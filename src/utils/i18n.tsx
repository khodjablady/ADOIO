import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Globe, Check } from 'lucide-react';

export type AppLanguage = 'fr' | 'en' | 'ar';

export interface LanguageOption {
  code: AppLanguage;
  label: string;
  shortLabel: string;
  nativeLabel: string;
  dir: 'ltr' | 'rtl';
  title: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: 'fr',
    label: 'Français',
    shortLabel: 'FR',
    nativeLabel: 'Français',
    dir: 'ltr',
    title: 'Afficher le portail en Français (Langue originale)',
  },
  {
    code: 'en',
    label: 'English',
    shortLabel: 'EN',
    nativeLabel: 'English',
    dir: 'ltr',
    title: 'Translate portal into English',
  },
  {
    code: 'ar',
    label: 'Arabe',
    shortLabel: 'عربي',
    nativeLabel: 'العربية',
    dir: 'rtl',
    title: 'ترجمة البوابة إلى اللغة العربية (Arabic)',
  },
];

export const LANGUAGE_STORAGE_KEY = 'adoio_language_preference';
const LANGUAGE_BROADCAST_CHANNEL = 'adoio_language_sync_channel';
const DYNAMIC_TRANSLATION_CACHE_KEY = 'adoio_dynamic_i18n_cache_v1';

