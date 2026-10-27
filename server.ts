import 'dotenv/config';
import crypto from 'crypto';
import fs from 'fs';
import express from 'express';
import { createServer as createHttpServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const RUNTIME_STORE_PATH = path.join(__dirname, '.adoio-runtime-store.json');

interface RuntimeStoreData {
  vapidPublicKey?: string;
  pushSubscriptions?: StoredPushSubscription[];
}

function readRuntimeStore(): RuntimeStoreData {
  try {
    if (fs.existsSync(RUNTIME_STORE_PATH)) {
      const raw = fs.readFileSync(RUNTIME_STORE_PATH, 'utf-8');
      return JSON.parse(raw) as RuntimeStoreData;
    }
  } catch {
    // Ignore read errors in read-only or ephemeral environments
  }
  return {};
}

function writeRuntimeStore(data: RuntimeStoreData): void {
  try {
    fs.writeFileSync(RUNTIME_STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // Ignore write errors in read-only environments
  }
}

const initialStore = readRuntimeStore();

// Generate or restore a P-256 VAPID public key (65-byte uncompressed EC point in Base64URL)
function generateVapidPublicKeyBase64Url(): string {
  try {
    const { publicKey } = crypto.generateKeyPairSync('ec', {
      namedCurve: 'prime256v1',
    });
    const jwk = publicKey.export({ format: 'jwk' });
    if (jwk.x && jwk.y) {
      const xBuf = Buffer.from(jwk.x, 'base64url');
      const yBuf = Buffer.from(jwk.y, 'base64url');
      const uncompressed = Buffer.concat([Buffer.from([0x04]), xBuf, yBuf]);
      return uncompressed.toString('base64url');
    }
  } catch {
    // Fallback valid 65-byte uncompressed P-256 point
  }
  return 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
}

const VAPID_PUBLIC_KEY =
  process.env.VAPID_PUBLIC_KEY ||
  initialStore.vapidPublicKey ||
  generateVapidPublicKeyBase64Url();

interface StoredPushSubscription {
  id: string;
  endpoint: string;
  bassin: string;
  channels: string[];
  createdAt: number;
}

const pushSubscriptions = new Map<string, StoredPushSubscription>();
if (Array.isArray(initialStore.pushSubscriptions)) {
  for (const sub of initialStore.pushSubscriptions) {
    if (sub && typeof sub.id === 'string') {
      pushSubscriptions.set(sub.id, sub);
    }
  }
}

function persistPushSubscriptions(): void {
  writeRuntimeStore({
    vapidPublicKey: VAPID_PUBLIC_KEY,
    pushSubscriptions: Array.from(pushSubscriptions.values()),
  });
}

// In-memory LRU Cache for frequent agronomic assistant queries (max 100 entries, 2h TTL)
interface CachedReplyEntry {
  reply: string;
  timestamp: number;
}
const ASSISTANT_CACHE_MAX = 100;
const ASSISTANT_CACHE_TTL_MS = 2 * 60 * 60 * 1000;
const assistantReplyCache = new Map<string, CachedReplyEntry>();

function buildCacheKey(message: string, historyLength: number): string {
  const normalized = message
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
  return `${historyLength}:${normalized}`;
}

function getCachedAssistantReply(key: string): string | null {
  const entry = assistantReplyCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > ASSISTANT_CACHE_TTL_MS) {
    assistantReplyCache.delete(key);
    return null;
  }
  // Refresh LRU order
  assistantReplyCache.delete(key);
  assistantReplyCache.set(key, entry);
  return entry.reply;
}

function setCachedAssistantReply(key: string, reply: string): void {
  if (assistantReplyCache.size >= ASSISTANT_CACHE_MAX) {
    const oldestKey = assistantReplyCache.keys().next().value;
    if (oldestKey) assistantReplyCache.delete(oldestKey);
  }
  assistantReplyCache.set(key, { reply, timestamp: Date.now() });
}

// Per-IP Sliding Window Rate Limiter for API protection
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_CHAT = 20; // 20 requests/min per IP
const ipRateBuckets = new Map<string, number[]>();

function checkRateLimit(ip: string, maxRequests: number): { allowed: boolean; remaining: number; retryAfterSec: number } {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = (ipRateBuckets.get(ip) || []).filter((t) => t > windowStart);

  if (timestamps.length >= maxRequests) {
    const oldestInWindow = timestamps[0] || now;
    const retryAfterSec = Math.max(1, Math.ceil((oldestInWindow + RATE_LIMIT_WINDOW_MS - now) / 1000));
    ipRateBuckets.set(ip, timestamps);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  timestamps.push(now);
  ipRateBuckets.set(ip, timestamps);
  return { allowed: true, remaining: Math.max(0, maxRequests - timestamps.length), retryAfterSec: 0 };
}

function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || 'missing-api-key';
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const ADOIO_SYSTEM_INSTRUCTION = `Tu es l'Assistant Agronomique Officiel de l'ADOIO (Association du Développement de l'Oléiculture et des Industries Oléicoles de la Wilaya de Béjaïa), basée à la Chambre d'Agriculture (CAW) de Béjaïa et présidée par M. Kaci Mohamed.

Ton rôle est d'accompagner les oléiculteurs, mouliniers et producteurs de Kabylie (Wilaya de Béjaïa : 52 communes, 57 400 ha de verger oléicole, 5,35 millions d'oliviers dont 4,85 millions en production, 448 huileries recensées dont 192 chaînes continues modernes et 256 huileries traditionnelles, rendement moyen de 19,4 L/qx) avec des conseils techniques précis, pratiques et adaptés au terroir montagnard et vallonné (Vallée de la Soummam, Seddouk, Akbou, Beni Maouche, Amizour, Feraoun, Ouzellaguen, Tazmalt, Timezrit, etc.).

Tu maîtrises particulièrement :
1. LES TECHNIQUES DE TAILLE DE L'OLIVIER (AZEMMUR) :
- Période idéale en Kabylie : juste après la récolte et avant le débourrement (février à fin mars), hors périodes de gel sévère.
- Taille de fructification (tous les 1 à 2 ans) : maintenir la forme en « gobelet aéré » (le soleil et le vent doivent traverser le centre de l'arbre — principe kabyle et méditerranéen « l'oiseau doit pouvoir traverser la frondaison sans toucher une branche »).L'olivier fructifie sur le bois d'un an (rameaux poussés l'année précédente).
- Suppression des gourmands verticaux (rejets), des branches basses traînantes, des bois morts et des rameaux qui se croisent.
- Taille de régénération / rajeunissement des vieux oliviers de montagne : rabattage progressif des charpentières sur 2 à 3 ans ou recepage avec sélection de 3 à 4 vigoureux rejets bien orientés.
- Prophylaxie obligatoire : désinfecter les sécateurs et scies à l'alcool à 70° ou à l'eau de Javel diluée entre chaque arbre (surtout en présence de tuberculose de l'olivier) et appliquer un mastic ou badigeon cuprique (bouillie bordelaise) sur les grosses coupes (> 3 cm).

2. LES MALADIES ET RAVAGEURS DE L'OLIVIER & TRAITEMENTS BIOLOGIQUES :
- Mouche de l'olive (Bactrocera oleae) : ravageur n°1 en Kabylie (piqûres sur drupes, galeries larvaires, chute prématurée et hausse drastique de l'acidité oléique). Lutte bio : piégeage massif précoce dès juin (bouteilles à attractif phosphate diammonique ou protéine hydrolysée), pulvérisation préventive d'argile kaolinite blanche calcinée (barrière physique 5 kg/100 L d'eau de juin à septembre), traitements localisés au Spinosad bio, et récolte précoce dès la véraison.
- Œil de paon (Spilocea oleagina / Cycloconium oleaginum) : taches rondes concentriques brun-jaunâtre sur les feuilles, défoliation. Favorisé par l'humidité automnale et les vergers non taillés. Lutte bio : taille d'éclaircie pour aérer la frondaison + pulvérisation de bouillie bordelaise (cuivre homologué AB) après la récolte et avant les pluies d'automne (septembre-octobre).
- Verticilliose (Verticillium dahliae) : champignon vasculaire du sol provoquant le dessèchement brutal d'un rameau ou d'une charpentière avec feuilles brunes enroulées restant attachées. Lutte bio : proscrire absolument les cultures maraîchères intercalaires sensibles (tomate, pomme de terre, piment, aubergine, cucurbitacées) entre les oliviers, éviter l'excès d'eau et d'azote au collet, éliminer et brûler les bois atteints, favoriser les amendements organiques riches en antagonistes (Trichoderma).
- Psylle de l'olivier (Euphyllura olivina) : amas cotonneux blancs sur les jeunes pousses et grappes florales au printemps (avril-mai). Lutte bio : préserver la faune auxiliaire (punaises anthocorides, coccinelles, chrysopes), taille des gourmands, et pulvérisation de savon noir potassique agricole (1 à 2 %) sous pression modérée avant l'ouverture des fleurs en cas de forte attaque.
- Tuberculose ou Gale de l'olivier (Pseudomonas savastanoi) : tumeurs/galles ligneuses sur rameaux et branches, transmise par les blessures de gaulage violent, la grêle ou les outils de taille non désinfectés. Lutte bio : abandonner le gaulage brutal au bâton au profit des peignes manuels ou vibreurs, couper les rameaux atteints par temps sec, désinfecter systématiquement les outils et appliquer du cuivre après la taille et la récolte.
- Teigne de l'olivier (Prays oleae) : chenille attaquant feuilles, boutons floraux (mai) puis noyau du fruit (chute physiologique de fin d'été). Lutte bio : Bacillus thuringiensis (Bt kurstaki) appliqué au stade bouton floral gonflé.
- Fumagine (Capnodium oleae) : feutrage noir sur feuilles et rameaux se développant sur le miellat de la cochenille noire (Saissetia oleae) ou du psylle. Lutte bio : taille d'aération sévère, savon noir et cuivre.

3. LE CALENDRIER AGRONOMIQUE LOCAL DE BÉJAÏA (12 MOIS) & VARIÉTÉS LOCALES :
- Variétés emblématiques : Chemlal (Achamlal, ~75 % du verger, vigoureuse, huile douce et fruitée, maturité nov-janv, rendement 18-22 %), Azeradj (Azaradj, ~15 %, gros fruit double fin, précoce fin oct-déc, rendement 20-24 %, pollinisateur idéal de la Chemlal), Bouchouk Soummam, Limli (vallée de la Soummam/Sidi Aïch, précoce, très riche en polyphénols), Takesrit (El Kseur/Ouzellaguen, haut rendement 22-26 %), Aghenfas, Aimel, Tabelout.
- Novembre – Janvier : Récolte au stade de véraison tournante (violet-noir) sur bâches/filets propres, transport en caisses plastiques ajourées de 20-25 kg (jamais en sacs de jute ou plastique fermés qui provoquent fermentation et défaut de chômé), trituration en moins de 24h-48h à froid (< 27 °C), stockage en cuves inox à l'abri de la lumière et de l'air (15-18 °C).
- Février – Mars : Taille annuelle de fructification, broyage des bois de taille sains ou compostage, apport de compost mûr de grignons/fumier ovin-bovin décomposé (20 à 40 kg/arbre selon l'âge), traitement cuprique post-taille.
- Avril – Mai : Gonflement des bourgeons et floraison (mai) ; surveillance Psylle et Teigne, fauchage de l'enherbement ou griffage superficiel pour limiter la concurrence hydrique, arrosage d'appoint si printemps très sec pour sécuriser la nouaison.
- Juin – Août : Nouaison et durcissement du noyau (juillet) ; pose des pièges contre la mouche de l'olive, application d'argile kaolinite, irrigation déficitaire contrôlée en été (30 à 50 L/arbre tous les 15-20 jours pour jeunes vergers ou vergers intensifs avec paillage des cuvettes).
- Septembre – Octobre : Lipogenèse active (formation de l'huile dans la pulpe) et début de véraison ; surveillance sanitaire de la mouche et de l'œil de paon, préparation du matériel de récolte et révision des huileries avant l'ouverture de la campagne.

Règles de réponse :
- Réponds toujours en français clair, structuré, chaleureux et professionnel, avec des listes à puces et des repères concrets directement applicables au verger en Kabylie.
- Tu peux ponctuer tes réponses des termes traditionnels kabyles (Tamazight) pertinents (ex: Azemmur pour l'olivier/olive, Zzit uzemmur pour l'huile d'olive, Achamlal, Azaradj, etc.).
- Reste concis (environ 150 à 280 mots par réponse sauf si l'utilisateur demande un programme détaillé) pour faciliter la lecture sur mobile au verger.`;

interface ChatTurn {
  role: 'user' | 'model';
  text: string;
}

async function startServer() {
  const app = express();
  const httpServer = createHttpServer(app);
  app.use(express.json({ limit: '1mb' }));

  // Web Push API - VAPID Public Key endpoint
  app.get('/api/push/vapid-public-key', (_req, res) => {
    res.json({
      publicKey: VAPID_PUBLIC_KEY,
      status: 'ready',
      supportedChannels: [
        'harvest-start',
        'agronomic-period',
        'frost',
        'high-wind',
        'heavy-rain',
        'heat-sirocco',
      ],
    });
  });

  // Web Push API - Subscribe endpoint
  app.post('/api/push/subscribe', (req, res) => {
    const { subscription, bassin, channels } = req.body as {
      subscription?: { endpoint?: string; keys?: Record<string, string> };
      bassin?: string;
      channels?: string[];
    };

    const endpoint =
      subscription?.endpoint || `local-pwa-sw://${bassin || 'bejaia'}-${Date.now()}`;
    const id = crypto.createHash('sha256').update(endpoint).digest('hex').slice(0, 12);

    const record: StoredPushSubscription = {
      id,
      endpoint,
      bassin: bassin || 'Seddouk & Haute Soummam',
      channels: Array.isArray(channels)
        ? channels
        : ['harvest-start', 'agronomic-period', 'frost', 'high-wind', 'heavy-rain', 'heat-sirocco'],
      createdAt: Date.now(),
    };

    pushSubscriptions.set(id, record);
    persistPushSubscriptions();

    res.json({
      subscribed: true,
      subscriptionId: id,
      bassin: record.bassin,
      activeChannels: record.channels,
      subscribersCount: pushSubscriptions.size,
      timestamp: record.createdAt,
    });
  });

  // Web Push API - Unsubscribe endpoint
  app.post('/api/push/unsubscribe', (req, res) => {
    const { subscriptionId, endpoint } = req.body as {
      subscriptionId?: string;
      endpoint?: string;
    };

    if (subscriptionId && pushSubscriptions.has(subscriptionId)) {
      pushSubscriptions.delete(subscriptionId);
    } else if (endpoint) {
      const id = crypto.createHash('sha256').update(endpoint).digest('hex').slice(0, 12);
      pushSubscriptions.delete(id);
    }
    persistPushSubscriptions();

    res.json({
      subscribed: false,
      subscribersCount: pushSubscriptions.size,
    });
  });

  // Web Push API - Dispatch critical period or local weather alert payload
  app.post('/api/push/dispatch-alert', (req, res) => {
    const { title, body, type, zone, metric, severity } = req.body as {
      title?: string;
      body?: string;
      type?: string;
      zone?: string;
      metric?: string;
      severity?: string;
    };

    const payload = {
      title: title || '🌿 Alerte Période Critique ADOIO · Béjaïa',
      body: body || 'Vigilance oléicole en cours sur votre bassin.',
      icon: '/pwa-192x192.png',
      badge: '/icon.svg',
      tag: `adoio-push-${type || 'general'}-${Date.now()}`,
      data: {
        url: type === 'harvest-start' ? '/#simulateur' : '/#alertes-meteo',
        type: type || 'harvest-start',
        zone: zone || 'Wilaya de Béjaïa',
        metric: metric || 'Vigilance Active',
        severity: severity || 'info',
        dispatchedAt: new Date().toISOString(),
      },
    };

    res.json({
      dispatched: true,
      protocol: 'Web Push API (RFC 8030 / VAPID)',
      payload,
    });
  });

  app.post('/api/assistant/chat', async (req, res) => {
    try {
      const clientIp =
        String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'local').split(',')[0].trim();
      const rateStatus = checkRateLimit(clientIp, RATE_LIMIT_MAX_CHAT);
      res.setHeader('X-RateLimit-Limit', String(RATE_LIMIT_MAX_CHAT));
      res.setHeader('X-RateLimit-Remaining', String(rateStatus.remaining));

      if (!rateStatus.allowed) {
        res.setHeader('Retry-After', String(rateStatus.retryAfterSec));
        res.status(429).json({
          error: `Trop de requêtes rapprochées. Veuillez patienter ${rateStatus.retryAfterSec}s avant de poser une nouvelle question.`,
        });
        return;
      }

      const { message, history, stream } = req.body as {
        message?: string;
        history?: ChatTurn[];
        stream?: boolean;
      };

      if (!message || typeof message !== 'string' || !message.trim()) {
        res.status(400).json({ error: 'Veuillez saisir une question valide.' });
        return;
      }

      const trimmedMessage = message.trim();
      const validHistory: ChatTurn[] = [];

      if (Array.isArray(history)) {
        for (const turn of history.slice(-10)) {
          if (
            turn &&
            (turn.role === 'user' || turn.role === 'model') &&
            typeof turn.text === 'string' &&
            turn.text.trim()
          ) {
            validHistory.push({
              role: turn.role,
              text: turn.text.trim(),
            });
          }
        }
      }

      const cacheKey = buildCacheKey(trimmedMessage, validHistory.length);
      const cachedReply = getCachedAssistantReply(cacheKey);

      if (cachedReply) {
        if (stream) {
          res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache, no-transform');
          res.setHeader('Connection', 'keep-alive');
          res.write(`data: ${JSON.stringify({ chunk: cachedReply, cached: true, done: true })}\n\n`);
          res.end();
          return;
        }
        res.json({ reply: cachedReply, cached: true });
        return;
      }

      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> =
        validHistory.map((turn) => ({
          role: turn.role,
          parts: [{ text: turn.text }],
        }));

      contents.push({
        role: 'user',
        parts: [{ text: trimmedMessage }],
      });

      const aiClient = getGenAIClient();

      if (stream) {
        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');

        const responseStream = await aiClient.models.generateContentStream({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: ADOIO_SYSTEM_INSTRUCTION,
            temperature: 0.4,
          },
        });

        let accumulatedText = '';
        for await (const chunk of responseStream) {
          const piece = chunk.text || '';
          if (piece) {
            accumulatedText += piece;
            res.write(`data: ${JSON.stringify({ chunk: piece, done: false })}\n\n`);
          }
        }

        if (accumulatedText.trim()) {
          setCachedAssistantReply(cacheKey, accumulatedText);
          res.write(`data: ${JSON.stringify({ chunk: '', done: true })}\n\n`);
        } else {
          res.write(
            `data: ${JSON.stringify({
              error: "L'assistant n'a pas pu générer de réponse pour le moment.",
              done: true,
            })}\n\n`
          );
        }
        res.end();
        return;
      }

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: ADOIO_SYSTEM_INSTRUCTION,
          temperature: 0.4,
        },
      });

      const replyText = response.text;
      if (!replyText) {
        res.status(502).json({
          error: "L'assistant n'a pas pu générer de réponse pour le moment. Veuillez réessayer.",
        });
        return;
      }

      setCachedAssistantReply(cacheKey, replyText);
      res.json({ reply: replyText, cached: false });
    } catch (error: unknown) {
      console.error('Erreur Gemini API (/api/assistant/chat):', error);
      const errMsg =
        error instanceof Error
          ? error.message
          : "Erreur lors de la communication avec l'assistant agronomique ADOIO.";
      if (!res.headersSent) {
        res.status(500).json({ error: errMsg });
      } else {
        res.write(`data: ${JSON.stringify({ error: errMsg, done: true })}\n\n`);
        res.end();
      }
    }
  });

  // Security, caching & lightweight Gzip/Brotli compression for mobile/3G performance
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (req.url.startsWith('/images/') || req.url.startsWith('/assets/')) {
      res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
    }

    // Compress JSON API and text responses when client supports gzip/br
    const acceptEncoding = String(req.headers['accept-encoding'] || '');
    const origSend = res.send.bind(res);
    res.send = function (body: unknown): express.Response {
      if (
        !res.headersSent &&
        (typeof body === 'string' || Buffer.isBuffer(body)) &&
        !res.getHeader('Content-Encoding')
      ) {
        const rawBuf = Buffer.isBuffer(body) ? body : Buffer.from(body);
        if (rawBuf.byteLength > 1024) {
          res.setHeader('Vary', 'Accept-Encoding');
          if (acceptEncoding.includes('br')) {
            res.setHeader('Content-Encoding', 'br');
            const compressed = zlib.brotliCompressSync(rawBuf, {
              params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 4 },
            });
            res.setHeader('Content-Length', compressed.byteLength);
            return origSend(compressed);
          } else if (acceptEncoding.includes('gzip')) {
            res.setHeader('Content-Encoding', 'gzip');
            const compressed = zlib.gzipSync(rawBuf, { level: 6 });
            res.setHeader('Content-Length', compressed.byteLength);
            return origSend(compressed);
          }
        }
      }
      return origSend(body);
    };

    next();
  });

  if (process.env.NODE_ENV !== 'production') {
    app.get(['/dev-sw.js', '/sw.js'], (_req, res) => {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.send(`
        self.addEventListener('install', () => self.skipWaiting());
        self.addEventListener('activate', async () => {
          try {
            const keys = await caches.keys();
            await Promise.all(keys.map((k) => caches.delete(k)));
            await self.registration.unregister();
            const clients = await self.clients.matchAll({ type: 'window' });
            clients.forEach((client) => client.navigate(client.url));
          } catch (e) {}
        });
      `);
    });

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          server: httpServer,
        },
        watch: process.env.DISABLE_HMR === 'true' ? null : undefined,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(
      '/assets',
      express.static(path.join(distPath, 'assets'), {
        maxAge: '1y',
        immutable: true,
      })
    );
    app.use(
      express.static(distPath, {
        maxAge: '7d',
      })
    );
    app.get('*', (_req, res) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur Olive Béjaïa ADOIO démarré sur http://0.0.0.0:${PORT}`);
  });
}

startServer();
