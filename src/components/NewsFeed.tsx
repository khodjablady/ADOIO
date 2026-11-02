import React, { useState, useEffect, useMemo } from 'react';
import {
  Newspaper,
  Search,
  Bookmark,
  BookmarkCheck,
  Share2,
  Check,
  ArrowRight,
  X,
  Printer,
  Calendar,
  MapPin,
  BookOpen,
} from 'lucide-react';
import { buildResponsiveImageAttrs } from '../utils/responsiveImage';

export type NewsCategory =
  | 'all'
  | 'adoio'
  | 'agronomie'
  | 'qualite'
  | 'evenements';

export interface NewsArticle {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<NewsCategory, 'all'>;
  categoryLabel: string;
  date: string;
  isoDate: string;
  commune: string;
  readTimeMin: number;
  author: string;
  authorRole: string;
  featured?: boolean;
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
  excerpt: string;
  content: string[];
  keyTakeaways: string[];
  metrics?: { label: string; value: string; context: string }[];
  relatedSectionId: string;
  relatedSectionLabel: string;
}

const SAVED_ARTICLES_STORAGE_KEY = 'adoio_saved_news_articles_v1';

export const ADOIO_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'campagne-oleicole-2026-recommandations-adoio',
    title:
      'Ouverture de la Campagne Oléicole 2026–2027 : Cap sur la Récolte à la Véraison et l’Extraction à Froid',
    subtitle:
      'Orientations techniques officielles du Bureau de l’ADOIO et de la Chambre d’Agriculture de la Wilaya de Béjaïa pour sécuriser le taux de polyphénols et abaisser l’acidité libre sous 0,5 %.',
    category: 'adoio',
    categoryLabel: 'Communiqué ADOIO',
    date: '28 Octobre 2026',
    isoDate: '2026-10-28',
    commune: 'Seddouk & Vallée de la Soummam',
    readTimeMin: 4,
    author: 'M. Kaci Mohamed',
    authorRole: 'Président de l’ADOIO · Siège CAW Béjaïa',
    featured: true,
    image: '/assets/aistudio/Oliveseddouk_2593a714.jpg',
    imageAlt: 'Vergers d’oliviers centenaires à Seddouk dans la vallée de la Soummam',
    imageCaption:
      'Fig. 1 — Vergers traditionnels de variété Chemlal à Seddouk au stade de véraison tournante.',
    excerpt:
      'À l’approche du lancement officiel de la cueillette dans les 52 communes de la wilaya, l’ADOIO publie son protocole de campagne : récolte sur filets dès la véraison tournante, transport exclusif en caisses ajourées de 25 kg et trituration sous 24 heures.',
    content: [
      'Durant la réunion préparatoire tenue au siège de la Chambre d’Agriculture (CAW) de Béjaïa avec les représentants des 448 huileries recensées, l’Association du Développement de l’Oléiculture et des Industries Oléicoles (ADOIO) a dressé le bilan phénologique des 57 400 hectares du verger de la wilaya. Les pluies automnales de septembre ont favorisé une lipogenèse régulière dans les bassins d’Akbou, Seddouk, Tazmalt et Amizour.',
      'Le facteur déterminant pour hisser l’huile d’olive de Béjaïa (« Zzit uzemmur n Bgayet ») au rang d’huile vierge extra médaillée réside dans la maîtrise du délai entre la cueillette et le malaxage. L’entassement des olives en sacs de jute ou de polypropylène provoque en moins de 36 heures un échauffement anaérobie responsable du défaut organoleptique de « chômé » et d’une hausse rapide de l’acidité oléique.',
      'L’ADOIO appelle l’ensemble des oléiculteurs et mouliniers à généraliser l’usage des caisses plastiques rigides ajourées, à maintenir la température de la pâte sous 27 °C lors du malaxage (extraction à froid certifiée COI) et à orienter systématiquement les lots issus de vergers sains vers les cuves en acier inoxydable inertées.',
    ],
    keyTakeaways: [
      'Récolter au stade de véraison tournante (indice de maturité 2,5 à 3,5) avec peignes vibrants et filets propres.',
      'Bannir les sacs fermés : utiliser exclusivement des caisses plastiques ventilées de 20 à 25 kg.',
      'Triturer les lots en moins de 24 h à 48 h maximum à une température de pâte strictement inférieure à 27 °C.',
    ],
    metrics: [
      {
        label: 'Rendement Moyen Attendu',
        value: '19,8 L/qx',
        context: 'Variétés Chemlal & Azeradj (Campagne 2026)',
      },
      {
        label: 'Délai Maximal de Trituration',
        value: '< 24 h',
        context: 'Pour garantir une acidité ≤ 0,4 % (Vierge Extra)',
      },
      {
        label: 'Huileries Mobilisées',
        value: '448 unités',
        context: 'Dont 192 chaînes continues en inox sur 52 communes',
      },
    ],
    relatedSectionId: 'simulateur',
    relatedSectionLabel: 'Calculer mon rendement sur le Simulateur',
  },
  {
    id: 'bilan-piegeage-mouche-olive-soummam-2026',
    title:
      'Suivi Phytosanitaire : Bilan du Réseau de Piégeage Biologique de la Mouche de l’Olive (Bactrocera oleae)',
    subtitle:
      'Résultats des relevés hebdomadaires dans les bassins de Sidi Aïch, Ouzellaguen et Feraoun et efficacité de la barrière minérale à l’argile kaolinite.',
    category: 'agronomie',
    categoryLabel: 'Agronomie & Verger',
    date: '19 Octobre 2026',
    isoDate: '2026-10-19',
    commune: 'Ouzellaguen & Sidi Aïch',
    readTimeMin: 3,
    author: 'Cellule Technique Phytosanitaire',
    authorRole: 'ADOIO & Inspection Phytosanitaire (DSA)',
    image: '/assets/aistudio/olivier-taille_5b611fff.jpg',
    imageAlt: 'Oliviers sur les coteaux de Sidi Aïch dans la vallée de la Soummam',
    imageCaption: 'Fig. 2 — Parcelles pilotes conduites en protection biologique intégrée à Sidi Aïch.',
    excerpt:
      'Les parcelles équipées dès le mois de juin de pièges attractifs au phosphate diammonique et traitées à l’argile kaolinite blanche calcinée affichent un taux de piqûres inférieur à 4 %, contre 22 % dans les vergers témoins non suivis.',
    content: [
      'Le réseau d’observation phytosanitaire coordonné par l’ADOIO sur 38 parcelles de référence réparties entre 150 m et 750 m d’altitude confirme l’efficacité de la lutte préventive sans insecticides de synthèse contre Bactrocera oleae.',
      'Dans les vergers de moyenne altitude (Beni Maouche, Feraoun, Timezrit), l’application d’un film protecteur d’argile kaolinite blanche calcinée (5 kg pour 100 litres d’eau) renouvelée après le lessivage des orages d’août a considérablement réduit la ponte des femelles tout en limitant le stress thermique estival sur le feuillage.',
      'Pour les parcelles présentant un seuil de capture supérieur à 5 mouches par piège et par semaine en octobre, les techniciens recommandent d’avancer la date de récolte de 10 à 12 jours afin de préserver la qualité chimique de l’huile avant toute chute prématurée des drupes.',
    ],
    keyTakeaways: [
      'Taux d’infestation réduit de 82 % sur les vergers combinant piégeage massif et argile kaolinite.',
      'Récolte précoce conseillée dès fin octobre sur les expositions humides de basse altitude.',
      'Traitement cuprique d’automne (bouillie bordelaise homologuée AB) recommandé juste après la cueillette contre l’œil de paon.',
    ],
    relatedSectionId: 'diagnostic-phytosanitaire',
    relatedSectionLabel: 'Ouvrir l’outil de Diagnostic Phytosanitaire Bio',
  },
  {
    id: 'preparation-concours-meilleure-huile-bejaia-2026',
    title:
      'Concours Régional « Goutte d’Or ADOIO 2026 » : Ouverture du Dépôt des Échantillons et Protocole COI',
    subtitle:
      'Critères d’éligibilité des lots d’huile d’olive vierge extra, calendrier de prélèvement sous scellés et jury d’analyse sensorielle au verre bleu normalisé.',
    category: 'qualite',
    categoryLabel: 'Qualité & Trituration',
    date: '11 Octobre 2026',
    isoDate: '2026-10-11',
    commune: 'Akbou & Béjaïa',
    readTimeMin: 3,
    author: 'Comité du Concours & Jury COI',
    authorRole: 'Commission Qualité Organoleptique ADOIO',
    image: '/assets/aistudio/M_tdaille-or_41fd89c2.jpg',
    imageAlt: 'Médaille d’Or du Concours Régional Goutte d’Or ADOIO 2026',
    imageCaption: 'Fig. 3 — Médaille officielle du Concours Régional « Goutte d’Or ADOIO 2026 ».',
    excerpt:
      'Les producteurs individuels, coopératives et maîtres mouliniers de la wilaya peuvent désormais inscrire leurs lots issus de la nouvelle récolte. Chaque échantillon fait l’objet d’une double analyse physico-chimique et organoleptique à l’aveugle.',
    content: [
      'À l’occasion de la célébration du 25e anniversaire de l’ADOIO, l’édition 2026 du Concours de la Meilleure Huile d’Olive de Béjaïa met à l’honneur quatre catégories : Fruité Vert Intense, Fruité Mûr Doux (spécialité Chemlal), Monovariétal Autochtone (Azeradj, Limli, Takesrit, Bouchouk) et Huileries Coopératives.',
      'Pour être recevable, chaque lot candidat doit provenir d’un stock homogène d’au moins 300 litres conservé en cuve inox à l’abri de la lumière. Les analyses de laboratoire vérifient l’acidité oléique (< 0,8 %, avec une moyenne des lauréats inférieure à 0,28 %), l’indice de peroxyde (≤ 20 mEq O2/kg) et l’absorbance dans l’ultraviolet (K232 et K270).',
      'La dégustation officielle est conduite par un panel d’experts agréés utilisant les verres tulipes bleu cobalt chauffés à 28 °C ± 2 °C afin d’évaluer l’harmonie entre le fruité (amande verte, herbe fraîchement coupée, feuille de figuier), l’amertume et l’ardence poivrée caractéristique des polyphénols kabyles.',
    ],
    keyTakeaways: [
      'Lot minimum requis : 300 litres stockés en cuve inoxydable alimentaire.',
      'Zéro défaut organoleptique toléré (médiane des défauts Md = 0,0 selon la norme COI).',
      'Remise des médailles d’Or, d’Argent et de Bronze lors de la Fête annuelle de l’Olive.',
    ],
    relatedSectionId: 'concours',
    relatedSectionLabel: 'Consulter le règlement & palmarès du Concours 2026',
  },
  {
    id: 'valorisation-grignons-compost-vergers-montagne',
    title:
      'Économie Circulaire au Moulin : Transformer les Grignons d’Olives en Compost Organique Fertilisant',
    subtitle:
      'Retour d’expérience des huileries d’El Kseur et de Tazmalt sur le co-compostage des grignons épuisés avec le broyat de bois de taille et le fumier ovin.',
    category: 'agronomie',
    categoryLabel: 'Agronomie & Verger',
    date: '02 Octobre 2026',
    isoDate: '2026-10-02',
    commune: 'El Kseur & Tazmalt',
    readTimeMin: 4,
    author: 'Équipe Agronomique Sol & Humus',
    authorRole: 'Pôle Valorisation des Sous-Produits ADOIO',
    image: '/assets/aistudio/images_8bc725d8.png',
    imageAlt: 'Cycle de l’économie circulaire appliquée aux sous-produits oléicoles',
    imageCaption:
      'Fig. 4 — Cycle d’économie circulaire : valorisation et compostage des sous-produits oléicoles.',
    excerpt:
      'Avec plus de 42 000 tonnes de grignons générées chaque saison dans la wilaya, le compostage contrôlé en andains permet de restituer jusqu’à 35 kg d’humus stable par arbre tout en améliorant de 28 % la rétention en eau des sols pentus.',
    content: [
      'Longtemps perçus comme une contrainte environnementale lors du pic de trituration de décembre, les sous-produits solides de l’huilerie (grignons bruts et grignons deux-phases) constituent une ressource agronomique précieuse pour les sols argilo-calcaires et schisteux de Kabylie, souvent déficitaires en matière organique.',
      'Le protocole préconisé par l’ADOIO consiste à mélanger 50 % de grignons d’olives, 30 % de rameaux issus de la taille de fructification broyés et 20 % de fumier ovin ou bovin bien décomposé. Après 4 à 6 mois de maturation avec retournements périodiques et contrôle de l’humidité, le compost obtenu présente un rapport C/N équilibré proche de 15 et une neutralisation complète des composés phénoliques phytotoxiques.',
      'Épandu en couronne à l’aplomb de la frondaison à la fin de l’hiver (20 à 35 kg par arbre adulte), cet amendement stimule l’activité microbienne de la rhizosphère et sécurise la floraison printanière face aux épisodes de sécheresse précoce.',
    ],
    keyTakeaways: [
      'Ne jamais épandre de grignons frais ou de margines brutes directement au pied des jeunes oliviers.',
      'Respecter un cycle de compostage thermophile de 4 à 6 mois avant incorporation superficielle au sol.',
      'Coupler l’apport de compost avec le calculateur de fertilisation organique selon l’âge du verger.',
    ],
    relatedSectionId: 'sous-produits',
    relatedSectionLabel: 'Explorer le module Valorisation des Sous-Produits',
  },
  {
    id: 'cycles-formation-taille-greffage-oleastre-2026',
    title:
      'Calendrier des Journées Techniques de Démonstration : Taille en Gobelet Aéré et Greffage de l’Oléastre (Azebboudj)',
    subtitle:
      'Sessions pratiques en plein champ organisées par l’ADOIO, l’ITMAS et la CAW de Béjaïa dans 8 daïras oléicoles pilotes.',
    category: 'evenements',
    categoryLabel: 'Événements & Formation',
    date: '21 Septembre 2026',
    isoDate: '2026-09-21',
    commune: 'Amizour, Beni Maouche & Adekar',
    readTimeMin: 2,
    author: 'Secrétariat Général ADOIO',
    authorRole: 'Commission Vulgarisation & Jeunes Oléiculteurs',
    excerpt:
      'Programme d’ateliers pratiques gratuits sur parcelle : désinfection prophylactique des outils contre la tuberculose (Pseudomonas savastanoi), rajeunissement des oliviers centenaires et surgreffage en fente ou en couronne.',
    content: [
      'Dans le cadre de son programme annuel de vulgarisation agricole, l’ADOIO déploie ses formateurs et maîtres tailleurs directement dans les vergers communaux d’Amizour, Beni Maouche, Adekar, Kherrata et Timezrit.',
      'Chaque journée technique débute par un diagnostic visuel de la charpente de l’arbre, suivi d’une démonstration de la taille d’éclaircie en « gobelet aéré » permettant à la lumière solaire de pénétrer au cœur de la frondaison tout en réduisant l’humidité favorable à l’œil de paon et à la fumagine.',
      'Un atelier spécifique est consacré à la mise en valeur des peuplements d’oléastres spontanés (Azebboudj) par greffage printanier avec des greffons certifiés des variétés autochtones Chemlal, Azeradj et Takesrit.',
    ],
    keyTakeaways: [
      'Inscriptions ouvertes à tous les producteurs et jeunes porteurs de projets auprès de l’ADOIO.',
      'Remise sur place du guide illustré de prophylaxie (désinfection à l’alcool à 70° et badigeon cuprique).',
      'Disponibilité des fiches techniques PDF consultables hors-ligne sur smartphone au verger.',
    ],
    relatedSectionId: 'pratiques',
    relatedSectionLabel: 'Voir le Calendrier Agronomique des 12 mois',
  },
  {
    id: 'modernisation-huileries-inox-hygiene-trituration',
    title:
      'Audit Technique des Huileries : Guide d’Hygiène Pré-Campagne et Réglage des Décanteurs Centrifuges',
    subtitle:
      'Points de contrôle indispensables avant la réception des premiers quintaux : nettoyage des broyeurs à marteaux, maîtrise de l’eau d’ajout et stockage inox.',
    category: 'qualite',
    categoryLabel: 'Qualité & Trituration',
    date: '09 Septembre 2026',
    isoDate: '2026-09-09',
    commune: 'Akbou, Taharacht & El Kseur',
    readTimeMin: 3,
    author: 'Collège des Mouliniers ADOIO',
    authorRole: 'Section Industries Oléicoles & Chaînes Continues',
    excerpt:
      'L’inspection préventive des lignes d’extraction à 2 et 3 phases permet d’éviter toute contamination olfactive par les résidus oxydés de la campagne précédente et d’optimiser l’épuisement des grignons sans surchauffer la pâte.',
    content: [
      'À quelques semaines de la mise en service des 192 chaînes continues et des 256 huileries traditionnelles de la wilaya de Béjaïa, le Collège des Mouliniers de l’ADOIO rappelle que la qualité finale d’une huile vierge extra se joue autant au verger que dans l’atelier de trituration.',
      'Le protocole pré-campagne impose le démontage et le dégraissage intégral à l’eau chaude alcaline puis le rinçage à l’eau potable des trémies de réception, de la laveuse-effeuilleuse, des grilles du broyeur, des cuves de malaxage et du bol du décanteur horizontal.',
      'Sur les installations à trois phases, les techniciens recommandent de réduire au strict nécessaire le débit d’eau tiède ajoutée au décanteur afin de ne pas lessiver les polyphénols hydrophiles (oleuropéine et oléocanthal) qui confèrent aux huiles de Kabylie leur stabilité antioxydante et leurs vertus nutritionnelles.',
    ],
    keyTakeaways: [
      'Activer systématiquement l’effeuilleuse et la laveuse à eau renouvelée en entrée de chaîne.',
      'Surveiller la sonde thermique du malaxeur : consigne stricte entre 22 °C et 26 °C maximum.',
      'Séparer les lots d’olives saines cueillies sur l’arbre des olives ramassées au sol.',
    ],
    relatedSectionId: 'annuaire',
    relatedSectionLabel: 'Parcourir l’Annuaire des 448 Huileries de Béjaïa',
  },
];

