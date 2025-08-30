import React, { useEffect, useState } from "react";
import {
  CarFront,
  CheckCircle,
  CalendarClock,
  ArrowLeft,
  AlarmClock,
  User2,
  Shield,
  RefreshCw,
  AlertTriangle,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import FancyButtonDark from "../components/FancyButtonDark";
import type { CarType } from '../types/cars';


 // Service API 
const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';


type PlanData = {
  carId: string;
  engagement: number;
  mileage: number;
  insurance: boolean;
  price: number;
  startDate: string;
  form?: any;
};




const carService = {
  async getCarById(carId: string): Promise<CarType | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${carId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const car = await response.json();
      return car;
    } catch (error) {
      console.error('Erreur lors de la récupération de la voiture:', error);
      throw error;
    }
  },

  async getAllCars(): Promise<CarType[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/cars`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const cars = await response.json();
      return cars;
    } catch (error) {
      console.error('Erreur lors de la récupération des voitures:', error);
      throw error;
    }
  }
};

const Loader = ({ text = "Chargement..." }) => (
  <div className="flex flex-col items-center justify-center h-80">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gradient-to-r from-blue-500 to-purple-600 mb-4" />
    <p className="text-gray-600 animate-pulse">{text}</p>
  </div>
);

const NoPlan = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-6 py-12">
    <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md text-center ">
      <div className="w-20 h-20 bg-gradient-to-br from-black to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <CarFront className="h-10 w-10 text-white" />
      </div>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
        Aucun abonnement actif
      </h1>
      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
        Vous n'avez pas encore d'abonnement. Découvrez nos formules flexibles et trouvez le véhicule qui vous correspond !
      </p>
      <FancyButtonDark
        label="Nos véhicules"
        onClick={() => window.location.href = "/vehicles"}
      />
    </div>
  </div>
);

const CarNotFound = ({ carId }: { carId: string }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 px-6 py-12">
    <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertTriangle className="h-10 w-10 text-white" />
      </div>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
        Véhicule introuvable
      </h1>
      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
        Le véhicule associé à votre abonnement (ID: {carId}) n'a pas pu être trouvé.
      </p>
      <div className="space-y-4">
        <FancyButtonDark
          label="Contacter le support"
          onClick={() => alert("À venir : contacter le support.")}
        />
        <button
          onClick={() => window.location.href = "/vehicles"}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl transition-colors duration-200"
        >
          Voir nos véhicules
        </button>
      </div>
    </div>
  </div>
);

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

const StatusBadge = ({ status, daysLeft }: { status: 'active' | 'warning' | 'expired', daysLeft?: number }) => {
  const styles = {
    active: "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
    warning: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white",
    expired: "bg-gradient-to-r from-red-500 to-pink-600 text-white"
  };

  const icons = {
    active: <CheckCircle className="h-4 w-4" />,
    warning: <AlarmClock className="h-4 w-4" />,
    expired: <AlertTriangle className="h-4 w-4" />
  };

  const text = {
    active: "Actif",
    warning: `${daysLeft} jour${daysLeft && daysLeft > 1 ? 's' : ''} restant${daysLeft && daysLeft > 1 ? 's' : ''}`,
    expired: "Expiré"
  };

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-lg ${styles[status]} animate-pulse`}>
      {icons[status]}
      {text[status]}
    </div>
  );
};

const InfoCard = ({ icon, title, children, className = "" }: { 
  icon: React.ReactNode, 
  title: string, 
  children: React.ReactNode,
  className?: string 
}) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 p-6 group ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

