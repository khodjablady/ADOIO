import React, { useState } from 'react';
import {
  Recycle,
  Sprout,
  Droplets,
  Flame,
  Sparkles,
  Compass,
  FileText,
  Download,
  AlertTriangle,
  CheckCircle2,
  Scale,
  TreePine,
  Factory,
  FlaskConical,
  Layers,
  ShieldCheck,
  BookOpen,
  ArrowUpRight,
  Info,
  Award,
  Users
} from 'lucide-react';
import { ArticleAudioReader } from './ArticleAudioReader';

type ValorizationTab =
  | 'identification'
  | 'alimentation'
  | 'compostage'
  | 'margines'
  | 'biomasse'
  | 'cosmetiques'
  | 'axes';

interface PruningProfile {
  id: string;
  age: 'Jeune' | 'Adulte' | 'Vieux';
  type: 'Légère' | 'Sévère';
  totalWoodKg: number | null;
  leavesSharePct: number | null;
  fodderLeavesKg: number | null;
}

const PRUNING_TABLE_DATA: PruningProfile[] = [
  { id: 'jeune-legere', age: 'Jeune', type: 'Légère', totalWoodKg: null, leavesSharePct: null, fodderLeavesKg: null },
  { id: 'jeune-severe', age: 'Jeune', type: 'Sévère', totalWoodKg: 30, leavesSharePct: 60, fodderLeavesKg: 18 },
  { id: 'adulte-legere', age: 'Adulte', type: 'Légère', totalWoodKg: 50, leavesSharePct: 50, fodderLeavesKg: 25 },
  { id: 'adulte-severe', age: 'Adulte', type: 'Sévère', totalWoodKg: 100, leavesSharePct: 30, fodderLeavesKg: 30 },
  { id: 'vieux-legere', age: 'Vieux', type: 'Légère', totalWoodKg: null, leavesSharePct: null, fodderLeavesKg: null },
  { id: 'vieux-severe', age: 'Vieux', type: 'Sévère', totalWoodKg: 100, leavesSharePct: 12, fodderLeavesKg: 12 },
];

const ANNEX_TECHNICAL_DATA = [
  {
    matiere: 'Grignon brut',
    valeur: 'Environ 24 % d’eau et 9 % d’huile',
    precaution: 'Composition variable selon le procédé et l’échantillon. Altération rapide à l’air libre.',
  },
  {
    matiere: 'Pulpe d’olive',
    valeur: 'Environ 60 % d’eau',
    precaution: 'Pâte obtenue lorsque le noyau est séparé avant extraction. Conservation particulièrement délicate.',
  },
  {
    matiere: 'Feuilles de nettoyage',
    valeur: 'Environ 5 % du poids des olives',
    precaution: 'Retirées au lavage à l’entrée de l’huilerie (à distinguer des feuilles et ramilles de taille).',
  },
  {
    matiere: 'Grignons bruts (masse)',
    valeur: 'Estimation moyenne de 35 % de la masse d’olives traitées',
    precaution: 'Ordre de grandeur de référence, non applicable automatiquement à toutes les huileries.',
  },
  {
    matiere: 'Margines en système par pression',
    valeur: 'Environ 100 L pour 100 kg d’olives traitées',
    precaution: 'Volume et composition variables selon le procédé (pressage vs centrifugation).',
  },
  {
    matiere: 'Grignon épuisé non dénoyauté',
    valeur: 'Environ 77 % de la masse du grignon brut (eau 15 %, huile 4 %, coques 55 %, pulpe 26 %)',
    precaution: 'Résidu obtenu après extraction complémentaire de l’huile résiduelle par solvant (ex. hexane).',
  },
  {
    matiere: 'Dénoyautage des grignons épuisés',
    valeur: 'Environ 44 % de la masse initiale après dénoyautage',
    precaution: 'Séparation d’une partie des noyaux par tamisage ou ventilation.',
  },
  {
    matiere: 'Margines — plafonds documentaires cités',
    valeur: '100 m³/ha/an en système continu ; 30 m³/ha/an en système classique',
    precaution: 'Valeurs documentaires à vérifier avant toute application et au regard de la réglementation en vigueur.',
  },
];

const ACTION_AXES_DATA = [
  {
    axe: 'Connaissance des gisements',
    actions: 'Quantifier et caractériser les sous-produits par bassin oléicole et par procédé.',
    acteurs: 'Huileries, services agricoles, instituts techniques, universités',
    indicateurs: 'Nombre d’huileries enquêtées ; volumes caractérisés',
  },
  {
    axe: 'Prévention des pollutions',
    actions: 'Élaborer des procédures de collecte, stockage et traitement des margines.',
    acteurs: 'Huileries, collectivités, services environnementaux',
    indicateurs: 'Part des sites dotés d’un dispositif de gestion ; incidents recensés',
  },
  {
    axe: 'Valorisation agronomique',
    actions: 'Encadrer le compostage et les plans d’épandage par des analyses et des protocoles.',
    acteurs: 'Agriculteurs, laboratoires, services agricoles',
    indicateurs: 'Volumes valorisés conformément aux protocoles ; analyses réalisées',
  },
  {
    axe: 'Alimentation animale',
    actions: 'Former les éleveurs et soutenir des essais locaux sur des rations adaptées.',
    acteurs: 'Éleveurs, vétérinaires, nutritionnistes, instituts de recherche',
    indicateurs: 'Nombre d’essais ; éleveurs formés ; résultats zootechniques suivis',
  },
  {
    axe: 'Économie circulaire et énergie',
    actions: 'Étudier la faisabilité de projets de biomasse à l’échelle locale.',
    acteurs: 'Investisseurs, coopératives, collectivités, opérateurs énergétiques',
    indicateurs: 'Études de faisabilité ; projets pilotes viables',
  },
  {
    axe: 'Entrepreneuriat et tourisme',
    actions: 'Appuyer les produits dérivés, les salons, les visites et les circuits oléicoles.',
    acteurs: 'Entrepreneurs, associations, offices de tourisme, collectivités',
    indicateurs: 'Entreprises créées ; visiteurs ; ventes générées',
  },
  {
    axe: 'Coordination et diffusion',
    actions: 'Partager les résultats, documenter les bonnes pratiques et structurer des partenariats.',
    acteurs: 'Pouvoirs publics, organisations professionnelles, recherche',
    indicateurs: 'Partenariats actifs ; guides diffusés ; retours d’expérience publiés',
  },
];

