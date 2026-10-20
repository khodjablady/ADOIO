import React, { useState } from 'react';
import { 
  TASTING_GUIDE, 
  CULINARY_PAIRINGS 
} from '../data/bejaiaOliveData';
import { 
  Award, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle, 
  Utensils, 
  AlertCircle,
  Eye,
  Wind,
  Heart,
  Droplets,
  BookOpen,
  FileText,
  Download,
  ArrowUpRight,
  ShoppingBag,
  Flame,
  PackageCheck,
  HelpCircle,
  CheckSquare,
  Globe,
  Leaf,
  Scale
} from 'lucide-react';

type ConsumerGuideSubTab =
  | 'categories'
  | 'degustation-obtention'
  | 'achat-etiquetage'
  | 'cuisson-sante'
  | 'conservation-env'
  | 'faq-consommateur';

const CONSUMER_CATEGORIES_TABLE = [
  {
    categorie: 'Huile d’olive vierge extra',
    badge: 'Catégorie Supérieure',
    description:
      'Obtenue uniquement par des procédés mécaniques ou physiques dans des conditions préservant le produit. Satisfait aux critères chimiques et sensoriels les plus exigeants.',
    profil: 'Arômes plus expressifs et variés (délicat, fruité, herbacé, amer ou piquant équilibrés)',
    usages: 'Assaisonnement, finition, cuisson',
  },
  {
    categorie: 'Huile d’olive vierge',
    badge: 'Qualité Vierge',
    description:
      'Obtenue également par des procédés mécaniques ou physiques, avec des caractéristiques chimiques et/ou sensorielles moins exigeantes que la vierge extra.',
    profil: 'Profil variable, parfois moins intense',
    usages: 'Cuisine quotidienne, sauces, cuisson',
  },
  {
    categorie: 'Huile d’olive vierge courante',
    badge: 'Acidité > 2 %',
    description:
      'Caractéristiques chimiques et/ou sensorielles de qualité inférieure (souvent issue d’olives abîmées ou tombées au sol). Dans certains pays, non consommable en l’état et doit être raffinée.',
    profil: 'Profil variable, de faible intensité',
    usages: 'Cuisine quotidienne, cuisson (selon réglementation nationale)',
  },
  {
    categorie: 'Huile d’olive (raffinée + vierge)',
    badge: 'Dite « ordinaire »',
    description:
      'Mélange d’huile d’olive raffinée et d’huiles d’olive vierges ajoutées pour ajuster le profil aromatique et la couleur.',
    profil: 'Goût généralement plus doux',
    usages: 'Cuisson et recettes recherchant un goût discret',
  },
];

const CONSUMER_FAQ_ITEMS = [
  {
    q: 'La couleur permet-elle de reconnaître une bonne huile ?',
    a: 'Non. La couleur varie selon de nombreux facteurs (variété, maturité des olives, conditions de production) et ne constitue pas un indicateur fiable de qualité. Une huile plus verte n’est pas nécessairement meilleure qu’une huile plus dorée. La dégustation, la catégorie déclarée et la conformité du produit sont plus pertinentes.',
    myth: 'Idée reçue : « Plus elle est verte, meilleure elle est »',
  },
  {
    q: 'Une huile qui se solidifie au réfrigérateur est-elle authentique ?',
    a: 'Ce test n’est pas fiable. Au froid, l’huile peut se troubler ou se solidifier partiellement (cristallisation des cires et acides gras), puis redevenir liquide à température ambiante. Ce phénomène dépend de la composition de l’huile et de la température, et ne permet pas de vérifier son authenticité.',
    myth: 'Idée reçue : « Le test du frigo prouve la pureté »',
  },
  {
    q: 'Une huile vierge extra convient-elle à la cuisson ?',
    a: 'Oui, elle peut être utilisée pour les vinaigrettes, marinades, légumes, sauces, cuissons à la poêle, au four et de nombreuses fritures domestiques. Évitez cependant les surchauffes et les fumées prolongées.',
    myth: 'Idée reçue : « Il ne faut jamais chauffer l’huile d’olive »',
  },
  {
    q: 'La mention « première pression à froid » garantit-elle la qualité ?',
    a: 'Non, pas à elle seule. Cette formule est historiquement liée aux presses traditionnelles, tandis que la mention « extraction à froid » est encadrée par des conditions réglementaires précises. Examinez l’ensemble de l’étiquette : catégorie, origine, traçabilité, stockage et fiabilité du producteur.',
    myth: 'Idée reçue : « Mention marketing = garantie absolue »',
  },
  {
    q: 'Un assemblage de plusieurs origines est-il suspect ?',
    a: 'Pas en soi. L’assemblage est une pratique technique courante permettant d’obtenir un profil aromatique déterminé et une constance d’un lot à l’autre. L’essentiel est la conformité à la catégorie annoncée et la transparence de l’étiquetage (ne pas confondre « conditionné à » et « origine des olives »).',
    myth: 'Idée reçue : « Assemblage = mauvaise qualité »',
  },
  {
    q: 'Faut-il acheter uniquement l’huile la plus chère ?',
    a: 'Non. Un prix élevé ne garantit pas à lui seul une qualité supérieure, pas plus qu’un prix bas ne prouve une fraude. Choisissez une huile adaptée à vos goûts, à l’usage prévu et à votre budget, auprès d’un producteur ou fournisseur transparent.',
    myth: 'Idée reçue : « Seul le prix fait la qualité »',
  },
  {
    q: 'Comment reconnaître une huile altérée ?',
    a: 'Une odeur ou un goût rance, cireux ou rappelant des noix très anciennes signale une dégradation par l’air, la lumière ou la chaleur. En cas de doute sur l’intégrité du produit, ne le consommez pas et contactez le vendeur ou le fabricant.',
    myth: 'Alerte sensorielle : Goût rance ou vieux',
  },
];

