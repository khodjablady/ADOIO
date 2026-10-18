/**
 * Système d'Avis et de Retours d'Expérience Oléicoles sur les Huileries de Béjaïa
 * Wilaya de Béjaïa · ADOIO
 */

export interface MillReview {
  id: string;
  millId: string;
  authorName: string;
  authorRole: string; // ex: 'Oléiculteur Récoltant', 'Coopérateur Villageois', 'Domaine Familial', 'Producteur Particulier'
  communeOrigin: string;
  date: string;
  rating: number; // 1 to 5
  serviceRatings: {
    extractionYield: number; // Rendement & pureté d'extraction (1-5)
    turnaroundTime: number;  // Rapidité de trituration post-cueillette (1-5)
    hygiene: number;         // Propreté des lignes & cuves inox (1-5)
    reception: number;       // Accueil, pesée transparente & conseils (1-5)
  };
  volumeBroughtQuintals?: number;
  varietyBrought?: string; // Chemlal, Bouchouk, Aberkane, Limli, Assemblage
  comment: string;
  recommended: boolean;
  likesCount: number;
}

export interface MillStats {
  averageRating: number;
  totalReviews: number;
  recommendationPercentage: number;
  ratingsBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  criteriaAverages: {
    extractionYield: number;
    turnaroundTime: number;
    hygiene: number;
    reception: number;
  };
}

