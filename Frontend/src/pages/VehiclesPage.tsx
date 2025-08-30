// src/pages/VehiclesPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Fuel,
  Settings,
  Check,
  MapPin,
  Clock,
  Zap,
  Search,
} from "lucide-react";
import VehicleFilters from "../components/VehicleFilters";
import type { CarType, Brand } from "../types/cars";
import { matchesSearchQuery } from "../utils/searchUtils";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

function normalize(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

const VehiclesPage: React.FC<{
  onPageChange?: (page: string, data?: any) => void;
  onCarSelect: (carId: string) => void;
  initialCategory?: string;
}> = ({ onCarSelect, initialCategory }) => {
  // --- Données ---
  const [cars, setCars] = useState<CarType[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState<boolean>(false);
  const [brandsError, setBrandsError] = useState<string | null>(null);

  // --- Filtres / UI state ---
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || ""
  );
  const [durationType, setDurationType] = useState<"courte" | "longue">(
    "courte"
  );
  const [selectedTransmission, setSelectedTransmission] = useState<string>("");
  const [selectedFuel, setSelectedFuel] = useState<string>("");
  const [selectedEngagement, setSelectedEngagement] = useState<number | null>(
    null
  );

  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [sortBy, setSortBy] = useState<"price" | "name" | "category">("price");

  // Dropdowns
  const [showTransmissionDropdown, setShowTransmissionDropdown] =
    useState(false);
  const [showFuelDropdown, setShowFuelDropdown] = useState(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // --- Fetch véhicules ---
  useEffect(() => {
    fetch(`${API_BASE_URL}/vehicles`)
      .then((res) => res.json())
      .then((data: any[]) => {
        const normalized = (data || []).map((v) => ({
          ...v,
          brandId: String(v.brandId ?? ""),
        }));
        console.log("🚗 Vehicles loaded:", normalized);
        setCars(normalized);
      })
      .catch((err) => console.error("❌ Erreur chargement véhicules :", err));
  }, []);

  // --- Fetch marques ---
  useEffect(() => {
    setBrandsLoading(true);
    setBrandsError(null);
    fetch(`${API_BASE_URL}/brands`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: any[]) => {
        const normalized = (data || []).map((b) => ({
          ...b,
          id: String(b.id ?? ""),
        }));
        console.log("🏷️ Brands loaded:", normalized);
        setBrands(normalized);
      })
      .catch((err) => {
        console.error("❌ Erreur chargement marques :", err);
        setBrandsError("Impossible de charger les marques.");
      })
      .finally(() => setBrandsLoading(false));
  }, []);

  // --- Sync initialCategory si prop change ---
  useEffect(() => {
    setSelectedCategory(initialCategory || "");
  }, [initialCategory]);

  // --- Règles de filtre locales (cat/brand/transmission/fuel/engagement) ---
  const categoryMatches = (car: CarType): boolean => {
    if (!selectedCategory) return true;
    const cat = normalize(car.category);
    const sel = normalize(selectedCategory);
    if (sel === "premium") {
      return ["minisuv", "mini-suv", "suv", "premium"].includes(cat);
    }
    return cat === sel || cat.includes(sel);
  };

  const transmissionMatches = (car: CarType): boolean =>
    !selectedTransmission ||
    normalize(car.transmission) === normalize(selectedTransmission);

  const fuelMatches = (car: CarType): boolean =>
    !selectedFuel || normalize(car.fuel) === normalize(selectedFuel);

  // ✅ marquage strict par ID (cohérent avec VehicleFilters qui envoie brand.id)
  const brandMatches = (car: CarType): boolean => {
    if (!selectedBrand) return true;

    const match = car.brandId === selectedBrand;
    if (!match) {
      console.log("🔎 Brand mismatch:", {
        carId: car.id,
        carBrandId: car.brandId,
        selectedBrand,
        brands,
      });
    }
    return match;
  };

  const engagementMatches = (car: CarType): boolean => {
    if (selectedEngagement === null) return true;
    const list = car.subscriptionOptions?.engagement || [];
    return list.some((e: any) => e.months === selectedEngagement);
  };

  // --- Recherche: on délègue à utils/matchesSearchQuery ---
  const searchMatches = (car: CarType): boolean => {
    // On crée une vue "searchable" minimale qui respecte l’utilitaire
    // (on transmet le brand name pour enrichir la recherche)
    const searchableVehicle = {
      id: car.id,
      name: car.name,
      category: car.category,
      brandId: car.brandId,
      transmission: car.transmission,
      fuel: car.fuel,
      description: car.description,
      features: car.features,
    };
    return matchesSearchQuery(searchableVehicle as any, brands, searchQuery);
  };

  const getDisplayedPrice = (car: CarType): number => {
    if (selectedEngagement !== null && car.subscriptionOptions?.engagement) {
      const opt = car.subscriptionOptions.engagement.find(
        (e: any) => e.months === selectedEngagement
      );
      if (opt) return opt.monthlyPrice;
    }
    return car.subscriptionOptions?.engagement?.[0]?.monthlyPrice || 0;
  };

  // --- Filtrage + recherche ---
  const filteredCars = useMemo(() => {
    return cars.filter(
      (car) =>
        categoryMatches(car) &&
        transmissionMatches(car) &&
        fuelMatches(car) &&
        brandMatches(car) &&
        engagementMatches(car) &&
        searchMatches(car)
    );
  }, [
    cars,
    selectedCategory,
    selectedTransmission,
    selectedFuel,
    selectedBrand,
    selectedEngagement,
    searchQuery,
    brands,
  ]);

  // --- Tri (prix avec engagement, sinon nom/catégorie) ---
  const sortedCars = useMemo(() => {
    const arr = [...filteredCars];
    switch (sortBy) {
      case "price":
        arr.sort((a, b) => getDisplayedPrice(a) - getDisplayedPrice(b));
        break;
      case "name":
        arr.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "category":
        arr.sort((a, b) =>
          normalize(a.category).localeCompare(normalize(b.category))
        );
        break;
    }
    return arr;
  }, [filteredCars, sortBy, selectedEngagement]);

  // --- Carte véhicule (inchangée côté style/UX) ---
  const CarCard: React.FC<{ car: CarType; index: number }> = ({
    car,
    index,
  }) => {
    const getCategoryColor = (category: string) => {
      switch (normalize(category)) {
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

    return (
      <motion.div
        className={`group relative bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 ${
          !car.available ? "opacity-75" : ""
        }`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          ease: "easeOut",
        }}
        whileHover={{
          y: -1,
          transition: { duration: 0.4, ease: "easeOut" },
        }}
        onClick={() => onCarSelect(car.id)}
      >
        {/* Image avec overlay */}
        <div className="relative overflow-hidden">
          <div className="relative h-48 overflow-hidden">
            <img
              src={car.image}
              alt={car.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          </div>

          {/* Badge disponibilité */}
          <div className="absolute top-4 left-4">
            {car.available ? (
              <motion.div
                className="flex items-center space-x-2 bg-white/95 backdrop-blur-md text-green-600 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border border-green-100"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span>Disponible</span>
              </motion.div>
            ) : (
              <div className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                Non disponible
              </div>
            )}
          </div>

          {/* Badge catégorie */}
          <div className="absolute top-4 right-4">
            <span
              className={`bg-gradient-to-r ${getCategoryColor(
                car.category
              )} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/20`}
            >
              {car.category}
            </span>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              {car.name}
            </h3>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="flex flex-col items-center p-2.5 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors duration-200">
              <Users className="h-4 w-4 text-gray-600 group-hover:text-blue-600 mb-1" />
              <span className="text-sm font-semibold text-gray-900">
                {car.seats}
              </span>
              <span className="text-xs text-gray-500">places</span>
            </div>
            <div className="flex flex-col items-center p-2.5 bg-gray-50 rounded-xl group-hover:bg-green-50 transition-colors duration-200">
              <Settings className="h-4 w-4 text-gray-600 group-hover:text-green-600 mb-1" />
              <span className="text-sm font-semibold text-gray-900">
                {car.transmission}
              </span>
              <span className="text-xs text-gray-500">transmission</span>
            </div>
            <div className="flex flex-col items-center p-2.5 bg-gray-50 rounded-xl group-hover:bg-purple-50 transition-colors duration-200">
              {car.fuel === "Électrique" ? (
                <Zap className="h-4 w-4 text-gray-600 group-hover:text-purple-600 mb-1" />
              ) : (
                <Fuel className="h-4 w-4 text-gray-600 group-hover:text-purple-600 mb-1" />
              )}
              <span className="text-sm font-semibold text-gray-900">
                {car.fuel}
              </span>
              <span className="text-xs text-gray-500">énergie</span>
            </div>
          </div>

          {/* Features */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {car.features.slice(0, 2).map((feature: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1 bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full border border-green-200 font-medium"
                >
                  <Check className="h-2.5 w-2.5" />
                  <span>{feature}</span>
                </span>
              ))}
              {car.features.length > 2 && (
                <span className="text-xs text-gray-500 px-2.5 py-1 bg-gray-50 rounded-full font-medium">
                  +{car.features.length - 2} autres
                </span>
              )}
            </div>
          </div>

          {/* Prix */}
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {getDisplayedPrice(car)}€
              </div>
              <div className="text-xs text-gray-500 font-medium">
                par mois, tout inclus
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 text-xs text-green-600 mb-1">
                <MapPin className="h-3 w-3" />
                <span className="font-medium">Livraison gratuite</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-blue-600">
                <Clock className="h-3 w-3" />
                <span className="font-medium">24h/24</span>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-3xl pointer-events-none" />
        </div>
      </motion.div>
    );
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero */}
      <section className="py-16 px-4 bg-gradient-to-r from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-50">
              Découvrez notre flotte
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-50">
              Réservez votre véhicule en quelques clics selon vos besoins et
              votre budget
            </p>
          </div>
        </div>
      </section>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* Sidebar Filtres */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <VehicleFilters
                  vehicles={filteredCars}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedEngagement={selectedEngagement}
                  setSelectedEngagement={setSelectedEngagement}
                  durationType={durationType}
                  setDurationType={setDurationType}
                  selectedTransmission={selectedTransmission}
                  setSelectedTransmission={setSelectedTransmission}
                  selectedFuel={selectedFuel}
                  setSelectedFuel={setSelectedFuel}
                  selectedBrand={selectedBrand}
                  setSelectedBrand={setSelectedBrand}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  showTransmissionDropdown={showTransmissionDropdown}
                  setShowTransmissionDropdown={setShowTransmissionDropdown}
                  showFuelDropdown={showFuelDropdown}
                  setShowFuelDropdown={setShowFuelDropdown}
                  showBrandDropdown={showBrandDropdown}
                  setShowBrandDropdown={setShowBrandDropdown}
                  showSortDropdown={showSortDropdown}
                  setShowSortDropdown={setShowSortDropdown}
                  brands={brands}
                  brandsLoading={brandsLoading}
                  brandsError={brandsError}
                />

                <motion.button
                  onClick={() => {
                    setSelectedCategory("");
                    setSelectedTransmission("");
                    setSelectedFuel("");
                    setDurationType("courte");
                    setSelectedEngagement(null);
                    setSelectedBrand("");
                    setSearchQuery("");
                  }}
                  className="w-full mt-6 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Réinitialiser les filtres
                </motion.button>
              </div>
            </div>
          </div>

          {/* Zone des véhicules */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {sortedCars.length} véhicule{sortedCars.length > 1 ? "s" : ""}{" "}
                  disponible
                  {sortedCars.length > 1 ? "s" : ""}
                </h2>
                <p className="text-gray-500 mt-1">
                  Trouvez le véhicule parfait pour vos besoins
                </p>
              </div>
            </div>

            {sortedCars.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  staggerChildren: 0.1,
                  ease: "easeOut",
                }}
              >
                {sortedCars.map((car, index) => (
                  <CarCard key={car.id} car={car} index={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Aucun véhicule trouvé
                  </h3>
                  <p className="text-gray-500 text-lg mb-8">
                    Aucun véhicule ne correspond à vos critères de recherche.
                    Essayez d'ajuster vos filtres.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehiclesPage;