// Exact & phrase-level dictionary for instant 0ms translation of UI, navigation, headings, and domain terms
export const EXACT_TRANSLATIONS: Record<string, { en: string; ar: string }> = {
  // Top bar & Brand
  'Filière oléicole, Bejaïa - Algérie': {
    en: 'Olive Oil Sector, Béjaïa - Algeria',
    ar: 'شعبة الزيتون، بجاية - الجزائر',
  },
  '« Zzit uzemmur n Bgayet » · Patrimoine Oléicole de Kabylie': {
    en: '“Zzit uzemmur n Bgayet” · Kabylie Olive Heritage',
    ar: '« زيت أوزمور ن بجاية » · التراث الأوليفي لمنطقة القبائل',
  },
  'CAW de Béjaïa': {
    en: 'Chamber of Agriculture (CAW) of Béjaïa',
    ar: 'الغرفة الفلاحية لولاية بجاية (CAW)',
  },
  'Olive Béjaïa': {
    en: 'Olive Béjaïa',
    ar: 'زيتون بجاية',
  },
  'Association pour le développement de l’oléiculture et des industries oléicoles.': {
    en: 'Association for the Development of Olive Growing and Olive Oil Industries.',
    ar: 'جمعية تطوير زراعة الزيتون والصناعات الأوليفية ببجاية.',
  },
  'Agréée par le Wali le 11/08/2014 sous le numéro 024/2014': {
    en: 'Accredited by the Wali on 11/08/2014 under number 024/2014',
    ar: 'معتمدة من طرف الوالي بتاريخ 11/08/2014 تحت رقم 024/2014',
  },
  'Aller directement au contenu principal': {
    en: 'Skip directly to main content',
    ar: 'الانتقال مباشرة إلى المحتوى الرئيسي',
  },

  // Main Navigation Links
  'Terroir & ADOIO': {
    en: 'Terroir & ADOIO',
    ar: 'الإقليم و ADOIO',
  },
  'Missions, 25 ans & Chiffres': {
    en: 'Missions, 25 Years & Key Figures',
    ar: 'المهام، 25 سنة والأرقام الرئيسية',
  },
  'Carte & 448 Moulins': {
    en: 'Map & 448 Mills',
    ar: 'الخريطة و 448 معصرة',
  },
  'SIG & Annuaire huileries': {
    en: 'GIS Map & Olive Mills Directory',
    ar: 'نظام المعلومات الجغرافية ودليل المعاصر',
  },
  'Variétés & Guide COI': {
    en: 'Varieties & IOC Guide',
    ar: 'الأصناف ودليل COI',
  },
  'Cultivars, Guide COI & Glossaire Oléicole': {
    en: 'Cultivars, IOC Guide & Olive Glossary',
    ar: 'الأصناف، دليل المجلس الدولي للزيتون والمعجم',
  },
  'Concours 2026': {
    en: '2026 Award',
    ar: 'مسابقة 2026',
  },
  "Fête de l'Olive & Palmarès": {
    en: 'Olive Festival & Winners List',
    ar: 'عيد الزيتون وقائمة الفائزين',
  },
  'Sous-Produits': {
    en: 'By-Products',
    ar: 'المنتجات الثانوية',
  },
  'Grignons, Margines & Biomasse': {
    en: 'Olive Pomace, Mill Wastewater & Biomass',
    ar: 'الفيتور، المرجين والكتلة الحيوية',
  },
  'Diagnostic Bio': {
    en: 'Bio Diagnosis',
    ar: 'التشخيص العضوي',
  },
  'Symptômes & Traitements Bio': {
    en: 'Symptoms & Organic Treatments',
    ar: 'الأعراض والعلاجات البيولوجية',
  },
  'Pratiques & Météo': {
    en: 'Practices & Weather',
    ar: 'الممارسات والطقس',
  },
  'Fertilisation, Eau, Gel & Chatbot ADOIO': {
    en: 'Fertilization, Water, Frost & ADOIO Chatbot',
    ar: 'التسميد، الري، الصقيع والمساعد الذكي ADOIO',
  },

  // Navbar CTAs & Mobile Menu
  'Système': { en: 'System', ar: 'النظام' },
  'Auto': { en: 'Auto', ar: 'تلقائي' },
  'Clair': { en: 'Light', ar: 'فاتح' },
  'Sombre': { en: 'Dark', ar: 'داكن' },
  'Nuit': { en: 'Night', ar: 'ليلي' },
  'Mode Clair': { en: 'Light Mode', ar: 'الوضع الفاتح' },
  'Mode Sombre': { en: 'Dark Mode', ar: 'الوضع الداكن' },
  'Apparence & Thème': { en: 'Appearance & Theme', ar: 'المظهر والسمة' },
  'Langue & Traduction': { en: 'Language & Translation', ar: 'اللغة والترجمة' },
  'Mode Hors-Ligne': { en: 'Offline Mode', ar: 'وضع عدم الاتصال' },
  'Index': { en: 'Index', ar: 'الفهرس' },
  'Index Rapide (17)': { en: 'Quick Index (17)', ar: 'الفهرس السريع (17)' },
  'Vigilance Gel': { en: 'Frost Alert', ar: 'يقظة الصقيع' },
  'Vigilance Gel & Alertes Push Météo': {
    en: 'Frost Watch & Weather Push Alerts',
    ar: 'يقظة الصقيع وتنبيهات الطقس الفورية',
  },
  'Simulateur': { en: 'Simulator', ar: 'المحاكي' },
  'Simulateur & Comparateur': { en: 'Simulator & Comparator', ar: 'المحاكي والمقارن' },
  'Simulateur & Comparateur de Rendement': {
    en: 'Yield Simulator & Variety Comparator',
    ar: 'محاكي ومقارن مردودية الزيتون',
  },
  'Adhérer': { en: 'Join ADOIO', ar: 'انخرط معنا' },
  "Adhérer à l'ADOIO & Contact": {
    en: 'Join ADOIO & Contact Us',
    ar: 'الانخراط في جمعية ADOIO والاتصال',
  },
  'Connexion': { en: 'Sign In', ar: 'تسجيل الدخول' },
  'Connexion...': { en: 'Signing in...', ar: 'جارٍ الاتصال...' },
  'Connexion en cours...': { en: 'Signing in...', ar: 'جارٍ تسجيل الدخول...' },
  'Se connecter (Sauvegarde Compte)': {
    en: 'Sign In (Cloud Account Backup)',
    ar: 'تسجيل الدخول (حفظ الحساب)',
  },
  'Se déconnecter': { en: 'Sign Out', ar: 'تسجيل الخروج' },
  'Déconnexion': { en: 'Sign Out', ar: 'خروج' },
  'Mon Profil': { en: 'My Profile', ar: 'ملفي الشخصي' },
  'Membre ADOIO': { en: 'ADOIO Member', ar: 'عضو ADOIO' },
  'Synchronisé': { en: 'Synced', ar: 'متزامن' },
  'Compte Synchronisé': { en: 'Synced Account', ar: 'حساب متزامن' },
  'Ouvrir Mon Profil Complet': {
    en: 'Open My Full Profile',
    ar: 'فتح ملفي الشخصي الكامل',
  },
  'Huileries favorites': { en: 'Favorite Olive Mills', ar: 'المعاصر المفضلة' },
  'Statut Adhésion ADOIO': { en: 'ADOIO Membership Status', ar: 'حالة الانخراط في ADOIO' },
  'Non affilié': { en: 'Not Affiliated', ar: 'غير منخرط' },
  'Progression Quiz COI': { en: 'IOC Quiz Progress', ar: 'تقدم اختبار COI' },
  'Favoris': { en: 'Favorites', ar: 'المفضلة' },
  'Adhésion': { en: 'Membership', ar: 'الانخراط' },
  'Quiz COI': { en: 'IOC Quiz', ar: 'اختبار COI' },
  "Vue d'ensemble": { en: 'Overview', ar: 'نظرة عامة' },
  'Adhésion ADOIO': { en: 'ADOIO Membership', ar: 'عضوية ADOIO' },

  // Mobile Menu Links & NewsFeed
  'Actualités & Communiqués': {
    en: 'News & Official Updates',
    ar: 'الأخبار والبيانات الرسمية',
  },
  'Bulletin Agronomique & Dépêches Officielles': {
    en: 'Agronomic Bulletin & Official Dispatches',
    ar: 'النشرة الفلاحية والبيانات الرسمية',
  },
  'Édition Campagne 2026–2027': {
    en: '2026–2027 Harvest Campaign Edition',
    ar: 'طبعة موسم الجني 2026–2027',
  },
  'Actualités Agricoles & Communiqués de l’ADOIO': {
    en: 'Agricultural News & ADOIO Official Updates',
    ar: 'الأخبار الفلاحية وبيانات جمعية ADOIO',
  },
  'Toutes les actualités': {
    en: 'All News',
    ar: 'جميع الأخبار',
  },
  'Communiqués ADOIO': {
    en: 'ADOIO Updates',
    ar: 'بيانات ADOIO',
  },
  'Communiqué ADOIO': {
    en: 'ADOIO Official Update',
    ar: 'بيان رسمي ADOIO',
  },
  'Agronomie & Verger': {
    en: 'Agronomy & Orchard',
    ar: 'الزراعة والبستان',
  },
  'Qualité & Trituration': {
    en: 'Quality & Milling',
    ar: 'الجودة والعصر',
  },
  'Événements & Formation': {
    en: 'Events & Training',
    ar: 'الفعاليات والتكوين',
  },
  'Lire le dossier': {
    en: 'Read Full Article',
    ar: 'قراءة الملف الكامل',
  },
  'Dossiers Agronomiques & Qualité Oléicole': {
    en: 'Agronomic Reports & Olive Oil Quality',
    ar: 'الملفات الفلاحية وجودة زيت الزيتون',
  },
  'Dépêches de Terrain & Calendrier de Vulgarisation': {
    en: 'Field Dispatches & Extension Calendar',
    ar: 'برقيات ميدانية ورزنامة الإرشاد الفلاحي',
  },
  'Points clés à retenir au verger et au moulin': {
    en: 'Key Takeaways for the Orchard and Olive Mill',
    ar: 'النقاط الأساسية للبستان والمعصرة',
  },
  'ADOIO & Terroir (25 ans)': {
    en: 'ADOIO & Terroir (25 Years)',
    ar: 'جمعية ADOIO والإقليم (25 سنة)',
  },
  'Carte Interactive SIG': {
    en: 'Interactive GIS Map',
    ar: 'الخريطة التفاعلية (SIG)',
  },
  'Annuaire des 448 Huileries': {
    en: 'Directory of 448 Olive Mills',
    ar: 'دليل 448 معصرة زيتون',
  },
  'Annuaire des 448 Moulins': {
    en: 'Directory of 448 Mills',
    ar: 'دليل 448 معصرة',
  },
  'Guide Variétal Kabyle': {
    en: 'Kabyle Olive Varieties Guide',
    ar: 'دليل أصناف الزيتون القبائلية',
  },
  'Guide Variétal': {
    en: 'Varieties Guide',
    ar: 'دليل الأصناف',
  },
  'Guide des Variétés': {
    en: 'Varieties Guide',
    ar: 'دليل الأصناف',
  },
  'Guide du Consommateur & Normes COI': {
    en: 'Consumer Guide & IOC Standards',
    ar: 'دليل المستهلك ومعايير المجلس الدولي للزيتون',
  },
  'Guide du Consommateur': {
    en: 'Consumer Guide',
    ar: 'دليل المستهلك',
  },
  'Concours Meilleure Huile 2026': {
    en: 'Best Olive Oil Competition 2026',
    ar: 'مسابقة أفضل زيت زيتون 2026',
  },
  'Glossaire Oléicole (Termes & Définitions)': {
    en: 'Olive Glossary (Terms & Definitions)',
    ar: 'معجم مصطلحات الزيتون (تعاريف ومفاهيم)',
  },
  'Glossaire Oléicole': {
    en: 'Olive Glossary',
    ar: 'معجم الزيتون',
  },
  'Simulateur & Comparateur Variétal': {
    en: 'Yield Simulator & Variety Comparator',
    ar: 'محاكي المردودية ومقارن الأصناف',
  },
  'Simulateur de Rendement': {
    en: 'Yield Simulator',
    ar: 'محاكي المردودية',
  },
  'Calculateur de Fertilisation': {
    en: 'Fertilization Calculator',
    ar: 'حاسبة التسميد العضوي',
  },
  "Guide d'Irrigation": {
    en: 'Irrigation Guide',
    ar: 'دليل الري والاحتياجات المائية',
  },
  'Valorisation des Sous-Produits': {
    en: 'Olive By-Products Valorization',
    ar: 'تثمين المنتجات الثانوية للزيتون',
  },
  'Diagnostic Phytosanitaire & Bio': {
    en: 'Phytosanitary & Organic Diagnosis',
    ar: 'التشخيص الصحي النباتي والعلاج البيولوجي',
  },
  'Diagnostic Phytosanitaire Bio': {
    en: 'Organic Phytosanitary Diagnosis',
    ar: 'التشخيص الصحي النباتي البيولوجي',
  },
  'Calendrier, Irrigation & Fertilisation': {
    en: 'Calendar, Irrigation & Fertilization',
    ar: 'الرزنامة الزراعية، الري والتسميد',
  },
  'Calendrier Agronomique': {
    en: 'Agronomic Calendar',
    ar: 'الرزنامة الفلاحية',
  },
  'Chatbot Assistant Agronomique ADOIO': {
    en: 'ADOIO Agronomic Assistant Chatbot',
    ar: 'المساعد الفلاحي الذكي ADOIO',
  },
  'Assistant Agronomique ADOIO': {
    en: 'ADOIO Agronomic Assistant',
    ar: 'المساعد الفلاحي ADOIO',
  },
  'Assistant ADOIO': {
    en: 'ADOIO Assistant',
    ar: 'مساعد ADOIO',
  },
  'FAQ Oléicole': {
    en: 'Olive Growing FAQ',
    ar: 'الأسئلة الشائعة حول زراعة الزيتون',
  },
  'Plan du site & Index Thématique (17 modules)': {
    en: 'Sitemap & Thematic Index (17 modules)',
    ar: 'خريطة الموقع والفهرس الموضوعي (17 وحدة)',
  },
  'Chiffres & Verger': {
    en: 'Key Figures & Groves',
    ar: 'الأرقام وبساتين الزيتون',
  },
  'Galerie des Paysages': {
    en: 'Olive Landscapes Gallery',
    ar: 'معرض مشاهد وحقول الزيتون',
  },
  'Ouvrir la Carte SIG': {
    en: 'Open GIS Map',
    ar: 'فتح الخريطة التفاعلية',
  },
  'Continuité du Parcours · Pilier 2': {
    en: 'Journey Continuity · Pillar 2',
    ar: 'مواصلة المسار · المحور 2',
  },
  'Continuité du Parcours · Pilier 3': {
    en: 'Journey Continuity · Pillar 3',
    ar: 'مواصلة المسار · المحور 3',
  },
  'Continuité du Parcours · Pilier 4': {
    en: 'Journey Continuity · Pillar 4',
    ar: 'مواصلة المسار · المحور 4',
  },
};

