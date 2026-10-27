import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  Scissors, 
  Leaf, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  MessageCircle, 
  ArrowRight,
  Droplets,
  Layers
} from 'lucide-react';
import { ArticleAudioReader } from './ArticleAudioReader';

export interface FaqItem {
  id: string;
  category: 'taille' | 'bio' | 'recolte';
  categoryLabel: string;
  question: string;
  shortAnswer: string;
  detailedAnswer: string[];
  tips: string[];
  adoioRecommendation: string;
  tags: string[];
}

export const FAQ_DATA: FaqItem[] = [
  // --- TAILLE DE L'OLIVIER ---
  {
    id: 'faq-taille-periode',
    category: 'taille',
    categoryLabel: 'Taille & Conduite',
    question: "Quelle est la période idéale pour tailler les oliviers dans la wilaya de Béjaïa ?",
    shortAnswer: "La taille s'effectue impérativement entre la fin de la récolte (fin janvier/février) et le début du débourrement printanier (fin mars), en dehors des périodes de gelées.",
    detailedAnswer: [
      "Dans les bassins de la vallée de la Soummam (Akbou, Seddouk, Tazmalt) et sur les versants maritimes (Aokas, Tichy), la taille doit débuter dès que les arbres sont libérés de leur charge fruitière.",
      "Il convient de surveiller la météo pour éviter les jours de pluie ou de forte humidité, car les plaies de coupe fraîches constituent des portes d'entrée privilégiées pour la bactérie de la tuberculose de l'olivier (Pseudomonas savastanoi).",
      "Dans les zones d'altitude (Darguina, Chemini, Ighram), attendez la fin des risques de fortes gelées tardives (courant mars) avant d'entamer les coupes importantes."
    ],
    tips: [
      "Désinfectez systématiquement les outils (sécateurs, scies) à l'alcool à 70° ou à l'eau de javel diluée entre chaque arbre.",
      "Appliquez un mastic cicatrisant ou un badigeon cuprique sur les coupes de plus de 4 cm de diamètre."
    ],
    adoioRecommendation: "Ne jamais tailler en pleine floraison (mai). Une taille bien dosée en fin d'hiver régularise la mise à fruit et atténue fortement l'alternance biennale kabyle.",
    tags: ['Taille', 'Période', 'Calendrier', 'Soummam', 'Outils']
  },
  {
    id: 'faq-taille-alternance',
    category: 'taille',
    categoryLabel: 'Taille & Conduite',
    question: "Comment atténuer l'alternance biennale (années avec/sans récolte) grâce à la taille ?",
    shortAnswer: "En pratiquant une taille raisonnée différenciée : allégez modérément l'arbre avant une année à forte floraison prévisible, et taillez très légèrement avant une année de faible charge.",
    detailedAnswer: [
      "L'alternance biennale est particulièrement marquée sur la variété Chemlal, majoritaire à Béjaïa. Si l'olivier produit une récolte record, il épuise ses réserves glucidiques et n'initie que très peu de boutons floraux pour la saison suivante.",
      "Avant une année 'On' (forte charge) : réalisez un éclaircissage du houppier pour supprimer les rameaux surnuméraires et aérer le centre de l'arbre. Cela limite la surcharge et préserve du bois de pousse pour l'année suivante.",
      "Avant une année 'Off' (faible charge) : limitez-vous à une taille sanitaire légère (bois mort, gourmands verticaux stériles) pour conserver un maximum de surface foliaire et de bourgeons à fleurs."
    ],
    tips: [
      "Supprimez en priorité les 'gourmands' vigoureux qui poussent droit au centre de la couronne.",
      "Favorisez les rameaux retombants de 1 à 2 ans, qui sont les plus productifs en olives."
    ],
    adoioRecommendation: "Associez la taille à une restitution minérale et organique au printemps pour aider l'olivier à reconstituer ses réserves après une grosse récolte.",
    tags: ['Alternance', 'Chemlal', 'Rendement', 'Gourmands']
  },
  {
    id: 'faq-taille-regeneration',
    category: 'taille',
    categoryLabel: 'Taille & Conduite',
    question: "Comment régénérer un vieil olivier centenaire non entretenu ou dégradé par les incendies ?",
    shortAnswer: "Par une taille de recépage ou de rajeunissement progressif sur 2 à 3 saisons, en sélectionnant les meilleurs rejets issus de la souche ou de la charpente.",
    detailedAnswer: [
      "Le patrimoine de Béjaïa compte des centaines de milliers d'arbres multiséculaires. Pour un arbre délaissé très haut, rabattez les branches charpentières principales par tiers sur 3 ans pour stimuler l'émission de nouveaux rameaux vigoureux plus près du sol.",
      "Après un incendie : si la charpente est calcinée mais que le système racinaire est vivant, procédez au recépage au ras du sol ou à 20 cm au-dessus du point de greffe. Sélectionnez ensuite les 3 à 4 rejets les plus vigoureux et équilibrés pour reformer le tronc.",
      "Protégez le bois exposé aux coups de soleil estivaux en le blanchissant à la chaux agricole additionnée de cuivre."
    ],
    tips: [
      "Ne rabattez jamais l'intégralité d'un grand arbre d'un seul coup s'il n'a pas brûlé, pour ne pas provoquer un choc racinaire fatal.",
      "Apportez un paillage organique épais au pied pour maintenir la fraîcheur du sol."
    ],
    adoioRecommendation: "L'équipe technique de l'ADOIO propose des sessions de formation pratique au recépage et au greffage des oléastres (Zeboudj) pour les adhérents.",
    tags: ['Oliviers centenaires', 'Rajeunissement', 'Incendies', 'Recépage']
  },

  // --- TRAITEMENT BIO & SANTÉ DU VERGER ---
  {
    id: 'faq-bio-mouche',
    category: 'bio',
    categoryLabel: 'Traitements Bio & Protection',
    question: "Comment lutter efficacement et biologiquement contre la Mouche de l'Olive (Bactrocera oleae) ?",
    shortAnswer: "Par la combinaison du piégeage de masse (pièges à phéromones / alimentaires) et l'application préventive d'argile kaolin blanche sur le feuillage dès juillet-août.",
    detailedAnswer: [
      "La mouche de l'olive est le principal ravageur destructeur de la qualité de l'huile en Kabylie. La piqûre de ponte perfore l'épiderme, favorisant l'oxydation précoce de la pulpe et l'explosion de l'acidité libre.",
      "Argile blanche (Kaolin calciné) : pulvérisée à 3-5 kg / 100 L d'eau dès le durcissement du noyau (juillet/début août). Elle crée une barrière visuelle et tactile minérale qui désoriente la femelle et l'empêche de pondre, sans aucun résidu chimique.",
      "Piégeage de masse : installez des bouteilles pièges (ou pièges Olipe / Dacus Trap) garnis d'une solution de phosphate diammonique à 4% ou d'un attractif alimentaire protéique, à raison de 1 piège pour 1 à 2 arbres sur la bordure sud et ouest du verger."
    ],
    tips: [
      "Surveillez les vols grâce à 2 ou 3 pièges de monitoring par hectare dès début juin.",
      "Renouvelez la pulvérisation de kaolin après un gros orage d'été (> 25 mm).",
      "Une récolte précoce à véraison (octobre-novembre) évite les dernières générations automnales de mouches."
    ],
    adoioRecommendation: "Le traitement bio au kaolin permet de préserver un indice de peroxyde très bas et de garantir le classement en Vierge Extra sans polluer les nappes de la Soummam.",
    tags: ['Mouche', 'Kaolin', 'Bio', 'Piégeage', 'Vierge Extra']
  },
  {
    id: 'faq-bio-oeil-paon',
    category: 'bio',
    categoryLabel: 'Traitements Bio & Protection',
    question: "Comment traiter la maladie de l'œil de paon (Cycloconium / Spilocaea) sans fongicide chimique ?",
    shortAnswer: "Grâce à une aération soignée de l'arbre par la taille et un traitement préventif au cuivre (bouillie bordelaise ou hydroxyde de cuivre) à dose modérée à l'automne et au début du printemps.",
    detailedAnswer: [
      "L'œil de paon se manifeste par des taches circulaires brunes avec des halos jaunâtres sur la face supérieure des feuilles, provoquant une chute prématurée massive du feuillage et affaiblissant considérablement l'arbre.",
      "Les brouillards et la forte humidité stagnante de la vallée de la Soummam créent un environnement propice au champignon.",
      "Traitement préconisé en agriculture biologique : 1 passage à la bouillie bordelaise (1 à 1,5 kg / 100 L d'eau) immédiatement après la fin de la récolte en hiver, et 1 passage au printemps juste avant la floraison.",
      "La taille d'aération est le remède n°1 : en permettant au soleil et au vent de traverser le houppier, les feuilles sèchent rapidement après la rosée matinale, stoppant la germination des spores."
    ],
    tips: [
      "Ramassez ou broyez les feuilles malades tombées au sol lors des labours légers d'hiver.",
      "Respectez scrupuleusement les plafonds de cuivre métal homologués en agriculture biologique (maximum 4 kg Cu/ha/an)."
    ],
    adoioRecommendation: "Préférez les formulations d'hydroxyde de cuivre ou de sulfate de cuivre neutralisé, plus couvrantes et moins lessivables par les averses hivernales.",
    tags: ['Œil de paon', 'Cuivre', 'Bouillie bordelaise', 'Fongicide bio']
  },
  {
    id: 'faq-bio-fumure',
    category: 'bio',
    categoryLabel: 'Traitements Bio & Protection',
    question: "Quelle fertilisation naturelle privilégier pour nourrir le verger tout en stockant du carbone ?",
    shortAnswer: "L'apport de compost de grignons d'olives issu des huileries locales combiné à du fumier de ferme bien mûr et un enherbement temporaire de légumineuses d'hiver.",
    detailedAnswer: [
      "Les sols oléicoles de montagne à Béjaïa sont souvent pauvres en matière organique (< 1,5%). L'apport d'engrais chimiques minéraux solubles entraîne un lessivage rapide vers l'oued Soummam et l'acidification des sols.",
      "La solution d'économie circulaire valorisée par l'ADOIO consiste à composter les grignons d'olive (résidus solides après pressage) mélangés à du fumier ovin ou bovin de Kabylie pendant 6 à 9 mois.",
      "Cet amendement organique améliore la capacité de rétention d'eau du sol de 30% lors des sécheresses estivales et séquestre durablement le carbone dans l'humus."
    ],
    tips: [
      "Épandez le compost à l'aplomb de la frondaison (là où se trouvent les radicelles absorbantes) en novembre-décembre.",
      "Évitez d'enfouir la fumure trop profondément : un simple griffage superficiel à 10 cm suffit."
    ],
    adoioRecommendation: "L'ADOIO encourage les huileries partenaires à mettre leurs grignons compostés à disposition des producteurs locaux pour boucler le cycle agronomique.",
    tags: ['Fertilisation', 'Compost', 'Grignons', 'Carbone', 'Sol']
  },

  // --- RÉCOLTE, RENDEMENT & QUALITÉ DE L'HUILE ---
  {
    id: 'faq-recolte-veraison',
    category: 'recolte',
    categoryLabel: 'Récolte & Rendement',
    question: "Quel est le moment optimal pour cueillir les olives afin d'obtenir une huile Vierge Extra ?",
    shortAnswer: "À la véraison, lorsque 50% à 70% des olives virent du vert au violet/noir violacé, généralement entre la mi-novembre et la fin décembre à Béjaïa.",
    detailedAnswer: [
      "C'est à ce stade précis que s'opère l'équilibre parfait : la teneur en polyphénols (antioxydants naturels protecteurs) et le fruité aromatique sont à leur maximum, tandis que l'acidité libre reste minimale (< 0,3% à 0,5%).",
      "Si vous récoltez trop tôt (olives entièrement vertes dures) : le rendement en huile sera plus faible (13-15 L / quintal) et l'huile sera très amère et piquante.",
      "Si vous récoltez trop tard (olives noires surmûres tombées au sol en janvier-février) : le rendement volumique en litres paraît supérieur, mais la qualité chute drastiquement (oxydation, acidité dépassant 1,5%, perte des arômes fruités)."
    ],
    tips: [
      "Surveillez l'indice de maturité en coupant quelques fruits : la pulpe doit commencer à se pigmenter sans être ramollie.",
      "La variété Chemlal mûrit plus tardivement que l'Azeradj ou la Bouchouk."
    ],
    adoioRecommendation: "Règle d'or ADOIO : Récoltez sur l'arbre à véraison. Une huile Vierge Extra précoce se vend 30% à 50% plus cher sur le marché qu'une huile tardive oxydée.",
    tags: ['Récolte', 'Véraison', 'Maturité', 'Qualité', 'Polyphénols']
  },
  {
    id: 'faq-recolte-gaulage-filets',
    category: 'recolte',
    categoryLabel: 'Récolte & Rendement',
    question: "Pourquoi faut-il impérativement abandonner le gaulage traditionnel au bâton au profit des filets et peignes ?",
    shortAnswer: "Le gaulage brutal brise les jeunes pousses porteuses de la récolte de l'année suivante et blesse les olives, provoquant pourriture et montée d'acidité.",
    detailedAnswer: [
      "Le bâton de gaulage traditionnel arrache les bourgeons et casse les rameaux terminaux qui auraient dû porter les olives de la saison suivante, aggravant dramatiquement le phénomène d'alternance.",
      "De plus, les blessures sur l'écorce ouvrent la voie à la tuberculose et aux champignons pathogènes.",
      "L'usage des filets posés au sol sous l'arbre empêche les olives d'entrer en contact avec la terre humide, la boue et les bactéries.",
      "L'emploi de peignes manuels ou de vibreurs électroportatifs sur batterie permet de décrocher les fruits sans abîmer ni les feuilles ni les futures pousses."
    ],
    tips: [
      "Étendez les filets avant de commencer pour recueillir 100% de la récolte propre.",
      "Ne mélangez jamais les olives saines cueillies sur l'arbre avec les olives tombées naturellement au sol depuis des semaines."
    ],
    adoioRecommendation: "L'ADOIO organise des campagnes de sensibilisation pour équiper les coopératives familiales en filets de récolte et peignes oscillants modernes.",
    tags: ['Gaulage', 'Filets', 'Peignes vibreurs', 'Préservation']
  },
  {
    id: 'faq-recolte-delai-moulin',
    category: 'recolte',
    categoryLabel: 'Récolte & Rendement',
    question: "Combien de temps peut-on attendre entre la cueillette et le pressage au moulin ?",
    shortAnswer: "Maximum 24 à 48 heures. Chaque jour supplémentaire de stockage dégrade irrémédiablement l'huile par échauffement et fermentation.",
    detailedAnswer: [
      "L'olive est un fruit vivant qui continue de respirer après la cueillette. Dès le détachement de la branche, les enzymes lipolytiques commencent à dégrader les triglycérides en acides gras libres.",
      "Pire encore : l'utilisation de sacs en plastique fermés provoque un effet d'étuve où la température interne dépasse 40°C, entraînant le défaut organoleptique irréversible de 'chômé' ou de 'moisi'.",
      "Le stockage doit impérativement se faire dans des caisses en plastique ajourées et empilables (type caisses à vendange), dans un local frais, ventilé et à l'abri du soleil."
    ],
    tips: [
      "Réservez votre créneau à l'huilerie avant même de démarrer les grands chantiers de ramassage.",
      "Préférez les huileries à chaîne continue moderne équipées de malaxeurs thermorégulés sous vide (< 27°C)."
    ],
    adoioRecommendation: "Consultez notre annuaire des 448 huileries et la carte interactive pour identifier le moulin à chaîne continue le plus proche et calculer votre itinéraire direct.",
    tags: ['Délai pressage', 'Stockage', 'Caisses ajourées', 'Acidité', 'Moulins']
  }
];