export const TastingAndQuality: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'consumer-guide' | 'attributes' | 'grades' | 'pairings' | 'storage'>('consumer-guide');
  const [guideSubTab, setGuideSubTab] = useState<ConsumerGuideSubTab>('categories');
  const [checkedStorePoints, setCheckedStorePoints] = useState<number[]>([0, 1, 3, 5]);

  const toggleStorePoint = (idx: number) => {
    setCheckedStorePoints((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const consumerPdfPath = '/assets/aistudio/Guide_consommateur_huile_olive_ADOIO_revise_b2346a53.pdf';

  const storeChecklist = [
    'La dénomination exacte : « huile d’olive vierge extra », « vierge » ou autre catégorie.',
    'L’identité claire du producteur, du moulin, du conditionneur ou du responsable de mise sur le marché.',
    'L’origine géographique déclarée (sans confondre le lieu de conditionnement avec l’origine des olives).',
    'La date de durabilité minimale (DDM) et, lorsqu’elle est indiquée, la date de récolte (campagne oléicole).',
    'L’intégrité de l’emballage (verre teinté, métal alimentaire, inox) et la présence d’une fermeture hermétique.',
    'Les conditions de présentation en magasin : produit protégé de la lumière directe et éloigné des sources de chaleur.',
  ];

  return (
    <section id="degustation" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E6DEC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-2">
              <Award className="w-4 h-4 text-[#E6AB3C]" />
              <span>Guide du Consommateur ADOIO & Normes Internationales COI</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18230F] tracking-tight">
              L'Huile d'Olive de Kabylie : Dégustation & Qualité
            </h2>
            <p className="mt-3 text-base text-[#436229] leading-relaxed">
              Comprendre, choisir, déguster et conserver l’huile d’olive : retrouvez le <strong>Guide officiel du Consommateur de l’ADOIO Béjaïa</strong>, les critères sensoriels du Conseil Oléicole International (COI) et les accords gastronomiques.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href={consumerPdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#18230F] hover:bg-[#31491E] text-white text-xs font-bold shadow-xs transition-all"
            >
              <FileText className="w-4 h-4 text-[#E6AB3C]" />
              <span>Ouvrir le Guide du Consommateur (PDF)</span>
              <ArrowUpRight className="w-4 h-4 text-[#E6AB3C]" />
            </a>
            <a
              href={consumerPdfPath}
              download="Guide_consommateur_huile_olive_ADOIO_Bejaia.pdf"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-[#F4EEE1] text-[#18230F] border border-[#D5C7A3] text-xs font-bold transition-all"
            >
              <Download className="w-4 h-4 text-[#31491E]" />
              <span>Télécharger (8 pages)</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-[#F4EEE1] p-1.5 rounded-2xl border border-[#E6DEC9]">
          <button
            onClick={() => setActiveTab('consumer-guide')}
            className={`flex-1 min-w-[180px] py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'consumer-guide'
                ? 'bg-[#31491E] text-white shadow-xs'
                : 'text-[#31491E] hover:text-[#18230F]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#E6AB3C]" />
            <span>Guide du Consommateur ADOIO</span>
          </button>
          <button
            onClick={() => setActiveTab('attributes')}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'attributes'
                ? 'bg-[#31491E] text-white shadow-xs'
                : 'text-[#31491E] hover:text-[#18230F]'
            }`}
          >
            Les 3 Attributs Majeurs
          </button>
          <button
            onClick={() => setActiveTab('grades')}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'grades'
                ? 'bg-[#31491E] text-white shadow-xs'
                : 'text-[#31491E] hover:text-[#18230F]'
            }`}
          >
            Grades Officiels COI
          </button>
          <button
            onClick={() => setActiveTab('pairings')}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pairings'
                ? 'bg-[#31491E] text-white shadow-xs'
                : 'text-[#31491E] hover:text-[#18230F]'
            }`}
          >
            Accords Gastronomiques
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'storage'
                ? 'bg-[#31491E] text-white shadow-xs'
                : 'text-[#31491E] hover:text-[#18230F]'
            }`}
          >
            Conservation Idéale
          </button>
        </div>

        {/* =================================================================== */}
        {/* TAB 0 : GUIDE DU CONSOMMATEUR DE L'HUILE D'OLIVE (DOCUMENT ADOIO) */}
        {/* =================================================================== */}
        {activeTab === 'consumer-guide' && (
          <div className="space-y-8 animate-in fade-in-50 duration-200">
            {/* Avant-propos & À retenir Banner */}
            <div className="bg-gradient-to-r from-[#18230F] via-[#233416] to-[#31491E] text-white rounded-3xl p-6 sm:p-8 border border-[#8CBE5D]/30 shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8 space-y-2.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#E6AB3C] text-[11px] font-bold uppercase tracking-wider">
                    <span>Association ADOIO – Béjaïa • Édition Révisée</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    Guide du Consommateur de l’Huile d’Olive : Comprendre • Choisir • Déguster • Conserver
                  </h3>
                  <p className="text-xs sm:text-sm text-[#E8F4D9]/90 leading-relaxed">
                    L’huile d’olive occupe une place singulière dans l’alimentation méditerranéenne. Produit agricole, patrimoine culturel et ingrédient de cuisine, elle se distingue par la diversité de ses arômes et par la composition de ses matières grasses. Ce guide aide chacun à comprendre les catégories, lire une étiquette, choisir un produit adapté à ses usages et préserver sa qualité après l’achat.
                  </p>
                </div>

                <div className="lg:col-span-4 bg-white/10 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-[#E6AB3C]/40 space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#E6AB3C] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>À retenir (Avant-propos)</span>
                  </span>
                  <p className="text-xs text-white leading-relaxed font-medium">
                    « La qualité d’une huile dépend notamment de la <strong>matière première</strong>, des <strong>conditions d’extraction</strong>, du <strong>stockage</strong> et de la <strong>protection contre l’air, la chaleur et la lumière</strong>. »
                  </p>
                </div>
              </div>
            </div>

            {/* Sub-tabs for the 11 Chapters of the Consumer Guide */}
            <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-[#D5C7A3]">
              {[
                { id: 'categories', label: '1. Catégories & Usages', sub: 'Chapitre 1', icon: Award },
                { id: 'degustation-obtention', label: '2. Goût & Extraction', sub: 'Chapitres 2 & 3', icon: Droplets },
                { id: 'achat-etiquetage', label: '3. Choisir, Étiquette & Origine', sub: 'Chapitres 4, 7 & 8', icon: ShoppingBag },
                { id: 'cuisson-sante', label: '4. Cuisson & Santé', sub: 'Chapitres 5 & 6', icon: Flame },
                { id: 'conservation-env', label: '5. Emballage & Environnement', sub: 'Chapitres 9 & 10', icon: PackageCheck },
                { id: 'faq-consommateur', label: '6. Questions Fréquentes (11)', sub: 'Chapitre 11 & Conclusion', icon: HelpCircle },
              ].map((st) => {
                const Icon = st.icon;
                const isSubActive = guideSubTab === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setGuideSubTab(st.id as ConsumerGuideSubTab)}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer flex-1 min-w-[165px] ${
                      isSubActive
                        ? 'bg-[#18230F] text-white shadow-xs'
                        : 'bg-transparent text-[#18230F] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isSubActive ? 'text-[#E6AB3C]' : 'text-[#567B34]'}`} />
                    <div className="min-w-0">
                      <span className="text-xs font-bold block truncate">{st.label}</span>
                      <span className={`text-[10px] block truncate ${isSubActive ? 'text-[#B0D984]' : 'text-[#567B34]'}`}>
                        {st.sub}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* SOUS-ONGLET 1 : CHAPITRE 1 — COMPRENDRE LES CATÉGORIES D'HUILE D'OLIVE */}
            {guideSubTab === 'categories' && (
              <div className="bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                    Chapitre 1 du Guide du Consommateur ADOIO
                  </span>
                  <h4 className="font-serif text-2xl font-bold text-[#18230F] mt-1">
                    1. Comprendre les catégories d’huile d’olive
                  </h4>
                  <p className="text-xs sm:text-sm text-[#436229] mt-1">
                    Les appellations ne sont pas interchangeables. Elles correspondent à des catégories définies par des critères de qualité, dont des paramètres chimiques et, pour les huiles vierges, une évaluation sensorielle réalisée selon des méthodes reconnues.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CONSUMER_CATEGORIES_TABLE.map((item, i) => (
                    <div
                      key={item.categorie}
                      className={`p-5 rounded-2xl border space-y-2.5 ${
                        i === 0
                          ? 'bg-[#F4F9EC] border-[#8CBE5D]'
                          : 'bg-[#FAF7F2] border-[#E6DEC9]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h5 className="font-serif text-lg font-bold text-[#18230F]">
                          {item.categorie}
                        </h5>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            i === 0
                              ? 'bg-[#31491E] text-white'
                              : i === 1
                              ? 'bg-[#E6AB3C]/30 text-[#18230F]'
                              : 'bg-[#E6DEC9] text-[#436229]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#436229] leading-relaxed">{item.description}</p>
                      <div className="pt-2 border-t border-[#E6DEC9] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-[#567B34] block">Profil général :</span>
                          <span className="text-[#18230F] font-medium">{item.profil}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-[#567B34] block">Usages possibles :</span>
                          <span className="text-[#31491E] font-bold">{item.usages}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-[#FEF5DB] border border-[#E6AB3C] text-xs text-[#18230F] font-semibold flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#B47A16] shrink-0" />
                  <span>
                    Conseil ADOIO : Choisissez d’abord selon l’usage, le goût recherché, la fraîcheur du produit et la fiabilité du fabricant — pas uniquement selon la couleur ou le prix.
                  </span>
                </div>
              </div>
            )}

            {/* SOUS-ONGLET 2 : CHAPITRES 2 & 3 — GOÛT, DÉGUSTATION & EXTRACTION */}
            {guideSubTab === 'degustation-obtention' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Chapitre 2 */}
                <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 space-y-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                      Chapitre 2 — Analyse Sensorielle
                    </span>
                    <h4 className="font-serif text-2xl font-bold text-[#18230F] mt-1">
                      2. Goût, arôme et dégustation
                    </h4>
                    <p className="text-xs text-[#436229] mt-1 leading-relaxed">
                      Une huile d’olive vierge extra peut présenter des notes d’herbe fraîche, de feuille, d’amande, de tomate, d’artichaut ou de fruits mûrs. <strong>L’amertume et le piquant sont des attributs positifs</strong> lorsqu’ils sont équilibrés.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FEF5DB]/70 border border-[#E6AB3C]/50 text-xs text-[#18230F] leading-relaxed">
                    <strong>Pourquoi la couleur ne suffit pas :</strong> La couleur varie selon la variété, la maturité des olives et les conditions de production. <strong>Une huile plus verte n’est donc pas nécessairement meilleure qu’une huile plus dorée.</strong>
                  </div>

                  <div className="space-y-2.5">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#31491E]">
                      Une méthode simple pour déguster à la maison (4 étapes) :
                    </h5>
                    {[
                      '1. Versez une petite quantité dans un verre propre, de préférence légèrement opaque.',
                      '2. Réchauffez doucement le verre dans la paume et sentez les arômes.',
                      '3. Prenez une petite gorgée et répartissez l’huile dans toute la bouche.',
                      '4. Repérez le fruité, l’amertume et le piquant, puis observez l’équilibre général.',
                    ].map((step) => (
                      <div key={step} className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DEC9] text-xs font-medium text-[#18230F]">
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chapitre 3 */}
                <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 space-y-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                      Chapitre 3 — Du Verger au Moulin
                    </span>
                    <h4 className="font-serif text-2xl font-bold text-[#18230F] mt-1">
                      3. Comment l’huile est-elle obtenue ?
                    </h4>
                    <p className="text-xs text-[#436229] mt-1 leading-relaxed">
                      L’huile d’olive vierge est le pur jus huileux du fruit obtenu exclusivement par des procédés mécaniques :
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {[
                      { step: '1. Nettoyage & Lavage', desc: 'Retrait des feuilles et impuretés, lavage à l’eau propre.' },
                      { step: '2. Broyage', desc: 'Les olives sont broyées (meules ou broyeurs métalliques) pour former une pâte.' },
                      { step: '3. Malaxage maîtrisé', desc: 'Permet aux gouttelettes d’huile de se réunir à température contrôlée.' },
                      { step: '4. Séparation mécanique', desc: 'Centrifugation (décanteur) ou pression isolant l’huile de l’eau et du grignon.' },
                    ].map((s) => (
                      <div key={s.step} className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9]">
                        <span className="font-bold text-[#18230F] block mb-1">{s.step}</span>
                        <span className="text-[#436229] leading-relaxed">{s.desc}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F4F9EC] border border-[#C5DFB0] space-y-1.5 text-xs">
                    <span className="font-bold text-[#31491E] block">
                      Décryptage des mentions « Extraction à froid » & « Première pression à froid » :
                    </span>
                    <p className="text-[#18230F] leading-relaxed">
                      La mention <strong>« extraction à froid »</strong> est encadrée par des conditions réglementaires précises (&lt; 27 °C). La formule <strong>« première pression à froid »</strong> est historiquement liée aux presses traditionnelles ; elle ne constitue pas, à elle seule, une preuve suffisante de qualité. Il convient de lire l’ensemble des informations de l’étiquette.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SOUS-ONGLET 3 : CHAPITRES 4, 7 & 8 — CHOISIR EN MAGASIN, AUTHENTICITÉ & ORIGINE */}
            {guideSubTab === 'achat-etiquetage' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Chapitre 4 : Checklist interactive en magasin */}
                <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 space-y-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                      Chapitre 4 — Liste de Contrôle à l’Achat
                    </span>
                    <h4 className="font-serif text-2xl font-bold text-[#18230F] mt-1">
                      4. Choisir une huile en magasin : les 6 points à vérifier
                    </h4>
                    <p className="text-xs text-[#436229] mt-1">
                      Utilisez cette grille interactive lors de vos achats ({checkedStorePoints.length}/6 critères vérifiés) :
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {storeChecklist.map((point, idx) => {
                      const isChecked = checkedStorePoints.includes(idx);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleStorePoint(idx)}
                          className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                            isChecked
                              ? 'bg-[#F4F9EC] border-[#31491E]'
                              : 'bg-[#FAF7F2] border-[#E6DEC9]'
                          }`}
                        >
                          <CheckSquare
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              isChecked ? 'text-[#31491E]' : 'text-[#8C5E0A]'
                            }`}
                          />
                          <span className="text-xs text-[#18230F] font-medium leading-relaxed">
                            {point}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#D5C7A3] text-xs text-[#436229] leading-relaxed">
                    <strong className="text-[#18230F] block mb-1">Le prix et la confiance :</strong>
                    Un prix élevé ne garantit pas à lui seul une qualité supérieure, pas plus qu’un prix bas ne prouve une fraude. Privilégiez les fournisseurs transparents, les produits correctement étiquetés et les producteurs dont la traçabilité peut être établie.
                  </div>
                </div>

                {/* Chapitres 7 & 8 : Authenticité, étiquetage, origine et assemblages */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-7 space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                      Chapitre 7 — Vigilance & Réglementation
                    </span>
                    <h4 className="font-serif text-xl font-bold text-[#18230F]">
                      7. Authenticité, qualité et étiquetage
                    </h4>
                    <p className="text-xs text-[#436229] leading-relaxed">
                      Il est important de distinguer trois questions : <strong>l’authenticité du produit</strong>, sa <strong>conformité à la catégorie annoncée</strong> et <strong>l’exactitude de son étiquetage</strong>. Une huile peut ne pas correspondre pleinement à la catégorie indiquée (suite à une dégradation par l’air, la lumière ou la chaleur lors du transport/stockage) sans être nécessairement mélangée frauduleusement à une autre huile.
                    </p>
                    <p className="text-xs text-[#18230F] bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E6DEC9] leading-relaxed">
                      <strong>Contexte algérien :</strong> L’évaluation d’une huile vierge repose sur des analyses chimiques et un jury sensoriel agréé. Les exigences propres aux États-Unis ou à l’Union européenne ne s’appliquent pas automatiquement à l’Algérie.
                    </p>
                  </div>

                  <div className="bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-7 space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                      Chapitre 8 — Traçabilité Géographique
                    </span>
                    <h4 className="font-serif text-xl font-bold text-[#18230F]">
                      8. Origine et assemblages
                    </h4>
                    <p className="text-xs text-[#436229] leading-relaxed">
                      L’assemblage de plusieurs lots ou variétés est une pratique technique courante permettant d’obtenir un profil aromatique équilibré et constant.
                    </p>
                    <div className="p-3.5 rounded-xl bg-[#FEF5DB] border border-[#E6AB3C]/60 text-xs text-[#18230F]">
                      <strong>Attention aux mentions :</strong> Les termes <em>« produit de »</em>, <em>« conditionné à »</em> ou <em>« importé de »</em> n’ont pas la même signification. <strong>Le pays ou lieu de conditionnement ne doit pas être confondu avec l’origine des olives.</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SOUS-ONGLET 4 : CHAPITRES 5 & 6 — CUISSON & SANTÉ */}
            {guideSubTab === 'cuisson-sante' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Chapitre 5 : Cuisson */}
                <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 space-y-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                      Chapitre 5 — Stabilité Thermique en Cuisine
                    </span>
                    <h4 className="font-serif text-2xl font-bold text-[#18230F] mt-1">
                      5. Cuisson : l’huile d’olive est-elle adaptée ?
                    </h4>
                    <p className="text-xs text-[#436229] mt-1 leading-relaxed">
                      <strong>Oui.</strong> L’huile d’olive peut être utilisée pour les vinaigrettes, les marinades, les légumes, les sauces, les cuissons à la poêle, au four et de nombreuses fritures domestiques, à condition de respecter les bonnes pratiques de cuisson.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9] text-xs text-[#436229] leading-relaxed">
                    <strong className="text-[#18230F] block mb-1">Au-delà du seul « point de fumée » :</strong>
                    Le point de fumée ne suffit pas à lui seul pour comparer les huiles. La stabilité à la chaleur dépend aussi de la <strong>composition en acides gras (richesse en acide oléique monoinsaturé)</strong>, de la présence de <strong>composés mineurs antioxydants</strong>, du degré de raffinage et des conditions réelles de cuisson.
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#31491E]">
                      Les 4 règles d’or pour la cuisson :
                    </h5>
                    {[
                      'Évitez de laisser l’huile fumer de façon prolongée.',
                      'Ne réutilisez pas indéfiniment une huile ayant servi à frire.',
                      'Évitez les surchauffes et filtrez les résidus alimentaires si l’huile est réutilisée une fois dans des conditions appropriées.',
                      'Choisissez une huile dont le goût convient au plat (vierge extra pour enrichir en arômes ; profil plus doux lorsque l’on souhaite laisser dominer les autres ingrédients).',
                    ].map((rule, i) => (
                      <div key={i} className="p-3 rounded-xl bg-[#F4F9EC] border border-[#C5DFB0] text-xs text-[#18230F] flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-[#31491E] shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chapitre 6 : Santé */}
                <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 space-y-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                      Chapitre 6 — Profil Lipidique & Nutrition
                    </span>
                    <h4 className="font-serif text-2xl font-bold text-[#18230F] mt-1">
                      6. Huile d’olive et santé : que retenir ?
                    </h4>
                  </div>

                  <div className="space-y-3 text-xs text-[#436229] leading-relaxed">
                    <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9]">
                      <strong className="text-[#18230F] block mb-1">Acide oléique & Polyphénols :</strong>
                      L’huile d’olive est riche en <strong>acide oléique (acide gras monoinsaturé)</strong>. L’huile vierge extra contient également des composés naturellement présents dans l’olive, dont des <strong>polyphénols</strong>, en quantités variables selon la variété, la récolte, l’extraction et le stockage.
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9]">
                      <strong className="text-[#18230F] block mb-1">Équilibre alimentaire global :</strong>
                      Remplacer certaines sources de graisses saturées par des graisses insaturées contribue à améliorer le profil lipidique. Toutefois, l’huile d’olive reste un aliment énergétique : la quantité consommée et l’ensemble du régime alimentaire comptent.
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FEF5DB] border border-[#E6AB3C] text-xs text-[#18230F] leading-relaxed">
                    <strong>Information importante (Avertissement du Guide ADOIO) :</strong> Ce guide est un document d’information alimentaire et ne remplace pas l’avis d’un professionnel de santé. Les études montrent des associations dans des contextes précis mais ne permettent pas d’affirmer qu’une huile prévient ou traite à elle seule une maladie.
                  </div>
                </div>
              </div>
            )}

            {/* SOUS-ONGLET 5 : CHAPITRES 9 & 10 — EMBALLAGE, CONSERVATION & ENVIRONNEMENT */}
            {guideSubTab === 'conservation-env' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 space-y-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                      Chapitre 9 — Protection contre l’Air, la Lumière et la Chaleur
                    </span>
                    <h4 className="font-serif text-2xl font-bold text-[#18230F] mt-1">
                      9. Emballage et conservation à la maison
                    </h4>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F4F9EC] border border-[#C5DFB0] text-xs text-[#18230F] leading-relaxed">
                    <strong>Quels emballages choisir ?</strong> Le <strong>verre teinté</strong>, les <strong>boîtes métalliques adaptées au contact alimentaire</strong>, l’<strong>acier inoxydable</strong> et certains <strong>emballages multicouches</strong> protègent efficacement l’huile. Le plastique alimentaire approprié peut convenir lorsqu’il est conçu pour cet usage et stocké correctement.
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#18230F]">
                      Les 5 bons gestes à la maison :
                    </h5>
                    {[
                      'Conservez l’huile dans un endroit frais, sec et sombre, à température relativement stable.',
                      'Refermez soigneusement le bouchon après chaque utilisation pour limiter le contact avec l’oxygène.',
                      'Évitez de laisser la bouteille près du four, d’une fenêtre ensoleillée ou d’une source de chaleur.',
                      'Achetez une quantité adaptée à votre rythme réel de consommation.',
                      'Après ouverture, consommez l’huile sans la laisser traîner inutilement.',
                    ].map((g, i) => (
                      <div key={i} className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DEC9] text-xs text-[#436229] flex items-center gap-2.5">
                        <CheckCircle className="w-4 h-4 text-[#31491E] shrink-0" />
                        <span>{g}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FEF5DB] border border-[#E6AB3C]/60 text-xs text-[#18230F]">
                    <strong>Faut-il mettre l’huile au réfrigérateur ?</strong> Le réfrigérateur n’est généralement pas nécessaire pour un usage domestique courant. Au froid, l’huile peut se troubler ou se solidifier partiellement, puis redevenir liquide à température ambiante. <strong>Ce phénomène ne permet pas de vérifier son authenticité.</strong>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 space-y-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                      Chapitre 10 — Durabilité de la Filière
                    </span>
                    <h4 className="font-serif text-2xl font-bold text-[#18230F] mt-1">
                      10. L’oléiculture et l’environnement
                    </h4>
                  </div>

                  <p className="text-xs text-[#436229] leading-relaxed">
                    L’olivier est une culture pérenne qui contribue à préserver les paysages agricoles kabyles, favoriser la biodiversité et limiter l’érosion des sols en pente.
                  </p>
                  <p className="text-xs text-[#436229] leading-relaxed">
                    Les performances environnementales dépendent toutefois du système de production : <strong>gestion des sols, de l’eau, des intrants, des sous-produits (grignons et margines), énergie au moulin, transport et type d’emballage</strong>.
                  </p>
                  <div className="p-4 rounded-2xl bg-[#18230F] text-white text-xs leading-relaxed">
                    <span className="text-[#E6AB3C] font-bold block mb-1">Conclusion du Guide ADOIO :</span>
                    « En développant la connaissance du produit et en valorisant le travail des oléiculteurs, les consommateurs contribuent à soutenir une filière oléicole plus exigeante, plus transparente et mieux ancrée dans son territoire. »
                  </div>
                </div>
              </div>
            )}

            {/* SOUS-ONGLET 6 : CHAPITRE 11 — QUESTIONS FRÉQUENTES DU CONSOMMATEUR */}
            {guideSubTab === 'faq-consommateur' && (
              <div className="bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                    Chapitre 11 du Guide du Consommateur ADOIO
                  </span>
                  <h4 className="font-serif text-2xl font-bold text-[#18230F] mt-1">
                    11. Questions fréquentes — Vrai / Faux & Repères Pratiques
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CONSUMER_FAQ_ITEMS.map((item) => (
                    <div
                      key={item.q}
                      className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9] space-y-2"
                    >
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#E8F4D9] text-[#31491E]">
                        {item.myth}
                      </span>
                      <h5 className="font-serif text-base font-bold text-[#18230F]">
                        {item.q}
                      </h5>
                      <p className="text-xs text-[#436229] leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 1: The 3 Attributes */}
        {activeTab === 'attributes' && (
          <div className="space-y-8 animate-in fade-in-50 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TASTING_GUIDE.positiveAttributes.map((attr, idx) => (
                <div
                  key={attr.name}
                  className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E6DEC9] shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-[#E8F4D9] flex items-center justify-center text-[#31491E]">
                      {idx === 0 ? <Wind className="w-6 h-6 text-[#567B34]" /> : idx === 1 ? <Eye className="w-6 h-6 text-[#E6AB3C]" /> : <Heart className="w-6 h-6 text-[#AF4D24]" />}
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#18230F]">
                        {attr.name}
                      </h3>
                      <p className="text-xs text-[#567B34] mt-2 leading-relaxed">
                        {attr.definition}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E6DEC9] bg-[#FAF7F2] p-3.5 rounded-xl">
                    <span className="text-[11px] font-bold text-[#18230F] block mb-1">
                      Dans le terroir de Béjaïa :
                    </span>
                    <p className="text-xs text-[#436229] leading-relaxed">
                      {attr.kabyleNotes}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* How to taste like a professional panelist */}
            <div className="bg-[#233416] text-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#8CBE5D]/30">
              <h3 className="font-serif text-xl font-bold text-[#FAF7F2] mb-4">
                Le Protocole de Dégustation Professionnel (Panel Test)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs text-[#E8F4D9]">
                <div className="space-y-1">
                  <span className="font-mono text-[#E6AB3C] font-bold block">Étape 01 · Chauffer</span>
                  <p>Tenir le petit verre bleu ou ambré dans la paume de la main pour amener l'huile à ~28°C et libérer les molécules volatiles.</p>
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-[#E6AB3C] font-bold block">Étape 02 · Olfaction</span>
                  <p>Inspirer profondément en tournoyant le verre pour évaluer le fruité (vert d'herbe ou mûr de fruits) et vérifier l'absence de défauts.</p>
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-[#E6AB3C] font-bold block">Étape 03 · Strippagio</span>
                  <p>Prendre une gorgée d'huile et aspirer de l'air vivement entre les lèvres pour tapisser l'ensemble des récepteurs de la cavité buccale.</p>
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-[#E6AB3C] font-bold block">Étape 04 · Déglutition</span>
                  <p>Avaler lentement pour ressentir l'ardence (picotement au fond de la gorge caractéristique de l'oléocanthal bénéfique pour la santé).</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: COI Grades */}
        {activeTab === 'grades' && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TASTING_GUIDE.coiCategories.map((cat, idx) => (
                <div
                  key={cat.grade}
                  className={`bg-white rounded-2xl p-6 sm:p-7 border shadow-xs space-y-4 ${
                    idx === 0 ? 'border-[#8CBE5D] ring-2 ring-[#8CBE5D]/30' : 'border-[#E6DEC9]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      idx === 0 ? 'bg-[#E8F4D9] text-[#233416]' : idx === 1 ? 'bg-[#FEF5DB] text-[#B47A16]' : 'bg-red-50 text-red-700'
                    }`}>
                      {idx === 0 ? 'Élite Terroir' : idx === 1 ? 'Qualité Vierge' : 'Non commerciale en l\'état'}
                    </span>
                    {idx === 0 && <ShieldCheck className="w-5 h-5 text-[#567B34]" />}
                  </div>

                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#18230F]">
                      {cat.grade}
                    </h3>
                    <p className="text-xs text-[#E6AB3C] font-mono font-bold mt-1">
                      {cat.acidity}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs text-[#436229] pt-3 border-t border-[#E6DEC9]">
                    <p><strong>Peroxydes :</strong> {cat.peroxide}</p>
                    <p><strong>Caractéristiques :</strong> {cat.tastingNotes}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#E6DEC9] text-xs text-[#436229] leading-relaxed">
              <strong>Engagement Qualité ADOIO :</strong> L'association soutient les oléiculteurs de Béjaïa dans l'acquisition de réfractomètres et kits d'acidité rapide afin de classer chaque lot d'huile dès la sortie du décanteur centrifuge.
            </div>
          </div>
        )}

        {/* Tab 3: Culinary Pairings */}
        {activeTab === 'pairings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in-50 duration-200">
            {CULINARY_PAIRINGS.map((item) => (
              <div
                key={item.dish}
                className="bg-white rounded-2xl p-6 border border-[#E6DEC9] shadow-xs space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-[#E6AB3C]" />
                  <h3 className="font-serif text-lg font-bold text-[#18230F]">
                    {item.dish}
                  </h3>
                </div>
                <div className="inline-block px-2.5 py-1 rounded bg-[#E8F4D9] text-[#233416] text-xs font-semibold">
                  Type conseillé : {item.oilType}
                </div>
                <p className="text-xs sm:text-sm text-[#436229] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Storage */}
        {activeTab === 'storage' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DEC9] shadow-xs space-y-6 animate-in fade-in-50 duration-200">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#18230F]">
              Les 4 Ennemis de l'Huile d'Olive & Règles de Conservation
            </h3>
            <p className="text-xs sm:text-sm text-[#436229]">
              L'huile d'olive est un pur jus de fruit frais : elle ne vieillit pas comme le vin et doit être protégée pour préserver ses vitamines et ses composés phénoliques.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TASTING_GUIDE.storageAdvice.map((advice, i) => (
                <div
                  key={i}
                  className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E6DEC9] flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-[#567B34] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#242A20] leading-relaxed font-medium">
                    {advice}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