// Phrase-level replacements (ordered longest-first at runtime) to translate rich French content across all 17 modules
export const PHRASE_TRANSLATIONS: Array<{ fr: string; en: string; ar: string }> = [
  // Silo & Navigation Phrases
  {
    fr: 'Explorez maintenant la géolocalisation SIG des 52 communes et le répertoire des 448 huileries de Béjaïa.',
    en: 'Now explore the GIS geolocation of the 52 municipalities and the directory of 448 olive mills in Béjaïa.',
    ar: 'استكشف الآن التموقع الجغرافي للبلديات الـ 52 ودليل معاصر الزيتون الـ 448 في ولاية بجاية.',
  },
  {
    fr: 'géolocalisation SIG des 52 communes',
    en: 'GIS geolocation of the 52 municipalities',
    ar: 'التموقع الجغرافي للبلديات الـ 52',
  },
  {
    fr: '448 huileries de Béjaïa',
    en: '448 olive mills of Béjaïa',
    ar: '448 معصرة زيتون في بجاية',
  },
  {
    fr: 'variétés autochtones kabyles',
    en: 'native Kabyle olive varieties',
    ar: 'أصناف الزيتون المحلية القبائلية',
  },
  {
    fr: 'Guide officiel du Consommateur ADOIO',
    en: 'official ADOIO Consumer Guide',
    ar: 'الدليل الرسمي للمستهلك من جمعية ADOIO',
  },
  {
    fr: 'Simulateur Comparatif de Variétés',
    en: 'Comparative Variety Simulator',
    ar: 'المحاكي المقارن للأصناف',
  },

  // Hero & General Portal Headings
  {
    fr: "Portail Officiel de l'Oléiculture & des Huileries de Béjaïa",
    en: 'Official Portal of Olive Growing & Olive Mills in Béjaïa',
    ar: 'البوابة الرسمية لزراعة الزيتون والمعاصر في ولاية بجاية',
  },
  {
    fr: "L'Excellence Oléicole au Cœur de la Kabylie",
    en: 'Olive Growing Excellence in the Heart of Kabylie',
    ar: 'التميز الأوليفي في قلب منطقة القبائل',
  },
  {
    fr: "Capitale Algérienne de l'Huile d'Olive",
    en: 'Algerian Capital of Olive Oil',
    ar: 'العاصمة الجزائرية لزيت الزيتون',
  },
  {
    fr: "Huile d'Olive Vierge Extra",
    en: 'Extra Virgin Olive Oil',
    ar: 'زيت زيتون بكر ممتاز',
  },
  {
    fr: "Huile d'Olive Vierge Courante",
    en: 'Ordinary Virgin Olive Oil',
    ar: 'زيت زيتون بكر عادي',
  },
  {
    fr: "Huile d'Olive Vierge",
    en: 'Virgin Olive Oil',
    ar: 'زيت زيتون بكر',
  },
  {
    fr: "Huile d'Olive Lampante",
    en: 'Lampante Olive Oil',
    ar: 'زيت زيتون وقادي (لامبانتي)',
  },
  {
    fr: "Huile d'Olive",
    en: 'Olive Oil',
    ar: 'زيت الزيتون',
  },
  {
    fr: "huile d'olive",
    en: 'olive oil',
    ar: 'زيت الزيتون',
  },

  // Silo Navigation & Breadcrumbs
  {
    fr: 'Pilier 1 : Terroir & ADOIO',
    en: 'Pillar 1: Terroir & ADOIO',
    ar: 'المحور 1: الإقليم و ADOIO',
  },
  {
    fr: 'Pilier 2 : Carte SIG & 448 Huileries',
    en: 'Pillar 2: GIS Map & 448 Mills',
    ar: 'المحور 2: خريطة SIG و 448 معصرة',
  },
  {
    fr: 'Pilier 3 : Variétés, COI & Concours',
    en: 'Pillar 3: Varieties, IOC & Competition',
    ar: 'المحور 3: الأصناف، معايير COI والمسابقة',
  },
  {
    fr: 'Pilier 4 : Simulateurs, Diagnostic & IA',
    en: 'Pillar 4: Simulators, Diagnosis & AI',
    ar: 'المحور 4: المحاكيات، التشخيص والمساعد الذكي',
  },
  {
    fr: 'Parcours Thématique',
    en: 'Thematic Journey',
    ar: 'المسار الموضوعي',
  },
  {
    fr: 'Navigation par Silos',
    en: 'Pillar Navigation',
    ar: 'التنقل حسب المحاور',
  },
  {
    fr: 'Plan Complet (17)',
    en: 'Full Sitemap (17)',
    ar: 'المخطط الكامل (17)',
  },

  // Key Agronomic & Portal Phrases
  {
    fr: 'Rechercher une huilerie, une commune (Akbou, Seddouk, Feraoun...)',
    en: 'Search for an olive mill, municipality (Akbou, Seddouk, Feraoun...)',
    ar: 'ابحث عن معصرة أو بلدية (أقبو، صدوق، فرعون...)',
  },
  {
    fr: 'Rechercher une commune ou une huilerie',
    en: 'Search for a municipality or an olive mill',
    ar: 'البحث عن بلدية أو معصرة زيتون',
  },
  {
    fr: 'Rechercher une huilerie',
    en: 'Search for an olive mill',
    ar: 'البحث عن معصرة',
  },
  {
    fr: 'Rechercher une commune',
    en: 'Search for a municipality',
    ar: 'البحث عن بلدية',
  },
  {
    fr: 'Toutes les communes',
    en: 'All municipalities',
    ar: 'جميع البلديات',
  },
  {
    fr: 'Tous les bassins',
    en: 'All production basins',
    ar: 'جميع الأحواض الإنتاجية',
  },
  {
    fr: 'Tous les systèmes',
    en: 'All extraction systems',
    ar: 'جميع أنظمة الاستخلاص',
  },
  {
    fr: "Filtrer par Système d'Extraction (Type de Moulin)",
    en: 'Filter by Extraction System (Mill Type)',
    ar: 'التصفية حسب نظام الاستخلاص (نوع المعصرة)',
  },
  {
    fr: 'Chaîne Continue',
    en: 'Continuous Line',
    ar: 'خط استخلاص مستمر',
  },
  {
    fr: 'Inox 2 & 3 phases (< 27°C)',
    en: 'Stainless 2 & 3-phase (< 27°C)',
    ar: 'فولاذ غير قابل للصدأ طورين و3 أطوار (< 27°م)',
  },
  {
    fr: 'Presse Traditionnelle',
    en: 'Traditional Press',
    ar: 'معصرة تقليدية بالحجر',
  },
  {
    fr: 'Taâssart · Meules de granit',
    en: 'Taâssart · Granite millstones',
    ar: 'ثعصارت · رحى الغرانيت الحجرية',
  },
  {
    fr: 'Domaine Intégré',
    en: 'Integrated Estate',
    ar: 'مزرعة ومعصرة مدمجة',
  },
  {
    fr: 'Proximité & Géolocalisation :',
    en: 'Proximity & Geolocation:',
    ar: 'القرب الجغرافي وتحديد الموقع:',
  },
  {
    fr: 'Autour de ma position (GPS)',
    en: 'Near my location (GPS)',
    ar: 'بالقرب من موقعي (GPS)',
  },
  {
    fr: 'Position GPS active',
    en: 'GPS location active',
    ar: 'موقع GPS مفعل',
  },
  {
    fr: 'Choisir un point de départ en Kabylie…',
    en: 'Choose a starting point in Kabylia…',
    ar: 'اختر نقطة انطلاق في منطقة القبائل…',
  },
  {
    fr: 'Rayon max :',
    en: 'Max radius:',
    ar: 'أقصى نطاق مسافة:',
  },
  {
    fr: '📍 Plus proches de ma position',
    en: '📍 Nearest to my location',
    ar: '📍 الأقرب إلى موقعي',
  },
  {
    fr: 'Alertes Navigateur & Phénologie Régionale · Wilaya de Béjaïa',
    en: 'Browser Alerts & Regional Phenology · Béjaïa Province',
    ar: 'تنبيهات المتصفح والفينولوجيا الإقليمية · ولاية بجاية',
  },
  {
    fr: 'Notification de Fenêtre Optimale de Récolte par Variété & Commune',
    en: 'Optimal Harvest Window Notification by Variety & Municipality',
    ar: 'إشعار فترة الجني المثلى حسب الصنف والبلدية',
  },
  {
    fr: "1. Votre variété d'olives :",
    en: '1. Your olive variety:',
    ar: '1. صنف الزيتون الخاص بك:',
  },
  {
    fr: '2. Bassin régional / Commune :',
    en: '2. Regional basin / Municipality:',
    ar: '2. الحوض الإقليمي / البلدية:',
  },
  {
    fr: 'Surveiller cette variété',
    en: 'Monitor this variety',
    ar: 'مراقبة هذا الصنف',
  },
  {
    fr: 'Alerte Activée',
    en: 'Alert Active',
    ar: 'التنبيه مفعل',
  },
  {
    fr: "Tester l'alerte",
    en: 'Test alert',
    ar: 'اختبار التنبيه',
  },
  {
    fr: 'Fenêtre Optimale Active (Cueillette Recommandée)',
    en: 'Optimal Window Active (Harvest Recommended)',
    ar: 'الفترة المثلى نشطة (ينصح بالجني)',
  },
  {
    fr: 'Fenêtre Régionale Calculée',
    en: 'Calculated Regional Window',
    ar: 'فترة الجني الإقليمية المحسوبة',
  },
  {
    fr: 'Indice de Maturité (Jaén)',
    en: 'Maturity Index (Jaén)',
    ar: 'مؤشر النضج (جاين)',
  },
  {
    fr: 'Système Continu (2 ou 3 phases)',
    en: 'Continuous System (2 or 3 phases)',
    ar: 'نظام مستمر (طورين أو 3 أطوار)',
  },
  {
    fr: 'Système Continu',
    en: 'Continuous System',
    ar: 'نظام استخلاص مستمر',
  },
  {
    fr: 'Super-Presse',
    en: 'Super-Press',
    ar: 'معصرة ضغط عالي (سوبر برس)',
  },
  {
    fr: 'Traditionnel (Maâsra)',
    en: 'Traditional (Maâsra)',
    ar: 'تقليدي (معصرة حجرية)',
  },
  {
    fr: 'Traditionnel',
    en: 'Traditional',
    ar: 'تقليدي',
  },
  {
    fr: 'Capacité de trituration',
    en: 'Crushing capacity',
    ar: 'قدرة العصر والتحويل',
  },
  {
    fr: 'Point de Collecte',
    en: 'Collection Point',
    ar: 'نقطة تجميع الزيتون',
  },
  {
    fr: 'Points de Collecte',
    en: 'Collection Points',
    ar: 'نقاط تجميع الزيتون',
  },
  {
    fr: 'Huileries recensées',
    en: 'Registered olive mills',
    ar: 'المعاصر المحصاة',
  },
  {
    fr: 'Huileries modernes',
    en: 'Modern olive mills',
    ar: 'معاصر حديثة',
  },
  {
    fr: 'Huileries traditionnelles',
    en: 'Traditional olive mills',
    ar: 'معاصر تقليدية',
  },
  {
    fr: 'Huilerie',
    en: 'Olive Mill',
    ar: 'معصرة زيتون',
  },
  {
    fr: 'Huileries',
    en: 'Olive Mills',
    ar: 'معاصر الزيتون',
  },
  {
    fr: 'Moulins',
    en: 'Mills',
    ar: 'معاصر',
  },
  {
    fr: 'Moulin',
    en: 'Mill',
    ar: 'معصرة',
  },
  {
    fr: 'Verger oléicole',
    en: 'Olive grove',
    ar: 'بستان الزيتون',
  },
  {
    fr: 'Superficie oléicole',
    en: 'Olive-growing area',
    ar: 'المساحة المزروعة بالزيتون',
  },
  {
    fr: 'Oliviers en production',
    en: 'Producing olive trees',
    ar: 'أشجار الزيتون المنتجة',
  },
  {
    fr: 'Rendement moyen',
    en: 'Average yield',
    ar: 'المردود المتوسط',
  },
  {
    fr: 'Rendement en huile',
    en: 'Oil yield',
    ar: 'مردود الزيت',
  },
  {
    fr: 'Taux d’acidité',
    en: 'Acidity rate',
    ar: 'نسبة الحموضة',
  },
  {
    fr: "Taux d'acidité",
    en: 'Acidity rate',
    ar: 'نسبة الحموضة',
  },
  {
    fr: 'Polyphénols',
    en: 'Polyphenols',
    ar: 'البوليفينولات (مضادات الأكسدة)',
  },
  {
    fr: 'Indice de peroxyde',
    en: 'Peroxide value',
    ar: 'مؤشر البيروكسيد',
  },
  {
    fr: 'Extraction à froid',
    en: 'Cold extraction',
    ar: 'استخلاص على البارد',
  },
  {
    fr: 'Première pression à froid',
    en: 'First cold pressing',
    ar: 'العصرة الأولى على البارد',
  },
  {
    fr: 'Conseil Oléicole International',
    en: 'International Olive Council',
    ar: 'المجلس الدولي للزيتون',
  },
  {
    fr: 'Bassin de la Soummam',
    en: 'Soummam Valley Basin',
    ar: 'حوض وادي الصومام',
  },
  {
    fr: 'Haute Soummam',
    en: 'Upper Soummam',
    ar: 'الصومام العليا',
  },
  {
    fr: 'Basse Soummam',
    en: 'Lower Soummam',
    ar: 'الصومام السفلى',
  },
  {
    fr: 'Monts du Guergour',
    en: 'Guergour Mountains',
    ar: 'جبال قرقور',
  },
  {
    fr: 'Littoral & Babor',
    en: 'Coastline & Babor',
    ar: 'الساحل وجبال بابور',
  },
  {
    fr: 'Double fin (Huile & Table)',
    en: 'Dual purpose (Oil & Table)',
    ar: 'ثنائية الغرض (زيت ومائدة)',
  },
  {
    fr: 'Olive de table',
    en: 'Table olive',
    ar: 'زيتون المائدة',
  },
  {
    fr: 'Huile uniquement',
    en: 'Oil production',
    ar: 'إنتاج الزيت',
  },
  {
    fr: 'Partager',
    en: 'Share',
    ar: 'مشاركة',
  },
  {
    fr: 'Imprimer la fiche',
    en: 'Print datasheet',
    ar: 'طباعة البطاقة التقنية',
  },
  {
    fr: 'Exporter en CSV',
    en: 'Export to CSV',
    ar: 'تصدير بصيغة CSV',
  },
  {
    fr: 'Exporter en PDF',
    en: 'Export to PDF',
    ar: 'تصدير بصيغة PDF',
  },
  {
    fr: 'Télécharger',
    en: 'Download',
    ar: 'تحميل',
  },
  {
    fr: 'Réinitialiser les filtres',
    en: 'Reset filters',
    ar: 'إعادة ضبط الفلاتر',
  },
  {
    fr: 'Réinitialiser',
    en: 'Reset',
    ar: 'إعادة ضبط',
  },
  {
    fr: 'Voir les détails',
    en: 'View details',
    ar: 'عرض التفاصيل',
  },
  {
    fr: 'Fermer',
    en: 'Close',
    ar: 'إغلاق',
  },
  {
    fr: 'Communes oléicoles',
    en: 'Olive-growing municipalities',
    ar: 'البلديات المنتجة للزيتون',
  },
  {
    fr: '52 communes',
    en: '52 municipalities',
    ar: '52 بلدية',
  },
  {
    fr: 'Commune',
    en: 'Municipality',
    ar: 'البلدية',
  },
  {
    fr: 'Daïra',
    en: 'District (Daïra)',
    ar: 'الدائرة',
  },
  {
    fr: 'Altitude',
    en: 'Altitude',
    ar: 'الارتفاع عن سطح البحر',
  },
  {
    fr: 'Mouche de l’olivier',
    en: 'Olive fruit fly',
    ar: 'ذبابة ثمار الزيتون',
  },
  {
    fr: "Mouche de l'olivier",
    en: 'Olive fruit fly',
    ar: 'ذبابة ثمار الزيتون',
  },
  {
    fr: 'Œil de paon',
    en: 'Peacock spot disease',
    ar: 'مرض عين الطاووس',
  },
  {
    fr: 'Psylle de l’olivier',
    en: 'Olive psyllid',
    ar: 'بسيلا الزيتون (القطن)',
  },
  {
    fr: "Psylle de l'olivier",
    en: 'Olive psyllid',
    ar: 'بسيلا الزيتون (القطن)',
  },
  {
    fr: 'Teigne de l’olivier',
    en: 'Olive moth',
    ar: 'عتة الزيتون',
  },
  {
    fr: "Teigne de l'olivier",
    en: 'Olive moth',
    ar: 'عتة الزيتون',
  },
  {
    fr: 'Cochenille noire',
    en: 'Black scale insect',
    ar: 'الحشرة القشرية السوداء',
  },
  {
    fr: 'Verticilliose',
    en: 'Verticillium wilt',
    ar: 'ذبول الفيرتيسيليوم',
  },
  {
    fr: 'Bactériose (Tuberculose)',
    en: 'Olive knot disease (Tuberculosis)',
    ar: 'سل الزيتون البكتيري',
  },
  {
    fr: 'Grignons d’olive',
    en: 'Olive pomace (solid residue)',
    ar: 'فيتور الزيتون (المخلفات الصلبة)',
  },
  {
    fr: "Grignons d'olive",
    en: 'Olive pomace (solid residue)',
    ar: 'فيتور الزيتون (المخلفات الصلبة)',
  },
  {
    fr: 'Margines',
    en: 'Olive mill wastewater (OMWW)',
    ar: 'المرجين (المياه النباتية للمعاصر)',
  },
  {
    fr: 'Bois de taille',
    en: 'Pruning wood',
    ar: 'حطب التقليم',
  },
  {
    fr: 'Compostage',
    en: 'Composting',
    ar: 'التسميد العضوي (الكومبوست)',
  },
  {
    fr: 'Taille de fructification',
    en: 'Fruiting pruning',
    ar: 'تقليم الإثمار',
  },
  {
    fr: 'Taille de régénération',
    en: 'Rejuvenation pruning',
    ar: 'تقليم التجديد والتشبيب',
  },
  {
    fr: 'Taille de formation',
    en: 'Training pruning',
    ar: 'تقليم التكوين والتربية',
  },
  {
    fr: 'Indice de maturité',
    en: 'Maturity index',
    ar: 'مؤشر النضج',
  },
  {
    fr: 'Véraison',
    en: 'Veraison (color change)',
    ar: 'بداية تلون الثمار (الفيريزون)',
  },
  {
    fr: 'Floraison',
    en: 'Flowering',
    ar: 'الإزهار',
  },
  {
    fr: 'Nouaison',
    en: 'Fruit set',
    ar: 'عقد الثمار',
  },
  {
    fr: 'Récolte optimale',
    en: 'Optimal harvest',
    ar: 'الجني الأمثل',
  },
  {
    fr: 'Campagne oléicole',
    en: 'Olive harvest season',
    ar: 'موسم جني وعصر الزيتون',
  },
  {
    fr: 'Fruité vert',
    en: 'Green fruity',
    ar: 'فاكهية خضراء',
  },
  {
    fr: 'Fruité mûr',
    en: 'Ripe fruity',
    ar: 'فاكهية ناضجة',
  },
  {
    fr: 'Fruité noir',
    en: 'Black fruity',
    ar: 'فاكهية سوداء',
  },
  {
    fr: 'Amertume',
    en: 'Bitterness',
    ar: 'المرارة الإيجابية',
  },
  {
    fr: 'Ardence (Piquant)',
    en: 'Pungency (Peppery finish)',
    ar: 'الحرارة الفلفلية (الحرقة الإيجابية)',
  },
  {
    fr: 'Ardence',
    en: 'Pungency',
    ar: 'الحرارة الفلفلية',
  },
  {
    fr: 'Posez votre question agronomique...',
    en: 'Ask your agronomic question...',
    ar: 'اطرح سؤالك الفلاحي هنا...',
  },
  {
    fr: 'Dictée vocale',
    en: 'Voice input',
    ar: 'الإملاء الصوتي',
  },
  {
    fr: 'Envoyer',
    en: 'Send',
    ar: 'إرسال',
  },
];

