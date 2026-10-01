import { icons } from '../src/icons.js';

const nav = [
  { label: 'Plateforme', href: '#plateforme' },
  { label: 'Modules', href: '#modules' },
  { label: 'Méthode', href: '#methode' },
  { label: 'Anomalies', href: '#anomalies' },
  { label: 'Tarifs', href: '#tarifs' },
  { label: 'FAQ', href: '#faq' }
];

const clients = [
  'Groupe Helios',
  'Cabinet LVF',
  'Industrie Précision',
  'Nexum Retail',
  'Altior Conseil',
  'Transalpine Logistique',
  'Studio Vertigo',
  'Finor Partners'
];

const features = [
  {
    icon: 'folder',
    title: 'Centralisation des comptes annuels',
    text: "Un référentiel unique pour vos bilans, comptes de résultat et annexes. Import des fichiers FECF/AGREP, des FEC, des balances et des pièces justificatives, sans ressaisie.",
    metric: '6 formats acceptés'
  },
  {
    icon: 'calculator',
    title: 'Calculs automatisés',
    text: "Amortissements, provisions, taxes différées, capitaux propres, consolidation : chaque calcul est tracé, recalculé et documenté en permanence.",
    metric: 'Zéro ressaisie'
  },
  {
    icon: 'file',
    title: 'Rapports générés',
    text: "Annexes, liasse fiscale, pistes d'audit et rapports de gestion générés en un clic, alignés sur le référentiel comptable applicable.",
    metric: '12 modèles'
  },
  {
    icon: 'percent',
    title: 'Analyse de la performance',
    text: "Marge, besoin en fonds de roulement, capacité de remboursement, ratios sectoriels et écarts par rapport à N-1, lisibles par un dirigeant.",
    metric: '40+ ratios'
  },
  {
    icon: 'sparkles',
    title: 'Prévisions par Machine Learning',
    text: "Le modèle apprend de vos historiques et de vos saisonnalités pour projeter la trésorerie, la marge et le résultat sur 12 à 24 mois.",
    metric: 'Horizon 24 mois'
  },
  {
    icon: 'cpu',
    title: 'Détection d’anomalies',
    text: "Écarts inhabituels, doublons, écritures de fin d'exercice tardives et ratios hors norme sont signalés avec un score de confiance.",
    metric: 'Score de confiance'
  }
];

const steps = [
  {
    number: '01',
    title: 'Connectez vos sources',
    text: "Importez vos fichiers comptables et vos exports ERP, ou connectez l'API pour une synchronisation continue."
  },
  {
    number: '02',
    title: 'Consolidez et calculez',
    text: 'Les postes sont rapprochés, les écritures contrôlées et les états financiers générés automatiquement.'
  },
  {
    number: '03',
    title: 'Analysez et comparez',
    text: 'Ratios, écarts et référentiels sectoriels sont calculés, puis les prévisions et les anomalies produites en continu.'
  },
  {
    number: '04',
    title: 'Décidez et suivez',
    text: "Tableaux de bord, alertes et rapports exportables accompagnent vos décisions et vos clôtures."
  }
];

const anomalies = [
  {
    severity: 'high',
    label: 'Écriture manuelle hors période',
    text: "Journal 691, fournisseur « Nova Services » : 184 000 € comptabilisés au 31/12 alors que la facture est du 14/11.",
    confidence: '94 %'
  },
  {
    severity: 'medium',
    label: 'Marge brute en rupture',
    text: "Marge de la ligne « Distribution » à 22,4 % contre 34,8 % en N-1, sur trois mois consécutifs.",
    confidence: '87 %'
  },
  {
    severity: 'medium',
    label: 'Doublon sur les frais généraux',
    text: 'Deux factures de même montant, pour le même fournisseur, à onze jours d’intervalle.',
    confidence: '81 %'
  },
  {
    severity: 'low',
    label: 'Compte de trésorerie atypique',
    text: "Baisse du solde bancaire de 12 % alors que le budget prévoyait une hausse de 4 % sur la période.",
    confidence: '68 %'
  }
];

const security = [
  {
    icon: 'lock',
    title: 'Chiffrement de bout en bout',
    text: 'AES-256 au repos, TLS 1.3 en transit, clés gérées hors de la base applicative.'
  },
  {
    icon: 'database',
    title: 'Hébergement dans l’UE',
    text: 'Données hébergées dans l’Union européenne, sauvegardes quotidiennes chiffrées.'
  },
  {
    icon: 'users',
    title: 'Contrôle des accès',
    text: 'Rôles, validation à quatre yeux et journalisation inaltérable de chaque consultation.'
  },
  {
    icon: 'scale',
    title: 'Conformité RGPD',
    text: 'Registre des traitements, DPA, réversibilité complète et droit à l’effacement.'
  }
];