export const INITIAL_MILL_REVIEWS: MillReview[] = [
  // mill-01: Huilerie Moderne de Seddouk (Blady Products)
  {
    id: 'rev-01-1',
    millId: 'mill-01',
    authorName: 'Mouloud Ait-Amar',
    authorRole: 'Oléiculteur Récoltant (Verger de 600 oliviers)',
    communeOrigin: 'Seddouk Ouffella',
    date: '12 Janvier 2026',
    rating: 5,
    serviceRatings: {
      extractionYield: 5,
      turnaroundTime: 5,
      hygiene: 5,
      reception: 5,
    },
    volumeBroughtQuintals: 48,
    varietyBrought: 'Chemlal & Azeradj',
    comment: 'Excellente unité moderne ! Mes 48 quintaux récoltés au filet ont été pressés dans la soirée même. Rendement obtenu de 20,4 L/quintal avec une acidité mesurée à 0,26% au réfractomètre du laboratoire. Aucune trace d’échauffement de la pâte.',
    recommended: true,
    likesCount: 14,
  },
  {
    id: 'rev-01-2',
    millId: 'mill-01',
    authorName: 'Brahim Kaci',
    authorRole: 'Domaine Familial',
    communeOrigin: 'Béni Maouche',
    date: '28 Décembre 2025',
    rating: 5,
    serviceRatings: {
      extractionYield: 5,
      turnaroundTime: 4,
      hygiene: 5,
      reception: 5,
    },
    volumeBroughtQuintals: 75,
    varietyBrought: 'Chemlal Pur',
    comment: 'Ligne 2 phases ultra-propre. Pas d’ajout d’eau superflue, ce qui concentre les polyphénols. L’équipe technique ADOIO est sur place pour conseiller sur les filtrations. Pesée électronique transparente.',
    recommended: true,
    likesCount: 9,
  },
  {
    id: 'rev-01-3',
    millId: 'mill-01',
    authorName: 'Rachid M.',
    authorRole: 'Producteur Villageois',
    communeOrigin: 'Amalou',
    date: '04 Décembre 2025',
    rating: 4.8,
    serviceRatings: {
      extractionYield: 5,
      turnaroundTime: 4,
      hygiene: 5,
      reception: 5,
    },
    volumeBroughtQuintals: 30,
    varietyBrought: 'Bouchouk & Chemlal',
    comment: 'Très sérieux et organisés. Les caisses ajourées sont déchargées sans attente. L’huile obtenue est limpide et très fruitée avec des notes d’artichaut.',
    recommended: true,
    likesCount: 6,
  },

  // mill-02: Domaine Oléicole & Moulin d'Akbou
  {
    id: 'rev-02-1',
    millId: 'mill-02',
    authorName: 'Slimane Belkacemi',
    authorRole: 'Oléiculteur Récoltant',
    communeOrigin: 'Akbou',
    date: '18 Décembre 2025',
    rating: 5,
    serviceRatings: {
      extractionYield: 5,
      turnaroundTime: 5,
      hygiene: 5,
      reception: 5,
    },
    volumeBroughtQuintals: 65,
    varietyBrought: 'Chemlal de Kabylie',
    comment: 'Le moulin d’Akbou est une référence dans la moyenne Soummam. Prise en charge impeccable le matin même de la cueillette. Séparation rigoureuse des lots biologiques. Rendement de 19,2 L/qx.',
    recommended: true,
    likesCount: 11,
  },
  {
    id: 'rev-02-2',
    millId: 'mill-02',
    authorName: 'Farid Oulmokhtar',
    authorRole: 'Coopérateur Agricole',
    communeOrigin: 'Tazmalt',
    date: '05 Janvier 2026',
    rating: 4.7,
    serviceRatings: {
      extractionYield: 5,
      turnaroundTime: 4,
      hygiene: 5,
      reception: 5,
    },
    volumeBroughtQuintals: 40,
    varietyBrought: 'Bouchouk El Ghalia',
    comment: 'Processus très rigoureux, les bacs d’effeuillage et de lavage à l’eau claire éliminent poussières et brindilles. Mon huile a obtenu la note A en dégustation sensorielle.',
    recommended: true,
    likesCount: 7,
  },

  // mill-03: Huilerie Traditionnelle El-Baraka de Sidi Aïch
  {
    id: 'rev-03-1',
    millId: 'mill-03',
    authorName: 'Arezki Haddadi',
    authorRole: 'Oléiculteur Traditionnel (Arbres centenaires)',
    communeOrigin: 'Leflaye / Sidi Aïch',
    date: '20 Décembre 2025',
    rating: 4.6,
    serviceRatings: {
      extractionYield: 4,
      turnaroundTime: 4,
      hygiene: 4,
      reception: 5,
    },
    volumeBroughtQuintals: 22,
    varietyBrought: 'Aberkane Noire',
    comment: 'Pour les amoureux de la véritable huile douce kabyle d’antan, le broyage lent aux meules de granit en pierre naturelle est irremplaçable. Pas de chauffe violente, parfum authentique de pâte d’olive.',
    recommended: true,
    likesCount: 15,
  },
  {
    id: 'rev-03-2',
    millId: 'mill-03',
    authorName: 'Karim Bouzid',
    authorRole: 'Producteur Particulier',
    communeOrigin: 'Tinebdar',
    date: '10 Janvier 2026',
    rating: 4.4,
    serviceRatings: {
      extractionYield: 4,
      turnaroundTime: 4,
      hygiene: 4,
      reception: 5,
    },
    volumeBroughtQuintals: 15,
    varietyBrought: 'Chemlal & Aberkane',
    comment: 'Da Mouloud perpétue un savoir-faire familial précieux. Les scourtins sont bien nettoyés entre chaque pressée. Un peu d’attente le week-end car très demandé.',
    recommended: true,
    likesCount: 8,
  },

  // mill-04: Coopérative Oléicole de Tazmalt
  {
    id: 'rev-04-1',
    millId: 'mill-04',
    authorName: 'Djamel Messaoi',
    authorRole: 'Coopérateur Villageois',
    communeOrigin: 'Boudjellil',
    date: '22 Décembre 2025',
    rating: 4.8,
    serviceRatings: {
      extractionYield: 5,
      turnaroundTime: 4,
      hygiene: 5,
      reception: 5,
    },
    volumeBroughtQuintals: 38,
    varietyBrought: 'Chemlal & Limli',
    comment: 'Excellent esprit d’entraide (Tiwizi). Tarifs de pressage très avantageux pour les adhérents. Mise à disposition de caisses de transport ajourées et analyse d’acidité gratuite sur échantillon.',
    recommended: true,
    likesCount: 12,
  },

  // mill-05: Huilerie des Frères Ould-Ali (Ouzellaguen)
  {
    id: 'rev-05-1',
    millId: 'mill-05',
    authorName: 'Nassima Cherif',
    authorRole: 'Exploitante Oléicole Bio',
    communeOrigin: 'Ighzer Amokrane',
    date: '15 Décembre 2025',
    rating: 5,
    serviceRatings: {
      extractionYield: 5,
      turnaroundTime: 5,
      hygiene: 5,
      reception: 5,
    },
    volumeBroughtQuintals: 55,
    varietyBrought: 'Chemlal Biologique',
    comment: 'Ligne Alfa Laval 3 phases ultra-moderne. Le séparateur centrifuge tourne à la perfection sans ajout d’eau chaude. Cuves de repos en inox avec purge d’azote. Résultat : huile Vierge Extra d’une pureté exceptionnelle.',
    recommended: true,
    likesCount: 10,
  },

  // mill-07: Agro-Huile Soummam (El Kseur)
  {
    id: 'rev-07-1',
    millId: 'mill-07',
    authorName: 'Tahar Benkhellat',
    authorRole: 'Grand Verger Pluvial',
    communeOrigin: 'El Kseur',
    date: '10 Décembre 2025',
    rating: 4.7,
    serviceRatings: {
      extractionYield: 5,
      turnaroundTime: 5,
      hygiene: 5,
      reception: 4,
    },
    volumeBroughtQuintals: 110,
    varietyBrought: 'Chemlal Soummam',
    comment: 'Cadence de trituration impressionnante (90 quintaux/jour). Idéal pour les gros tonnages afin d’éviter l’entassement des sacs. Laboratoire d’analyse de la teneur en eau et acidité très pro.',
    recommended: true,
    likesCount: 8,
  },

  // mill-08: Huilerie des Crêtes d'Adekar
  {
    id: 'rev-08-1',
    millId: 'mill-08',
    authorName: 'Lounes Ait-Ouarab',
    authorRole: 'Oléiculteur de Haute Montagne',
    communeOrigin: 'Adekar (900m)',
    date: '02 Janvier 2026',
    rating: 5,
    serviceRatings: {
      extractionYield: 5,
      turnaroundTime: 5,
      hygiene: 5,
      reception: 5,
    },
    volumeBroughtQuintals: 28,
    varietyBrought: 'Bouchouk & Chemlal des Babors',
    comment: 'Pressage à basse température avec l’eau pure de source d’Akfadou. Les notes herbacées de thym et d’artichaut de nos olives d’altitude sont parfaitement exaltées. Maître moulinier passionné !',
    recommended: true,
    likesCount: 13,
  }
];