interface FaqOleicultureProps {
  onOpenAdhesion?: () => void;
  onOpenSimulator?: () => void;
}

export const FaqOleiculture: React.FC<FaqOleicultureProps> = ({
  onOpenAdhesion,
  onOpenSimulator
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'taille' | 'bio' | 'recolte'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'faq-taille-periode': true,
    'faq-bio-mouche': true,
    'faq-recolte-veraison': true
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const allOpen: Record<string, boolean> = {};
    FAQ_DATA.forEach(item => { allOpen[item.id] = true; });
    setOpenItems(allOpen);
  };

  const collapseAll = () => {
    setOpenItems({});
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        item.question.toLowerCase().includes(q) ||
        item.shortAnswer.toLowerCase().includes(q) ||
        item.detailedAnswer.some(d => d.toLowerCase().includes(q)) ||
        item.tags.some(t => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="faq-oleiculture" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E6DEC9] relative scroll-mt-28">
      {/* Subtle ambient motif */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#567B34_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F4D9] text-[#233416] text-xs font-bold uppercase tracking-wider mb-3 border border-[#8CBE5D]/30">
            <HelpCircle className="w-4 h-4 text-[#436229]" />
            <span>Foire Aux Questions & Vulgarisation Agronomique</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#18230F] tracking-tight">
            Questions Fréquentes sur la Conduite de l'Oliveraie
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#436229] leading-relaxed">
            Retrouvez les réponses et protocoles validés par les ingénieurs agronomes de l'<strong>ADOIO</strong> pour réussir la taille de vos arbres, maîtriser la protection biologique et optimiser la récolte de votre huile.
          </p>
          <div className="mt-4">
            <ArticleAudioReader
              sectionId="faq-oleiculture"
              title="Questions Fréquentes sur la Conduite de l'Oliveraie"
              text={() => {
                const itemsToRead = filteredFaqs.length > 0 ? filteredFaqs : FAQ_DATA;
                return (
                  `Foire aux questions agronomiques de l'ADOIO Béjaïa. ` +
                  itemsToRead
                    .map(
                      (faq) =>
                        `Question : ${faq.question} Réponse : ${faq.shortAnswer} ${faq.detailedAnswer.join(' ')} Recommandation ADOIO : ${faq.adoioRecommendation}`
                    )
                    .join(' ')
                );
              }}
            />
          </div>
        </div>

        {/* Filter bar: categories + search input */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#E6DEC9] shadow-xs mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Thematic Category Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#31491E] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-[#233416] hover:bg-[#E8F4D9] border border-[#E6DEC9]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Toutes ({FAQ_DATA.length})</span>
              </button>

              <button
                onClick={() => setSelectedCategory('taille')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === 'taille'
                    ? 'bg-[#31491E] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-[#233416] hover:bg-[#E8F4D9] border border-[#E6DEC9]'
                }`}
              >
                <Scissors className="w-3.5 h-3.5 text-[#E6AB3C]" />
                <span>Taille & Conduite</span>
              </button>

              <button
                onClick={() => setSelectedCategory('bio')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === 'bio'
                    ? 'bg-[#31491E] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-[#233416] hover:bg-[#E8F4D9] border border-[#E6DEC9]'
                }`}
              >
                <Leaf className="w-3.5 h-3.5 text-[#8CBE5D]" />
                <span>Traitements Bio</span>
              </button>

              <button
                onClick={() => setSelectedCategory('recolte')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === 'recolte'
                    ? 'bg-[#31491E] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-[#233416] hover:bg-[#E8F4D9] border border-[#E6DEC9]'
                }`}
              >
                <Droplets className="w-3.5 h-3.5 text-[#E6AB3C]" />
                <span>Récolte & Rendement</span>
              </button>
            </div>

            {/* Quick action: expand/collapse all */}
            <div className="flex items-center gap-2 text-xs text-[#567B34] font-medium shrink-0">
              <button
                onClick={expandAll}
                className="hover:text-[#18230F] underline cursor-pointer"
              >
                Tout ouvrir
              </button>
              <span>·</span>
              <button
                onClick={collapseAll}
                className="hover:text-[#18230F] underline cursor-pointer"
              >
                Tout replier
              </button>
            </div>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#567B34] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrer les questions (ex. : mouche, Chemlal, kaolin, véraison, alternance, filets, cuivre)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] rounded-xl border border-[#E6DEC9] text-xs sm:text-sm text-[#18230F] placeholder-[#567B34]/60 focus:outline-none focus:ring-2 focus:ring-[#31491E] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* FAQ Accordion List */}
        {filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-[#E6DEC9] space-y-3">
            <HelpCircle className="w-12 h-12 text-[#B0D984] mx-auto" />
            <h3 className="font-serif text-lg font-bold text-[#18230F]">
              Aucune question ne correspond à votre recherche
            </h3>
            <p className="text-xs text-[#436229] max-w-md mx-auto">
              Essayez un mot-clé plus générique ou réinitialisez vos filtres pour afficher l'ensemble des fiches techniques.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-[#31491E] text-white text-xs font-bold hover:bg-[#233416] transition-colors cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isOpen = !!openItems[faq.id];
              return (
                <div
                  key={faq.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen 
                      ? 'border-[#8CBE5D] shadow-sm ring-1 ring-[#8CBE5D]/30' 
                      : 'border-[#E6DEC9] hover:border-[#8CBE5D]/60'
                  }`}
                >
                  {/* Accordion trigger button */}
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          faq.category === 'taille'
                            ? 'bg-[#FAF7F2] text-[#6F9D44] border border-[#E6DEC9]'
                            : faq.category === 'bio'
                            ? 'bg-[#E8F4D9] text-[#233416]'
                            : 'bg-[#FAF7F2] text-[#B47A16] border border-[#E6DEC9]'
                        }`}>
                          {faq.categoryLabel}
                        </span>
                        {faq.tags.slice(0, 2).map((t) => (
                          <span key={t} className="text-[10px] text-[#567B34] font-medium hidden sm:inline">
                            #{t}
                          </span>
                        ))}
                      </div>

                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#18230F] leading-snug">
                        {faq.question}
                      </h3>

                      {!isOpen && (
                        <p className="text-xs text-[#436229] line-clamp-1 mt-1 font-normal">
                          {faq.shortAnswer}
                        </p>
                      )}
                    </div>

                    <div className={`p-2 rounded-xl transition-transform duration-200 shrink-0 ${
                      isOpen ? 'bg-[#31491E] text-white rotate-180' : 'bg-[#FAF7F2] text-[#31491E]'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Accordion Content */}
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-[#E6DEC9]/60 space-y-4 animate-in fade-in duration-200">
                      {/* Short summary block */}
                      <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E6DEC9] text-xs font-semibold text-[#18230F] flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#567B34] shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                          <strong className="text-[#31491E]">En synthèse : </strong>
                          {faq.shortAnswer}
                        </p>
                      </div>

                      {/* Detailed development */}
                      <div className="space-y-2 text-xs sm:text-sm text-[#436229] leading-relaxed">
                        {faq.detailedAnswer.map((p, idx) => (
                          <p key={idx}>{p}</p>
                        ))}
                      </div>

                      {/* Practical tips */}
                      {faq.tips.length > 0 && (
                        <div className="bg-[#E8F4D9]/60 p-4 rounded-xl border border-[#8CBE5D]/30 space-y-2">
                          <span className="text-xs font-bold text-[#18230F] uppercase tracking-wide flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#E6AB3C]" />
                            <span>Conseils de terrain de nos techniciens :</span>
                          </span>
                          <ul className="space-y-1.5 text-xs text-[#233416]">
                            {faq.tips.map((tip, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-[#567B34] font-bold">•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* ADOIO Official Recommendation Badge */}
                      <div className="p-3 bg-[#31491E] text-[#FAF7F2] rounded-xl flex items-start gap-2.5 text-xs">
                        <ShieldCheck className="w-4 h-4 text-[#E6AB3C] shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-[#E8F4D9] font-bold mb-0.5">
                            Recommandation officielle ADOIO :
                          </strong>
                          <span className="text-[#FAF7F2]/90 leading-snug">
                            {faq.adoioRecommendation}
                          </span>
                        </div>
                      </div>

                      {/* Tags & quick actions */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-[#E6DEC9]/40">
                        <div className="flex flex-wrap gap-1">
                          {faq.tags.map(t => (
                            <span key={t} className="text-[11px] text-[#567B34] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#E6DEC9]">
                              #{t}
                            </span>
                          ))}
                        </div>

                        {faq.category === 'recolte' && onOpenSimulator && (
                          <button
                            type="button"
                            onClick={onOpenSimulator}
                            className="text-[11px] font-bold text-[#31491E] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>Calculer mon rendement en huile</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Direct Contact Banner with ADOIO Agronomists */}
        <div className="mt-12 bg-gradient-to-r from-[#233416] to-[#18230F] rounded-3xl p-6 sm:p-8 text-[#FAF7F2] border border-[#8CBE5D]/30 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#B0D984]">
              <MessageCircle className="w-3.5 h-3.5 text-[#E6AB3C]" />
              <span>Assistance Technique & Accompagnement des Producteurs</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold">
              Vous avez une question agronomique spécifique pour votre oliveraie ?
            </h3>
            <p className="text-xs sm:text-sm text-[#E8F4D9]/80 max-w-xl">
              Les ingénieurs et experts de l'ADOIO organisent des permanences à la Chambre d'Agriculture de Béjaïa pour analyser vos échantillons d'olives, diagnostiquer les maladies et vous conseiller sur les itinéraires techniques.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {onOpenAdhesion && (
              <button
                type="button"
                onClick={onOpenAdhesion}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#8CBE5D] hover:bg-[#729e4b] text-[#18230F] font-bold text-xs shadow-md transition-all cursor-pointer text-center"
              >
                Contacter un Agronome ADOIO
              </button>
            )}
            <a
              href="tel:+213661630658"
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all text-center"
            >
              Permanence : 0661 63 06 58
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