export const ByproductsValorizationSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ValorizationTab>('identification');

  // Interactive By-product Estimator State (based on ADOIO Technical Guide formulas)
  const [olivesTons, setOlivesTons] = useState<number>(10); // 10 tonnes = 10 000 kg (100 quintaux)
  const [extractionSystem, setExtractionSystem] = useState<'pression' | 'continu'>('pression');
  const [pruningTreeCount, setPruningTreeCount] = useState<number>(100);
  const [selectedPruningProfileId, setSelectedPruningProfileId] = useState<string>('adulte-legere');

  const olivesKg = olivesTons * 1000;
  // 35% average raw pomace (grignons bruts)
  const rawPomaceKg = Math.round(olivesKg * 0.35);
  const rawPomaceWaterKg = Math.round(rawPomaceKg * 0.24);
  const rawPomaceResidualOilKg = Math.round(rawPomaceKg * 0.09);
  // Exhausted pomace (~77% of raw pomace)
  const exhaustedPomaceKg = Math.round(rawPomaceKg * 0.77);
  // Pitted exhausted pomace (~44% of exhausted pomace)
  const pittedPomaceKg = Math.round(exhaustedPomaceKg * 0.44);
  // Cleaning leaves at mill entrance (~5% of olive mass)
  const millLeavesKg = Math.round(olivesKg * 0.05);
  // Margines (~100 L per 100 kg in pressure system; ~80 L in 3-phase continuous)
  const marginesLiters = Math.round(olivesKg * (extractionSystem === 'pression' ? 1.0 : 0.8));
  const marginesM3 = Number((marginesLiters / 1000).toFixed(1));
  const spreadingCeilingM3PerHa = extractionSystem === 'continu' ? 100 : 30;
  const minSpreadingAreaHa = Number((marginesM3 / spreadingCeilingM3PerHa).toFixed(2));

  // Pruning residues calculation
  const activePruningProfile =
    PRUNING_TABLE_DATA.find((p) => p.id === selectedPruningProfileId) || PRUNING_TABLE_DATA[2];
  const totalPruningWoodKg = (activePruningProfile.totalWoodKg || 0) * pruningTreeCount;
  const totalFodderLeavesKg = (activePruningProfile.fodderLeavesKg || 0) * pruningTreeCount;
  const totalLargeBranchesKg = Math.max(0, totalPruningWoodKg - totalFodderLeavesKg);

  const pdfPath = '/assets/aistudio/Les_sous_produits_oleicoles_version_revisee_265b6229.pdf';

  const tabs: { id: ValorizationTab; label: string; badge: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'identification', label: '1. Identifier les Sous-Produits', badge: 'Huilerie & Taille', icon: Layers },
    { id: 'alimentation', label: '2. Alimentation Animale', badge: 'Ovins & Bovins', icon: Sprout },
    { id: 'compostage', label: '3. Compostage & Amendements', badge: 'Humus & NPK', icon: Recycle },
    { id: 'margines', label: '4. Valorisation des Margines', badge: 'Épandage & Suivi', icon: Droplets },
    { id: 'biomasse', label: '5. Biomasse & Énergie', badge: 'Chaleur & Bioénergie', icon: Flame },
    { id: 'cosmetiques', label: '6. Cosmétiques & Oléotourisme', badge: 'Savons, Musées & Routes', icon: Sparkles },
    { id: 'axes', label: '7. Stratégie & Annexe Technique', badge: '7 Axes & Chiffres', icon: BookOpen },
  ];

  return (
    <section
      id="sous-produits"
      className="py-16 sm:py-24 bg-[#F4EFE6] border-b border-[#E6DEC9] scroll-mt-36"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* En-tête Institutionnel & Téléchargement du Guide ADOIO */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#D5C7A3]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#31491E]/10 border border-[#31491E]/20 text-xs font-bold uppercase tracking-wider text-[#31491E] mb-3">
              <Recycle className="w-3.5 h-3.5 text-[#567B34]" />
              <span>Économie Circulaire & Guide Technique ADOIO – Béjaïa</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#18230F] tracking-tight">
              Les Sous-Produits Oléicoles : Mieux les connaître, mieux les valoriser
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#436229] leading-relaxed">
              Guide technique à destination des oléiculteurs, des agriculteurs et des acteurs publics de la filière.
              La transformation des olives et l’entretien des vergers génèrent plusieurs catégories de résidus —{' '}
              <strong className="text-[#18230F]">grignons, margines, pulpe, feuilles, ramilles et bois de taille</strong>{' '}
              — pouvant contribuer à l’alimentation animale, à la production de compost, à la fertilisation raisonnée,
              à la biomasse énergétique ou à des activités économiques et touristiques complémentaires.
            </p>
            <div className="mt-4">
              <ArticleAudioReader
                sectionId="sous-produits"
                title="Guide Technique de Valorisation des Sous-Produits Oléicoles"
                text={() => {
                  const annexSummary = ANNEX_TECHNICAL_DATA.map(
                    (d) => `${d.matiere} : ${d.valeur}. Précaution : ${d.precaution}`
                  ).join(' ');
                  return `Guide technique de l'ADOIO Béjaïa sur la valorisation des sous-produits oléicoles. La transformation des olives et la taille des vergers génèrent six grandes familles de co-produits : les grignons bruts ou épuisés, les margines, la pulpe d'olive, les feuilles de lavage, ainsi que les ramilles et le bois de taille. Ces ressources peuvent être valorisées selon sept axes complémentaires : 1. L'alimentation animale des ovins et bovins grâce aux feuilles fraîches et aux blocs multi-nutritionnels à base de grignons dénoyautés. 2. Le compostage aérobie en andains associant grignons, fumier et feuilles pour restituer l'humus aux sols pentus de Kabylie. 3. L'épandage agronomique contrôlé des margines après neutralisation à la chaux ou évaporation. 4. La biomasse énergétique avec les noyaux d'olives concassés et briquettes combustibles à haut pouvoir calorifique. 5. La savonnerie artisanale, la cosmétique et l'oléotourisme. Données techniques de référence : ${annexSummary}`;
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#18230F] hover:bg-[#31491E] text-white text-xs sm:text-sm font-bold shadow-xs transition-all"
            >
              <FileText className="w-4 h-4 text-[#E6AB3C]" />
              <span>Consulter le Guide PDF Officiel</span>
              <ArrowUpRight className="w-4 h-4 text-[#E6AB3C]" />
            </a>
            <a
              href={pdfPath}
              download="Les_sous_produits_oleicoles_Guide_ADOIO_Bejaia.pdf"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white hover:bg-[#FAF7F2] text-[#18230F] border border-[#D5C7A3] text-xs sm:text-sm font-bold transition-all"
            >
              <Download className="w-4 h-4 text-[#31491E]" />
              <span>Télécharger (14 pages)</span>
            </a>
          </div>
        </div>

        {/* Synthèse "À RETENIR" du Guide ADOIO (Page 2) */}
        <div className="bg-white rounded-3xl border border-[#D5C7A3] p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-xl bg-[#E8F4D9] text-[#31491E] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#18230F]">
                Objet et portée du document — Les 5 principes fondamentaux à retenir
              </h3>
              <p className="text-xs text-[#567B34]">
                Les applications agricoles (épandage des margines, incorporation des grignons dans les rations) nécessitent toujours une évaluation préalable adaptée au contexte local.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                num: '01',
                title: 'Identification précise',
                desc: 'Identifier précisément chaque sous-produit (procédé par pression ou en continu) avant de choisir son mode de valorisation.',
              },
              {
                num: '02',
                title: 'Vigilance stockage humide',
                desc: 'Éviter le stockage prolongé des matières humides (grignons bruts à 24 % d’eau, pulpe à 60 %) sans précaution : elles se dégradent rapidement.',
              },
              {
                num: '03',
                title: 'Doses encadrées',
                desc: 'Ne pas assimiler une possibilité d’utilisation à une recommandation universelle : les doses et les usages doivent être adaptés et encadrés.',
              },
              {
                num: '04',
                title: 'Solutions maîtrisables',
                desc: 'Privilégier les solutions techniquement maîtrisables, économiquement réalistes et respectueuses des sols, des eaux et de la santé animale.',
              },
              {
                num: '05',
                title: 'Filières territoriales',
                desc: 'Développer des filières organisées associant huileries, agriculteurs, collectivités, chercheurs et porteurs de projets.',
              },
            ].map((item) => (
              <div
                key={item.num}
                className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#E6DEC9] flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-xs font-extrabold text-[#E6AB3C] bg-[#18230F] px-2 py-0.5 rounded-md inline-block mb-2.5">
                    Principe {item.num}
                  </span>
                  <h4 className="font-bold text-sm text-[#18230F] mb-1.5">{item.title}</h4>
                  <p className="text-xs text-[#436229] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation par Onglets des 7 Volets du Guide */}
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-[#D5C7A3]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer flex-1 min-w-[180px] ${
                    isActive
                      ? 'bg-[#31491E] text-white shadow-xs'
                      : 'bg-transparent text-[#18230F] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#E6AB3C]' : 'text-[#567B34]'}`} />
                  <div className="min-w-0">
                    <span className="text-xs font-bold block truncate">{tab.label}</span>
                    <span
                      className={`text-[10px] block truncate ${
                        isActive ? 'text-[#E8F4D9]/90' : 'text-[#567B34]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ================================================================= */}
          {/* ONGLET 1 : IDENTIFIER LES SOUS-PRODUITS (HUILERIE & VERGER) */}
          {/* ================================================================= */}
          {activeTab === 'identification' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* 1.1 Résidus issus de l'huilerie */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 space-y-6">
                <div className="border-b border-[#E6DEC9] pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                    Chapitre 1.1 du Guide Technique ADOIO
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#18230F] mt-1">
                    Les résidus issus de l’huilerie (Pressage & Continu)
                  </h3>
                  <p className="text-xs sm:text-sm text-[#436229] mt-1">
                    La précision du vocabulaire est essentielle : une désignation imprécise peut conduire à comparer des matières différentes ou à appliquer des résultats d’essais qui ne leur correspondent pas.
                  </p>
                </div>

                {/* Les 5 catégories de Grignons */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#18230F] flex items-center gap-2">
                      <Factory className="w-4 h-4 text-[#31491E]" />
                      <span>Typologie précise des Grignons (~35 % de la masse d’olives)</span>
                    </h4>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#E8F4D9] text-[#31491E]">
                      Résidu solide
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9]">
                      <span className="text-xs font-bold text-[#18230F] block">1. Grignon brut</span>
                      <p className="text-xs text-[#436229] mt-1 leading-relaxed">
                        Résidu de la première extraction, contenant environ <strong>24 % d’eau</strong> et <strong>9 % d’huile</strong>. S’altère rapidement lorsqu’il est laissé à l’air libre.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9]">
                      <span className="text-xs font-bold text-[#18230F] block">2. Grignon épuisé</span>
                      <p className="text-xs text-[#436229] mt-1 leading-relaxed">
                        Résidu obtenu après extraction complémentaire de l’huile du grignon, généralement au moyen d’un solvant tel que l’<strong>hexane</strong> (~77 % de la masse du brut).
                      </p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9]">
                      <span className="text-xs font-bold text-[#18230F] block">3. Grignon partiellement dénoyauté</span>
                      <p className="text-xs text-[#436229] mt-1 leading-relaxed">
                        Matière dont une partie des noyaux a été séparée de la pulpe par <strong>tamisage ou ventilation</strong> (ramène la masse à ~44 % du grignon épuisé initial).
                      </p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9]">
                      <span className="text-xs font-bold text-[#18230F] block">4. Grignon gras vs dégraissé</span>
                      <p className="text-xs text-[#436229] mt-1 leading-relaxed">
                        <strong>Grignon gras :</strong> partiellement dénoyauté non extrait par solvant.{' '}
                        <strong>Grignon dégraissé :</strong> dont l’huile résiduelle a été extraite par solvant.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pulpe, Margines et Feuilles de nettoyage */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-4 rounded-2xl bg-[#FEF5DB]/60 border border-[#E6AB3C]/40">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#8C5E0A] block">
                      La Pulpe d’Olive
                    </span>
                    <span className="font-mono text-lg font-extrabold text-[#18230F] block my-1">
                      ~60 % d’eau
                    </span>
                    <p className="text-xs text-[#436229] leading-relaxed">
                      Pâte obtenue lorsque le noyau est séparé de la pulpe avant l’extraction de l’huile. Conservation particulièrement délicate.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#D5C7A3]">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#31491E] block">
                      Les Margines
                    </span>
                    <span className="font-mono text-lg font-extrabold text-[#18230F] block my-1">
                      ~100 L / 100 kg
                    </span>
                    <p className="text-xs text-[#436229] leading-relaxed">
                      Effluents liquides aqueux bruns (sédimentation ou centrifugation). 100 L/100 kg en pression traditionnelle. Fort risque polluant.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#E8F4D9]/60 border border-[#C5DFB0]">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#31491E] block">
                      Feuilles de lavage
                    </span>
                    <span className="font-mono text-lg font-extrabold text-[#18230F] block my-1">
                      ~5 % du poids
                    </span>
                    <p className="text-xs text-[#436229] leading-relaxed">
                      Retirées lors du lavage et nettoyage des olives à l’entrée de l’huilerie (distinctes des feuilles et ramilles de taille).
                    </p>
                  </div>
                </div>
              </div>

              {/* 1.2 Résidus de taille et de récolte (Tableau officiel) */}
              <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 space-y-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                    Chapitre 1.2 — Ressource Fourragère & Biomasse
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#18230F] mt-1">
                    Les résidus de taille et de récolte
                  </h3>
                  <p className="text-xs text-[#436229] mt-1 leading-relaxed">
                    Après séparation des grosses branches, les feuilles et les rameaux de petit diamètre (<strong>moins de 3 cm</strong>) peuvent être envisagés comme ressource fourragère pour les ruminants.
                  </p>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-[#E6DEC9]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#31491E] text-white">
                        <th className="py-2.5 px-3 font-bold">Âge de l’arbre</th>
                        <th className="py-2.5 px-3 font-bold">Type de taille</th>
                        <th className="py-2.5 px-3 font-bold text-right">Bois total (kg/arbre)</th>
                        <th className="py-2.5 px-3 font-bold text-right">Part feuilles & ramilles</th>
                        <th className="py-2.5 px-3 font-bold text-right">Feuilles & ramilles (kg)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E6DEC9]">
                      {PRUNING_TABLE_DATA.map((row, idx) => (
                        <tr
                          key={row.id}
                          className={idx % 2 === 0 ? 'bg-[#FAF7F2]' : 'bg-white'}
                        >
                          <td className="py-2.5 px-3 font-bold text-[#18230F]">{row.age}</td>
                          <td className="py-2.5 px-3 text-[#436229]">{row.type}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-[#18230F]">
                            {row.totalWoodKg !== null ? `${row.totalWoodKg} kg` : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-[#31491E]">
                            {row.leavesSharePct !== null ? `${row.leavesSharePct} %` : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-extrabold text-[#31491E]">
                            {row.fodderLeavesKg !== null ? `${row.fodderLeavesKg} kg` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9] text-xs text-[#436229] space-y-1.5">
                  <div className="font-bold text-[#18230F] flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-[#E6AB3C]" />
                    <span>1.3. Ordres de grandeur et variabilité</span>
                  </div>
                  <p className="leading-relaxed">
                    On retient une estimation moyenne de <strong>35 % de grignons bruts</strong> par rapport à la masse d’olives traitées (production mondiale &gt; 3 millions de tonnes). Le dénoyautage des grignons épuisés ramène leur masse à environ <strong>44 %</strong> de celle du grignon épuisé initial.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* ONGLET 2 : ALIMENTATION ANIMALE (CHAPITRE 2) */}
          {/* ================================================================= */}
          {activeTab === 'alimentation' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                    Chapitre 2 — Valorisation Fourragère en Saison Sèche
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#18230F] mt-1">
                    Valoriser les grignons et résidus végétaux en alimentation animale
                  </h3>
                  <p className="text-xs sm:text-sm text-[#436229] mt-1 leading-relaxed">
                    Dans les régions où les ressources fourragères diminuent fortement en saison sèche, les sous-produits de l’oléiculture représentent une ressource d’appoint précieuse. Toutefois, les grignons ne constituent pas un aliment complet.
                  </p>
                </div>

                {/* 2.1 Atouts et limites nutritionnels */}
                <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9] space-y-3">
                  <h4 className="text-sm font-bold text-[#18230F]">
                    2.1. Profil biochimique & limites nutritionnelles des grignons
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#436229]">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#31491E] mt-1.5 shrink-0" />
                      <span>Teneur élevée en fibres lignocellulosiques (fractions <strong>NDF, ADF</strong> et <strong>lignine</strong>).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#31491E] mt-1.5 shrink-0" />
                      <span>Teneur généralement <strong>faible en matières azotées</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#31491E] mt-1.5 shrink-0" />
                      <span>Digestibilité souvent limitée de la matière sèche et des matières azotées.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#31491E] mt-1.5 shrink-0" />
                      <span>Fermentations ruminales à <strong>dominante acétique</strong> et influence sur la rumination.</span>
                    </li>
                  </ul>
                  <div className="p-3 rounded-xl bg-[#FEF5DB] border border-[#E6AB3C]/50 text-xs text-[#18230F] font-medium">
                    <strong>Règle d’or :</strong> Distribués seuls, les grignons peuvent être mal digérés et entraîner une perte de poids. Ils doivent s’inscrire dans une ration équilibrée (énergie, azote, minéraux et fourrages de qualité).
                  </div>
                </div>

                {/* 2.2 Enseignements des essais rapportés */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-[#18230F]">
                    2.2. Enseignements des essais zootechniques rapportés (Ovins & Bovins)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#E8F4D9]/50 border border-[#C5DFB0]">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#31491E] block mb-1">
                        Seuil optimal observé (Brebis)
                      </span>
                      <div className="font-serif text-2xl font-extrabold text-[#18230F] mb-1">
                        35 % d’incorporation
                      </div>
                      <p className="text-xs text-[#436229] leading-relaxed">
                        Dans un essai sur des brebis gestantes puis allaitantes, une ration contenant <strong>35 % de grignons épuisés</strong> a produit des performances comparables au lot témoin.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#AF4D24] block mb-1">
                        Seuil critique à proscrire
                      </span>
                      <div className="font-serif text-2xl font-extrabold text-[#AF4D24] mb-1">
                        70 % d’incorporation
                      </div>
                      <p className="text-xs text-[#7A2E12] leading-relaxed">
                        À <strong>70 %</strong>, les brebis ont perdu du poids, le poids des agneaux à la naissance a diminué et la mortalité des agneaux a augmenté. Chez les bovins, les taux élevés réduisent aussi le gain de poids.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2.3, 2.4 & 2.5 Recommandations pratiques et priorités */}
              <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 space-y-6">
                <div>
                  <h4 className="font-serif text-xl font-bold text-[#18230F]">
                    2.3 & 2.4. Traitements et Recommandations Pratiques
                  </h4>
                  <p className="text-xs text-[#436229] mt-1">
                    Le <strong>tamisage ou la ventilation</strong> permettent de séparer une partie des noyaux et constituent des solutions pratiques plus accessibles que les traitements alcalins coûteux.
                  </p>
                </div>

                <ul className="space-y-2.5 text-xs text-[#18230F]">
                  {[
                    'Désigner et analyser précisément le sous-produit avant son incorporation dans une ration.',
                    'Éviter de distribuer les grignons comme aliment unique ; les intégrer à une ration équilibrée.',
                    'Réserver leur usage prioritaire aux rations d’entretien ou de sauvegarde lorsque les fourrages sont rares (hors production intensive).',
                    'Prévenir l’altération des matières humides en limitant le stockage à l’air libre.',
                    'Séparer, lorsque cela est possible, les feuilles du bois (< 3 cm) afin d’améliorer la qualité du fourrage.',
                    'Faire valider les rations par un technicien d’élevage ou un spécialiste de l’alimentation animale.',
                  ].map((rec, i) => (
                    <li key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DEC9]">
                      <CheckCircle2 className="w-4 h-4 text-[#31491E] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>

                <div className="p-4 rounded-2xl bg-[#18230F] text-white space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#E6AB3C] block">
                    2.5. Priorités de Recherche Zootechnique
                  </span>
                  <p className="text-xs text-[#E8F4D9]/90 leading-relaxed">
                    Harmoniser les protocoles d’échantillonnage, étudier la digestibilité et la dégradabilité ruminale, tester les complémentations azotées/minérales et caractériser les volumes de taille selon les vergers kabyles.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* ONGLET 3 : COMPOSTAGE ET AMENDEMENTS ORGANIQUES (CHAPITRE 3) */}
          {/* ================================================================= */}
          {activeTab === 'compostage' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                    Chapitre 3 — Restitution de la Matière Organique aux Sols
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#18230F] mt-1">
                    Compostage et amendements organiques
                  </h3>
                  <p className="text-xs sm:text-sm text-[#436229] mt-1 leading-relaxed">
                    Le compostage transforme les sous-produits oléicoles en amendements organiques stables grâce à l’association de matières complémentaires, une humidité maîtrisée, une aération suffisante et un suivi de maturation.
                  </p>
                </div>

                {/* 3.1 Principe général en 3 étapes */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-[#18230F]">
                    3.1. Principe général d’imprégnation et de compostage en andain
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9]">
                      <span className="font-mono text-xs font-extrabold text-[#31491E] block mb-1">
                        Étape 1 • ~24 heures
                      </span>
                      <span className="font-bold text-xs text-[#18230F] block mb-1">
                        Imprégnation carbonée
                      </span>
                      <p className="text-xs text-[#436229] leading-relaxed">
                        Imprégnation du support carboné (grignons, broyat de taille, paille) par les margines pendant environ <strong>24 heures</strong>.
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9]">
                      <span className="font-mono text-xs font-extrabold text-[#31491E] block mb-1">
                        Étape 2 • Mise en andain
                      </span>
                      <span className="font-bold text-xs text-[#18230F] block mb-1">
                        Aire de compostage
                      </span>
                      <p className="text-xs text-[#436229] leading-relaxed">
                        Constitution d’un <strong>andain</strong> structuré sur une aire de compostage dédiée et imperméabilisée.
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9]">
                      <span className="font-mono text-xs font-extrabold text-[#31491E] block mb-1">
                        Étape 3 • Maturation
                      </span>
                      <span className="font-bold text-xs text-[#18230F] block mb-1">
                        Mélange & Égouttage
                      </span>
                      <p className="text-xs text-[#436229] leading-relaxed">
                        Phase de mélange, d’aération, d’égouttage et contrôle analytique de la qualité du compost mûr avant épandage.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#E8F4D9]/60 border border-[#C5DFB0] text-xs text-[#18230F] leading-relaxed">
                  <strong>Création d’activité locale :</strong> Outre la restitution d’humus au sol, la filière compostage génère une activité économique rurale autour de la collecte, du broyage, du mélange, du suivi de maturation et de la distribution des amendements.
                </div>
              </div>

              {/* 3.2 Fourchettes d'apports possibles par hectare */}
              <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 space-y-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                    Chapitre 3.2 — Valeurs Fertilisantes de Référence
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#18230F] mt-1">
                    Fourchettes d’apports possibles par hectare
                  </h3>
                  <p className="text-xs text-[#436229] mt-1">
                    Ces chiffres doivent être considérés comme des données initiales de référence et non comme une dose universelle d’application :
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Matière Organique (MO)', range: '400 à 1 800 kg/ha', sub: 'Restitution humique' },
                    { label: 'Azote total (N)', range: '50 à 200 kg/ha', sub: 'Vigueur végétative' },
                    { label: 'Phosphore (P₂O₅)', range: '65 à 200 kg/ha', sub: 'Enracinement & floraison' },
                    { label: 'Potasse (K₂O)', range: '350 à 1 100 kg/ha', sub: 'Richesse majeure en K' },
                    { label: 'Magnésie (MgO)', range: '15 à 150 kg/ha', sub: 'Photosynthèse foliaire' },
                    { label: 'Calcium (CaO)', range: '15 à 100 kg/ha', sub: 'Structure & pH du sol' },
                  ].map((nut) => (
                    <div key={nut.label} className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9]">
                      <span className="text-[11px] font-bold text-[#567B34] block">{nut.label}</span>
                      <span className="font-mono text-base sm:text-lg font-extrabold text-[#18230F] block my-1">
                        {nut.range}
                      </span>
                      <span className="text-[10px] text-[#436229] block">{nut.sub}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-[#FEF5DB] border border-[#E6AB3C]/50 flex items-start gap-2.5 text-xs text-[#18230F]">
                  <AlertTriangle className="w-4 h-4 text-[#B47A16] shrink-0 mt-0.5" />
                  <span>
                    La qualité agronomique et l’innocuité du compost final doivent systématiquement être vérifiées par analyse avant son utilisation au verger.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* ONGLET 4 : VALORISATION AGRICOLE DES MARGINES (CHAPITRE 4) */}
          {/* ================================================================= */}
          {activeTab === 'margines' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                    Chapitre 4 — Gestion Contrôlée des Effluents Hydriques
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#18230F] mt-1">
                    Valorisation agricole des margines : intérêts, limites et précautions
                  </h3>
                  <p className="text-xs sm:text-sm text-[#436229] mt-1 leading-relaxed">
                    Les margines contiennent de l’eau et des éléments minéraux (forte richesse en potassium), mais leur épandage non maîtrisé présente des risques sévères pour les sols, les cultures et les ressources en eau.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#E8F4D9]/50 border border-[#C5DFB0] space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#31491E] block">
                      4.1. Intérêt agronomique potentiel
                    </span>
                    <p className="text-xs text-[#18230F] leading-relaxed">
                      <strong>Richesse élevée en potassium (K)</strong> et apport hydrique et minéral valorisable en plan d’épandage contrôlé ou en imprégnation de compost.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#AF4D24] block">
                      4.1. Limites & Risque Phytotoxique
                    </span>
                    <p className="text-xs text-[#7A2E12] leading-relaxed">
                      Teneurs faibles/variables en N, P, Mg ; <strong>acidité et salinité élevées</strong> ; risque phytotoxique du <strong>chlorure de sodium (NaCl)</strong> et contamination des nappes en cas de rejet direct.
                    </p>
                  </div>
                </div>

                {/* 4.2 Précautions avant épandage */}
                <div className="space-y-2.5">
                  <h4 className="text-sm font-bold text-[#18230F]">
                    4.2. Les 6 précautions obligatoires avant tout épandage
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {[
                      'Analyser les margines et le sol avant de déterminer la dose et la fréquence d’application.',
                      'Tenir compte de la culture, du type de sol, de la pente, de la profondeur des eaux souterraines et de la proximité des cours d’eau.',
                      'Éviter les épandages avant ou pendant de fortes pluies, en période de gel, ou sur terrains favorisant le ruissellement.',
                      'Éviter le contact direct avec les cultures sensibles et respecter les stades de végétation.',
                      'Procéder par apports fractionnés et prévenir toute accumulation excessive de sels (NaCl).',
                      'Tenir un registre des apports et calculer la fertilisation en complément des apports déjà réalisés.',
                    ].map((prec, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DEC9] flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#31491E] shrink-0 mt-0.5" />
                        <span className="text-[#436229] leading-relaxed">{prec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Plafonds documentaires & Modes de valorisation */}
              <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 space-y-5">
                <h4 className="font-serif text-xl font-bold text-[#18230F]">
                  Plafonds documentaires & Modes de valorisation (4.2 à 4.4)
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#D5C7A3] text-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#567B34] block">
                      Systèmes Continus
                    </span>
                    <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#18230F] block my-1">
                      100 m³/ha/an
                    </span>
                    <span className="text-[10px] text-[#436229] block">Plafond documentaire cité</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#D5C7A3] text-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#567B34] block">
                      Systèmes Classiques
                    </span>
                    <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#18230F] block my-1">
                      30 m³/ha/an
                    </span>
                    <span className="text-[10px] text-[#436229] block">Pressage traditionnel</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9] space-y-2.5 text-xs">
                  <span className="font-bold text-[#18230F] block">4.3. Trois modes de valorisation encadrée :</span>
                  <p className="text-[#436229] leading-relaxed">
                    <strong>1. Épandage agricole contrôlé :</strong> directement ou après une phase de stockage adaptée.
                  </p>
                  <p className="text-[#436229] leading-relaxed">
                    <strong>2. Incorporation au compost :</strong> sur un support carboné (24h d’imprégnation), puis utilisation du compost mûr.
                  </p>
                  <p className="text-[#436229] leading-relaxed">
                    <strong>3. Plan d’épandage territorial :</strong> tenant compte des volumes produits par l’huilerie, de la durée de campagne, du mode de trituration et de la pluviométrie.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FEF5DB] border border-[#E6AB3C]/50 text-[11px] text-[#18230F] leading-relaxed">
                  <strong>Note réglementaire :</strong> Les plafonds de 100 m³/ha/an et 30 m³/ha/an sont reproduits à titre documentaire uniquement ; ils doivent être vérifiés avant toute application au regard du cadre réglementaire en vigueur et des analyses de sol.
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* ONGLET 5 : BIOMASSE ET ÉNERGIE (CHAPITRE 5) */}
          {/* ================================================================= */}
          {activeTab === 'biomasse' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                    Chapitre 5 — Transition Énergétique des Huileries & Bassins Oléicoles
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#18230F] mt-1">
                    Utilisation des sous-produits dans la biomasse
                  </h3>
                  <p className="text-xs sm:text-sm text-[#436229] mt-1 leading-relaxed">
                    Les résidus végétaux de l’oléiculture (coques de grignons dénoyautés, grignons épuisés secs, bois de taille) peuvent produire de la <strong>chaleur</strong>, de l’<strong>électricité</strong> ou, selon les technologies disponibles, des <strong>biocarburants</strong>.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9] space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#31491E]">
                      5.1. Atouts potentiels pour les zones rurales
                    </h4>
                    <ul className="space-y-1.5 text-xs text-[#436229]">
                      <li>• Valorisation de résidus agricoles autrement peu utilisés.</li>
                      <li>• Création d’emplois liés à la collecte, au conditionnement et à la transformation.</li>
                      <li>• Diversification énergétique et activité économique rurale.</li>
                      <li>• Réduction potentielle des dépôts sauvages de résidus.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9] space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#AF4D24]">
                      5.2. Limites technico-économiques à évaluer
                    </h4>
                    <ul className="space-y-1.5 text-xs text-[#436229]">
                      <li>• Investissements initiaux et logistique de collecte/transport.</li>
                      <li>• Régularité saisonnière des gisements et maîtrise du taux d’humidité.</li>
                      <li>• Bilan environnemental réel : transport, émissions de combustion et gestion des cendres.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 space-y-4">
                <h4 className="font-serif text-xl font-bold text-[#18230F]">
                  5.3. Pistes de développement progressif
                </h4>
                <div className="space-y-3 text-xs">
                  {[
                    {
                      step: 'Étape 1',
                      title: 'Inventaire des gisements disponibles',
                      desc: 'Cartographier et caractériser les tonnages de grignons, coques et bois de taille par bassin oléicole.',
                    },
                    {
                      step: 'Étape 2',
                      title: 'Étude technico-économique locale',
                      desc: 'Évaluer les solutions adaptées à l’échelle des huileries, des coopératives ou des bassins de la Soummam.',
                    },
                    {
                      step: 'Étape 3',
                      title: 'Projets pilotes avant généralisation',
                      desc: 'Démontrer la viabilité économique, énergétique et environnementale sur des unités pilotes avant déploiement.',
                    },
                  ].map((s) => (
                    <div key={s.step} className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#E6AB3C] bg-[#18230F] px-2 py-0.5 rounded-md">
                        {s.step}
                      </span>
                      <h5 className="font-bold text-sm text-[#18230F] mt-1.5">{s.title}</h5>
                      <p className="text-[#436229] mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* ONGLET 6 : COSMÉTIQUES, ARTISANAT & TOURISME OLÉICOLE (CHAP. 6 & 7) */}
          {/* ================================================================= */}
          {activeTab === 'cosmetiques' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Chapitre 6 : Cosmétiques et usages complémentaires */}
              <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 space-y-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                    Chapitre 6 — Diversification & Entrepreneuriat Féminin Rural
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#18230F] mt-1">
                    Produits cosmétiques et usages complémentaires
                  </h3>
                  <p className="text-xs sm:text-sm text-[#436229] mt-1 leading-relaxed">
                    Développement de produits cosmétiques et artisanaux à base d’huile d’olive ou de feuilles/coques d’olivier : <strong>savons traditionnels, huiles à usage externe, eaux de toilette et parfums naturels</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#E8F4D9]/50 border border-[#C5DFB0] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#31491E]">
                    <Users className="w-4 h-4" />
                    <span>6.1. Opportunités économiques en milieu rural</span>
                  </div>
                  <p className="text-xs text-[#18230F] leading-relaxed">
                    Ces activités à forte valeur patrimoniale méditerranéenne permettent de diversifier les revenus des exploitations et offrent des débouchés directs aux <strong>petites entreprises et aux initiatives portées par des femmes en milieu rural</strong>.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#18230F]">
                    6.2. Conditions de réussite & conformité
                  </h4>
                  <ul className="space-y-2 text-xs text-[#436229]">
                    <li className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DEC9]">
                      • Respecter strictement les exigences applicables à la <strong>sécurité, la formulation, l’étiquetage</strong> et la mise sur le marché.
                    </li>
                    <li className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DEC9]">
                      • Renforcer les compétences en formulation, contrôle qualité, conditionnement et commercialisation.
                    </li>
                    <li className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DEC9]">
                      • <strong>Éthique commerciale :</strong> Éviter de présenter comme démontrée une allégation de santé ou d’efficacité qui ne serait pas scientifiquement étayée.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Chapitre 7 : Foires, Musées et Tourisme Oléicole */}
              <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 space-y-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                    Chapitre 7 — Patrimoine Culturel & Oléotourisme en Kabylie
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#18230F] mt-1">
                    Foires, musées et routes touristiques de l’olivier
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9]">
                    <span className="text-xs font-bold text-[#18230F] block mb-1">7.1. Foires & Salons</span>
                    <p className="text-xs text-[#436229] leading-relaxed">
                      Rapprochent producteurs, transformateurs, chercheurs et acheteurs pour diffuser les innovations et créer des débouchés commerciaux.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9]">
                    <span className="text-xs font-bold text-[#18230F] block mb-1">7.2. Musées de l’Olivier</span>
                    <p className="text-xs text-[#436229] leading-relaxed">
                      Anciennes huileries et espaces d’interprétation (publics, privés ou intégrés au moulin) transmettant la mémoire oléicole kabyle.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9]">
                    <span className="text-xs font-bold text-[#18230F] block mb-1">7.3. Circuits & Routes</span>
                    <p className="text-xs text-[#436229] leading-relaxed">
                      Associent visites de vergers centenaires, huileries, dégustation, restauration terroir, artisanat et vente directe.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#D5C7A3] space-y-2 text-xs">
                  <span className="font-bold text-[#18230F] block">
                    7.4. Conditions de développement de l’oléotourisme :
                  </span>
                  <p className="text-[#436229] leading-relaxed">
                    Construire des offres coordonnées (producteurs, huileries, restaurateurs, artisans, collectivités), former les acteurs à la médiation culturelle et à la dégustation, mettre en place des outils de réservation accessibles et préserver l’authenticité des sites.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* ONGLET 7 : AXES D'ACTION ALGÉRIE (CHAP. 8) & ANNEXE TECHNIQUE */}
          {/* ================================================================= */}
          {activeTab === 'axes' && (
            <div className="space-y-8">
              {/* 8.1 Tableau des 7 axes d'action proposés */}
              <div className="bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 space-y-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                    Chapitre 8 & 8.1 — Enjeux pour la Filière Oléicole Algérienne
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#18230F] mt-1">
                    Les 7 axes d’action prioritaires pour structurer la filière
                  </h3>
                  <p className="text-xs sm:text-sm text-[#436229] mt-1">
                    La réussite dépendra moins de la multiplication de solutions isolées que de la capacité à organiser des filières coordonnées adaptées aux territoires :
                  </p>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-[#E6DEC9]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#18230F] text-white">
                        <th className="py-3 px-4 font-bold">Axe stratégique</th>
                        <th className="py-3 px-4 font-bold">Actions prioritaires</th>
                        <th className="py-3 px-4 font-bold">Acteurs à mobiliser</th>
                        <th className="py-3 px-4 font-bold">Indicateurs de suivi possibles</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E6DEC9]">
                      {ACTION_AXES_DATA.map((row, idx) => (
                        <tr key={row.axe} className={idx % 2 === 0 ? 'bg-[#FAF7F2]' : 'bg-white'}>
                          <td className="py-3 px-4 font-bold text-[#31491E]">{row.axe}</td>
                          <td className="py-3 px-4 text-[#18230F]">{row.actions}</td>
                          <td className="py-3 px-4 text-[#436229]">{row.acteurs}</td>
                          <td className="py-3 px-4 font-medium text-[#567B34]">{row.indicateurs}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Annexe — Données techniques quantitatives */}
              <div className="bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 space-y-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                    Annexe Officielle (Page 14 du Guide ADOIO)
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#18230F] mt-1">
                    Annexe — Données techniques et valeurs quantitatives de référence
                  </h3>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-[#E6DEC9]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#31491E] text-white">
                        <th className="py-3 px-4 font-bold">Matière / Paramètre</th>
                        <th className="py-3 px-4 font-bold">Valeurs estimées</th>
                        <th className="py-3 px-4 font-bold">Précaution d’interprétation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E6DEC9]">
                      {ANNEX_TECHNICAL_DATA.map((item, idx) => (
                        <tr key={item.matiere} className={idx % 2 === 0 ? 'bg-[#FAF7F2]' : 'bg-white'}>
                          <td className="py-3 px-4 font-bold text-[#18230F]">{item.matiere}</td>
                          <td className="py-3 px-4 font-mono font-bold text-[#31491E]">{item.valeur}</td>
                          <td className="py-3 px-4 text-[#436229]">{item.precaution}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* SIMULATEUR INTERACTIF DE GISEMENT DE SOUS-PRODUITS (ANNEXE ADOIO) */}
        {/* ================================================================= */}
        <div className="bg-gradient-to-br from-[#18230F] via-[#223315] to-[#31491E] rounded-3xl p-6 sm:p-8 text-white shadow-sm border border-[#436229]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/15">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E6AB3C] mb-1">
                <Scale className="w-4 h-4" />
                <span>Calculateur Circulaire ADOIO (Basé sur l’Annexe & le Chapitre 1.2)</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                Estimez vos gisements de sous-produits (Huilerie & Taille du Verger)
              </h3>
            </div>
            <span className="text-xs text-[#E8F4D9]/80 max-w-sm">
              Ordres de grandeur documentaires issus du guide ADOIO Béjaïa pour pré-dimensionner vos filières de compostage, fourrage ou biomasse.
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-start">
            {/* Paramètres d'entrée */}
            <div className="lg:col-span-5 space-y-5 bg-white/10 backdrop-blur-xs p-5 rounded-2xl border border-white/15">
              {/* Tonnage d'olives triturées */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#FAF7F2]">Masse d’olives traitées à l’huilerie :</span>
                  <span className="font-mono font-extrabold text-[#E6AB3C]">
                    {olivesTons} tonnes ({olivesKg.toLocaleString('fr-FR')} kg)
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="200"
                  step="1"
                  value={olivesTons}
                  onChange={(e) => setOlivesTons(Number(e.target.value))}
                  className="w-full accent-[#E6AB3C] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#E8F4D9]/75">
                  <span>1 t (10 qx)</span>
                  <span>50 t (500 qx)</span>
                  <span>200 t (Huilerie)</span>
                </div>
              </div>

              {/* Système d'extraction */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#FAF7F2] block">Procédé d’extraction :</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setExtractionSystem('pression')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      extractionSystem === 'pression'
                        ? 'bg-[#E6AB3C] text-[#18230F] border-[#E6AB3C]'
                        : 'bg-white/5 text-white border-white/20 hover:bg-white/10'
                    }`}
                  >
                    Système Pression (Classique)
                  </button>
                  <button
                    type="button"
                    onClick={() => setExtractionSystem('continu')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      extractionSystem === 'continu'
                        ? 'bg-[#E6AB3C] text-[#18230F] border-[#E6AB3C]'
                        : 'bg-white/5 text-white border-white/20 hover:bg-white/10'
                    }`}
                  >
                    Système Continu
                  </button>
                </div>
              </div>

              {/* Taille du verger */}
              <div className="pt-3 border-t border-white/15 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#FAF7F2]">Nombre d’oliviers taillés au verger :</span>
                  <span className="font-mono font-extrabold text-[#E6AB3C]">{pruningTreeCount} arbres</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={pruningTreeCount}
                  onChange={(e) => setPruningTreeCount(Number(e.target.value))}
                  className="w-full accent-[#E6AB3C] cursor-pointer"
                />

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#FAF7F2] block">
                    Profil d’âge et intensité de taille (Tableau 1.2) :
                  </label>
                  <select
                    value={selectedPruningProfileId}
                    onChange={(e) => setSelectedPruningProfileId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#18230F] border border-white/25 text-xs font-bold text-white focus:outline-none focus:border-[#E6AB3C]"
                  >
                    <option value="jeune-severe">Olivier Jeune — Taille Sévère (30 kg bois dont 18 kg feuilles/ramilles)</option>
                    <option value="adulte-legere">Olivier Adulte — Taille Légère (50 kg bois dont 25 kg feuilles/ramilles)</option>
                    <option value="adulte-severe">Olivier Adulte — Taille Sévère (100 kg bois dont 30 kg feuilles/ramilles)</option>
                    <option value="vieux-severe">Olivier Vieux — Taille Sévère (100 kg bois dont 12 kg feuilles/ramilles)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Résultats quantitatifs */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Carte 1 : Grignons */}
              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/15 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E6AB3C] block">
                  1. Gisements de Grignons (~35 %)
                </span>
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
                  {rawPomaceKg.toLocaleString('fr-FR')} kg <span className="text-xs font-normal text-[#E8F4D9]">de grignon brut</span>
                </div>
                <p className="text-xs text-[#E8F4D9]/85 leading-relaxed">
                  Contient ~<strong>{rawPomaceWaterKg.toLocaleString('fr-FR')} kg d’eau</strong> (24 %) et ~<strong>{rawPomaceResidualOilKg.toLocaleString('fr-FR')} kg d’huile résiduelle</strong> (9 %).
                </p>
                <div className="pt-2 border-t border-white/10 flex justify-between text-xs text-[#E8F4D9]">
                  <span>Grignon épuisé (77 %) : <strong>{exhaustedPomaceKg.toLocaleString('fr-FR')} kg</strong></span>
                  <span>Dénoyauté (44 %) : <strong>{pittedPomaceKg.toLocaleString('fr-FR')} kg</strong></span>
                </div>
              </div>

              {/* Carte 2 : Margines */}
              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/15 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E6AB3C] block">
                  2. Effluents Margines & Plan d’Épandage
                </span>
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
                  {marginesM3.toLocaleString('fr-FR')} m³ <span className="text-xs font-normal text-[#E8F4D9]">({marginesLiters.toLocaleString('fr-FR')} L)</span>
                </div>
                <p className="text-xs text-[#E8F4D9]/85 leading-relaxed">
                  Plafond documentaire ({extractionSystem === 'pression' ? '30 m³/ha/an en classique' : '100 m³/ha/an en continu'}) : nécessite au minimum <strong>{minSpreadingAreaHa} ha</strong> pour un épandage contrôlé ou une imprégnation sur support carboné (24h).
                </p>
              </div>

              {/* Carte 3 : Feuilles de nettoyage huilerie */}
              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/15 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E6AB3C] block">
                  3. Feuilles de Nettoyage (Entrée Huilerie ~5 %)
                </span>
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
                  {millLeavesKg.toLocaleString('fr-FR')} kg <span className="text-xs font-normal text-[#E8F4D9]">de feuilles fraîches</span>
                </div>
                <p className="text-xs text-[#E8F4D9]/85 leading-relaxed">
                  Retirées lors du lavage des olives à la réception. Valorisables en co-compostage ou en appoint fourrager après tri.
                </p>
              </div>

              {/* Carte 4 : Résidus de taille du verger */}
              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/15 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E6AB3C] block">
                  4. Résidus de Taille ({pruningTreeCount} arbres)
                </span>
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
                  {totalPruningWoodKg.toLocaleString('fr-FR')} kg <span className="text-xs font-normal text-[#E8F4D9]">de bois total</span>
                </div>
                <p className="text-xs text-[#E8F4D9]/85 leading-relaxed">
                  Dont <strong>{totalFodderLeavesKg.toLocaleString('fr-FR')} kg de feuilles et ramilles (&lt; 3 cm)</strong> utilisables comme fourrage pour ruminants, et <strong>{totalLargeBranchesKg.toLocaleString('fr-FR')} kg</strong> de bois/branches (&gt; 3 cm) pour la biomasse ou le broyat carboné.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
