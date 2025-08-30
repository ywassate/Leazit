import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthModal from "../components/AuthModal";
import SubscriptionConfigurator from "../components/SubscriptionConfigurator";
import {
  ArrowLeft,
  Share2,
  Heart,
  Star,
  Shield,
  Clock,
  Users,
  Settings,
  Fuel,
  Check,
  Zap,
  X,
  MapPin,
} from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { CarType } from "../types/cars";

type ReservationFormType = {
  engagementIndex: number;
  mileageIndex: number;
  insuranceIndex: number;
  driversCount: number;
  prenom: string;
  nom: string;
  type: string;
  email: string;
  tel: string;
  adresse: string;
  codePostal: string;
  etage: string;
  porte: string;
  entreprise: string;
  accepteContrat: boolean;
  assuranceRisque?: boolean;
};

interface VehicleDetailsPageProps {
  selectedCarId: string;
  onPageChange: (page: string, data?: any) => void;
  onReserve: () => void;
}

/** === API === */
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api";
const api = (path: string) =>
  `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** --- Utils --- */
const ensureJson = async (res: Response) => {
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const text = await res.text();
    throw new Error(
      `Réponse non-JSON (Content-Type: ${ct}). Extrait: ${text.slice(0, 120)}…`
    );
  }
  return res.json();
};

const VehicleDetailsPage: React.FC<VehicleDetailsPageProps> = ({
  selectedCarId,
  onPageChange,
  onReserve,
}) => {
  // Données
  const [car, setCar] = useState<CarType | null>(null);
  const [similarCars, setSimilarCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Form global
  const [form, setFormState] = useState<ReservationFormType>({
    engagementIndex: 0,
    mileageIndex: 0,
    insuranceIndex: 0,
    driversCount: 1,
    prenom: "",
    nom: "",
    type: "",
    email: "",
    tel: "",
    adresse: "",
    codePostal: "",
    etage: "",
    porte: "",
    entreprise: "",
    accepteContrat: false,
    assuranceRisque: false,
  });

  const setForm = (patch: Partial<ReservationFormType>) =>
    setFormState((f) => ({ ...f, ...patch }));

  /** --- API calls --- */
  const fetchCarById = async (carId: string): Promise<CarType | null> => {
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken?.();
    const res = await fetch(api(`/vehicles/${carId}`), {
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);
    return ensureJson(res);
  };

  const fetchCarsByCategory = async (
    category: string,
    excludeId: string
  ): Promise<CarType[]> => {
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken?.();
    const res = await fetch(
      api(`/vehicles?category=${encodeURIComponent(category)}`),
      {
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
    if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);
    const data: CarType[] = await ensureJson(res);
    return data.filter((c) => c.id !== excludeId);
  };

  /** --- Auth state --- */
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  /** --- Load vehicle + similar --- */
  useEffect(() => {
    let cancelled = false;
    const loadCarData = async () => {
      try {
        setLoading(true);
        setError(null);

        const carData = await fetchCarById(selectedCarId);
        if (cancelled) return;

        if (!carData) {
          setCar(null);
          setError("Véhicule non trouvé");
          return;
        }

        setCar(carData);

        try {
          const similar = await fetchCarsByCategory(
            carData.category,
            carData.id
          );
          if (!cancelled) setSimilarCars(similar);
        } catch (e) {
          // On log sans bloquer l’affichage du véhicule
          console.warn("Erreur chargement véhicules similaires:", e);
          if (!cancelled) setSimilarCars([]);
        }
      } catch (err: any) {
        if (!cancelled) setError(err?.message || "Erreur lors du chargement");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (selectedCarId) loadCarData();
    return () => {
      cancelled = true;
    };
  }, [selectedCarId]);

  /** --- Reset UI when car changes --- */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedImageIndex(0);
    setFormState((f) => ({
      ...f,
      engagementIndex: 0,
      mileageIndex: 0,
      insuranceIndex: 0,
      driversCount: 1,
    }));
  }, [selectedCarId]);

  /** --- Reserve flow --- */
  const handleReservation = () => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      onPageChange("reservation", {
        selectedCarId,
        selectedOptions: {
          engagementIndex: form.engagementIndex,
          mileageIndex: form.mileageIndex,
          insuranceIndex: form.insuranceIndex,
          driversCount: form.driversCount,
        },
      });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "premium":
        return "from-purple-500 to-purple-600";
      case "berline":
        return "from-blue-500 to-blue-600";
      case "suv":
        return "from-green-500 to-green-600";
      case "citadine":
        return "from-orange-500 to-orange-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  /** --- Loading --- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <motion.div
          className="text-center max-w-md mx-auto px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Chargement du véhicule...
          </h2>
          <p className="text-gray-600">
            Veuillez patienter pendant que nous récupérons les informations.
          </p>
        </motion.div>
      </div>
    );
  }

  /** --- Error --- */
  if (error || !car) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <motion.div
          className="text-center max-w-md mx-auto px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {error || "Véhicule non trouvé"}
          </h2>
          <p className="text-gray-600 mb-8">
            {error || "Ce véhicule n'existe pas ou n'est plus disponible."}
          </p>
          <button
            onClick={() => onPageChange("vehicles")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg"
          >
            Retour aux véhicules
          </button>
        </motion.div>
      </div>
    );
  }

  /** --- View --- */
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => onPageChange("vehicles")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Retour aux véhicules</span>
            </motion.button>

            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-3 rounded-full transition-all duration-200 ${
                  isLiked
                    ? "bg-red-50 text-red-500"
                    : "bg-gray-50 text-gray-400 hover:text-red-500"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`} />
              </motion.button>
              <motion.button
                className="p-3 rounded-full bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Share2 className="h-6 w-6" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
          {/* Galerie */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative group">
              <motion.img
                src={car.gallery?.[selectedImageIndex] || car.image}
                alt={car.name}
                className="w-full h-96 lg:h-[500px] object-cover rounded-3xl shadow-2xl"
                layoutId="car-image"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />

              <div className="absolute top-6 left-6">
                {car.available ? (
                  <div className="flex items-center space-x-2 bg-white/95 backdrop-blur-md text-green-600 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Disponible immédiatement</span>
                  </div>
                ) : (
                  <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    Non disponible
                  </div>
                )}
              </div>

              <div className="absolute top-6 right-6">
                <span
                  className={`bg-gradient-to-r ${getCategoryColor(
                    car.category
                  )} text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg`}
                >
                  {car.category}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {(car.gallery && car.gallery.length > 0
                ? car.gallery
                : [car.image]
              ).map((img, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative rounded-2xl overflow-hidden transition-all duration-200 ${
                    selectedImageIndex === idx
                      ? "ring-4 ring-blue-500 ring-offset-2"
                      : "hover:ring-2 hover:ring-gray-300"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={img}
                    alt="miniature"
                    className="h-20 lg:h-24 w-full object-cover"
                  />
                  {selectedImageIndex === idx && (
                    <div className="absolute inset-0 bg-blue-500/20" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Informations */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {car.name}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">4.8</span>
                      <span className="text-sm">(124 avis)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl">
                  <Users className="h-6 w-6 text-blue-600 mb-2" />
                  <span className="font-semibold text-gray-900">
                    {car.seats}
                  </span>
                  <span className="text-sm text-gray-500">places</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl">
                  <Settings className="h-6 w-6 text-green-600 mb-2" />
                  <span className="font-semibold text-gray-900">
                    {car.transmission}
                  </span>
                  <span className="text-sm text-gray-500">transmission</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl">
                  {car.fuel === "Électrique" ? (
                    <Zap className="h-6 w-6 text-purple-600 mb-2" />
                  ) : (
                    <Fuel className="h-6 w-6 text-purple-600 mb-2" />
                  )}
                  <span className="font-semibold text-gray-900">
                    {car.fuel}
                  </span>
                  <span className="text-sm text-gray-500">énergie</span>
                </div>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {car.description}
              </p>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Équipements inclus
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {car.features.map((feature: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-sm text-gray-700"
                    >
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Configurateur */}
            <SubscriptionConfigurator car={car} form={form} setForm={setForm} />

            {/* CTA */}
            <motion.button
              onClick={handleReservation}
              disabled={authLoading}
              className={`w-full font-bold py-6 px-8 rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl text-lg ${
                authLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white"
              }`}
              whileHover={authLoading ? {} : { scale: 1.02 }}
              whileTap={authLoading ? {} : { scale: 0.98 }}
            >
              {authLoading ? "Vérification..." : "Continuer la réservation"}
            </motion.button>

            {/* Garanties */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="p-3 bg-green-100 rounded-full">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Assurance incluse
                </span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="p-3 bg-blue-100 rounded-full">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Livraison gratuite
                </span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Support 24/7
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Similaires */}
        {similarCars.length > 0 && (
          <motion.div
            className="mt-24"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Véhicules similaires
              </h2>
              <p className="text-xl text-gray-600">
                Découvrez d'autres véhicules de la même catégorie
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarCars.slice(0, 3).map((c, index) => (
                <motion.div
                  key={c.id}
                  onClick={() => onPageChange("vehicle-details", c.id)}
                  className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="relative">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4">
                      <span
                        className={`bg-gradient-to-r ${getCategoryColor(
                          c.category
                        )} text-white text-xs font-bold px-3 py-1 rounded-full`}
                      >
                        {c.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                      {c.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-gray-900">
                        {c.subscriptionOptions?.engagement?.[0]?.monthlyPrice ??
                          "-"}
                        €
                        <span className="text-sm font-normal text-gray-500 ml-1">
                          /mois
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-green-600">
                        <Check className="h-4 w-4" />
                        <span>Disponible</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal login */}
      <AnimatePresence>
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onSuccess={() => {
              setIsAuthenticated(true);
              setShowAuthModal(false);
              onReserve();
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VehicleDetailsPage;