const MyPlanPage: React.FC = () => {
  const [plan, setPlan] = useState<PlanData | null>(null);
  const [car, setCar] = useState<CarType | null>(null);
  const [loading, setLoading] = useState(true);
  const [carLoading, setCarLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [carError, setCarError] = useState<string | null>(null);

  // Récupération du plan d'abonnement
  useEffect(() => {
    let isCancelled = false;
    async function fetchPlan() {
      setLoading(true);
      setError(null);
      try {
        const user = getAuth().currentUser;
        if (!user) throw new Error("Utilisateur non connecté");
        
        // Firestore
        const docRef = doc(db, "users", user.uid, "subscription", "current");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const planData = docSnap.data() as PlanData;
          setPlan(planData);
        } else {
          // Fallback localStorage
          const planStr = localStorage.getItem(`user_plan_${user.uid}`);
          const planData = planStr ? JSON.parse(planStr) : null;
          setPlan(planData);
        }
      } catch (err: any) {
        setError(err.message || "Erreur de chargement");
        setPlan(null);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }
    fetchPlan();
    return () => { isCancelled = true; };
  }, []);

  // Récupération des données de la voiture depuis l'API
  useEffect(() => {
    let isCancelled = false;
    async function fetchCar() {
      if (!plan?.carId) return;
      
      setCarLoading(true);
      setCarError(null);
      try {
        const carData = await carService.getCarById(plan.carId);
        if (!isCancelled) {
          setCar(carData);
          if (!carData) {
            setCarError(`Véhicule avec l'ID ${plan.carId} introuvable`);
          }
        }
      } catch (err: any) {
        if (!isCancelled) {
          setCarError(err.message || "Erreur lors du chargement du véhicule");
          setCar(null);
        }
      } finally {
        if (!isCancelled) setCarLoading(false);
      }
    }
    
    fetchCar();
    return () => { isCancelled = true; };
  }, [plan?.carId]);

  // États de chargement et d'erreur
  if (loading) return <Loader text="Chargement de votre abonnement..." />;
  
  if (error) return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="h-8 w-8 text-white" />
        </div>
        <p className="text-red-600 mb-6 text-lg">Erreur : {error}</p>
        <FancyButtonDark 
          label="Nos véhicules" 
          onClick={() => window.location.href = "/vehicles"} 
        />
      </div>
    </div>
  );
  
  if (!plan) return <NoPlan />;
  
  if (carError || (!carLoading && !car)) {
    return <CarNotFound carId={plan.carId} />;
  }

  const userForm = plan.form || {};
  const clientName = userForm.prenom || "" + (userForm.nom ? " " + userForm.nom : "");

  // Calcul date fin abonnement et statut
  let endDate = "-";
  let status: 'active' | 'warning' | 'expired' = 'active';
  let daysLeft = 0;
  
  if (plan.startDate && plan.engagement) {
    const d = new Date(plan.startDate);
    d.setMonth(d.getMonth() + plan.engagement);
    endDate = formatDate(d.toISOString());

    const now = new Date();
    daysLeft = Math.floor((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
      status = 'expired';
    } else if (daysLeft < 30) {
      status = 'warning';
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => window.location.href = "/"}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" /> 
            Retour à l'accueil
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-black to-gray-800 bg-clip-text text-transparent mb-4">
            Mon Abonnement
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Gérez votre abonnement et découvrez tous les détails de votre formule
          </p>
          <div className="mt-6">
            <StatusBadge status={status} daysLeft={daysLeft} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Vehicle Card - Spans 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="bg-gradient-to-r from-black to-gray-800 p-6">
                <h2 className="text-2xl font-bold text-white mb-2">Votre Véhicule</h2>
                <p className="text-blue-100">Profitez de votre mobilité en toute sérénité</p>
              </div>
              
              <div className="p-8">
                {carLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader text="Chargement du véhicule..." />
                  </div>
                ) : car ? (
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="relative group-hover:scale-105 transition-transform duration-500">
                      <img
                        src={car.image}
                        alt={car.name}
                        className="h-40 w-60 object-cover rounded-2xl shadow-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-car.jpg"; // Image de fallback
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">{car.name}</h3>
                      <p className="text-lg text-gray-600 mb-3">{car.category}</p>
                      <p className="text-gray-500 mb-4 leading-relaxed">{car.description}</p>
                      
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {car.features.map((feature, index) => (
                          <span 
                            key={index} 
                            className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full border border-blue-200 hover:shadow-md transition-shadow duration-200"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                      
                      {/* Informations techniques */}
                      <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Transmission:</span>
                          <span>{car.transmission}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Carburant:</span>
                          <span>{car.fuel}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Places:</span>
                          <span>{car.seats}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Impossible de charger les informations du véhicule</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Card */}
          <div className="space-y-6">
            <InfoCard 
              icon={<CreditCard className="h-5 w-5" />} 
              title="Paiement Mensuel"
              className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
            >
              <div className="space-y-4">
                <div className="text-center p-4 bg-white rounded-xl border border-green-200">
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {plan.price} €
                  </div>
                  <div className="text-sm text-gray-500">par mois</div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prochain paiement :</span>
                    <span className="font-medium">{formatDate(plan.startDate)}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  Toutes charges incluses
                </div>
              </div>
            </InfoCard>

            {/* Quick Actions */}
            <div className="space-y-3">
              <button
                className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 py-4 rounded-xl flex items-center justify-center gap-3 font-medium transition-all duration-300 shadow-lg hover:shadow-xl group"
                onClick={() => alert("À venir : modification ou résiliation d'abonnement.")}
              >
                <RefreshCw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                Gérer mon abonnement
              </button>
              
              <button
                className="w-full bg-white hover:bg-red-50 text-red-600 border-2 border-red-200 hover:border-red-300 px-6 py-4 rounded-xl flex items-center justify-center gap-3 font-medium transition-all duration-300 group"
                onClick={() => alert("À venir : contacter le support.")}
              >
                <User2 className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                Contacter le support
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Information Cards */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* Subscription Details */}
          <InfoCard 
            icon={<CalendarClock className="h-5 w-5" />} 
            title="Détails de l'Abonnement"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-gray-900">{plan.engagement}</div>
                  <div className="text-sm text-gray-500">mois d'engagement</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-gray-900">{plan.mileage}</div>
                  <div className="text-sm text-gray-500">km/mois inclus</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Début :</span>
                  <span className="font-medium">{formatDate(plan.startDate)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Fin prévue :</span>
                  <span className="font-medium">{endDate}</span>
                </div>
                {clientName && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">Titulaire :</span>
                    <span className="font-medium">{clientName}</span>
                  </div>
                )}
              </div>
            </div>
          </InfoCard>

          {/* Insurance & Services */}
          <InfoCard 
            icon={<Shield className="h-5 w-5" />} 
            title="Assurance & Services"
            className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
          >
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border-2 ${plan.insurance ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  {plan.insurance ? (
                    <>
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-green-800">Assurance tous risques</div>
                        <div className="text-sm text-green-600">Protection maximale incluse</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">Assurance de base</div>
                        <div className="text-sm text-gray-500">Protection standard</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Entretien et maintenance inclus
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Assistance 24h/24, 7j/7
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Véhicule de remplacement
                </div>
              </div>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default MyPlanPage;