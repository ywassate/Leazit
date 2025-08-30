export interface Model {
  id: string;
  name: string;
  image: string;
  category: 'compact' | 'mini-suv' | 'suv' | 'utilitaire';
  description: string;
}
export interface BrandData {
  id: string;
  name: string;
  logo: string;
  imageDescription: string;
  description: string;
  buttonLabel: string;
  models: Model[];
}

export const brandData: BrandData[] = [
  {
    id: 'peugeot',
    name: 'Peugeot',
    logo: 'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/659677e1d5c580523185ebe4_Logo_Peugeot.svg',
    imageDescription: 'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/659677e1d5c580523185ebe4_Logo_Peugeot.svg',
    description: 'Nos véhicules de la marque Peugeot 100% équipés pour les professionnels : Peugeot 2008, Peugeot 3008, Peugeot 5008... Disponibles en location longue durée et moyenne durée.',
    buttonLabel: 'Nos véhicules Peugeot',
    models: [
      { id: "peugeot-208", name: 'Peugeot 208', image: 'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65c2680c136f1a6db5d165cf_Peugeot%20208%20-%203.webp', category: 'compact', description: 'Citadine élégante, parfaite pour la ville et les déplacements courts.' },
      { id: "peugeot-2008", name: 'Peugeot 2008', image: 'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac58e9f76385678426e1a0_2008-%201%20-%20Modifie%CC%81.webp', category: 'mini-suv', description: 'SUV raffiné avec technologies avancées, idéal pour les professionnels.' },
      { id: "peugeot-3008", name: 'Peugeot 3008', image: 'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65f08f1497545591640b870b_Peugeot%203008%201.webp', category: 'suv', description: 'SUV familial 7 places, confort et modularité pour les longues distances.' }
    ]
  },
  {
    id: 'renault',
    name: 'Renault',
    logo: 'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/659676f3bc731e89c65e9600_Logo_Renault.svg',
    imageDescription: '/images/brands/renault-cover.jpg',
    description: 'La gamme Renault allie innovation, sécurité et performance : Clio, Captur, Arkana, Austral... en LLD et LMD.',
    buttonLabel: 'Nos véhicules Renault',
    models: [
      { id: "renault-clio", name: 'Renault Clio', image: 'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac5673a76a2cf0287c5ec6_Clio-V-1%20-%20modifie%CC%81.webp', category: 'compact', description: 'Compacte agile et économique, idéale pour un usage quotidien.' },
      { id: "renault-austral", name: 'Renault Austral', image: 'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac554109a8adaf7d41cf32_RENAULT%20AUSTRAL%201.webp', category: 'mini-suv', description: 'SUV spacieux avec technologies embarquées de dernière génération.' },

      {
        id: "util1",
        name: "Renault Express Van",
        image: "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac557cc6cc171c871d2574_RENAULT%20EXPRESS%20VAN%201%20-%20Modifie%CC%81.webp",
        category: "utilitaire",
        description: "Fourgon compact, ultra pratique pour la livraison urbaine."
      },
      {
        id: "util2",
        name: "Renault Master L1H1",
        image: "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65f99e59f2f8997547dc7217_RENAULT%20MASTER%201%20-%20Modifie%CC%81.webp",
        category: "utilitaire",
        description: "Grand fourgon pratique pour les déménagements ou transport volumineux."
      },
      {
        id: "util3",
        name: "Renault Trafic 3",
        image: "https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac54e83d7e8a4378c703b6_RENAULT%20TRAFIC%203%20-%201%20copie.webp",
        category: "utilitaire",
        description: "Polyvalent, confortable et adapté aux missions intensives de transport."
      }
    ]
  },
  {
    id: 'toyota',
    name: 'Toyota',
    logo: 'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/659676aba360fb95db943f2f_Logo_Toyota.svg',
    imageDescription: 'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/659676aba360fb95db943f2f_Logo_Toyota.svg',
    description: "Toyota, le choix de la fiabilité et de l'hybride. Découvrez la Yaris, Corolla, RAV4... pour une mobilité durable.",
    buttonLabel: 'Nos véhicules Toyota',
    models: [
      {id: "toyota-yaris-hybride", name: 'Toyota Yaris Hybride', image: 'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac5421a76a2cf0287b3b82_TOYOTA%20YARIS%201%20-%20modifie%CC%81.webp', category: 'compact', description: 'Hybride urbaine, économique et écologique.' }
    ]
  },
  {
    id: 'skoda',
    name: 'Skoda',
    logo: 'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65967922636c09e263061f31_Logo_Skoda.png',
    imageDescription: '/images/brands/skoda-cover.jpg',
    description: 'Skoda propose des véhicules robustes, modernes et fiables, parfaits pour les pros en LLD et LMD.',
    buttonLabel: 'Nos véhicules Skoda',
    models: [
      { id: "skoda-octavia", name: 'Skoda Octavia', image: 'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65c26969175170ebdbca7d51_SKODA%20OCTAVIA%202%20-modifie%CC%81%20.webp', category: 'compact', description: 'Voiture économique et pratique pour la ville.' },
      { id: "skoda-kamiq", name: 'Skoda Kamiq', image: 'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac5466cb3de587af5ae105_Kamiq_1%20-%20MODIFIE%CC%81.webp', category: 'mini-suv', description: 'SUV compact polyvalent pour tous vos déplacements.' }
    ]
  },
  {
    id: 'volkswagen',
    name: 'Volkswagen',
    logo: 'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65967979acdaf75d768f2135_Logo_Volkswagen.svg',
    imageDescription: 'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65967979acdaf75d768f2135_Logo_Volkswagen.svg',
    description: 'Volkswagen vous offre qualité allemande et fiabilité avec des modèles comme Polo, T-Roc et Tiguan.',
    buttonLabel: 'Nos véhicules Volkswagen',
    models: [
      { id: "volkswagen-golf-8", name: 'Volkswagen Golf 8', image: 'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac527acf24d57cca0c1328_Golf-1-min%20-%20modifie%CC%81.webp', category: 'compact', description: 'Citadine dynamique et économique, idéale au quotidien.' },
      { id: "volkswagen-t-roc", name: 'Volkswagen T-Roc', image: 'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65ac52b8443aede538e3bee9_TRoc-1.webp', category: 'mini-suv', description: 'SUV au design affirmé et technologies innovantes.' },
      { id: "volkswagen-tiguan",name: 'Volkswagen Tiguan', image: 'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bac7c2e1c6a11352eea5d3_Tiguan%20Hybride%201.webp', category: 'suv', description: 'SUV familial avec un confort haut de gamme.' }
    ]
  },
  {
  id: 'audi',
  name: 'Audi',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg',
  imageDescription: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg',
  description: "Audi, symbole de technologie et d'élégance allemande, propose des véhicules modernes et performants.",
  buttonLabel: 'Nos véhicules Audi',
  models: [
    { id: "audi-a3", name: 'Audi A3', image: 'https://www.audi.fr/content/dam/nemo/models/a3/a3-sportback/my-2025/NeMo-Derivate-StartPage/1920x1080-AA3_SB_232009.jpg', category: 'compact', description: 'Compacte premium au design sportif et intérieur raffiné.' },
    { id: "audi-q2", name: 'Audi Q2', image: 'https://www.audi.fr/content/dam/nemo/models/q2/q2/my-2024/NeMo-Derivate-StartPage/1920x1080-AQ2_232004.jpg', category: 'mini-suv', description: 'Mini SUV design et agile, idéal pour la ville.' },
    { id: "audi-q5", name: 'Audi Q5', image: 'https://www.audi.fr/content/dam/nemo/models/q5/q5/my-2025/NeMo-Derivate-StartPage/1920x1080-AQ5_232004.jpg', category: 'suv', description: 'SUV polyvalent et confortable avec des motorisations efficientes.' }
  ]
},
{
  id: 'mercedes',
  name: 'Mercedes-Benz',
  logo: 'https://upload.wikimedia.org/wikipedia/fr/a/ae/Mercedes_Benz_logo_2011.svg',
  imageDescription: 'https://upload.wikimedia.org/wikipedia/fr/a/ae/Mercedes_Benz_logo_2011.svg',
  description: "Mercedes-Benz allie luxe, confort et innovation pour une expérience de conduite exceptionnelle.",
  buttonLabel: 'Nos véhicules Mercedes',
  models: [
    { id: "mercedes-classe-a", name: 'Mercedes Classe A', image: 'https://www.mercedes-benz.fr/passengercars/mercedes-benz-cars/models/a-class/hatchback-w177-fl/explore/highlights/_jcr_content/root/stage/par/stageitem/image/MQ6-12-image-20230512084737/01-mercedes-benz-a-class-hatchback-v177-fl-exterior-front-view-night-3400x1440.jpeg', category: 'compact', description: 'Compacte élégante et moderne, parfaite pour le quotidien.' },
    { id: "mercedes-gla", name: 'Mercedes GLA', image: 'https://www.mercedes-benz.fr/passengercars/mercedes-benz-cars/models/gla/suv-h247/explore/highlights/_jcr_content/root/stage/par/stageitem/image/MQ6-12-image-20231030131055/02-mercedes-benz-gla-h247-exterior-front-view-night-3400x1440.jpeg', category: 'mini-suv', description: 'Mini SUV urbain, raffiné et technologique.' },
    { id: "mercedes-glc", name: 'Mercedes GLC', image: 'https://www.mercedes-benz.fr/passengercars/mercedes-benz-cars/models/glc/suv-x254/explore/highlights/_jcr_content/root/stage/par/stageitem/image/MQ6-12-image-20230620111418/03-mercedes-benz-glc-suv-x254-exterior-front-view-silver-3400x1440.jpeg', category: 'suv', description: 'SUV haut de gamme, spacieux et confortable pour toute la famille.' }
  ]
},

  
{
  id: 'landrover',
  name: 'Land Rover',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Land_Rover_logo_black.svg',
  imageDescription: '',
  description: 'Land Rover conçoit des SUV premium taillés pour l’aventure comme pour la ville, alliant confort, technologies et capacités tout-terrain.',
  buttonLabel: 'Nos véhicules Land Rover',
  models: [
    { id: "landrover-range-rover-sport", name: "Range Rover Sport", image: "/images/cars/landrover-range-rover-sport.jpg", category: "suv", description: "SUV haut de gamme puissant et confortable pour longs trajets." }
  ]
},

  {
    id: 'dacia',
    name: 'Dacia',
    logo: 'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65967662b246211f8556c44d_Logo_Dacia.svg',
    imageDescription: 'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65967662b246211f8556c44d_Logo_Dacia.svg',
    description: 'La marque Dacia offre un excellent rapport qualité/prix avec une gamme simple, robuste et fiable.',
    buttonLabel: 'Nos véhicules Dacia',
    models: [
      { id: "dacia-sandero", name: 'Dacia Sandero', image: 'https://cdn.prod.website-files.com/657a25238d27b824ae6c3d41/65bacf6434ef65917567ca71_DACIA%20SANDERO%2011%20-%20modifie%CC%81%20.webp', category: 'compact', description: 'Compacte accessible et pratique pour tous les trajets.' }
    ]
  }
];
