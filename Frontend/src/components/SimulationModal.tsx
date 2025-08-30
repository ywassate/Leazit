import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, X, Car, Calendar, Route, Shield, Users, MapPin, Sparkles, ArrowLeft, Check, Menu } from 'lucide-react';
import type { CarType } from '../types/cars';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface City {
  nom: string;
  facteur: number;
}

function normalize(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '');
}

const excludedCategories = ['economique', 'confort', 'premium'];

const SimulationModal: React.FC<SimulationModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [typeVehicule, setTypeVehicule] = useState('utilitaire');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({
    engagementIndex: 0,
    mileageIndex: 0,
    insuranceIndex: 0,
    driversCount: 0,
    ville: 'casablanca',
  });
  const [prixCalcule, setPrixCalcule] = useState(0);
  const [showFormulaire, setShowFormulaire] = useState(false);
  const [form, setForm] = useState({
    nom: '',
    email: '',
    tel: '',
    type: '',
    entreprise: '',
    message: ''
  });
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // États pour les données de l'API
  const [cars, setCars] = useState<CarType[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chargement des données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [vehiclesResponse, citiesResponse] = await Promise.all([
          fetch('http://localhost:5050/api/vehicles'),
          fetch('http://localhost:5050/api/cities')
        ]);

        if (!vehiclesResponse.ok) {
          throw new Error(`Erreur véhicules: ${vehiclesResponse.status}`);
        }
        if (!citiesResponse.ok) {
          throw new Error(`Erreur villes: ${citiesResponse.status}`);
        }

        const vehiclesData = await vehiclesResponse.json();
        const citiesData = await citiesResponse.json();

        setCars(vehiclesData);
        setCities(citiesData);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filtre les voitures par catégorie
  const carsFiltered = cars.filter(
    (car) => normalize(car.category) === normalize(typeVehicule)
  );

  const selectedCar = carsFiltered.length > 0 ? carsFiltered[carouselIndex % carsFiltered.length] : null;

  // Steps pour navigation mobile
  const steps = [
    { title: "Véhicule", icon: Car },
    { title: "Options", icon: Menu },
    { title: "Récapitulatif", icon: Check }
  ];

  // Touch handlers pour carousel
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && carsFiltered.length > 1) {
      setCarouselIndex((carouselIndex + 1) % carsFiltered.length);
    }
    if (isRightSwipe && carsFiltered.length > 1) {
      setCarouselIndex((carouselIndex - 1 + carsFiltered.length) % carsFiltered.length);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Met à jour les options dispo à chaque changement de véhicule
  useEffect(() => {
    if (selectedCar) {
      setSelectedOptions({
        engagementIndex: 0,
        mileageIndex: 0,
        insuranceIndex: 0,
        driversCount: 0,
        ville: selectedOptions.ville || 'casablanca',
      });
    }
  }, [selectedCar]);

  // Calcul du prix
  useEffect(() => {
    if (!selectedCar || !cities.length) return;
    
    const engagement = selectedCar?.subscriptionOptions?.engagement?.[selectedOptions.engagementIndex]
    ?? { monthlyPrice: 0, months: 0 };

    const mileage = selectedCar?.subscriptionOptions?.mileage?.[selectedOptions.mileageIndex]
      ?? { km: 0, additionalPrice: 0 };

    const insurance = selectedCar?.subscriptionOptions?.insurance?.[selectedOptions.insuranceIndex]
      ?? { franchiseAmount: 0, additionalPrice: 0, type: '' };

    const additionalDriverPrice = selectedCar?.subscriptionOptions?.additionalDriverPrice ?? 0;
    const ville = cities.find((c) => normalize(c.nom) === normalize(selectedOptions.ville)) ?? { facteur: 1 };

    const basePrice = engagement.monthlyPrice;
    const kmSupp = mileage.additionalPrice;
    const assuranceSupp = insurance.additionalPrice;
    const driversSupp = selectedOptions.driversCount * additionalDriverPrice;

    let total = basePrice + kmSupp + assuranceSupp + driversSupp;
    total = Math.round(total * ville.facteur);
    setPrixCalcule(total);

  }, [selectedOptions, selectedCar, cities]);

  if (!isOpen) return null;

  // État de chargement
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
        <div className="bg-white rounded-xl p-8 shadow-xl">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            <p className="text-slate-600">Chargement des données...</p>
          </div>
        </div>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
        <div className="bg-white rounded-xl p-8 shadow-xl max-w-md">
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 bg-red-100 rounded-full">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-slate-900 mb-2">Erreur de chargement</h3>
              <p className="text-slate-600 text-sm mb-4">{error}</p>
              <button
                onClick={onClose}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dropdowns dynamiques
  const engagements = selectedCar?.subscriptionOptions?.engagement || [];
  const mileages = selectedCar?.subscriptionOptions?.mileage || [];
  const insurances = selectedCar?.subscriptionOptions?.insurance || [];
  const additionalDriverPrice = selectedCar?.subscriptionOptions?.additionalDriverPrice ?? 0;

  // Mobile Step Navigation
  const MobileStepNavigation = () => (
    <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2">
      <div className="flex items-center justify-between mb-2">
        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <h3 className="text-base font-semibold text-slate-900 flex-1 text-center">
          {steps[currentStep].title}
        </h3>
        <div className="w-7" />
      </div>
      <div className="flex space-x-1">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex-1 h-1.5 rounded-full transition-colors ${
              index <= currentStep ? 'bg-green-500' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
    </div>
  );

  // Mobile Step Content
  const renderMobileStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="p-3 space-y-4">
            {/* Type de véhicule */}
            <div className="bg-white rounded-lg border border-slate-200 p-3">
              <h3 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-600" />
                Type de véhicule
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {Array.from(new Set(cars.map(car => normalize(car.category))))
                  .filter((cat) => !excludedCategories.includes(normalize(cat)))
                  .map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setTypeVehicule(cat);
                        setCarouselIndex(0);
                      }}
                      className={`w-full p-3 rounded-lg font-medium text-left transition-all duration-200 text-sm ${
                        normalize(typeVehicule) === cat
                          ? 'bg-gradient-to-r from-slate-900 to-slate-700 text-white shadow-md'
                          : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
              </div>
            </div>

            {/* Carousel véhicule mobile */}
            <div className="bg-white rounded-lg border border-slate-200 p-3">
              <h3 className="text-base font-semibold text-slate-900 mb-3">Choisir le modèle</h3>
              <div 
                className="relative"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="w-full h-32 bg-slate-100 rounded-lg overflow-hidden mb-3">
                  {selectedCar && (
                    <img
                      src={selectedCar.image}
                      alt={selectedCar.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() =>
                      setCarouselIndex((carouselIndex - 1 + carsFiltered.length) % carsFiltered.length)
                    }
                    className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                    disabled={carsFiltered.length <= 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="text-center">
                    <h4 className="font-medium text-slate-900 text-sm">{selectedCar?.name}</h4>
                    <p className="text-xs text-slate-600">
                      {carouselIndex + 1} / {carsFiltered.length}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setCarouselIndex((carouselIndex + 1) % carsFiltered.length)}
                    className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                    disabled={carsFiltered.length <= 1}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(1)}
              className="w-full bg-gradient-to-r from-slate-900 to-slate-700 text-white py-3 px-4 rounded-lg font-medium hover:from-slate-800 hover:to-slate-600 transition-all duration-200 shadow-md text-sm"
              disabled={!selectedCar}
            >
              Configurer les options
            </button>
          </div>
        );

      case 1:
        return (
          <div className="p-3 space-y-3">
            {/* Engagement */}
            <div className="bg-white rounded-lg border border-slate-200 p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-emerald-100 rounded-md">
                  <Calendar className="w-3 h-3 text-emerald-600" />
                </div>
                <label className="font-medium text-slate-900 text-sm">Engagement</label>
              </div>
              <select
                className="w-full p-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm"
                value={selectedOptions.engagementIndex}
                onChange={e => setSelectedOptions({ ...selectedOptions, engagementIndex: Number(e.target.value) })}
              >
                {engagements.map((opt, idx) => (
                  <option key={idx} value={idx}>
                    {opt.months === 0 ? "Sans engagement" : `${opt.months} mois`} - {opt.monthlyPrice}€
                  </option>
                ))}
              </select>
            </div>

            {/* Kilométrage */}
            <div className="bg-white rounded-lg border border-slate-200 p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-purple-100 rounded-md">
                  <Route className="w-3 h-3 text-purple-600" />
                </div>
                <label className="font-medium text-slate-900 text-sm">Kilométrage</label>
              </div>
              <select
                className="w-full p-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm"
                value={selectedOptions.mileageIndex}
                onChange={e => setSelectedOptions({ ...selectedOptions, mileageIndex: Number(e.target.value) })}
              >
                {mileages.map((opt, idx) => (
                  <option key={idx} value={idx}>
                    {opt.km} km/mois {opt.additionalPrice > 0 ? `+${opt.additionalPrice}€/mois` : "(inclus)"}
                  </option>
                ))}
              </select>
            </div>

            {/* Assurance */}
            <div className="bg-white rounded-lg border border-slate-200 p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-orange-100 rounded-md">
                  <Shield className="w-3 h-3 text-orange-600" />
                </div>
                <label className="font-medium text-slate-900 text-sm">Assurance</label>
              </div>
              <select
                className="w-full p-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm"
                value={selectedOptions.insuranceIndex}
                onChange={e => setSelectedOptions({ ...selectedOptions, insuranceIndex: Number(e.target.value) })}
              >
                {insurances.map((opt, idx) => (
                  <option key={idx} value={idx}>
                    {opt.type} ({opt.franchiseAmount}€) {opt.additionalPrice > 0 ? `+${opt.additionalPrice}€/mois` : "(inclus)"}
                  </option>
                ))}
              </select>
            </div>

            {/* Ville */}
            <div className="bg-white rounded-lg border border-slate-200 p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-teal-100 rounded-md">
                  <MapPin className="w-3 h-3 text-teal-600" />
                </div>
                <label className="font-medium text-slate-900 text-sm">Ville de livraison</label>
              </div>
              <select
                className="w-full p-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm"
                value={selectedOptions.ville}
                onChange={e => setSelectedOptions({ ...selectedOptions, ville: e.target.value })}
              >
                {cities.map((ville, i) => (
                  <option key={i} value={ville.nom.toLowerCase()}>
                    {ville.nom}
                  </option>
                ))}
              </select>
            </div>

            {/* Conducteurs additionnels */}
            <div className="bg-white rounded-lg border border-slate-200 p-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-indigo-100 rounded-md">
                  <Users className="w-3 h-3 text-indigo-600" />
                </div>
                <label className="font-medium text-slate-900 text-sm">Conducteurs additionnels</label>
              </div>
              <div className="flex items-center justify-center gap-3 mb-2">
                <button
                  type="button"
                  className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg text-lg font-bold text-slate-700 transition-all duration-200"
                  onClick={() => setSelectedOptions(o => ({ ...o, driversCount: Math.max(0, o.driversCount - 1) }))}
                >
                  –
                </button>
                <div className="w-12 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-lg font-bold text-slate-900">
                  {selectedOptions.driversCount}
                </div>
                <button
                  type="button"
                  className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg text-lg font-bold text-slate-700 transition-all duration-200"
                  onClick={() => setSelectedOptions(o => ({ ...o, driversCount: o.driversCount + 1 }))}
                >
                  +
                </button>
              </div>
              <p className="text-center text-slate-600 text-xs">
                +{additionalDriverPrice}€/mois par conducteur supplémentaire
              </p>
            </div>

            <button
              onClick={() => setCurrentStep(2)}
              className="w-full bg-gradient-to-r from-slate-900 to-slate-700 text-white py-3 px-4 rounded-lg font-medium hover:from-slate-800 hover:to-slate-600 transition-all duration-200 shadow-md text-sm"
            >
              Voir le récapitulatif
            </button>
          </div>
        );

      case 2:
        return (
          <div className="p-3 space-y-4">
            {/* Prix principal */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold mb-1">
                {prixCalcule.toLocaleString()}€
              </div>
              <p className="text-slate-300 text-sm">TTC par mois</p>
            </div>

            {/* Détail du véhicule */}
            <div className="bg-white rounded-lg border border-slate-200 p-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-16 h-12 bg-slate-100 rounded-md overflow-hidden">
                  {selectedCar && (
                    <img
                      src={selectedCar.image}
                      alt={selectedCar.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 text-sm">{selectedCar?.name}</h3>
                  <p className="text-slate-600 text-xs capitalize">{typeVehicule}</p>
                </div>
              </div>
            </div>

            {/* Résumé configuration */}
            <div className="bg-white rounded-lg border border-slate-200 p-3">
              <h3 className="font-medium text-slate-900 mb-2 text-sm">Configuration</h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Engagement:</span>
                  <span className="font-medium">
                    {engagements[selectedOptions.engagementIndex]?.months === 0 
                      ? "Sans engagement" 
                      : `${engagements[selectedOptions.engagementIndex]?.months} mois`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Kilométrage:</span>
                  <span className="font-medium">{mileages[selectedOptions.mileageIndex]?.km} km/mois</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Assurance:</span>
                  <span className="font-medium">{insurances[selectedOptions.insuranceIndex]?.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Ville:</span>
                  <span className="font-medium capitalize">{selectedOptions.ville}</span>
                </div>
                {selectedOptions.driversCount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Conducteurs additionnels:</span>
                    <span className="font-medium">{selectedOptions.driversCount}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowFormulaire(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md flex items-center justify-center gap-2 text-sm"
            >
              <Sparkles className="w-4 h-4" />
              Demander un devis personnalisé
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm"
    >
      <div
        className={`bg-white text-slate-900 w-full  overflow-y-auto animate-in slide-in-from-bottom-4 duration-500 ${
          isMobile ? '' : 'rounded-xl max-w-5xl max-h-[90vh] m-4'
        }`}
      >

        
        {/* Header - adapté mobile/desktop */}
        <div className={`relative bg-gradient-to-br from-slate-50 to-white border-b border-slate-200/80 ${
          isMobile ? 'p-3' : 'p-4'
        }`}>
          <button 
            onClick={onClose} 
            className={`absolute top-3 right-3 p-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md ${
              isMobile ? 'z-10' : ''
            }`}
          >
            <X className="w-4 h-4" />
          </button>

          {!isMobile && (
            <div className="text-center max-w-xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-200/50 mb-3">
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">Simulation intelligente</span>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent mb-2">
                Configurez votre abonnement
              </h2>
            </div>
          )}

          {isMobile && (
            <div className="text-center pr-8">
              <h2 className="text-base font-bold text-slate-900">
                Configurez votre abonnement
              </h2>
            </div>
          )}
        </div>

        {/* Navigation mobile */}
        {isMobile && <MobileStepNavigation />}

        {/* Contenu principal */}
        {isMobile ? (
          <div className="min-h-0 bg-slate-50">
            {renderMobileStep()}
          </div>
        ) : (
          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Configuration Panel - Version Desktop optimisée */}
              <div className="lg:col-span-2 space-y-4">
                {/* Catégorie */}
                <div className="bg-gradient-to-br from-slate-50 to-white p-4 rounded-lg border border-slate-200/80 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-blue-100 rounded-md">
                      <Car className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">Type de véhicule</h3>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {Array.from(new Set(cars.map(car => normalize(car.category))))
                      .filter((cat) => !excludedCategories.includes(normalize(cat)))
                      .map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setTypeVehicule(cat);
                            setCarouselIndex(0);
                          }}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                            normalize(typeVehicule) === cat
                              ? 'bg-gradient-to-r from-slate-900 to-slate-700 text-white shadow-md scale-105'
                              : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-sm hover:scale-105'
                          }`}
                        >
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Options Grid - optimisé pour desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Engagement */}
                  <div className="bg-gradient-to-br from-white to-slate-50 p-4 rounded-lg border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-emerald-100 rounded-md">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                      </div>
                      <label className="text-sm font-semibold text-slate-900">Engagement</label>
                    </div>
                    <select
                      className="w-full p-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-slate-300 text-sm"
                      value={selectedOptions.engagementIndex}
                      onChange={e => setSelectedOptions({ ...selectedOptions, engagementIndex: Number(e.target.value) })}
                    >
                      {engagements.map((opt, idx) => (
                        <option key={idx} value={idx}>
                          {opt.months === 0 ? "Sans engagement" : `${opt.months} mois`} - {opt.monthlyPrice}€
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Kilométrage */}
                  <div className="bg-gradient-to-br from-white to-slate-50 p-4 rounded-lg border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-purple-100 rounded-md">
                        <Route className="w-4 h-4 text-purple-600" />
                      </div>
                      <label className="text-sm font-semibold text-slate-900">Kilométrage</label>
                    </div>
                    <select
                      className="w-full p-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-slate-300 text-sm"
                      value={selectedOptions.mileageIndex}
                      onChange={e => setSelectedOptions({ ...selectedOptions, mileageIndex: Number(e.target.value) })}
                    >
                      {mileages.map((opt, idx) => (
                        <option key={idx} value={idx}>
                          {opt.km} km/mois {opt.additionalPrice > 0 ? `+${opt.additionalPrice}€/mois` : "(inclus)"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Assurance */}
                  <div className="bg-gradient-to-br from-white to-slate-50 p-4 rounded-lg border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-orange-100 rounded-md">
                        <Shield className="w-4 h-4 text-orange-600" />
                      </div>
                      <label className="text-sm font-semibold text-slate-900">Assurance</label>
                    </div>
                    <select
                      className="w-full p-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-slate-300 text-sm"
                      value={selectedOptions.insuranceIndex}
                      onChange={e => setSelectedOptions({ ...selectedOptions, insuranceIndex: Number(e.target.value) })}
                    >
                      {insurances.map((opt, idx) => (
                        <option key={idx} value={idx}>
                          {opt.type} ({opt.franchiseAmount}€) {opt.additionalPrice > 0 ? `+${opt.additionalPrice}€/mois` : "(inclus)"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Ville de livraison */}
                  <div className="bg-gradient-to-br from-white to-slate-50 p-4 rounded-lg border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-teal-100 rounded-md">
                        <MapPin className="w-4 h-4 text-teal-600" />
                      </div>
                      <label className="text-sm font-semibold text-slate-900">Ville de livraison</label>
                    </div>
                    <select
                      className="w-full p-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-slate-300 text-sm"
                      value={selectedOptions.ville}
                      onChange={e => setSelectedOptions({ ...selectedOptions, ville: e.target.value })}
                    >
                      {cities.map((ville, i) => (
                        <option key={i} value={ville.nom.toLowerCase()}>
                          {ville.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Conducteurs additionnels */}
                <div className="bg-gradient-to-br from-white to-slate-50 p-4 rounded-lg border border-slate-200/80 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-indigo-100 rounded-md">
                      <Users className="w-4 h-4 text-indigo-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900">Conducteurs additionnels</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="w-10 h-10 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 rounded-lg text-lg font-bold text-slate-700 transition-all duration-200 hover:shadow-sm hover:scale-105 border border-slate-300"
                      onClick={() => setSelectedOptions(o => ({ ...o, driversCount: Math.max(0, o.driversCount - 1) }))}
                    >
                      –
                    </button>
                    <div className="w-12 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-lg font-bold text-slate-900">
                      {selectedOptions.driversCount}
                    </div>
                    <button
                      type="button"
                      className="w-10 h-10 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 rounded-lg text-lg font-bold text-slate-700 transition-all duration-200 hover:shadow-sm hover:scale-105 border border-slate-300"
                      onClick={() => setSelectedOptions(o => ({ ...o, driversCount: o.driversCount + 1 }))}
                    >
                      +
                    </button>
                    <div className="flex-1">
                      <span className="text-slate-600 font-medium text-sm">
                        +{additionalDriverPrice}€/mois par conducteur supplémentaire
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Panel */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white rounded-lg shadow-xl shadow-slate-900/25 overflow-hidden sticky top-4">
                  {/* Price Header */}
                  <div className="bg-gradient-to-r from-white/10 to-white/5 p-4 text-center border-b border-white/10">
                    <h3 className="text-sm font-semibold mb-3 text-slate-200">Votre abonnement mensuel</h3>
                    {selectedCar ? (
                      <>
                        <div className="text-3xl font-bold mb-1 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                          {prixCalcule.toLocaleString()}€
                        </div>
                        <p className="text-slate-300 text-sm font-medium">TTC par mois</p>
                      </>
                    ) : (
                      <p className="text-slate-400 text-sm">Aucun véhicule disponible</p>
                    )}
                  </div>

                  {/* Car Carousel */}
                  <div className="p-4">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <button
                        onClick={() =>
                          setCarouselIndex((carouselIndex - 1 + carsFiltered.length) % carsFiltered.length)
                        }
                        className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-110"
                        disabled={carsFiltered.length <= 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      
                      <div className="w-48 h-28 flex items-center justify-center bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                        {selectedCar && (
                          <img
                            src={selectedCar.image}
                            alt={selectedCar.name}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          />
                        )}
                      </div>
                      
                      <button
                        onClick={() => setCarouselIndex((carouselIndex + 1) % carsFiltered.length)}
                        className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-110"
                        disabled={carsFiltered.length <= 1}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-center text-slate-200 font-medium text-sm mb-6">
                      {selectedCar?.name}
                    </p>

                    <button
                      onClick={() => setShowFormulaire(true)}
                      className="w-full bg-gradient-to-r from-white to-slate-100 text-slate-900 py-3 px-4 rounded-lg font-semibold hover:from-slate-100 hover:to-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
                      disabled={!selectedCar}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Demander un devis personnalisé
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal formulaire - Optimisé mobile */}
        {showFormulaire && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-40 animate-in fade-in duration-300" style={{ top: isMobile ? '60px' : '0' }}>
            <div className={`bg-white shadow-2xl border border-slate-200/50 animate-in slide-in-from-bottom-4 duration-500 ${
              isMobile 
                ? 'w-full overflow-y-auto' 
                : 'rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto m-4'
            }`} style={{ height: isMobile ? 'calc(100vh - 60px)' : 'auto' }}>
              <div className={`bg-gradient-to-br from-slate-50 to-white border-b border-slate-200/80 ${
                isMobile ? 'p-3' : 'p-4'
              }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className={`font-bold text-slate-900 mb-1 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                      Finaliser votre demande
                    </h3>
                    <p className={`text-slate-600 ${isMobile ? 'text-sm' : 'text-base'}`}>
                      Nos experts vous contactent sous 2h ouvrées
                    </p>
                  </div>
                  <button
                    onClick={() => setShowFormulaire(false)}
                    className="p-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <form
                className={`space-y-4 ${isMobile ? 'p-3' : 'p-4'}`}
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Demande envoyée ! Nous vous contactons sous 2h.');
                  setShowFormulaire(false);
                  setForm({ nom: '', email: '', tel: '', type: '', entreprise: '', message: '' });
                }}
              >
                <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nom complet *</label>
                    <input 
                      type="text" 
                      required 
                      className={`w-full border border-slate-200 rounded-lg bg-white text-slate-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-slate-300 ${
                        isMobile ? 'p-2.5 text-sm' : 'p-3 text-sm'
                      }`}
                      value={form.nom} 
                      onChange={(e) => setForm({ ...form, nom: e.target.value })} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email *</label>
                    <input 
                      type="email" 
                      required 
                      className={`w-full border border-slate-200 rounded-lg bg-white text-slate-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-slate-300 ${
                        isMobile ? 'p-2.5 text-sm' : 'p-3 text-sm'
                      }`}
                      value={form.email} 
                      onChange={(e) => setForm({ ...form, email: e.target.value })} 
                    />
                  </div>
                </div>
                
                <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Téléphone *</label>
                    <input 
                      type="tel" 
                      required 
                      className={`w-full border border-slate-200 rounded-lg bg-white text-slate-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-slate-300 ${
                        isMobile ? 'p-2.5 text-sm' : 'p-3 text-sm'
                      }`}
                      value={form.tel} 
                      onChange={(e) => setForm({ ...form, tel: e.target.value })} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Type de client</label>
                    <select 
                      className={`w-full border border-slate-200 rounded-lg bg-white text-slate-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-slate-300 ${
                        isMobile ? 'p-2.5 text-sm' : 'p-3 text-sm'
                      }`}
                      value={form.type} 
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                    >
                      <option value="">Sélectionner...</option>
                      <option value="particulier">Particulier</option>
                      <option value="entreprise">Entreprise</option>
                      <option value="touriste">Touriste</option>
                    </select>
                  </div>
                </div>

                {form.type === 'entreprise' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nom de l'entreprise *</label>
                    <input 
                      type="text" 
                      required 
                      className={`w-full border border-slate-200 rounded-lg bg-white text-slate-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-slate-300 ${
                        isMobile ? 'p-2.5 text-sm' : 'p-3 text-sm'
                      }`}
                      value={form.entreprise} 
                      onChange={(e) => setForm({ ...form, entreprise: e.target.value })} 
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Commentaires ou besoins spécifiques</label>
                  <textarea 
                    rows={3} 
                    className={`w-full border border-slate-200 rounded-lg bg-white text-slate-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-slate-300 resize-none ${
                      isMobile ? 'p-2.5 text-sm' : 'p-3 text-sm'
                    }`}
                    value={form.message} 
                    onChange={(e) => setForm({ ...form, message: e.target.value })} 
                  />
                </div>
                
                <div className={`flex gap-3 pt-4 ${isMobile ? 'flex-col' : ''}`}>
                  <button 
                    type="button" 
                    onClick={() => setShowFormulaire(false)} 
                    className={`bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 hover:shadow-sm text-sm ${
                      isMobile ? 'w-full py-2.5 px-3' : 'flex-1 py-3 px-4'
                    }`}
                  >
                    Modifier ma configuration
                  </button>
                  <button 
                    type="submit" 
                    className={`bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-lg font-medium hover:from-slate-800 hover:to-slate-600 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 text-sm ${
                      isMobile ? 'w-full py-2.5 px-3' : 'flex-1 py-3 px-4'
                    }`}
                  >
                    Envoyer ma demande
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationModal;