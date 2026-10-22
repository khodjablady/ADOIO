import 'dotenv/config';
import express from 'express';
import { createServer as createHttpServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

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

  app.post('/api/assistant/chat', async (req, res) => {
    try {
      const { message, history } = req.body as {
        message?: string;
        history?: ChatTurn[];
      };

      if (!message || typeof message !== 'string' || !message.trim()) {
        res.status(400).json({ error: 'Veuillez saisir une question valide.' });
        return;
      }

      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const turn of history.slice(-10)) {
          if (
            turn &&
            (turn.role === 'user' || turn.role === 'model') &&
            typeof turn.text === 'string' &&
            turn.text.trim()
          ) {
            contents.push({
              role: turn.role,
              parts: [{ text: turn.text }],
            });
          }
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: message.trim() }],
      });

      const response = await ai.models.generateContent({
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

      res.json({ reply: replyText });
    } catch (error: unknown) {
      console.error('Erreur Gemini API (/api/assistant/chat):', error);
      const errMsg =
        error instanceof Error
          ? error.message
          : "Erreur lors de la communication avec l'assistant agronomique ADOIO.";
      res.status(500).json({ error: errMsg });
    }
  });

  // Security & caching headers for static assets (images, icons, PDFs)
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (req.url.startsWith('/images/') || req.url.startsWith('/assets/')) {
      res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
    }
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