const CATEGORY_TABS: { id: NewsCategory; label: string }[] = [
  { id: 'all', label: 'Toutes les actualités' },
  { id: 'adoio', label: 'Communiqués ADOIO' },
  { id: 'agronomie', label: 'Agronomie & Verger' },
  { id: 'qualite', label: 'Qualité & Trituration' },
  { id: 'evenements', label: 'Événements & Formation' },
];

interface NewsFeedProps {
  onNavigate?: (sectionId: string) => void;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const raw = window.localStorage.getItem(SAVED_ARTICLES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage access errors
    }
    return [];
  });
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      window.localStorage.setItem(SAVED_ARTICLES_STORAGE_KEY, JSON.stringify(savedIds));
    } catch {
      // Ignore storage write errors
    }
  }, [savedIds]);

  // Close modal on Escape key
  useEffect(() => {
    if (!activeArticle) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveArticle(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeArticle]);

  const toggleSaveArticle = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleShareArticle = async (article: NewsArticle, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}#actualites-adoio`;
    const shareText = `${article.title} — ${article.categoryLabel} (${article.date}, ${article.commune}) · Portail Oléicole ADOIO Béjaïa`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard copy if user cancels or share fails
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopiedId(article.id);
      setTimeout(() => {
        setCopiedId((prev) => (prev === article.id ? null : prev));
      }, 2400);
    } catch {
      // Ignore clipboard failure
    }
  };

  const handleNavigateToSection = (sectionId: string) => {
    setActiveArticle(null);
    if (onNavigate) {
      onNavigate(sectionId);
      return;
    }
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ADOIO_NEWS_ARTICLES.filter((article) => {
      const matchesCategory =
        selectedCategory === 'all' || article.category === selectedCategory;
      const matchesSaved = !showSavedOnly || savedIds.includes(article.id);
      const matchesQuery =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.subtitle.toLowerCase().includes(q) ||
        article.commune.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.categoryLabel.toLowerCase().includes(q);
      return matchesCategory && matchesSaved && matchesQuery;
    });
  }, [selectedCategory, searchQuery, showSavedOnly, savedIds]);

  const leadArticle = filteredArticles[0] || null;
  const secondaryArticles = filteredArticles.slice(1, 4);
  const archiveDispatches = filteredArticles.slice(4);

  return (
    <section
      id="actualites-adoio"
      aria-labelledby="newsfeed-heading"
      className="py-16 sm:py-24 bg-[#FAF7F2] border-t border-[#E6DEC9]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Masthead Header */}
        <div className="pb-8 border-b border-[#E6DEC9] flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-[#567B34] font-semibold mb-2">
              <Newspaper className="w-3.5 h-3.5 text-[#E6AB3C]" aria-hidden="true" />
              <span>Bulletin Agronomique & Dépêches Officielles</span>
              <span aria-hidden="true">·</span>
              <span>Édition Campagne 2026–2027</span>
            </div>
            <h2
              id="newsfeed-heading"
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#18230F] tracking-tight text-balance"
            >
              Actualités Agricoles & Communiqués de l’ADOIO
            </h2>
            <p className="mt-3 text-base text-[#436229] leading-relaxed max-w-2xl">
              Suivez les notes d’orientation de la campagne oléicole, les bulletins de surveillance phytosanitaire biologique dans la vallée de la Soummam et le calendrier des journées techniques en Kabylie.
            </p>
          </div>

          {/* Operational Utility Strip (Unboxed Editorial Metadata) */}
          <div className="text-xs text-[#436229] flex flex-wrap items-center gap-x-3 gap-y-1 shrink-0 tabular-nums border-t lg:border-t-0 pt-3 lg:pt-0 border-[#E6DEC9]">
            <span>
               Rédaction : <strong className="text-[#18230F]">CAW Béjaïa & Siège Seddouk</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              <strong className="text-[#18230F]">{ADOIO_NEWS_ARTICLES.length}</strong> dossiers publiés
            </span>
            <span aria-hidden="true">·</span>
            <span>Lecture hors-ligne disponible</span>
          </div>
        </div>

        {/* Interactive Filter & Search Toolbar */}
        <div className="py-5 border-b border-[#E6DEC9] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Segmented Category Filter Controls */}
          <div
            role="tablist"
            aria-label="Filtrer les actualités par thématique"
            className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0"
          >
            {CATEGORY_TABS.map((tab) => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#18230F] text-[#FAF7F2] shadow-xs'
                      : 'bg-white text-[#31491E] hover:bg-[#E8F4D9] border border-[#E6DEC9]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Input & Saved Reading List Toggle */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            <div className="relative flex-1 sm:w-64">
              <Search
                className="w-3.5 h-3.5 text-[#567B34] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher commune, sujet, variété..."
                aria-label="Rechercher dans les actualités agricoles"
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-white border border-[#E6DEC9] text-[#18230F] placeholder:text-[#567B34]/70 focus:outline-none focus:border-[#31491E]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Effacer la recherche"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#567B34] hover:text-[#18230F] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowSavedOnly((prev) => !prev)}
              aria-pressed={showSavedOnly}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                showSavedOnly
                  ? 'bg-[#31491E] text-white border-[#31491E]'
                  : 'bg-white text-[#233416] border-[#E6DEC9] hover:bg-[#E8F4D9]'
              }`}
            >
              {showSavedOnly ? (
                <BookmarkCheck className="w-3.5 h-3.5 text-[#E6AB3C]" aria-hidden="true" />
              ) : (
                <Bookmark className="w-3.5 h-3.5 text-[#567B34]" aria-hidden="true" />
              )}
              <span>Favoris ({savedIds.length})</span>
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-[#E6DEC9] my-8 px-4">
            <BookOpen className="w-8 h-8 text-[#567B34] mx-auto mb-3" aria-hidden="true" />
            <h3 className="font-serif text-xl font-bold text-[#18230F]">
              Aucun article ne correspond à votre sélection
            </h3>
            <p className="text-sm text-[#436229] mt-1 max-w-md mx-auto">
              Modifiez vos filtres de recherche ou affichez l’ensemble des communiqués et dossiers techniques de l’ADOIO.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setShowSavedOnly(false);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#31491E] hover:bg-[#233416] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-12">
            {/* ============================================================ */}
            {/* TIER 1 : LEAD EDITORIAL STORY (À LA UNE) */}
            {/* ============================================================ */}
            {leadArticle && (
              <article className="bg-white rounded-2xl border border-[#E6DEC9] overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                  {/* Lead Visual Column */}
                  <div className="lg:col-span-7 flex flex-col justify-between bg-[#F4EEE1]/60 border-b lg:border-b-0 lg:border-r border-[#E6DEC9]">
                    <div
                      onClick={() => setActiveArticle(leadArticle)}
                      className="relative aspect-16/10 lg:aspect-auto lg:h-full min-h-[280px] overflow-hidden cursor-pointer group"
                    >
                      {leadArticle.image && !imageErrors[leadArticle.id] ? (
                        (() => {
                          const imgAttrs = buildResponsiveImageAttrs(leadArticle.image, {
                            variant: 'featured',
                          });
                          return (
                            <img
                              src={imgAttrs.src}
                              srcSet={imgAttrs.imgSrcSet}
                              sizes={imgAttrs.sizes}
                              width={imgAttrs.width}
                              height={imgAttrs.height}
                              alt={leadArticle.imageAlt || leadArticle.title}
                              referrerPolicy="no-referrer"
                              onError={() =>
                                setImageErrors((prev) => ({ ...prev, [leadArticle.id]: true }))
                              }
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                          );
                        })()
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#233416] via-[#31491E] to-[#18230F] flex flex-col items-center justify-center p-8 text-center text-[#FAF7F2]">
                          <Newspaper className="w-10 h-10 text-[#E6AB3C] mb-3" />
                          <span className="font-serif text-lg font-bold max-w-md">
                            {leadArticle.title}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />
                      {leadArticle.imageCaption && (
                        <p className="absolute bottom-3 left-4 right-4 text-xs font-serif italic text-[#FAF7F2]/90">
                          {leadArticle.imageCaption}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Lead Editorial Prose Column */}
                  <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#567B34] font-medium">
                        <span className="font-semibold text-[#31491E]">
                          {leadArticle.categoryLabel}
                        </span>
                        <span aria-hidden="true">·</span>
                        <time dateTime={leadArticle.isoDate}>{leadArticle.date}</time>
                        <span aria-hidden="true">·</span>
                        <span>{leadArticle.commune}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{leadArticle.readTimeMin} min de lecture</span>
                      </div>

                      <h3
                        onClick={() => setActiveArticle(leadArticle)}
                        className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#18230F] leading-snug hover:text-[#31491E] transition-colors cursor-pointer text-balance"
                      >
                        {leadArticle.title}
                      </h3>

                      <p className="mt-2.5 text-sm text-[#436229] font-medium leading-relaxed">
                        {leadArticle.subtitle}
                      </p>

                      <div className="my-4 border-b border-[#E6DEC9]" />

                      {/* Opening Paragraph with Editorial Drop Cap */}
                      <p className="text-sm text-[#242A20] leading-relaxed first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:text-[#31491E] first-letter:float-left first-letter:mr-2.5 first-letter:leading-none">
                        {leadArticle.excerpt}
                      </p>
                    </div>

                    {/* Byline & Actions */}
                    <div className="mt-6 pt-4 border-t border-[#E6DEC9] flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-[#436229]">
                        <span className="font-bold text-[#18230F]">{leadArticle.author}</span>
                        <span aria-hidden="true"> · </span>
                        <span>{leadArticle.authorRole}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => toggleSaveArticle(leadArticle.id, e)}
                          aria-label={
                            savedIds.includes(leadArticle.id)
                              ? 'Retirer des articles sauvegardés'
                              : 'Sauvegarder cet article'
                          }
                          title="Sauvegarder pour lecture hors-ligne"
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            savedIds.includes(leadArticle.id)
                              ? 'bg-[#FEF5DB] border-[#E6AB3C] text-[#B47A16]'
                              : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#31491E] hover:bg-[#E8F4D9]'
                          }`}
                        >
                          {savedIds.includes(leadArticle.id) ? (
                            <BookmarkCheck className="w-4 h-4" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleShareArticle(leadArticle, e)}
                          aria-label="Partager cet article"
                          title="Partager cet article"
                          className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#E8F4D9] text-[#31491E] border border-[#E6DEC9] transition-colors cursor-pointer"
                        >
                          {copiedId === leadArticle.id ? (
                            <Check className="w-4 h-4 text-[#567B34]" />
                          ) : (
                            <Share2 className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveArticle(leadArticle)}
                          className="px-4 py-2 rounded-xl bg-[#31491E] hover:bg-[#233416] text-[#FAF7F2] text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <span>Lire le dossier</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#E6AB3C]" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full-Width Quantitative Campaign KPI Strip Below Hero Split */}
                {leadArticle.metrics && leadArticle.metrics.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#E6DEC9] border-t border-[#E6DEC9] bg-[#FAF7F2]/70">
                    {leadArticle.metrics.map((metric) => (
                      <div key={metric.label} className="px-6 py-4">
                        <div className="text-xs text-[#567B34] font-medium">{metric.label}</div>
                        <div className="mt-0.5 font-serif text-xl font-bold text-[#18230F] tabular-nums">
                          {metric.value}
                        </div>
                        <div className="text-xs text-[#436229] mt-0.5">{metric.context}</div>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            )}

            {/* ============================================================ */}
            {/* TIER 2 : SECONDARY AGRONOMIC FEATURES (3-COLUMN GRID) */}
            {/* ============================================================ */}
            {secondaryArticles.length > 0 && (
              <div>
                <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#E6DEC9]">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#18230F]">
                    Dossiers Agronomiques & Qualité Oléicole
                  </h3>
                  <span className="text-xs text-[#567B34] tabular-nums">
                    {secondaryArticles.length} analyses techniques
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                  {secondaryArticles.map((article) => {
                    const isSaved = savedIds.includes(article.id);
                    return (
                      <article
                        key={article.id}
                        onClick={() => setActiveArticle(article)}
                        className="bg-white rounded-2xl border border-[#E6DEC9] overflow-hidden flex flex-col justify-between hover:border-[#8CBE5D] transition-colors cursor-pointer group"
                      >
                        <div>
                          {/* Card Thumbnail with Fallback */}
                          <div className="aspect-4/3 bg-[#F4EEE1] overflow-hidden border-b border-[#E6DEC9] relative">
                            {article.image && !imageErrors[article.id] ? (
                              (() => {
                                const imgAttrs = buildResponsiveImageAttrs(article.image, {
                                  variant: 'card',
                                });
                                return (
                                  <img
                                    src={imgAttrs.src}
                                    srcSet={imgAttrs.imgSrcSet}
                                    sizes={imgAttrs.sizes}
                                    width={imgAttrs.width}
                                    height={imgAttrs.height}
                                    alt={article.imageAlt || article.title}
                                    referrerPolicy="no-referrer"
                                    onError={() =>
                                      setImageErrors((prev) => ({ ...prev, [article.id]: true }))
                                    }
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                  />
                                );
                              })()
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#233416] to-[#31491E] flex items-center justify-center p-6 text-center text-[#FAF7F2]">
                                <span className="font-serif text-base font-bold">
                                  {article.categoryLabel} · {article.commune}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="p-5">
                            {/* Unboxed Metadata Kicker */}
                            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-[#567B34]">
                              <span className="font-semibold text-[#31491E]">
                                {article.categoryLabel}
                              </span>
                              <span aria-hidden="true">·</span>
                              <time dateTime={article.isoDate}>{article.date}</time>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">{article.readTimeMin} min</span>
                            </div>

                            <h4 className="mt-2 font-serif text-lg font-bold text-[#18230F] group-hover:text-[#31491E] transition-colors leading-snug">
                              {article.title}
                            </h4>

                            <p className="mt-2 text-xs text-[#436229] leading-relaxed line-clamp-3">
                              {article.excerpt}
                            </p>
                          </div>
                        </div>

                        <div className="px-5 py-3.5 border-t border-[#E6DEC9] flex items-center justify-between gap-2 text-xs">
                          <span className="text-[#567B34] truncate">{article.commune}</span>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => toggleSaveArticle(article.id, e)}
                              aria-label={
                                isSaved ? 'Retirer des favoris' : 'Sauvegarder cet article'
                              }
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                isSaved
                                  ? 'bg-[#FEF5DB] border-[#E6AB3C] text-[#B47A16]'
                                  : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#31491E] hover:bg-[#E8F4D9]'
                              }`}
                            >
                              {isSaved ? (
                                <BookmarkCheck className="w-3.5 h-3.5" />
                              ) : (
                                <Bookmark className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleShareArticle(article, e)}
                              aria-label="Partager"
                              className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#E8F4D9] text-[#31491E] border border-[#E6DEC9] transition-colors cursor-pointer"
                            >
                              {copiedId === article.id ? (
                                <Check className="w-3.5 h-3.5 text-[#567B34]" />
                              ) : (
                                <Share2 className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <span className="font-semibold text-[#31491E] group-hover:underline ml-1 inline-flex items-center gap-1 whitespace-nowrap">
                              <span>Lire</span>
                              <ArrowRight className="w-3 h-3" aria-hidden="true" />
                            </span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* TIER 3 : ARCHIVE DISPATCHES & FIELD BULLETINS (COMPACT ROWS) */}
            {/* ============================================================ */}
            {archiveDispatches.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#E6DEC9] p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E6DEC9]">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#18230F]">
                      Dépêches de Terrain & Calendrier de Vulgarisation
                    </h3>
                    <p className="text-xs text-[#436229] mt-0.5">
                      Notes techniques courtes à destination des oléiculteurs et maîtres mouliniers des 52 communes.
                    </p>
                  </div>
                  <span className="text-xs text-[#567B34] tabular-nums shrink-0">
                    Archives Campagne 2026
                  </span>
                </div>

                <div className="divide-y divide-[#E6DEC9]">
                  {archiveDispatches.map((dispatch, idx) => {
                    const isSaved = savedIds.includes(dispatch.id);
                    return (
                      <article
                        key={dispatch.id}
                        onClick={() => setActiveArticle(dispatch)}
                        className="py-5 first:pt-5 last:pb-1 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[#FAF7F2]/60 transition-colors cursor-pointer group px-2 rounded-xl"
                      >
                        <div className="space-y-1.5 max-w-3xl">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#567B34]">
                            <span className="font-mono font-bold text-[#B47A16] tabular-nums">
                              0{idx + 1}.
                            </span>
                            <span className="font-semibold text-[#31491E]">
                              {dispatch.categoryLabel}
                            </span>
                            <span aria-hidden="true">·</span>
                            <time dateTime={dispatch.isoDate}>{dispatch.date}</time>
                            <span aria-hidden="true">·</span>
                            <span>{dispatch.commune}</span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums">{dispatch.readTimeMin} min de lecture</span>
                          </div>

                          <h4 className="font-serif text-lg font-bold text-[#18230F] group-hover:text-[#31491E] transition-colors">
                            {dispatch.title}
                          </h4>

                          <p className="text-xs text-[#436229] leading-relaxed">
                            {dispatch.excerpt}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-start lg:self-center">
                          <button
                            type="button"
                            onClick={(e) => toggleSaveArticle(dispatch.id, e)}
                            aria-label={
                              isSaved ? 'Retirer des favoris' : 'Sauvegarder cette dépêche'
                            }
                            className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                              isSaved
                                ? 'bg-[#FEF5DB] border-[#E6AB3C] text-[#B47A16]'
                                : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#31491E] hover:bg-[#E8F4D9]'
                            }`}
                          >
                            {isSaved ? (
                              <BookmarkCheck className="w-3.5 h-3.5" />
                            ) : (
                              <Bookmark className="w-3.5 h-3.5" />
                            )}
                            <span>{isSaved ? 'Sauvegardé' : 'Sauvegarder'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveArticle(dispatch)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] group-hover:bg-[#31491E] text-[#18230F] group-hover:text-white border border-[#E6DEC9] text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                          >
                            <span>Consulter</span>
                            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* FULL ARTICLE EDITORIAL READER MODAL */}
      {/* ============================================================ */}
      {activeArticle && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-article-title"
          onClick={() => setActiveArticle(null)}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF7F2] border border-[#E6DEC9] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl my-auto"
          >
            {/* Sticky Modal Header */}
            <div className="sticky top-0 z-20 bg-[#FAF7F2]/95 backdrop-blur-md px-6 py-4 border-b border-[#E6DEC9] flex items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#567B34]">
                <span className="font-bold text-[#31491E]">{activeArticle.categoryLabel}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#E6AB3C]" aria-hidden="true" />
                  {activeArticle.date}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#567B34]" aria-hidden="true" />
                  {activeArticle.commune}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 rounded-xl bg-white hover:bg-[#E8F4D9] text-[#31491E] border border-[#E6DEC9] transition-colors cursor-pointer"
                  title="Imprimer cet article"
                  aria-label="Imprimer cet article"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleShareArticle(activeArticle, e)}
                  className="p-2 rounded-xl bg-white hover:bg-[#E8F4D9] text-[#31491E] border border-[#E6DEC9] transition-colors cursor-pointer"
                  title="Partager cet article"
                  aria-label="Partager cet article"
                >
                  {copiedId === activeArticle.id ? (
                    <Check className="w-4 h-4 text-[#567B34]" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  className="p-2 rounded-xl bg-[#18230F] hover:bg-[#31491E] text-white transition-colors cursor-pointer"
                  aria-label="Fermer la lecture de l'article"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3
                  id="modal-article-title"
                  className="font-serif text-2xl sm:text-3xl font-bold text-[#18230F] leading-snug text-balance"
                >
                  {activeArticle.title}
                </h3>
                <p className="mt-2.5 text-sm sm:text-base text-[#436229] leading-relaxed">
                  {activeArticle.subtitle}
                </p>
                <div className="mt-4 pt-3 border-t border-[#E6DEC9] text-xs text-[#567B34] flex flex-wrap items-center justify-between gap-2">
                  <span>
                    Par <strong className="text-[#18230F]">{activeArticle.author}</strong> ·{' '}
                    {activeArticle.authorRole}
                  </span>
                  <span className="tabular-nums">
                    Temps de lecture : {activeArticle.readTimeMin} min
                  </span>
                </div>
              </div>

              {activeArticle.image && !imageErrors[activeArticle.id] && (
                <figure className="rounded-xl overflow-hidden border border-[#E6DEC9] bg-white">
                  {(() => {
                    const imgAttrs = buildResponsiveImageAttrs(activeArticle.image, {
                      variant: 'lightbox',
                    });
                    return (
                      <img
                        src={imgAttrs.src}
                        srcSet={imgAttrs.imgSrcSet}
                        sizes={imgAttrs.sizes}
                        width={imgAttrs.width}
                        height={imgAttrs.height}
                        alt={activeArticle.imageAlt || activeArticle.title}
                        referrerPolicy="no-referrer"
                        className="w-full max-h-80 object-cover"
                      />
                    );
                  })()}
                  {activeArticle.imageCaption && (
                    <figcaption className="px-4 py-2.5 text-xs font-serif italic text-[#436229] border-t border-[#E6DEC9]">
                      {activeArticle.imageCaption}
                    </figcaption>
                  )}
                </figure>
              )}

              {/* Long-Form Editorial Reading Column (65-75ch) */}
              <div className="space-y-4 max-w-prose text-sm sm:text-base text-[#242A20] leading-relaxed">
                {activeArticle.content.map((paragraph, idx) => (
                  <p
                    key={idx}
                    className={
                      idx === 0
                        ? 'first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:text-[#31491E] first-letter:float-left first-letter:mr-3 first-letter:leading-none'
                        : ''
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Key Agronomic Takeaways Box (Hairline All-Around Border, No Thick Left Stripe) */}
              <div className="bg-white rounded-xl border border-[#E6DEC9] p-5 space-y-3">
                <h4 className="font-serif text-base font-bold text-[#18230F]">
                  Points clés à retenir au verger et au moulin
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-[#31491E]">
                  {activeArticle.keyTakeaways.map((point, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <span className="font-mono font-bold text-[#B47A16] tabular-nums shrink-0">
                        0{index + 1}.
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contextual Tool Navigation Footer */}
              <div className="pt-4 border-t border-[#E6DEC9] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => toggleSaveArticle(activeArticle.id)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    savedIds.includes(activeArticle.id)
                      ? 'bg-[#FEF5DB] border-[#E6AB3C] text-[#B47A16]'
                      : 'bg-white border-[#E6DEC9] text-[#31491E] hover:bg-[#E8F4D9]'
                  }`}
                >
                  {savedIds.includes(activeArticle.id) ? (
                    <>
                      <BookmarkCheck className="w-4 h-4" />
                      <span>Article sauvegardé dans vos favoris</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      <span>Sauvegarder pour lecture hors-ligne</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigateToSection(activeArticle.relatedSectionId)}
                  className="px-4 py-2.5 rounded-xl bg-[#31491E] hover:bg-[#233416] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>{activeArticle.relatedSectionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E6AB3C]" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