const SORTED_PHRASES = [...PHRASE_TRANSLATIONS].sort((a, b) => b.fr.length - a.fr.length);

// Dynamic translation cache for full paragraphs/sentences translated via fallback API
let dynamicCache: Record<string, { en?: string; ar?: string }> = {};
try {
  if (typeof window !== 'undefined') {
    const raw = window.sessionStorage.getItem(DYNAMIC_TRANSLATION_CACHE_KEY);
    if (raw) {
      dynamicCache = JSON.parse(raw);
    }
  }
} catch {
  dynamicCache = {};
}

function saveDynamicCache() {
  try {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(DYNAMIC_TRANSLATION_CACHE_KEY, JSON.stringify(dynamicCache));
    }
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Synchronous translation function using exact dictionary + phrase matching
 */
export function translateTextSync(text: string, targetLang: AppLanguage): string {
  if (targetLang === 'fr' || !text) return text;

  const trimmed = text.trim();
  if (!trimmed) return text;

  // Skip pure numbers, phone numbers, symbols, or single characters
  if (/^[\d\s.,:%+\-/()•·«»°€$£A-Z0-9]+$/i.test(trimmed) && !/[a-zA-ZÀ-ÿ]{2,}/.test(trimmed)) {
    return text;
  }

  // 1. Check exact dictionary match (preserving leading/trailing whitespace)
  const exact = EXACT_TRANSLATIONS[trimmed];
  if (exact) {
    const leadingSpaces = text.match(/^\s*/)?.[0] ?? '';
    const trailingSpaces = text.match(/\s*$/)?.[0] ?? '';
    return `${leadingSpaces}${exact[targetLang]}${trailingSpaces}`;
  }

  // 2. Check dynamic translation cache
  const cached = dynamicCache[trimmed]?.[targetLang];
  if (cached) {
    const leadingSpaces = text.match(/^\s*/)?.[0] ?? '';
    const trailingSpaces = text.match(/\s*$/)?.[0] ?? '';
    return `${leadingSpaces}${cached}${trailingSpaces}`;
  }

  // 3. Apply phrase-level replacements
  let result = text;
  for (const item of SORTED_PHRASES) {
    if (result.includes(item.fr)) {
      result = result.split(item.fr).join(item[targetLang]);
    }
  }

  return result;
}

// Queue for asynchronous full-sentence translation of unmapped text nodes
const pendingTexts = new Set<string>();
let batchTimer: number | null = null;
const activeTranslationListeners = new Set<() => void>();

function scheduleAsyncTranslation(text: string, targetLang: AppLanguage) {
  if (targetLang === 'fr') return;
  const trimmed = text.trim();
  if (
    trimmed.length < 3 ||
    trimmed.length > 700 ||
    EXACT_TRANSLATIONS[trimmed] ||
    dynamicCache[trimmed]?.[targetLang]
  ) {
    return;
  }
  // Only translate if it contains French letters
  if (!/[a-zA-ZÀ-ÿ]{3,}/.test(trimmed)) return;

  const key = `${targetLang}:::${trimmed}`;
  if (pendingTexts.has(key)) return;
  pendingTexts.add(key);

  if (batchTimer !== null) {
    window.clearTimeout(batchTimer);
  }
  batchTimer = window.setTimeout(() => {
    void processPendingTranslations();
  }, 140);
}

async function processPendingTranslations() {
  batchTimer = null;
  if (pendingTexts.size === 0) return;

  const items = Array.from(pendingTexts);
  pendingTexts.clear();

  // Group by targetLang
  const byLang: Record<'en' | 'ar', string[]> = { en: [], ar: [] };
  for (const item of items) {
    const [lang, ...rest] = item.split(':::');
    const text = rest.join(':::');
    if ((lang === 'en' || lang === 'ar') && text) {
      byLang[lang].push(text);
    }
  }

  for (const lang of ['en', 'ar'] as const) {
    const list = byLang[lang];
    if (list.length === 0) continue;

    // Process in chunks of 12 strings joined by a safe delimiter
    const chunkSize = 12;
    for (let i = 0; i < list.length; i += chunkSize) {
      const chunk = list.slice(i, i + chunkSize);
      try {
        const joined = chunk.join('\n ||| \n');
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=${lang}&dt=t&q=${encodeURIComponent(joined)}`;
        const res = await fetch(url);
        if (!res.ok) continue;
        const data = await res.json();
        if (Array.isArray(data) && Array.isArray(data[0])) {
          const translatedFull = data[0]
            .map((segment: unknown[]) => (Array.isArray(segment) ? String(segment[0] || '') : ''))
            .join('');
          const splitParts = translatedFull.split(/\s*\|\|\|\s*/);
          if (splitParts.length === chunk.length) {
            chunk.forEach((orig, idx) => {
              const cleanTrans = splitParts[idx]?.trim();
              if (cleanTrans) {
                if (!dynamicCache[orig]) dynamicCache[orig] = {};
                dynamicCache[orig][lang] = cleanTrans;
              }
            });
            saveDynamicCache();
            activeTranslationListeners.forEach((cb) => cb());
          }
        }
      } catch {
        // Fallback already handled synchronously by phrase dictionary
      }
    }
  }
}

export function readStoredLanguage(): AppLanguage {
  if (typeof window === 'undefined') return 'fr';
  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'en' || saved === 'ar' || saved === 'fr') {
      return saved;
    }
  } catch {
    // Ignore storage read errors
  }
  return 'fr';
}

interface LanguageContextValue {
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
  t: (text: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'fr',
  setLang: () => {},
  t: (text: string) => text,
  isRTL: false,
});

export const useLanguage = () => useContext(LanguageContext);

// Original French storage maps for DOM nodes & attributes
const originalTextNodeMap = new WeakMap<Text, string>();
const lastAppliedTextNodeMap = new WeakMap<Text, string>();
const originalAttributesMap = new WeakMap<Element, Record<string, string>>();

const TRANSLATABLE_ATTRIBUTES = ['placeholder', 'title', 'aria-label'] as const;
const SKIPPED_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'SVG', 'PATH']);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<AppLanguage>(() => readStoredLanguage());
  const isUpdatingDomRef = useRef(false);

  const applyLangAttributesToHtml = useCallback((targetLang: AppLanguage) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.lang = targetLang;
    root.dir = targetLang === 'ar' ? 'rtl' : 'ltr';
    root.setAttribute('data-lang', targetLang);
  }, []);

  const setLang = useCallback(
    (nextLang: AppLanguage) => {
      setLangState(nextLang);
      applyLangAttributesToHtml(nextLang);
      try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLang);
      } catch {
        // Ignore storage write errors
      }
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        try {
          const channel = new BroadcastChannel(LANGUAGE_BROADCAST_CHANNEL);
          channel.postMessage({ type: 'LANGUAGE_SYNC', lang: nextLang });
          channel.close();
        } catch {
          // Ignore BroadcastChannel errors
        }
      }
    },
    [applyLangAttributesToHtml]
  );

  // Sync across tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === LANGUAGE_STORAGE_KEY && (e.newValue === 'fr' || e.newValue === 'en' || e.newValue === 'ar')) {
        setLangState(e.newValue);
        applyLangAttributesToHtml(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorage);

    let channel: BroadcastChannel | null = null;
    if ('BroadcastChannel' in window) {
      try {
        channel = new BroadcastChannel(LANGUAGE_BROADCAST_CHANNEL);
        channel.onmessage = (msg: MessageEvent) => {
          if (msg.data?.type === 'LANGUAGE_SYNC') {
            const incoming = msg.data.lang;
            if (incoming === 'fr' || incoming === 'en' || incoming === 'ar') {
              setLangState(incoming);
              applyLangAttributesToHtml(incoming);
            }
          }
        };
      } catch {
        channel = null;
      }
    }

    return () => {
      window.removeEventListener('storage', handleStorage);
      if (channel) {
        try {
          channel.close();
        } catch {
          // Ignore
        }
      }
    };
  }, [applyLangAttributesToHtml]);

  // DOM Walker & MutationObserver to automatically translate all rendered text and attributes
  useEffect(() => {
    if (typeof document === 'undefined') return;
    applyLangAttributesToHtml(lang);

    const translateDomSubtree = (rootNode: Node) => {
      if (isUpdatingDomRef.current) return;
      isUpdatingDomRef.current = true;

      try {
        // 1. Translate Element Attributes (placeholder, title, aria-label)
        if (rootNode.nodeType === Node.ELEMENT_NODE) {
          const rootEl = rootNode as Element;
          const elements = [
            rootEl,
            ...Array.from(rootEl.querySelectorAll('[placeholder], [title], [aria-label]')),
          ];

          for (const el of elements) {
            if (el.closest('[data-no-translate="true"]')) continue;
            let savedAttrs = originalAttributesMap.get(el);
            if (!savedAttrs) {
              savedAttrs = {};
              originalAttributesMap.set(el, savedAttrs);
            }

            for (const attr of TRANSLATABLE_ATTRIBUTES) {
              const currentVal = el.getAttribute(attr);
              if (!currentVal) continue;

              if (savedAttrs[attr] === undefined) {
                savedAttrs[attr] = currentVal;
              }

              const sourceFr = savedAttrs[attr];
              if (lang === 'fr') {
                if (currentVal !== sourceFr) {
                  el.setAttribute(attr, sourceFr);
                }
              } else {
                const translated = translateTextSync(sourceFr, lang);
                if (translated !== currentVal) {
                  el.setAttribute(attr, translated);
                }
                if (translated === sourceFr) {
                  scheduleAsyncTranslation(sourceFr, lang);
                }
              }
            }
          }
        }

        // 2. Translate Text Nodes
        const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT, {
          acceptNode: (node) => {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            if (SKIPPED_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
            if (parent.closest('[data-no-translate="true"]')) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          },
        });

        let currentNode = walker.nextNode() as Text | null;
        while (currentNode) {
          const currentVal = currentNode.nodeValue || '';
          if (currentVal.trim().length > 0) {
            const lastApplied = lastAppliedTextNodeMap.get(currentNode);
            // If React updated the text node underneath us, update our stored original French text
            if (
              !originalTextNodeMap.has(currentNode) ||
              (lastApplied !== undefined && currentVal !== lastApplied)
            ) {
              originalTextNodeMap.set(currentNode, currentVal);
            }

            const sourceFr = originalTextNodeMap.get(currentNode) ?? currentVal;
            if (lang === 'fr') {
              if (currentVal !== sourceFr) {
                currentNode.nodeValue = sourceFr;
              }
              lastAppliedTextNodeMap.set(currentNode, sourceFr);
            } else {
              const translated = translateTextSync(sourceFr, lang);
              if (currentVal !== translated) {
                currentNode.nodeValue = translated;
              }
              lastAppliedTextNodeMap.set(currentNode, translated);
              if (translated === sourceFr) {
                scheduleAsyncTranslation(sourceFr, lang);
              }
            }
          }
          currentNode = walker.nextNode() as Text | null;
        }
      } finally {
        isUpdatingDomRef.current = false;
      }
    };

    // Initial full-body translation pass
    translateDomSubtree(document.body);

    // Subscribe to async batch completions
    const handleAsyncBatchResolved = () => {
      translateDomSubtree(document.body);
    };
    activeTranslationListeners.add(handleAsyncBatchResolved);

    // Observe dynamic DOM changes (lazy-loaded sections, modals, tooltips, tabs)
    const observer = new MutationObserver((mutations) => {
      if (isUpdatingDomRef.current) return;
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
              translateDomSubtree(node.parentElement || document.body);
            }
          });
        } else if (mutation.type === 'characterData' && mutation.target) {
          translateDomSubtree(mutation.target.parentElement || document.body);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
      activeTranslationListeners.delete(handleAsyncBatchResolved);
    };
  }, [lang, applyLangAttributesToHtml]);

  const t = useCallback(
    (text: string) => {
      return translateTextSync(text, lang);
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL: lang === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  );
};

interface LanguageSelectorProps {
  variant?: 'topbar' | 'navbar' | 'mobile';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'navbar',
  className = '',
}) => {
  const { lang, setLang } = useLanguage();

  if (variant === 'topbar') {
    return (
      <div
        data-no-translate="true"
        role="radiogroup"
        aria-label="Language selector / Sélecteur de langue / اختيار اللغة"
        className={`inline-flex items-center gap-1 bg-[#18230F]/80 border border-[#8CBE5D]/35 rounded-md px-1.5 py-0.5 ${className}`}
      >
        <Globe className="w-3 h-3 text-[#E6AB3C] shrink-0 mr-0.5" aria-hidden="true" />
        {LANGUAGE_OPTIONS.map((opt) => {
          const isSelected = lang === opt.code;
          return (
            <button
              key={opt.code}
              type="button"
              role="radio"
              aria-checked={isSelected}
              title={opt.title}
              onClick={() => setLang(opt.code)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#E6AB3C] text-[#18230F] shadow-2xs'
                  : 'text-[#E8F4D9]/85 hover:text-white hover:bg-white/10'
              }`}
            >
              {opt.shortLabel}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'mobile') {
    return (
      <div
        data-no-translate="true"
        className={`w-full p-2.5 rounded-lg bg-white border border-[#E6DEC9] space-y-2 ${className}`}
      >
        <div className="flex items-center justify-between text-xs font-bold text-[#233416] px-1">
          <span className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#567B34]" />
            <span>
              {lang === 'ar'
                ? 'اللغة والترجمة'
                : lang === 'en'
                  ? 'Language & Translator'
                  : 'Langue & Traduction'}
            </span>
          </span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#E8F4D9] text-[#233416]">
            {LANGUAGE_OPTIONS.find((o) => o.code === lang)?.nativeLabel}
          </span>
        </div>
        <div
          role="radiogroup"
          aria-label="Choisir la langue du portail"
          className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-[#FAF7F2] border border-[#E6DEC9]"
        >
          {LANGUAGE_OPTIONS.map((option) => {
            const isSelected = lang === option.code;
            return (
              <button
                key={option.code}
                type="button"
                role="radio"
                aria-checked={isSelected}
                title={option.title}
                onClick={() => setLang(option.code)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#233416] text-[#FAF7F2] shadow-xs'
                    : 'text-[#233416] hover:bg-[#E8F4D9]'
                }`}
              >
                <span>{option.nativeLabel}</span>
                {isSelected && <Check className="w-3 h-3 text-[#E6AB3C] shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Default: 'navbar' compact pill selector
  return (
    <div
      data-no-translate="true"
      role="radiogroup"
      aria-label="Sélecteur de langue (Français, English, العربية)"
      className={`inline-flex items-center p-0.5 rounded-lg bg-white/85 border border-[#E6DEC9] shadow-2xs shrink-0 ${className}`}
    >
      <Globe className="w-3.5 h-3.5 text-[#567B34] ml-1.5 mr-1 shrink-0 hidden sm:inline" aria-hidden="true" />
      {LANGUAGE_OPTIONS.map((option) => {
        const isSelected = lang === option.code;
        return (
          <button
            key={option.code}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`Langue ${option.nativeLabel}`}
            title={option.title}
            onClick={() => setLang(option.code)}
            className={`px-2 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
              isSelected
                ? 'bg-[#233416] text-[#FAF7F2] shadow-2xs'
                : 'text-[#31491E] hover:bg-[#E8F4D9] hover:text-[#18230F]'
            }`}
          >
            {option.shortLabel}
          </button>
        );
      })}
    </div>
  );
};