const testimonials = [
  {
    quote:
      'La clôture de notre exercice est passée de trois semaines à quatre jours. Les contrôles sont documentés et les anomalies remontent avant la revue.',
    initials: 'NB',
    name: 'Nadia Benali',
    role: 'Directrice administrative et financière · Groupe Helios'
  },
  {
    quote:
      'En tant que cabinet, nous remettons à chaque client un dossier financier prêt à l’emploi. La consolidation multi-entités est devenue un réflexe.',
    initials: 'TL',
    name: 'Thomas Leclerc',
    role: 'Associé-expert-comptable · Cabinet LVF'
  },
  {
    quote:
      'Les prévisions de trésorerie nous ont permis de décaler un investissement de deux mois sans tension. Les alertes arrivent au bon moment.',
    initials: 'SM',
    name: 'Sofia Marchetti',
    role: 'Directrice financière · Industrie Précision'
  }
];

const plans = [
  {
    name: 'Essai',
    slug: 'essai',
    tagline: 'Pour valider le workflow sur un exercice.',
    priceMonthly: '0',
    priceYearly: '0',
    unit: '€ / mois',
    featured: false,
    cta: 'Créer un compte',
    features: [
      'Une société, un exercice',
      'Import FEC et balance',
      'Compte de résultat et bilan',
      'Cinq ratios clés',
      'Export PDF des états'
    ]
  },
  {
    name: 'Direction financière',
    slug: 'direction-financiere',
    tagline: 'Pour piloter une PME multi-exercices.',
    priceMonthly: '149',
    priceYearly: '119',
    unit: '€ / mois',
    featured: true,
    flag: 'Le plus choisi',
    cta: 'Démarrer l’essai de 14 jours',
    features: [
      'Sociétés et exercices illimités',
      'Consolidation et liasse fiscale',
      'Tableaux de bord et 40+ ratios',
      'Prévisions sur 12 mois',
      'Détection d’anomalies',
      'Support sous 4 h'
    ]
  },
  {
    name: 'Cabinet',
    slug: 'cabinet',
    tagline: 'Pour industrialiser vos missions récurrentes.',
    priceMonthly: '449',
    priceYearly: '359',
    unit: '€ / mois',
    featured: false,
    cta: 'Parler à un conseiller',
    features: [
      'Tout le plan Direction financière',
      'Portfolios clients et espaces de revue',
      'Workflow de validation et pistes d’audit',
      'Prévisions sur 24 mois',
      'Marquage blanc des rapports',
      'API et export ERP'
    ]
  }
];

const faq = [
  {
    q: 'Quels formats pouvez-vous importer ?',
    a: "FECF/AGREP, FEC, balance générale et analytique, journaux d'écritures, grand livre, liasse fiscale et exports ERP au format CSV ou XLSX. Un connecteur API est disponible pour les cabinets."
  },
  {
    q: 'Comment les modèles de prévision sont-ils construits ?',
    a: "Les modèles s'appuient sur vos historiques consolidés, corrigés des saisonnalités et des événements de fin d'exercice. Chaque projection est accompagnée de son intervalle de confiance et des variables qui la pilotent."
  },
  {
    q: 'Que détecte réellement le module d’anomalies ?',
    a: "Écritures de fin d'exercice tardives, doublons de factures, incohérences de comptabilisation, ratios hors norme, écarts budgétaires inexpliqués et variations anormales de trésorerie. Chaque alerte est notée par un score de confiance."
  },
  {
    q: 'Nos données restent-elles confidentielles ?',
    a: "Les données sont hébergées dans l'Union européenne, chiffrées au repos et en transit. Aucune donnée client n'est utilisée pour entraîner un modèle partagé : votre historique sert uniquement à vos prévisions."
  },
  {
    q: 'Combien de temps pour être opérationnel ?',
    a: "Comptez une demi-journée pour le premier import (FEC ou grand livre). La première clôture complète est généralement disponible sous 48 heures, accompagnée d'un rapport de contrôle."
  },
  {
    q: 'Pouvons-nous garder notre référentiel actuel ?',
    a: "Oui. SmartFinance AI se branche sur l'existant : il ingère, contrôle et restitue sans remplacer votre plan comptable ni votre outil de production. L'export reste disponible à tout moment."
  }
];

export const renderHome = (req, res) => {
  res.render('home', {
    description:
      'Plateforme web pour entreprises, cabinets d’expertise comptable et directions financières : centralisation des comptes annuels, automatisation des calculs et rapports, analyse de la performance, prévisions et détection d’anomalies par Machine Learning.',
    nav,
    clients,
    features,
    steps,
    anomalies,
    security,
    testimonials,
    plans,
    faq,
    icons,
    currentPath: req.path
  });
};