const LOCAL_STORAGE_KEY = 'adoio_bejaia_mill_reviews_v1';

/**
 * Récupère tous les avis (initial + stockés localement)
 */
export function getStoredReviews(): MillReview[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return INITIAL_MILL_REVIEWS;
    const userReviews: MillReview[] = JSON.parse(raw);
    
    // Merge user reviews with initial reviews (user reviews take priority by id)
    const combined = [...userReviews];
    for (const initRev of INITIAL_MILL_REVIEWS) {
      if (!combined.some(r => r.id === initRev.id)) {
        combined.push(initRev);
      }
    }
    return combined;
  } catch {
    return INITIAL_MILL_REVIEWS;
  }
}

/**
 * Ajoute un nouvel avis déposé par un producteur
 */
export function addProducerReview(newReview: Omit<MillReview, 'id' | 'date' | 'likesCount'>): MillReview {
  const reviews = getStoredReviews();
  
  const created: MillReview = {
    ...newReview,
    id: `user-rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    date: new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date()),
    likesCount: 0,
  };

  const updated = [created, ...reviews];
  
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save mill review to localStorage', err);
  }

  return created;
}

/**
 * Vote utile (like) pour un avis
 */
export function toggleReviewHelpful(reviewId: string): boolean {
  try {
    const helpfulKey = `adoio_review_liked_${reviewId}`;
    const alreadyLiked = localStorage.getItem(helpfulKey) === 'true';
    const reviews = getStoredReviews();
    
    const updated = reviews.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          likesCount: alreadyLiked ? Math.max(0, r.likesCount - 1) : r.likesCount + 1
        };
      }
      return r;
    });

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    if (alreadyLiked) {
      localStorage.removeItem(helpfulKey);
      return false;
    } else {
      localStorage.setItem(helpfulKey, 'true');
      return true;
    }
  } catch {
    return false;
  }
}

/**
 * Calcule les statistiques complètes d'un moulin
 */
export function calculateMillStats(millId: string, allReviews: MillReview[]): MillStats {
  const millReviews = allReviews.filter(r => r.millId === millId);
  
  if (millReviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      recommendationPercentage: 100,
      ratingsBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      criteriaAverages: {
        extractionYield: 0,
        turnaroundTime: 0,
        hygiene: 0,
        reception: 0,
      }
    };
  }

  const total = millReviews.length;
  const sumRating = millReviews.reduce((acc, r) => acc + r.rating, 0);
  const recommendedCount = millReviews.filter(r => r.recommended).length;

  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  millReviews.forEach(r => {
    const rounded = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    breakdown[rounded] = (breakdown[rounded] || 0) + 1;
  });

  const criteriaSums = millReviews.reduce((acc, r) => ({
    extractionYield: acc.extractionYield + (r.serviceRatings?.extractionYield || r.rating),
    turnaroundTime: acc.turnaroundTime + (r.serviceRatings?.turnaroundTime || r.rating),
    hygiene: acc.hygiene + (r.serviceRatings?.hygiene || r.rating),
    reception: acc.reception + (r.serviceRatings?.reception || r.rating),
  }), { extractionYield: 0, turnaroundTime: 0, hygiene: 0, reception: 0 });

  return {
    averageRating: Math.round((sumRating / total) * 10) / 10,
    totalReviews: total,
    recommendationPercentage: Math.round((recommendedCount / total) * 100),
    ratingsBreakdown: breakdown,
    criteriaAverages: {
      extractionYield: Math.round((criteriaSums.extractionYield / total) * 10) / 10,
      turnaroundTime: Math.round((criteriaSums.turnaroundTime / total) * 10) / 10,
      hygiene: Math.round((criteriaSums.hygiene / total) * 10) / 10,
      reception: Math.round((criteriaSums.reception / total) * 10) / 10,
    }
  };
}
