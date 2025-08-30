import React, { useState, useEffect, useRef } from 'react';
import FancyButton from '../components/FancyButton';
import FancyButtonDark from '../components/FancyButtonDark';
import { getAuth } from 'firebase/auth';
import '../index.css';

import { ChevronRight, Shield, Clock, Users, Award, Zap, ChevronLeft } from 'lucide-react';



interface HomePageProps {
  onPageChange: (page: string, data?: any) => void;
  scrollToFaqTrigger?: boolean;
  setShowSimulator?: (show: boolean) => void;
}

type BrandLite = {
  id: string;
  name: string;
  logo: string;
};

// Lis l'URL backend depuis .env (ex: /api en prod, http://localhost:5050/api en dev)
const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';


const HomePage: React.FC<HomePageProps> = ({ onPageChange, scrollToFaqTrigger , setShowSimulator}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [currentVehicleImageIndex, setCurrentVehicleImageIndex] = useState(0);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);

  const [logos, setLogos] = useState<BrandLite[]>([]);
  const [logosLoading, setLogosLoading] = useState(true);
  const [logosError, setLogosError] = useState<string | null>(null);

  const faqRef = useRef<HTMLDivElement>(null);
  const servicesScrollRef = useRef<HTMLDivElement>(null);

  const carImages = ['/range.png', '/golf8.png', '/audi.png', '/bmw.png', '/Corsa.jpeg'];
  const vehicleShowcaseImages = ['/range.png', '/golf8.png', '/bmw.png', '/Corsa.jpeg'];
  
  /* ───────────────────────────
   *  Chargement logos Firestore (via /brands)
   * ─────────────────────────── */
  useEffect(() => {
  let alive = true; // évite de setState si le composant est unmount

  (async () => {
    try {
      setLogosLoading(true);
      setLogosError(null);

      const token = await getAuth().currentUser?.getIdToken?.();

      const res = await fetch(`${API_BASE_URL}/brands`, {
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        if (res.status === 404) {
          if (alive) {
            setLogos([]);
            setLogosLoading(false);
          }
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        const snippet = (await res.text()).slice(0, 120);
        throw new Error(`Réponse non-JSON (Content-Type: ${ct}). Extrait: ${snippet}…`);
      }

      const data = (await res.json()) as { id: string; name: string; logo: string }[];
      if (alive) {
        setLogos(Array.isArray(data) ? data : []);
        setLogosLoading(false);
      }
    } catch (err: any) {
      // plus d'AbortController, donc pas d'AbortError à gérer
      console.error('Erreur chargement logos brands:', err);
      if (alive) {
        setLogosError('Impossible de charger les logos pour le moment.');
        setLogos([]);
        setLogosLoading(false);
      }
    }
  })();

  return () => {
    alive = false;
  };
}, []);

    
  
  /* ───────────────────────────
   *  Auto-rotating hero background
   * ─────────────────────────── */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carImages.length]);

  /* ───────────────────────────
   *  Auto-rotating vehicle showcase images
   * ─────────────────────────── */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVehicleImageIndex((prev) => (prev + 1) % vehicleShowcaseImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [vehicleShowcaseImages.length]);

  /* ───────────────────────────
   *  Auto-rotating stats (mobile)
   * ─────────────────────────── */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  /* ───────────────────────────
   *  Auto-rotating features (mobile)
   * ─────────────────────────── */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % features.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  /* ───────────────────────────
   *  Gestion du scroll vers la FAQ
   * ─────────────────────────── */
  useEffect(() => {
    if (scrollToFaqTrigger && faqRef.current) {
      faqRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [scrollToFaqTrigger]);

  /* ───────────────────────────
   *  Helpers
   * ─────────────────────────── */

  const stats = [
    { icon: Clock, label: '7+ années', description: "d'expérience" },
    { icon: Users, label: '500+ clients', description: 'satisfaits' },
    { icon: Shield, label: 'Service 24/7', description: 'assistance' },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Réservation Instantanée',
      description: 'Réservez votre véhicule en quelques clics, 24h/24 et 7j/7'
    },
    {
      icon: Shield,
      title: 'Assurance Incluse',
      description: 'Tous risques avec assistance dépannage partout au Maroc'
    },
    {
      icon: Award,
      title: 'Véhicules Premium',
      description: 'Flotte récente et entretenue selon les standards constructeurs'
    },
  ];

  const services = [
    {
      key: 'longue',
      img: '/longue.jpeg',
      title: 'Location longue durée',
      desc: 'Abonnements flexibles de 6 à 48 mois avec tout inclus',
    },
    {
      key: 'moyenne',
      img: '/court.jpeg',
      title: 'Location courte durée',
      desc: 'Solutions de 1 à 6 mois pour vos besoins temporaires',
    },
    {
      key: 'sans',
      img: '/sans.jpeg',
      title: 'Location sans engagement',
      desc: 'Liberté totale avec résiliation à tout moment',
    },
  ];

  const scrollServices = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentServiceIndex((prev) => (prev === 0 ? services.length - 1 : prev - 1));
    } else {
      setCurrentServiceIndex((prev) => (prev + 1) % services.length);
    }
  };

  return (
    <div className="overflow-x-hidden">
      <div className="min-h-[calc(100vh-80px)] flex flex-col">
      {/* ───────── ENHANCED HERO ───────── */}
      <section className="relative flex-grow flex items-center px-4 bg-black text-white overflow-hidden">
        {/* Background Images with Transition */}
        <div className="absolute inset-0">
          {carImages.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
     
        <div className="relative max-w-7xl mx-auto h-full flex items-center z-10">
          <div className="max-w-3xl space-y-8">
            <div className="space-y-6">              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
                Location de véhicules par{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">
                  Abonnement
                </span>
              </h1>

              <div className="space-y-4 text-lg lg:text-xl text-gray-300 leading-relaxed max-w-2xl">
                <p>
                  Première solution d'abonnements véhicules au Maroc. Tout inclus : assurance,
                  entretien, assistance 24/7.
                </p>
                <p className="font-semibold text-white">
                  Simple, flexible, sans surprises
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <FancyButton 
                label="Simulation gratuite" 
                onClick={() => setShowSimulator?.(true)}
                icon={<Zap className="w-5 h-5" />}
              />
              <FancyButtonDark 
                label="Découvrir nos voitures" 
                onClick={() => onPageChange('vehicles')}
                icon={<ChevronRight className="w-5 h-5" />}
              />
            </div>

            {/* Image Indicators */}
            <div className="flex space-x-2 pt-4 justify-center sm:justify-start">
              {carImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-white w-8' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>


      
      {/* ───────── LOGOS (depuis Firestore) ───────── */}
      <section className="w-full bg-gradient-to-r from-gray-50 to-gray-100 py-4 overflow-hidden border-t border-gray-200">
        <div className="relative w-full">
          {logosLoading ? (
            <div className="flex animate-pulse gap-8 px-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 md:h-16 w-24 bg-gray-200 rounded" />
              ))}
            </div>
          ) : logosError ? (
            <div className="text-center text-sm text-gray-500 py-2">{logosError}</div>
          ) : logos.length === 0 ? (
            <div className="text-center text-sm text-gray-500 py-2">Aucune marque disponible.</div>
          ) : (
            <div className="flex animate-scroll-linear whitespace-nowrap">
              {[...Array(3)].flatMap((_, dup) =>
                logos.map((b, i) => (
                  <button
                    key={`${dup}-${b.id}-${i}`}
                    className="flex-shrink-0 px-8 md:px-16"
                    aria-label={`Voir les véhicules ${b.name}`}
                    onClick={() => onPageChange('brand', { brandId: b.id })}
                  >
                    <img 
                      src={b.logo} 
                      alt={b.name} 
                      className="h-10 md:h-16 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0" 
                      loading="lazy"
                    />
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </section>

    </div>

      {/* ───────── ENHANCED STATS SECTION ───────── */}
      <section className="py-16 px-4 text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="max-w-6xl mx-auto">
          {/* Mobile Stats Carousel */}
          <div className="block md:hidden mb-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
                {React.createElement(stats[currentStatIndex].icon, { className: "w-8 h-8 text-gray-400" })}
              </div>
              <div className="text-3xl font-bold mb-2">{stats[currentStatIndex].label}</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">{stats[currentStatIndex].description}</div>
            </div>
            {/* Stats Indicators */}
            <div className="flex justify-center space-x-2 mt-6">
              {stats.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStatIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStatIndex 
                      ? 'bg-white w-8' 
                      : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Desktop Stats Grid */}
          <div className="hidden md:grid grid-cols-3 gap-8 mb-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                  <stat.icon className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold mb-2">{stat.label}</div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">{stat.description}</div>
              </div>
            ))}
          </div>

          {/* Value Proposition */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Flexibilité Totale. Tout Inclus.{' '}
              <span className="text-transparent bg-clip-text bg-gray-400">
                100% Digital.
              </span>
            </h2>
            
            {/* Mobile Feature Cards Carousel */}
            <div className="block md:hidden pt-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mx-4">
                {React.createElement(features[currentFeatureIndex].icon, { className: "w-8 h-8 text-gray-400 mb-4 mx-auto" })}
                <h3 className="text-lg font-semibold mb-2">{features[currentFeatureIndex].title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{features[currentFeatureIndex].description}</p>
              </div>
              {/* Feature Indicators */}
              <div className="flex justify-center space-x-2 mt-6">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeatureIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentFeatureIndex 
                        ? 'bg-white w-8' 
                        : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Desktop Feature Cards */}
            <div className="hidden md:grid grid-cols-3 gap-6 pt-4">
              {features.map((feature, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <feature.icon className="w-8 h-8 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── ENHANCED VEHICLE SHOWCASE ───────── */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-tight">
                Découvrez notre sélection de{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-200">
                  Voitures
                </span>{' '}
                disponibles
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Chaque voiture de notre flotte est soigneusement sélectionnée pour répondre à vos besoins.
                Profitez d'un confort inégalé et d'une performance optimale sur la route.
              </p>
            </div>

            <div className="space-y-4">
              {[
                'Véhicules récents et entretenus',
                'Assurance tous risques incluse',
                'Assistance 24/7 partout au Maroc',
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-center lg:justify-start">
              <FancyButton
                label="Voir tous nos véhicules"
                onClick={() => onPageChange('vehicles')}
                icon={<ChevronRight className="w-5 h-5" />}
              />
            </div>
          </div>

          {/* Mobile: Single rotating image */}
          <div className="block lg:hidden relative">
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl">
              {vehicleShowcaseImages.map((image, index) => (
                <img
                  key={image}
                  src={image}
                  alt={`Véhicule ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    index === currentVehicleImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            {/* Vehicle Image Indicators */}
            <div className="flex justify-center space-x-2 mt-4">
              {vehicleShowcaseImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentVehicleImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentVehicleImageIndex 
                      ? 'bg-white w-8' 
                      : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Desktop: Enhanced Images Grid */}
          <div className="hidden lg:block relative">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="group relative overflow-hidden rounded-2xl shadow-2xl">
                  <img 
                    src="/range.png" 
                    alt="Range Rover" 
                    className="w-full h-60 object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="group relative overflow-hidden rounded-2xl shadow-2xl">
                  <img 
                    src="/golf8.png" 
                    alt="Golf 8" 
                    className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              </div>
              <div className="space-y-6 mt-12">
                <div className="group relative overflow-hidden rounded-2xl shadow-2xl">
                  <img 
                    src="/bmw.png" 
                    alt="BMW" 
                    className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="group relative overflow-hidden rounded-2xl shadow-2xl">
                  <img 
                    src="/Corsa.jpeg" 
                    alt="Corsa" 
                    className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>
      
      {/* ───────── ENHANCED HOW IT WORKS ───────── */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-24 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Enhanced Image */}
          <div className="relative">
            <div
              className="h-[400px] lg:h-[600px] w-full bg-cover bg-center rounded-3xl shadow-2xl overflow-hidden"
              style={{ backgroundImage: "url('/casa.jpeg')" }}
            >
            </div>
          </div>

          {/* Enhanced Content */}
          <div className="space-y-10 text-gray-800">
            <div className="space-y-6">
              <span className="inline-block text-sm font-semibold uppercase tracking-widest text-gray-500 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200">
                ÉTAPE PAR ÉTAPE
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Comment ça{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-700">
                  marche?
                </span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Un processus simple et transparent en seulement 3 étapes pour obtenir votre véhicule.
              </p>
            </div>

            {/* Enhanced Steps */}
            <div className="space-y-8">
              {[
                {
                  step: 1,
                  title: 'Choisissez votre voiture',
                  description: 'Parcourez notre sélection premium et configurez votre abonnement selon vos besoins : kilométrage, durée, options.',
                },
                {
                  step: 2,
                  title: 'Inscription rapide et sécurisée',
                  description: 'Formulaire digital simplifié. Téléchargez vos documents en quelques clics. Validation sous 24h.',
                },
                {
                  step: 3,
                  title: 'Livraison à domicile',
                  description: 'Récupération gratuite en agence ou livraison à l\'adresse de votre choix. Votre véhicule vous attend.',
                },
              ].map(({ step, title, description }) => (
                <div key={step} className="group flex items-start space-x-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gray-700 text-white font-bold flex items-center justify-center text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-gray-600 transition-colors duration-300">
                      {title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-center lg:justify-start">
              <FancyButtonDark 
                label="Commencer maintenant" 
                onClick={() => onPageChange('vehicles')}
                icon={<ChevronRight className="w-5 h-5" />}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ───────── ENHANCED SERVICES SECTION ───────── */}
      <section className="py-24 px-4 bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-6">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-gray-500 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200">
              Explorez l'Excellence de Nos Services
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Nos{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-700">
                Services
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Des solutions adaptées à tous vos besoins de mobilité, avec un service client exceptionnel.
            </p>
          </div>

          {/* Mobile Services Carousel */}
          <div className="block md:hidden relative">
            <div className="overflow-hidden">
              <div 
                ref={servicesScrollRef}
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentServiceIndex * 100}%)` }}
              >
                {services.map((service, index) => (
                  <div
                    key={service.key}
                    className="w-full flex-shrink-0 px-4"
                  >
                    <div
                      className="group relative rounded-3xl overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-500 bg-white"
                      onClick={() => onPageChange('service-detail', service.key)}
                    >
                      {/* Image Container */}
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={service.img}
                          alt={service.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      </div>

                      {/* Content */}
                      <div className="p-8 space-y-4">
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-gray-500 transition-colors duration-300">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {service.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => scrollServices('left')}
                className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                disabled={currentServiceIndex === 0}
              >
                <ChevronLeft className={`w-6 h-6 ${currentServiceIndex === 0 ? 'text-gray-400' : 'text-gray-600 group-hover:text-gray-900'}`} />
              </button>

              {/* Service Indicators */}
              <div className="flex space-x-2">
                {services.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentServiceIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentServiceIndex 
                        ? 'bg-gray-700 w-8' 
                        : 'bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => scrollServices('right')}
                className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                disabled={currentServiceIndex === services.length - 1}
              >
                <ChevronRight className={`w-6 h-6 ${currentServiceIndex === services.length - 1 ? 'text-gray-400' : 'text-gray-600 group-hover:text-gray-900'}`} />
              </button>
            </div>
          </div>

          {/* Desktop Services Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.key}
                className="group relative rounded-3xl overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-500 bg-white"
                onClick={() => onPageChange('service-detail', service.key)}
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={service.img}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-8 space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-gray-500 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* ───────── ENHANCED FAQ SECTION ───────── */}
      
        <section id="faq" ref={faqRef} className="py-24 px-4 bg-gradient-to-r from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-6">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-gray-300 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              Questions fréquentes
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              FAQ
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Trouvez rapidement les réponses à vos questions les plus courantes.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "Quel âge faut-il avoir pour louer une voiture ?",
                answer: "Vous devez avoir au moins 21 ans et posséder un permis de conduire valide depuis au minimum 1 an. Pour certains véhicules premium, l'âge minimum peut être de 25 ans."
              },
              {
                question: "Puis-je modifier ou annuler ma réservation ?",
                answer: "Oui, vous pouvez modifier votre réservation jusqu'à 48h avant la prise en charge sans frais. L'annulation est possible jusqu'à 24h avant sans pénalité."
              },
              {
                question: "L'assurance est-elle incluse ?",
                answer: "Absolument ! Tous nos abonnements incluent une assurance tous risques avec franchise réduite, plus une assistance dépannage 24/7 sur tout le territoire marocain."
              },
              {
                question: "Quelles sont les zones de livraison couvertes ?",
                answer: "Nous livrons dans toutes les grandes villes du Maroc : Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir. La livraison en centre-ville est gratuite."
              },
              {
                question: "Quel est le kilométrage inclus dans l'abonnement ?",
                answer: "Le kilométrage varie selon votre forfait : de 1 500 km/mois à illimité. Vous pouvez ajuster votre forfait à tout moment selon vos besoins réels."
              },
              {
                question: "Que se passe-t-il en cas de panne ou d'accident ?",
                answer: "Notre service d'assistance 24/7 intervient rapidement. En cas de panne, nous organisons le dépannage. En cas d'accident, nous gérons toutes les démarches avec les assurances."
              },
            ].map((item, index) => (
              <div key={index} className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                <h3 className="text-lg font-bold text-white mb-4 ">
                  {item.question}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>

        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8 mt-16">
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Prêt à Réserver Votre Voiture ?
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Rejoignez des milliers de clients satisfaits et découvrez une nouvelle façon de conduire.
              Simple, flexible, tout inclus.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <FancyButton
              label="Réserver maintenant"
              onClick={() => onPageChange('vehicles')}
              icon={<ChevronRight className="w-5 h-5" />}
            />
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;