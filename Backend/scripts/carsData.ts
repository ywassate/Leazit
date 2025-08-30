// src/types.ts

export interface CarType {
  id: string;
  name: string;
  brandId: string;
  image: string;
  gallery: string[];
  category: string;
  transmission: string;
  fuel: string;
  seats: number;
  features: string[];
  available: boolean;
  description: string;
  
  // Nouveaux champs pour l'abonnement
  subscriptionOptions?: {
    engagement: {
      months: number;
      monthlyPrice: number;
      label?: string;
    }[];
    mileage: {
      km: number;
      additionalPrice: number;
      label?: string;
    }[];
    insurance: {
      type: string;
      franchiseAmount: number;
      additionalPrice: number;
      label?: string;
    }[];
    additionalDriverPrice?: number; // Prix par conducteur additionnel
  };
}



 export const cars = [
  {
    id: "peugeot-208",
    name: "Peugeot 208",
    brandId: "peugeot",
    image: "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65c2680c136f1a6db5d165cf_Peugeot%20208%20-%203.webp",
    gallery: [
      'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65c267e50fb3ee53c676126e_Peugeot%20208%20-%201.webp',
      'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65c2680ce059309a78f0ea9b_Peugeot%20208%20-%204.webp',
      'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65c2680c8f11068f212f1352_Peugeot%20208%20-%206.webp',
      'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65c2680c427f374c2d7423ff_Peugeot%20208%20-%207.webp',
    ],
    category: "compact",
    transmission: "Automatique",
    fuel: "Essence",
    seats: 5,
    features: ["Air conditionné", "Bluetooth", "GPS"],
    price: 2500,
    longTermPrice: 2000,
    available: true,
    description: "Citadine élégante, parfaite pour la ville et les déplacements courts.",
    
    // Options d'abonnement spécifiques à cette voiture
    subscriptionOptions: {
      engagement: [
        { months: 6, monthlyPrice: 420 },
        { months: 3, monthlyPrice: 450 },
        { months: 0, monthlyPrice: 480, label: "Sans engagement" }
      ],
      mileage: [
        { km: 800, additionalPrice: 0, label: "Compris" },
        { km: 1000, additionalPrice: 9.99 },
        { km: 1250, additionalPrice: 14.99 },
        { km: 1500, additionalPrice: 43.99 },
        { km: 2000, additionalPrice: 109.99 },
        { km: 2500, additionalPrice: 175.99 }
      ],
      insurance: [
        { 
          type: "ASSURANCE TOUS RISQUES", 
          franchiseAmount: 1100, 
          additionalPrice: 0, 
          label: "Compris" 
        },
        { 
          type: "ASSURANCE TOUS RISQUES PLUS", 
          franchiseAmount: 150, 
          additionalPrice: 100 
        }
      ],
      additionalDriverPrice: 12
    }
  },
  {
    id: "peugeot-2008",
    name: "Peugeot 2008",
    brandId: "peugeot",
    image: "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac58e9f76385678426e1a0_2008-%201%20-%20Modifie%CC%81.webp",
    gallery: [
    'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac58e9f76385678426e1a0_2008-%201%20-%20Modifie%CC%81.webp',
    'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bace758f511d506a7b71c1_2008-%202%20-%20Modifie%CC%81.webp',
    'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bace7516c073d5f8582390_2008-%203%20-%20Modifie%CC%81.webp',
    'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bace754b1e538c50bb68af_2008-%204%20-%20Modifie%CC%81.webp',
    'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bace757e79b40027cae259_2008-5%20-%20Modifie%CC%81.webp',
    'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bace7535232b4161e15e9e_2008-7.webp',
    'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bace75bdc8e21096da6e04_2008-8%20-%20Modifie%CC%81.webp',
    'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bace75566732c0104743c9_2008-9%20-%20Modifie%CC%81.webp'
  ],
    category: "mini-suv",
    transmission: "Automatique",
    fuel: "Essence",
    seats: 5,
    features: ["Toit panoramique", "Écran tactile", "Bluetooth"],
    available: true,
    description: "SUV raffiné avec technologies avancées, idéal pour les professionnels.",
    // Options d'abonnement spécifiques à cette voiture
    subscriptionOptions: {
      engagement: [
        { months: 6, monthlyPrice: 420 },
        { months: 3, monthlyPrice: 450 },
        { months: 0, monthlyPrice: 480, label: "Sans engagement" }
      ],
      mileage: [
        { km: 800, additionalPrice: 0, label: "Compris" },
        { km: 1000, additionalPrice: 9.99 },
        { km: 1250, additionalPrice: 14.99 },
        { km: 1500, additionalPrice: 43.99 },
        { km: 2000, additionalPrice: 109.99 },
        { km: 2500, additionalPrice: 175.99 }
      ],
      insurance: [
        { 
          type: "ASSURANCE TOUS RISQUES", 
          franchiseAmount: 1100, 
          additionalPrice: 0, 
          label: "Compris" 
        },
        { 
          type: "ASSURANCE TOUS RISQUES PLUS", 
          franchiseAmount: 150, 
          additionalPrice: 100 
        }
      ],
      additionalDriverPrice: 12
    }
  },
  {
    id: "peugeot-3008",
    name: "Peugeot 3008",
    brandId: "peugeot",
    image: "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65f08f1497545591640b870b_Peugeot%203008%201.webp",
    gallery: [
    'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65f08f0b50265088c6843f32_3008%20-%202.webp',
    'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65f08f1497545591640b870b_Peugeot%203008%201.webp',
    'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65f08f14b07314ad2a9c829a_3008%20-%203.webp',
    'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65f08db1570390dc3d2d329a_Intérieur.webp',
  ],
    category: "suv",
    transmission: "Automatique",
    fuel: "Essence",
    seats: 5,
    features: ["GPS", "Bluetooth", "Radar de recul"],
    available: true,
    description: "SUV familial 7 places, confort et modularité pour les longues distances.",
    // Options d'abonnement spécifiques à cette voiture
    subscriptionOptions: {
      engagement: [
        { months: 6, monthlyPrice: 420 },
        { months: 3, monthlyPrice: 450 },
        { months: 0, monthlyPrice: 480, label: "Sans engagement" }
      ],
      mileage: [
        { km: 800, additionalPrice: 0, label: "Compris" },
        { km: 1000, additionalPrice: 9.99 },
        { km: 1250, additionalPrice: 14.99 },
        { km: 1500, additionalPrice: 43.99 },
        { km: 2000, additionalPrice: 109.99 },
        { km: 2500, additionalPrice: 175.99 }
      ],
      insurance: [
        { 
          type: "ASSURANCE TOUS RISQUES", 
          franchiseAmount: 1100, 
          additionalPrice: 0, 
          label: "Compris" 
        },
        { 
          type: "ASSURANCE TOUS RISQUES PLUS", 
          franchiseAmount: 150, 
          additionalPrice: 100 
        }
      ],
      additionalDriverPrice: 12
    }
  },

  // RENAULT
  {
    id: "renault-clio",
    name: "Renault Clio",
    brandId: "renault",
    image: "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac5673a76a2cf0287c5ec6_Clio-V-1%20-%20modifie%CC%81.webp",
    gallery : [
      'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac5673a76a2cf0287c5ec6_Clio-V-1%20-%20modifie%CC%81.webp',
      'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65baca482f54daa98e61c0ab_Clio-V-%203%20-%20modifie%CC%81.webp',
      'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65baca48c77ef10865937241_Clio-V-%204%20-%20modifie%CC%81.webp',
    ],
    category: "compact",
    transmission: "Manuelle",
    fuel: "Diesel",
    seats: 5,
    features: ["Caméra de recul", "Bluetooth", "Régulateur"],
    available: true,
    description: "Compacte agile et économique, idéale pour un usage quotidien.",
    // Options d'abonnement spécifiques à cette voiture
    subscriptionOptions: {
      engagement: [
        { months: 6, monthlyPrice: 420 },
        { months: 3, monthlyPrice: 450 },
        { months: 0, monthlyPrice: 480, label: "Sans engagement" }
      ],
      mileage: [
        { km: 800, additionalPrice: 0, label: "Compris" },
        { km: 1000, additionalPrice: 9.99 },
        { km: 1250, additionalPrice: 14.99 },
        { km: 1500, additionalPrice: 43.99 },
        { km: 2000, additionalPrice: 109.99 },
        { km: 2500, additionalPrice: 175.99 }
      ],
      insurance: [
        { 
          type: "ASSURANCE TOUS RISQUES", 
          franchiseAmount: 1100, 
          additionalPrice: 0, 
          label: "Compris" 
        },
        { 
          type: "ASSURANCE TOUS RISQUES PLUS", 
          franchiseAmount: 150, 
          additionalPrice: 100 
        }
      ],
      additionalDriverPrice: 12
    }
  },
  {
  id: "renault-austral",
  name: "Renault Austral",
  brandId: "renault",
  image: "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac554109a8adaf7d41cf32_RENAULT%20AUSTRAL%201.webp",
  gallery: [
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac554109a8adaf7d41cf32_RENAULT%20AUSTRAL%201.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac969e30c6491b26fadab_RENAULT%20AUSTRAL%202.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac9695aa58de979a24f67_RENAULT%20AUSTRAL%206.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac969d6a8abe213e8eb73_RENAULT%20AUSTRAL%2011.webp"
  ],
  category: "mini-suv",
  transmission: "Automatique",
  fuel: "Essence",
  seats: 5,
  features: ["Multisense", "Grand écran", "Caméra 360°"],
  available: true,
  description: "SUV spacieux avec technologies embarquées de dernière génération.",
  // Options d'abonnement spécifiques à cette voiture
    subscriptionOptions: {
      engagement: [
        { months: 6, monthlyPrice: 420 },
        { months: 3, monthlyPrice: 450 },
        { months: 0, monthlyPrice: 480, label: "Sans engagement" }
      ],
      mileage: [
        { km: 800, additionalPrice: 0, label: "Compris" },
        { km: 1000, additionalPrice: 9.99 },
        { km: 1250, additionalPrice: 14.99 },
        { km: 1500, additionalPrice: 43.99 },
        { km: 2000, additionalPrice: 109.99 },
        { km: 2500, additionalPrice: 175.99 }
      ],
      insurance: [
        { 
          type: "ASSURANCE TOUS RISQUES", 
          franchiseAmount: 1100, 
          additionalPrice: 0, 
          label: "Compris" 
        },
        { 
          type: "ASSURANCE TOUS RISQUES PLUS", 
          franchiseAmount: 150, 
          additionalPrice: 100 
        }
      ],
      additionalDriverPrice: 12
    }
},


  // TOYOTA
  {
    id: "toyota-yaris-hybride",
    name: "Toyota Yaris Hybride",
    brandId: "toyota",
    image: "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac5421a76a2cf0287b3b82_TOYOTA%20YARIS%201%20-%20modifie%CC%81.webp",
    gallery : [
      'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac85def588cb3951cb586_TOYOTA%20YARIS%2013%20-%20modifie%CC%81.webp',
      'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac5421a76a2cf0287b3b82_TOYOTA%20YARIS%201%20-%20modifie%CC%81.webp',
      'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac85df3ea68bb42975f8d_TOYOTA%20YARIS%207%20-%20modifie%CC%81.webp',
      'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac85d124ae4166b617cac_TOYOTA%20YARIS%208%20-%20modifie%CC%81.webp',
    ],
    category: "compact",
    transmission: "Automatique",
    fuel: "Essence",
    seats: 5,
    features: ["Air conditionné", "Bluetooth"],
    available: true,
    description: "Hybride urbaine, économique et écologique.",
    // Options d'abonnement spécifiques à cette voiture
    subscriptionOptions: {
      engagement: [
        { months: 6, monthlyPrice: 420 },
        { months: 3, monthlyPrice: 450 },
        { months: 0, monthlyPrice: 480, label: "Sans engagement" }
      ],
      mileage: [
        { km: 800, additionalPrice: 0, label: "Compris" },
        { km: 1000, additionalPrice: 9.99 },
        { km: 1250, additionalPrice: 14.99 },
        { km: 1500, additionalPrice: 43.99 },
        { km: 2000, additionalPrice: 109.99 },
        { km: 2500, additionalPrice: 175.99 }
      ],
      insurance: [
        { 
          type: "ASSURANCE TOUS RISQUES", 
          franchiseAmount: 1100, 
          additionalPrice: 0, 
          label: "Compris" 
        },
        { 
          type: "ASSURANCE TOUS RISQUES PLUS", 
          franchiseAmount: 150, 
          additionalPrice: 100 
        }
      ],
      additionalDriverPrice: 12
    }
  },
  {
  id: "audi-a3",
  name: "Audi A3",
  brandId: "audi",
  image: "https://www.audi.fr/content/dam/nemo/models/a3/a3-sportback/my-2025/NeMo-Derivate-StartPage/1920x1080-AA3_SB_232009.jpg",
  gallery: [
    "https://www.audi.fr/content/dam/nemo/models/a3/a3-sportback/my-2025/NeMo-Derivate-StartPage/1920x1080-AA3_SB_232009.jpg",
    "https://www.audi.fr/content/dam/nemo/models/a3/a3-sportback/my-2025/NeMo-Derivate-StartPage/1920x1080-AA3_232005.jpg",
    "https://www.audi.fr/content/dam/nemo/models/a3/a3-sportback/my-2025/NeMo-Derivate-StartPage/1920x1080-AA3_232008.jpg"
  ],
  category: "compact",
  transmission: "Automatique",
  fuel: "Essence",
  seats: 5,
  features: ["Virtual Cockpit", "Air conditionné", "Bluetooth"],
  available: true,
  description: "Compacte premium au design sportif et intérieur raffiné.",
  subscriptionOptions: {
    engagement: [
      { months: 6, monthlyPrice: 560 },
      { months: 3, monthlyPrice: 590 },
      { months: 0, monthlyPrice: 630, label: "Sans engagement" }
    ],
    mileage: [
      { km: 800, additionalPrice: 0, label: "Compris" },
      { km: 1000, additionalPrice: 14.99 },
      { km: 1500, additionalPrice: 49.99 },
      { km: 2000, additionalPrice: 109.99 }
    ],
    insurance: [
      { type: "ASSURANCE TOUS RISQUES", franchiseAmount: 1100, additionalPrice: 0, label: "Compris" },
      { type: "ASSURANCE TOUS RISQUES PLUS", franchiseAmount: 150, additionalPrice: 120 }
    ],
    additionalDriverPrice: 14
  }
},
{
  id: "audi-q2",
  name: "Audi Q2",
  brandId: "audi",
  image: "https://www.audi.fr/content/dam/nemo/models/q2/q2/my-2024/NeMo-Derivate-StartPage/1920x1080-AQ2_232004.jpg",
  gallery: [
    "https://www.audi.fr/content/dam/nemo/models/q2/q2/my-2024/NeMo-Derivate-StartPage/1920x1080-AQ2_232004.jpg",
    "https://www.audi.fr/content/dam/nemo/models/q2/q2/my-2024/NeMo-Derivate-StartPage/1920x1080-AQ2_232006.jpg",
    "https://www.audi.fr/content/dam/nemo/models/q2/q2/my-2024/NeMo-Derivate-StartPage/1920x1080-AQ2_232008.jpg"
  ],
  category: "mini-suv",
  transmission: "Automatique",
  fuel: "Essence",
  seats: 5,
  features: ["Air conditionné", "Apple CarPlay", "Bluetooth"],
  available: true,
  description: "Mini SUV design et agile, idéal pour la ville.",
  subscriptionOptions: {
    engagement: [
      { months: 6, monthlyPrice: 590 },
      { months: 3, monthlyPrice: 620 },
      { months: 0, monthlyPrice: 660, label: "Sans engagement" }
    ],
    mileage: [
      { km: 800, additionalPrice: 0, label: "Compris" },
      { km: 1000, additionalPrice: 19.99 },
      { km: 1500, additionalPrice: 59.99 },
      { km: 2000, additionalPrice: 129.99 }
    ],
    insurance: [
      { type: "ASSURANCE TOUS RISQUES", franchiseAmount: 1100, additionalPrice: 0, label: "Compris" },
      { type: "ASSURANCE TOUS RISQUES PLUS", franchiseAmount: 150, additionalPrice: 130 }
    ],
    additionalDriverPrice: 15
  }
},
{
  id: "audi-q5",
  name: "Audi Q5",
  brandId: "audi",
  image: "https://www.audi.fr/content/dam/nemo/models/q5/q5/my-2025/NeMo-Derivate-StartPage/1920x1080-AQ5_232004.jpg",
  gallery: [
    "https://www.audi.fr/content/dam/nemo/models/q5/q5/my-2025/NeMo-Derivate-StartPage/1920x1080-AQ5_232004.jpg",
    "https://www.audi.fr/content/dam/nemo/models/q5/q5/my-2025/NeMo-Derivate-StartPage/1920x1080-AQ5_232006.jpg",
    "https://www.audi.fr/content/dam/nemo/models/q5/q5/my-2025/NeMo-Derivate-StartPage/1920x1080-AQ5_232008.jpg"
  ],
  category: "suv",
  transmission: "Automatique",
  fuel: "Hybride",
  seats: 5,
  features: ["Intérieur cuir", "GPS", "Bluetooth", "Caméra 360°"],
  available: true,
  description: "SUV polyvalent et confortable avec des motorisations efficientes.",
  subscriptionOptions: {
    engagement: [
      { months: 6, monthlyPrice: 690 },
      { months: 3, monthlyPrice: 720 },
      { months: 0, monthlyPrice: 770, label: "Sans engagement" }
    ],
    mileage: [
      { km: 800, additionalPrice: 0, label: "Compris" },
      { km: 1000, additionalPrice: 29.99 },
      { km: 1500, additionalPrice: 69.99 },
      { km: 2000, additionalPrice: 149.99 }
    ],
    insurance: [
      { type: "ASSURANCE TOUS RISQUES", franchiseAmount: 1100, additionalPrice: 0, label: "Compris" },
      { type: "ASSURANCE TOUS RISQUES PLUS", franchiseAmount: 150, additionalPrice: 150 }
    ],
    additionalDriverPrice: 16
  }
},
{
  id: "mercedes-classe-a",
  name: "Mercedes Classe A",
  brandId: "mercedes",
  image: "https://www.mercedes-benz.fr/passengercars/mercedes-benz-cars/models/a-class/hatchback-w177-fl/explore/highlights/_jcr_content/root/stage/par/stageitem/image/MQ6-12-image-20230512084737/01-mercedes-benz-a-class-hatchback-v177-fl-exterior-front-view-night-3400x1440.jpeg",
  gallery: [
    "https://www.mercedes-benz.fr/passengercars/mercedes-benz-cars/models/a-class/hatchback-w177-fl/explore/highlights/_jcr_content/root/stage/par/stageitem/image/MQ6-12-image-20230512084737/01-mercedes-benz-a-class-hatchback-v177-fl-exterior-front-view-night-3400x1440.jpeg",
    "https://www.mercedes-benz.fr/passengercars/mercedes-benz-cars/models/a-class/hatchback-w177-fl/explore/highlights/_jcr_content/root/stage/par/stageitem/image/MQ6-12-image-20230512084738/02-mercedes-benz-a-class-hatchback-v177-fl-exterior-rear-view.jpeg"
  ],
  category: "compact",
  transmission: "Automatique",
  fuel: "Essence",
  seats: 5,
  features: ["MBUX", "Air conditionné", "Bluetooth"],
  available: true,
  description: "Compacte élégante et moderne, parfaite pour le quotidien.",
  subscriptionOptions: {
    engagement: [
      { months: 6, monthlyPrice: 570 },
      { months: 3, monthlyPrice: 600 },
      { months: 0, monthlyPrice: 650, label: "Sans engagement" }
    ],
    mileage: [
      { km: 800, additionalPrice: 0, label: "Compris" },
      { km: 1000, additionalPrice: 19.99 },
      { km: 1500, additionalPrice: 59.99 },
      { km: 2000, additionalPrice: 139.99 }
    ],
    insurance: [
      { type: "ASSURANCE TOUS RISQUES", franchiseAmount: 1100, additionalPrice: 0, label: "Compris" },
      { type: "ASSURANCE TOUS RISQUES PLUS", franchiseAmount: 150, additionalPrice: 120 }
    ],
    additionalDriverPrice: 14
  }
},
{
  id: "mercedes-gla",
  name: "Mercedes GLA",
  brandId: "mercedes",
  image: "https://www.mercedes-benz.fr/passengercars/mercedes-benz-cars/models/gla/suv-h247/explore/highlights/_jcr_content/root/stage/par/stageitem/image/MQ6-12-image-20231030131055/02-mercedes-benz-gla-h247-exterior-front-view-night-3400x1440.jpeg",
  gallery: [
    "https://www.mercedes-benz.fr/passengercars/mercedes-benz-cars/models/gla/suv-h247/explore/highlights/_jcr_content/root/stage/par/stageitem/image/MQ6-12-image-20231030131055/02-mercedes-benz-gla-h247-exterior-front-view-night-3400x1440.jpeg",
    "https://www.mercedes-benz.fr/passengercars/mercedes-benz-cars/models/gla/suv-h247/explore/highlights/_jcr_content/root/stage/par/stageitem/image/MQ6-12-image-20231030131056/03-mercedes-benz-gla-h247-exterior-side.jpeg"
  ],
  category: "mini-suv",
  transmission: "Automatique",
  fuel: "Hybride",
  seats: 5,
  features: ["Apple CarPlay", "Caméra de recul", "Bluetooth"],
  available: true,
  description: "Mini SUV urbain, raffiné et technologique.",
  subscriptionOptions: {
    engagement: [
      { months: 6, monthlyPrice: 610 },
      { months: 3, monthlyPrice: 640 },
      { months: 0, monthlyPrice: 690, label: "Sans engagement" }
    ],
    mileage: [
      { km: 800, additionalPrice: 0, label: "Compris" },
      { km: 1000, additionalPrice: 24.99 },
      { km: 1500, additionalPrice: 69.99 },
      { km: 2000, additionalPrice: 159.99 }
    ],
    insurance: [
      { type: "ASSURANCE TOUS RISQUES", franchiseAmount: 1100, additionalPrice: 0, label: "Compris" },
      { type: "ASSURANCE TOUS RISQUES PLUS", franchiseAmount: 150, additionalPrice: 130 }
    ],
    additionalDriverPrice: 15
  }
},
{
  id: "mercedes-glc",
  name: "Mercedes GLC",
  brandId: "mercedes",
  image: "https://www.mercedes-benz.fr/passengercars/mercedes-benz-cars/models/glc/suv-x254/explore/highlights/_jcr_content/root/stage/par/stageitem/image/MQ6-12-image-20230620111418/03-mercedes-benz-glc-suv-x254-exterior-front-view-silver-3400x1440.jpeg",
  gallery: [
    "https://www.mercedes-benz.fr/passengercars/mercedes-benz-cars/models/glc/suv-x254/explore/highlights/_jcr_content/root/stage/par/stageitem/image/MQ6-12-image-20230620111418/03-mercedes-benz-glc-suv-x254-exterior-front-view-silver-3400x1440.jpeg",
    "https://www.mercedes-benz.fr/passengercars/mercedes-benz-cars/models/glc/suv-x254/explore/highlights/_jcr_content/root/stage/par/stageitem/image/MQ6-12-image-20230620111419/04-mercedes-benz-glc-suv-x254-exterior-side.jpeg"
  ],
  category: "suv",
  transmission: "Automatique",
  fuel: "Hybride",
  seats: 5,
  features: ["Intérieur cuir", "GPS", "Bluetooth", "Caméra 360°"],
  available: true,
  description: "SUV haut de gamme, spacieux et confortable pour toute la famille.",
  subscriptionOptions: {
    engagement: [
      { months: 6, monthlyPrice: 720 },
      { months: 3, monthlyPrice: 750 },
      { months: 0, monthlyPrice: 800, label: "Sans engagement" }
    ],
    mileage: [
      { km: 800, additionalPrice: 0, label: "Compris" },
      { km: 1000, additionalPrice: 29.99 },
      { km: 1500, additionalPrice: 79.99 },
      { km: 2000, additionalPrice: 169.99 }
    ],
    insurance: [
      { type: "ASSURANCE TOUS RISQUES", franchiseAmount: 1100, additionalPrice: 0, label: "Compris" },
      { type: "ASSURANCE TOUS RISQUES PLUS", franchiseAmount: 150, additionalPrice: 150 }
    ],
    additionalDriverPrice: 16
  }
},
{
  id: "landrover-range-rover-sport",
  name: "Range Rover Sport",
  brandId: "landrover",
  image: "/images/cars/landrover-range-rover-sport.jpg",
  gallery: [
  ],
  category: "suv",
  transmission: "Automatique",
  fuel: "Hybride",
  seats: 5,
  features: ["Intérieur cuir", "Suspension pilotée", "Caméra 360°", "Apple CarPlay/Android Auto"],
  available: true,
  description: "SUV premium performant, combinant luxe, technologies et véritables capacités tout-terrain.",
  subscriptionOptions: {
    engagement: [
      { months: 6, monthlyPrice: 990 },
      { months: 3, monthlyPrice: 1040 },
      { months: 0, monthlyPrice: 1090, label: "Sans engagement" }
    ],
    mileage: [
      { km: 800, additionalPrice: 0, label: "Compris" },
      { km: 1000, additionalPrice: 39.99 },
      { km: 1500, additionalPrice: 99.99 },
      { km: 2000, additionalPrice: 199.99 }
    ],
    insurance: [
      { type: "ASSURANCE TOUS RISQUES", franchiseAmount: 1100, additionalPrice: 0, label: "Compris" },
      { type: "ASSURANCE TOUS RISQUES PLUS", franchiseAmount: 150, additionalPrice: 170 }
    ],
    additionalDriverPrice: 18
  }
},


  // SKODA
  {
    id: "skoda-octavia",
    name: "Skoda Octavia",
    brandId: "skoda",
    image: "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65c26969175170ebdbca7d51_SKODA%20OCTAVIA%202%20-modifie%CC%81%20.webp",
    gallery: [
    'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65c2696f6fe0a28f6cf084bd_SKODA%20OCTAVIA%204%20-modifie%CC%81%20.webp',
    'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65c2696f64bc208fc834bb0a_SKODA%20OCTAVIA%205%20-modifie%CC%81%20.webp',
    'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65c2696f88c6400df3115d6a_SKODA%20OCTAVIA%206%20-modifie%CC%81%20.webp',
    'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65c2696f6fe0a28f6cf084c6_SKODA%20OCTAVIA%201-modifie%CC%81%20.webp',
  ],
    category: "compact",
    transmission: "Automatique",
    fuel: "Diesel",
    seats: 5,
    features: ["Radar recul", "Lane Assist", "GPS"],
    available: true,
    description: "Voiture économique et pratique pour la ville.",
    // Options d'abonnement spécifiques à cette voiture
    subscriptionOptions: {
      engagement: [
        { months: 6, monthlyPrice: 420 },
        { months: 3, monthlyPrice: 450 },
        { months: 0, monthlyPrice: 480, label: "Sans engagement" }
      ],
      mileage: [
        { km: 800, additionalPrice: 0, label: "Compris" },
        { km: 1000, additionalPrice: 9.99 },
        { km: 1250, additionalPrice: 14.99 },
        { km: 1500, additionalPrice: 43.99 },
        { km: 2000, additionalPrice: 109.99 },
        { km: 2500, additionalPrice: 175.99 }
      ],
      insurance: [
        { 
          type: "ASSURANCE TOUS RISQUES", 
          franchiseAmount: 1100, 
          additionalPrice: 0, 
          label: "Compris" 
        },
        { 
          type: "ASSURANCE TOUS RISQUES PLUS", 
          franchiseAmount: 150, 
          additionalPrice: 100 
        }
      ],
      additionalDriverPrice: 12
    }
  },
  {
  id: "skoda-kamiq",
  name: "Skoda Kamiq",
  brandId: "skoda",
  image: "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac5466cb3de587af5ae105_Kamiq_1%20-%20MODIFIE%CC%81.webp",
  gallery: [
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac5466cb3de587af5ae105_Kamiq_1%20-%20MODIFIE%CC%81.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac8992db33e3ae6030b7e_Kamiq_2%20-%20MODIFIE%CC%81.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac899a4ca009b42797bbb_Kamiq_3%20-%20MODIFIE%CC%81.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac8992d1c05d299d83ca0_Kamiq_4%20-%20MODIFIE%CC%81.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac899c687ea6be0c13029_Kamiq_5%20-%20MODIFIE%CC%81.webp"
  ],
  category: "mini-suv",
  transmission: "Automatique",
  fuel: "Essence",
  seats: 5,
  features: ["Toit panoramique", "Radar recul", "LED"],
  available: true,
  description: "SUV compact polyvalent pour tous vos déplacements.",
  // Options d'abonnement spécifiques à cette voiture
    subscriptionOptions: {
      engagement: [
        { months: 6, monthlyPrice: 420 },
        { months: 3, monthlyPrice: 450 },
        { months: 0, monthlyPrice: 480, label: "Sans engagement" }
      ],
      mileage: [
        { km: 800, additionalPrice: 0, label: "Compris" },
        { km: 1000, additionalPrice: 9.99 },
        { km: 1250, additionalPrice: 14.99 },
        { km: 1500, additionalPrice: 43.99 },
        { km: 2000, additionalPrice: 109.99 },
        { km: 2500, additionalPrice: 175.99 }
      ],
      insurance: [
        { 
          type: "ASSURANCE TOUS RISQUES", 
          franchiseAmount: 1100, 
          additionalPrice: 0, 
          label: "Compris" 
        },
        { 
          type: "ASSURANCE TOUS RISQUES PLUS", 
          franchiseAmount: 150, 
          additionalPrice: 100 
        }
      ],
      additionalDriverPrice: 12
    }
}
,

  // VOLKSWAGEN
  {
    id: "volkswagen-golf-8",
    name: "Volkswagen Golf 8",
    brandId: "volkswagen",
    image: "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac527acf24d57cca0c1328_Golf-1-min%20-%20modifie%CC%81.webp",
    gallery: [
    'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac527acf24d57cca0c1328_Golf-1-min%20-%20modifie%CC%81.webp',
    'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac7f73d338b9032bf9410_Golf-2-min%20-%20modifie%CC%81.webp',
    'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac7f7e30c6491b26ec4fc_Golf-3-min%20-%20modifie%CC%81.webp',
    'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac7f73a592e9af3754503_Golf-4-min%20-%20modifie%CC%81.webp',
  ],
    category: "compact",
    transmission: "Automatique",
    fuel: "Essence",
    seats: 5,
    features: ["Active Info Display", "Apple CarPlay", "Clim Auto"],
    available: true,
    description: "Compacte haut de gamme et très connectée.",
    // Options d'abonnement spécifiques à cette voiture
    subscriptionOptions: {
      engagement: [
        { months: 6, monthlyPrice: 420 },
        { months: 3, monthlyPrice: 450 },
        { months: 0, monthlyPrice: 480, label: "Sans engagement" }
      ],
      mileage: [
        { km: 800, additionalPrice: 0, label: "Compris" },
        { km: 1000, additionalPrice: 9.99 },
        { km: 1250, additionalPrice: 14.99 },
        { km: 1500, additionalPrice: 43.99 },
        { km: 2000, additionalPrice: 109.99 },
        { km: 2500, additionalPrice: 175.99 }
      ],
      insurance: [
        { 
          type: "ASSURANCE TOUS RISQUES", 
          franchiseAmount: 1100, 
          additionalPrice: 0, 
          label: "Compris" 
        },
        { 
          type: "ASSURANCE TOUS RISQUES PLUS", 
          franchiseAmount: 150, 
          additionalPrice: 100 
        }
      ],
      additionalDriverPrice: 12
    }
  },
  {
    id: "volkswagen-t-roc",
    name: "Volkswagen T-Roc",
    brandId: "volkswagen",
    image: "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac52b8443aede538e3bee9_TRoc-1.webp",
    gallery: [
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac52b8443aede538e3bee9_TRoc-1.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac81c4352419e9a725349_TRoc-2.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac81cbf2d77825aee6909_TRoc-3.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac81cf251b41e073eb9b5_TRoc-4.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac81c9d40b49555b1da11_TRoc-5.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac81c05090c757f9dfd0c_TRoc-6.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac81c810243e86c812f48_TRoc-7.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac81c6495b5449916f4b3_TRoc-8.webp"
  ],
    category: "mini-suv",
    transmission: "Automatique",
    fuel: "Diesel",
    seats: 5,
    features: ["Sièges chauffants", "Grand coffre", "Clim Auto"],
    available: true,
    description: "SUV au design affirmé et technologies innovantes.",
    // Options d'abonnement spécifiques à cette voiture
    subscriptionOptions: {
      engagement: [
        { months: 6, monthlyPrice: 420 },
        { months: 3, monthlyPrice: 450 },
        { months: 0, monthlyPrice: 480, label: "Sans engagement" }
      ],
      mileage: [
        { km: 800, additionalPrice: 0, label: "Compris" },
        { km: 1000, additionalPrice: 9.99 },
        { km: 1250, additionalPrice: 14.99 },
        { km: 1500, additionalPrice: 43.99 },
        { km: 2000, additionalPrice: 109.99 },
        { km: 2500, additionalPrice: 175.99 }
      ],
      insurance: [
        { 
          type: "ASSURANCE TOUS RISQUES", 
          franchiseAmount: 1100, 
          additionalPrice: 0, 
          label: "Compris" 
        },
        { 
          type: "ASSURANCE TOUS RISQUES PLUS", 
          franchiseAmount: 150, 
          additionalPrice: 100 
        }
      ],
      additionalDriverPrice: 12
    }
  },
  {
    id: "volkswagen-tiguan",
    name: "Volkswagen Tiguan",
    brandId: "volkswagen",
    image: "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac7c2e1c6a11352eea5d3_Tiguan%20Hybride%201.webp",
    gallery: [
    'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac7c25302d8f455e983e6_Tiguan%20Hybride%202.webp',
    'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac7c2ef91693a0995e639_Tiguan%20Hybride%203.webp',
    'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac7c21d24f90bbebd5426_Tiguan%20Hybride%205.webp',
    'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac7c2cecef4dbbba7ec28_Tiguan%20Hybride%206.webp',
    'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac7c23333979ebe396eac_Tiguan%20Hybride%208.webp'
  ],
    category: "suv",
    transmission: "Automatique",
    fuel: "Hybride",
    seats: 5,
    features: ["Toit panoramique", "Park Assist", "Cockpit digital"],
    available: true,
    description: "SUV familial avec un confort haut de gamme.",
    // Options d'abonnement spécifiques à cette voiture
    subscriptionOptions: {
      engagement: [
        { months: 6, monthlyPrice: 420 },
        { months: 3, monthlyPrice: 450 },
        { months: 0, monthlyPrice: 480, label: "Sans engagement" }
      ],
      mileage: [
        { km: 800, additionalPrice: 0, label: "Compris" },
        { km: 1000, additionalPrice: 9.99 },
        { km: 1250, additionalPrice: 14.99 },
        { km: 1500, additionalPrice: 43.99 },
        { km: 2000, additionalPrice: 109.99 },
        { km: 2500, additionalPrice: 175.99 }
      ],
      insurance: [
        { 
          type: "ASSURANCE TOUS RISQUES", 
          franchiseAmount: 1100, 
          additionalPrice: 0, 
          label: "Compris" 
        },
        { 
          type: "ASSURANCE TOUS RISQUES PLUS", 
          franchiseAmount: 150, 
          additionalPrice: 100 
        }
      ],
      additionalDriverPrice: 12
    }
  },

  // SEAT
  {
  id: "seat-ibiza",
  name: "SEAT Ibiza",
  brandId: "seat",
  image: "https://www.seat.ma/content/dam/public/seat-website/models/new-ibiza/exterior-colours/new-seat-ibiza-midnight-black-colour.png",
  gallery: [
    "https://www.seat.ma/content/dam/public/seat-website/models/new-ibiza/exterior-colours/new-seat-ibiza-midnight-black-colour.png",
    "https://www.seat.ma/content/dam/public/seat-website/models/new-ibiza/interior-design/small/new-seat-ibiza-upholstery-le-mans-cloth-sport-seats.jpg"
  ],
  category: "compact",
  transmission: "Manuelle",
  fuel: "Essence",
  seats: 5,
  features: ["Feux LED", "Lane Assist", "Bluetooth"],
  available: true,
  description: "Compacte sportive et urbaine, style et performance réunis.",
  // Options d'abonnement spécifiques à cette voiture
    subscriptionOptions: {
      engagement: [
        { months: 6, monthlyPrice: 420 },
        { months: 3, monthlyPrice: 450 },
        { months: 0, monthlyPrice: 480, label: "Sans engagement" }
      ],
      mileage: [
        { km: 800, additionalPrice: 0, label: "Compris" },
        { km: 1000, additionalPrice: 9.99 },
        { km: 1250, additionalPrice: 14.99 },
        { km: 1500, additionalPrice: 43.99 },
        { km: 2000, additionalPrice: 109.99 },
        { km: 2500, additionalPrice: 175.99 }
      ],
      insurance: [
        { 
          type: "ASSURANCE TOUS RISQUES", 
          franchiseAmount: 1100, 
          additionalPrice: 0, 
          label: "Compris" 
        },
        { 
          type: "ASSURANCE TOUS RISQUES PLUS", 
          franchiseAmount: 150, 
          additionalPrice: 100 
        }
      ],
      additionalDriverPrice: 12
    }
}
,
  {
    id: "seat-leon",
    name: "SEAT Léon",
    brandId: "seat",
    image: "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac54b1bde0d3879dc89ecd_Leon_1%20-%20Modifier.webp",
    gallery: [
      'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac54b1bde0d3879dc89ecd_Leon_1%20-%20Modifier.webp',
      'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac8fed6a8abe213e8b662_Leon_2%20-%20Modifier.webp',
      'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac8fe08b508e70f187c43_Leon_3%20-%20Modifier.webp',
      'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac8fe7398b3a75f666cdd_Leon_4%20-%20Modifier.webp',
      'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac8fed869a89b6db40686_Leon_5%20-%20Modifier.webp',
      'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac8fe13db4a9af6bc020e_Leon_6%20-%20Modifier.webp',
    ],
    category: "compact",
    transmission: "Manuelle",
    fuel: "Essence",
    seats: 5,
    features: ["Écran tactile", "Aide au stationnement", "Android Auto"],
    available: true,
    description: "Compacte sportive et urbaine, style et performance réunis.",
    // Options d'abonnement spécifiques à cette voiture
    subscriptionOptions: {
      engagement: [
        { months: 6, monthlyPrice: 420 },
        { months: 3, monthlyPrice: 450 },
        { months: 0, monthlyPrice: 480, label: "Sans engagement" }
      ],
      mileage: [
        { km: 800, additionalPrice: 0, label: "Compris" },
        { km: 1000, additionalPrice: 9.99 },
        { km: 1250, additionalPrice: 14.99 },
        { km: 1500, additionalPrice: 43.99 },
        { km: 2000, additionalPrice: 109.99 },
        { km: 2500, additionalPrice: 175.99 }
      ],
      insurance: [
        { 
          type: "ASSURANCE TOUS RISQUES", 
          franchiseAmount: 1100, 
          additionalPrice: 0, 
          label: "Compris" 
        },
        { 
          type: "ASSURANCE TOUS RISQUES PLUS", 
          franchiseAmount: 150, 
          additionalPrice: 100 
        }
      ],
      additionalDriverPrice: 12
    }
  },

  // DACIA
  {
    id: "dacia-sandero",
    name: "Dacia Sandero",
    brandId: "dacia",
    image: "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bacf6434ef65917567ca71_DACIA%20SANDERO%2011%20-%20modifie%CC%81%20.webp",
    gallery: [
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bacf6434ef65917567ca71_DACIA%20SANDERO%2011%20-%20modifie%CC%81%20.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bacf64a852fe485a206f3d_DACIA%20SANDERO%2012%20-%20modifie%CC%81%20.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bacf64bb7d6ecb5fac8da7_DACIA%20SANDERO%2013%20-%20modifie%CC%81%20.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bacf648f511d506a7c6494_DACIA%20SANDERO%201%20-%20modifie%CC%81%20.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bacf64e814de377ada5759_DACIA%20SANDERO%206%20-%20modifie%CC%81%20.webp"
  ],
    category: "compact",
    transmission: "Manuelle",
    fuel: "Essence",
    seats: 5,
    features: ["GPS", "Bluetooth", "Start&Stop"],
    available: true,
    description: "Compacte accessible et pratique pour tous les trajets.",
    // Options d'abonnement spécifiques à cette voiture
    subscriptionOptions: {
      engagement: [
        { months: 6, monthlyPrice: 420 },
        { months: 3, monthlyPrice: 450 },
        { months: 0, monthlyPrice: 480, label: "Sans engagement" }
      ],
      mileage: [
        { km: 800, additionalPrice: 0, label: "Compris" },
        { km: 1000, additionalPrice: 9.99 },
        { km: 1250, additionalPrice: 14.99 },
        { km: 1500, additionalPrice: 43.99 },
        { km: 2000, additionalPrice: 109.99 },
        { km: 2500, additionalPrice: 175.99 }
      ],
      insurance: [
        { 
          type: "ASSURANCE TOUS RISQUES", 
          franchiseAmount: 1100, 
          additionalPrice: 0, 
          label: "Compris" 
        },
        { 
          type: "ASSURANCE TOUS RISQUES PLUS", 
          franchiseAmount: 150, 
          additionalPrice: 100 
        }
      ],
      additionalDriverPrice: 12
    }
  },
  {
  id: "util1",
  name: "Renault Express Van",
  brandId: "renault",
  image: "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac557cc6cc171c871d2574_RENAULT%20EXPRESS%20VAN%201%20-%20Modifie%CC%81.webp",
  gallery: [
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac557cc6cc171c871d2574_RENAULT%20EXPRESS%20VAN%201%20-%20Modifie%CC%81.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac9a5c0335dce7f6e2a5b_RENAULT%20EXPRESS%20VAN%202%20-%20Modifie%CC%81.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac9a5d7c6a050b90e85b4_RENAULT%20EXPRESS%20VAN%203%20-%20Modifie%CC%81.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac9a5124ae4166b623565_RENAULT%20EXPRESS%20VAN%204%20-%20Modifie%CC%81.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac9a5e1c6a11352eff6e3_RENAULT%20EXPRESS%20VAN%2014%20-%20Modifie%CC%81%20copie.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac9a5bf2d77825aef54ab_EXPRESS%20VAN%20-%20INTERIEUR%201%20-%20Modifier.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac9a5745c35cca04b6938_EXPRESS%20VAN%20-%20INTERIEUR%203%20-%20Modifier.webp"
  ],
  available: true,
  transmission: "Manuelle",
  fuel: "Diesel",
  category: "Utilitaire",
  seats: 2,
  features: ["Bluetooth", "GPS", "Volume de chargement optimisé"],
  description: "Fourgon compact, ultra pratique pour la livraison urbaine.",
  // Options d'abonnement spécifiques à cette voiture
    subscriptionOptions: {
      engagement: [
        { months: 6, monthlyPrice: 420 },
        { months: 3, monthlyPrice: 450 },
        { months: 0, monthlyPrice: 480, label: "Sans engagement" }
      ],
      mileage: [
        { km: 800, additionalPrice: 0, label: "Compris" },
        { km: 1000, additionalPrice: 9.99 },
        { km: 1250, additionalPrice: 14.99 },
        { km: 1500, additionalPrice: 43.99 },
        { km: 2000, additionalPrice: 109.99 },
        { km: 2500, additionalPrice: 175.99 }
      ],
      insurance: [
        { 
          type: "ASSURANCE TOUS RISQUES", 
          franchiseAmount: 1100, 
          additionalPrice: 0, 
          label: "Compris" 
        },
        { 
          type: "ASSURANCE TOUS RISQUES PLUS", 
          franchiseAmount: 150, 
          additionalPrice: 100 
        }
      ],
      additionalDriverPrice: 12
    }
},
{
  id: "util2",
  name: "Renault Master L1H1",
  brandId: "renault",
  image: "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65f99e59f2f8997547dc7217_RENAULT%20MASTER%201%20-%20Modifie%CC%81.webp",
  gallery: [
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65f99e59f2f8997547dc7217_RENAULT%20MASTER%201%20-%20Modifie%CC%81.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65f99ea0ac1b1f225c3a1643_RENAULT%20MASTER%202%20-%20Modifie%CC%81.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65f99ea1606d2f9d8fb3170a_RENAULT%20MASTER%205%20-%20Modifie%CC%81.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65f99ea3b7e32170f4c77551_RENAULT%20MASTER%2011%20-%20Modifie%CC%81.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65f99ea0d455902228c3d519_RENAULT%20EXPRESS%20VAN%2010.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65f99ea07c03f444b8019fce_RENAULT%20MASTER%206%20-%20Modifie%CC%81.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65f99ea2fa61f299594905b7_RENAULT%20MASTER%20INTERIEUR%201%20-%20modifie%CC%81.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65f99ea32e66c12a0318e021_RENAULT%20MASTER%20INTERIEUR%202%20-%20modifie%CC%81.webp"
  ],
  available: true,
  transmission: "Manuelle",
  fuel: "Diesel",
  category: "Utilitaire",
  seats: 3,
  features: ["Volume XXL", "Caméra de recul", "Portes arrière battantes"],
  description: "Grand fourgon pratique pour les déménagements ou transport volumineux.",
  // Options d'abonnement spécifiques à cette voiture
    subscriptionOptions: {
      engagement: [
        { months: 6, monthlyPrice: 420 },
        { months: 3, monthlyPrice: 450 },
        { months: 0, monthlyPrice: 480, label: "Sans engagement" }
      ],
      mileage: [
        { km: 800, additionalPrice: 0, label: "Compris" },
        { km: 1000, additionalPrice: 9.99 },
        { km: 1250, additionalPrice: 14.99 },
        { km: 1500, additionalPrice: 43.99 },
        { km: 2000, additionalPrice: 109.99 },
        { km: 2500, additionalPrice: 175.99 }
      ],
      insurance: [
        { 
          type: "ASSURANCE TOUS RISQUES", 
          franchiseAmount: 1100, 
          additionalPrice: 0, 
          label: "Compris" 
        },
        { 
          type: "ASSURANCE TOUS RISQUES PLUS", 
          franchiseAmount: 150, 
          additionalPrice: 100 
        }
      ],
      additionalDriverPrice: 12
    }
},
{
  id: "util3",
  name: "Renault Trafic 3",
  brandId: "renault",
  image: "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac54e83d7e8a4378c703b6_RENAULT%20TRAFIC%203%20-%201%20copie.webp",
  gallery: [
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac54e83d7e8a4378c703b6_RENAULT%20TRAFIC%203%20-%201%20copie.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac945cc5ce2c855d7b17c_RENAULT%20TRAFIC%203%20-%202%20copie.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac94505090c757f9ea786_RENAULT%20TRAFIC%203%20-%205%20copie.webp",
    "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac945a2ba4b700254fe75_RENAULT%20TRAFIC%203%20-%2015%20copie.webp"
  ],
  available: true,
  transmission: "Manuelle",
  fuel: "Diesel",
  category: "Utilitaire",
  seats: 3,
  features: ["Polyvalent", "Confort de conduite", "Charge utile optimisée"],
  description: "Polyvalent, confortable et adapté aux missions intensives de transport.",
  // Options d'abonnement spécifiques à cette voiture
    subscriptionOptions: {
      engagement: [
        { months: 6, monthlyPrice: 420 },
        { months: 3, monthlyPrice: 460 },
        { months: 0, monthlyPrice: 480, label: "Sans engagement" }
      ],
      mileage: [
        { km: 800, additionalPrice: 0, label: "Compris" },
        { km: 1000, additionalPrice: 9.99 },
        { km: 1250, additionalPrice: 14.99 },
        { km: 1500, additionalPrice: 43.99 },
        { km: 2000, additionalPrice: 109.99 },
        { km: 2500, additionalPrice: 175.99 }
      ],
      insurance: [
        { 
          type: "ASSURANCE TOUS RISQUES", 
          franchiseAmount: 1100, 
          additionalPrice: 0, 
          label: "Compris" 
        },
        { 
          type: "ASSURANCE TOUS RISQUES PLUS", 
          franchiseAmount: 150, 
          additionalPrice: 100 
        }
      ],
      additionalDriverPrice: 12
    }
} 
];
