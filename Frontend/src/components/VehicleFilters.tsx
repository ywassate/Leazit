// src/components/VehicleFilters.tsx
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck,
  Car as CarIcon,
  Settings,
  Fuel,
  ChevronDown,
  Crown,
  X,
  ArrowUpDown,
  Search,
  Building,
} from "lucide-react";

import type { Brand } from "../types/cars";

interface Props {
  vehicles: any[];
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedEngagement: number | null;
  setSelectedEngagement: (value: number | null) => void;
  durationType: "courte" | "longue";
  setDurationType: (value: "courte" | "longue") => void;
  selectedTransmission: string;
  setSelectedTransmission: (value: string) => void;
  selectedFuel: string;
  setSelectedFuel: (value: string) => void;
  selectedBrand: string;
  setSelectedBrand: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  sortBy: "price" | "name" | "category";
  setSortBy: (value: "price" | "name" | "category") => void;
  showTransmissionDropdown: boolean;
  setShowTransmissionDropdown: (value: boolean) => void;
  showFuelDropdown: boolean;
  setShowFuelDropdown: (value: boolean) => void;
  showBrandDropdown: boolean;
  setShowBrandDropdown: (value: boolean) => void;
  showSortDropdown: boolean;
  setShowSortDropdown: (value: boolean) => void;
  brands: Brand[];
  brandsLoading: boolean;
  brandsError: string | null;
}

const engagementOptions = [
  { months: 3, label: "3 mois", popular: false },
  { months: 6, label: "6 mois", popular: true },
  { months: 12, label: "12 mois", popular: false },
];

const VehicleFilters: React.FC<Props> = ({
  vehicles,
  selectedCategory,
  setSelectedCategory,
  selectedEngagement,
  setSelectedEngagement,
  selectedTransmission,
  setSelectedTransmission,
  selectedFuel,
  setSelectedFuel,
  selectedBrand,
  setSelectedBrand,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  showTransmissionDropdown,
  setShowTransmissionDropdown,
  showFuelDropdown,
  setShowFuelDropdown,
  showBrandDropdown,
  setShowBrandDropdown,
  showSortDropdown,
  setShowSortDropdown,
  brands,
  brandsLoading,
  brandsError,
}) => {
  const categories = [
    { id: "compact", label: "Compact", icon: CarIcon, color: "blue" },
    { id: "premium", label: "Premium", icon: Crown, color: "purple" },
    { id: "Utilitaire", label: "Utilitaire", icon: Truck, color: "green" },
  ];

  const transmissions = ["Manuelle", "Automatique"];
  const fuels = ["Essence", "Diesel", "Électrique", "Hybride"];

  const hasActiveFilters =
    selectedCategory ||
    selectedTransmission ||
    selectedFuel ||
    selectedBrand ||
    selectedEngagement !== null ||
    searchQuery.trim();

  const clearFilters = () => {
    console.log("🧹 Clear filters clicked");
    setSelectedCategory("");
    setSelectedTransmission("");
    setSelectedFuel("");
    setSelectedBrand("");
    setSelectedEngagement(null);
    setSearchQuery("");
  };

  // --- Debug props on mount/update
  useEffect(() => {
    console.log("🔁 VehicleFilters props:", {
      vehiclesCount: vehicles?.length ?? 0,
      selectedCategory,
      selectedEngagement,
      selectedTransmission,
      selectedFuel,
      selectedBrand,
      searchQuery,
      sortBy,
      showTransmissionDropdown,
      showFuelDropdown,
      showBrandDropdown,
      showSortDropdown,
      brandsCount: brands?.length ?? 0,
      brandsLoading,
      brandsError,
    });
  }, [
    vehicles,
    selectedCategory,
    selectedEngagement,
    selectedTransmission,
    selectedFuel,
    selectedBrand,
    searchQuery,
    sortBy,
    showTransmissionDropdown,
    showFuelDropdown,
    showBrandDropdown,
    showSortDropdown,
    brands,
    brandsLoading,
    brandsError,
  ]);

  useEffect(() => {
    console.log("📊 Vehicles length changed:", vehicles?.length ?? 0);
  }, [vehicles?.length]);

  useEffect(() => {
    if (brandsLoading) console.log("🏷️ Brands loading…");
  }, [brandsLoading]);

  useEffect(() => {
    if (brandsError) console.error("❌ Brands error:", brandsError);
  }, [brandsError]);

  // Outside click (utilise 'click' au lieu de 'mousedown')
  // Remplacer votre useClickOutside par ceci :
  function useClickOutside(
    ref: React.RefObject<HTMLElement>,
    isOpen: boolean,
    onClose: () => void,
    name: string // juste pour les logs (ex: 'brand' / 'fuel' / 'transmission' / 'sort')
  ) {
    const armedRef = React.useRef(false);

    useEffect(() => {
      if (isOpen) {
        armedRef.current = false;
        const t = setTimeout(() => {
          armedRef.current = true; // on arme après le tick d'ouverture
          console.log(`[${name}] armed=true`);
        }, 0);
        return () => clearTimeout(t);
      } else {
        armedRef.current = false;
        console.log(`[${name}] armed=false (closed)`);
      }
    }, [isOpen, name]);

    useEffect(() => {
      const onPointerDown = (event: PointerEvent) => {
        if (!isOpen) return;

        const el = ref.current;
        const target = event.target as Node | null;

        // Path robuste (Shadow DOM, React portals)
        const path = (event.composedPath && event.composedPath()) || [];
        const inPath = el ? path.includes(el) : false;

        // Fallback contains classique
        const inContains = el && target ? el.contains(target) : false;

        // Logs détaillés
        console.log(`[${name}] onPointerDown`, {
          isOpen,
          armed: armedRef.current,
          inPath,
          inContains,
          elExists: !!el,
          target,
        });

        // On ignore le clic qui a servi à ouvrir (pas encore armé)
        if (!armedRef.current) return;

        // Si clic à l’intérieur (path inclut le conteneur, ou el.contains(target)), on ignore
        if (inPath || inContains) return;

        console.log(`🖱️ [${name}] Click outside -> close dropdown`);
        onClose();
      };

      // capture:true pour devancer des stopPropagation en interne
      document.addEventListener("pointerdown", onPointerDown, {
        capture: true,
      });
      return () => {
        document.removeEventListener("pointerdown", onPointerDown, {
          capture: true,
        } as any);
      };
    }, [isOpen, onClose, ref, name]);
  }

  const transmissionRef = useRef<HTMLDivElement>(null);
  const fuelRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useClickOutside(
    transmissionRef,
    showTransmissionDropdown,
    () => setShowTransmissionDropdown(false),
    "transmission"
  );
  useClickOutside(
    fuelRef,
    showFuelDropdown,
    () => setShowFuelDropdown(false),
    "fuel"
  );
  useClickOutside(
    brandRef,
    showBrandDropdown,
    () => setShowBrandDropdown(false),
    "brand"
  );
  useClickOutside(
    sortRef,
    showSortDropdown,
    () => setShowSortDropdown(false),
    "sort"
  );

  // Get selected brand details
  const selectedBrandData = brands.find((b) => b.id === selectedBrand);

  // --- Handlers instrumentés
  const handleToggleBrand = () => {
    console.log("⤵️ Toggle brand dropdown:", !showBrandDropdown);
    setShowBrandDropdown(!showBrandDropdown);
  };

  const handleSelectBrand = (brandId: string) => {
    const exists = brands.some((b) => b.id === brandId);
    console.log("✅ Select brand:", { brandId, exists });
    if (!exists) {
      console.warn(
        "⚠️ Selected brandId not found in brands list:",
        brandId,
        brands
      );
    }
    setSelectedBrand(brandId);
    setShowBrandDropdown(false);
  };

  const handleClearBrand = () => {
    console.log("🧹 Clear brand filter");
    setSelectedBrand("");
    setShowBrandDropdown(false);
  };

  const handleSearchChange = (value: string) => {
    console.log("🔍 Search change:", value);
    setSearchQuery(value);
  };

  const handleToggleTransmission = () => {
    console.log("⤵️ Toggle transmission dropdown:", !showTransmissionDropdown);
    setShowTransmissionDropdown(!showTransmissionDropdown);
  };

  const handleSelectTransmission = (value: string) => {
    console.log("⚙️ Select transmission:", value || "(Toutes)");
    setSelectedTransmission(value);
    setShowTransmissionDropdown(false);
  };

  const handleToggleFuel = () => {
    console.log("⤵️ Toggle fuel dropdown:", !showFuelDropdown);
    setShowFuelDropdown(!showFuelDropdown);
  };

  const handleSelectFuel = (value: string) => {
    console.log("⛽ Select fuel:", value || "(Tous)");
    setSelectedFuel(value);
    setShowFuelDropdown(false);
  };

  const handleToggleSort = () => {
    console.log("⤵️ Toggle sort dropdown:", !showSortDropdown);
    setShowSortDropdown(!showSortDropdown);
  };

  const handleSelectSort = (value: "price" | "name" | "category") => {
    console.log("↕️ Select sort:", value);
    setSortBy(value);
    setShowSortDropdown(false);
  };

  const handleSelectCategory = (id: string) => {
    const next = id === selectedCategory ? "" : id;
    console.log("📁 Select category:", { from: selectedCategory, to: next });
    setSelectedCategory(next);
  };

  const handleSelectEngagement = (months: number | null) => {
    console.log("📅 Select engagement:", months);
    setSelectedEngagement(months);
  };

  return (
    <div className="space-y-6">
      {/* Header avec compteur */}
      <div className="flex items-center justify-between">
        {hasActiveFilters && (
          <motion.button
            onClick={clearFilters}
            className="flex items-center space-x-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <X className="h-3 w-3" />
            <span className="font-medium">Réinitialiser</span>
          </motion.button>
        )}
      </div>

      {/* Barre de recherche */}
      <div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Rechercher un véhicule..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Catégories */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
          Catégorie
        </h3>
        <div className="space-y-2">
          <motion.button
            onClick={() => handleSelectCategory("")}
            className={`w-full px-4 py-2.5 rounded-xl border transition-all duration-200 font-medium text-sm text-left ${
              selectedCategory === ""
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            Toutes les catégories
          </motion.button>

          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <motion.button
                key={category.id}
                onClick={() => handleSelectCategory(category.id)}
                className={`w-full px-4 py-2.5 rounded-xl border transition-all duration-200 flex items-center space-x-3 font-medium text-sm ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <IconComponent className="h-4 w-4" />
                <span>{category.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Marques */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
          Nos marques
        </h3>
        <div className="relative" ref={brandRef}>
          <motion.button
            onClick={handleToggleBrand}
            className={`w-full px-4 py-2.5 rounded-xl border transition-all duration-200 flex items-center justify-between font-medium text-sm ${
              selectedBrand
                ? "bg-blue-100 text-blue border-blue-100"
                : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300"
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center space-x-2">
              {selectedBrandData?.logo ? (
                <img
                  src={selectedBrandData.logo}
                  alt={selectedBrandData.name}
                  className="h-4 w-4 object-contain"
                />
              ) : (
                <Building className="h-4 w-4" />
              )}
              <span>{selectedBrandData?.name || "Toutes les marques"}</span>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                showBrandDropdown ? "rotate-180" : ""
              }`}
            />
          </motion.button>

          <AnimatePresence>
            {showBrandDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <button
                  onMouseDown={handleClearBrand}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors duration-150 font-medium text-sm text-gray-700 flex items-center space-x-2"
                >
                  <Building className="h-4 w-4" />
                  <span>Toutes les marques</span>
                </button>

                {brandsLoading && (
                  <div className="px-4 py-2.5 text-sm text-gray-500">
                    Chargement des marques...
                  </div>
                )}

                {brandsError && (
                  <div className="px-4 py-2.5 text-sm text-red-500">
                    {brandsError}
                  </div>
                )}

                {!brandsLoading &&
                  !brandsError &&
                  brands.map((brand) => (
                    <button
                      key={brand.id}
                      onMouseDown={() => handleSelectBrand(brand.id)}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors duration-150 font-medium text-sm text-gray-700 flex items-center space-x-2"
                    >
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="h-4 w-4 object-contain"
                        />
                      ) : (
                        <Building className="h-4 w-4" />
                      )}
                      <span>{brand.name}</span>
                    </button>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Engagement */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
          Engagement
        </h3>
        <div className="space-y-2">
          <motion.button
            onClick={() => handleSelectEngagement(null)}
            className={`w-full px-4 py-2.5 rounded-xl border transition-all duration-200 font-medium text-sm text-left ${
              selectedEngagement === null
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            Sans engagement
          </motion.button>
          {engagementOptions.map((opt) => (
            <motion.button
              key={opt.months}
              onClick={() => handleSelectEngagement(opt.months)}
              className={`relative w-full px-4 py-2.5 rounded-xl border transition-all duration-200 font-medium text-sm text-left ${
                selectedEngagement === opt.months
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {opt.popular && (
                <div className="absolute -top-1 -right-1 bg-blue-900 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                  ★
                </div>
              )}
              <span>{opt.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
          Transmission
        </h3>
        <div className="relative" ref={transmissionRef}>
          <motion.button
            onClick={handleToggleTransmission}
            className={`w-full px-4 py-2.5 rounded-xl border transition-all duration-200 flex items-center justify-between font-medium text-sm ${
              selectedTransmission
                ? "bg-blue-100 text-blue border-blue-100"
                : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300"
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>{selectedTransmission || "Toutes"}</span>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                showTransmissionDropdown ? "rotate-180" : ""
              }`}
            />
          </motion.button>

          <AnimatePresence>
            {showTransmissionDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <button
                  onMouseDown={() => handleSelectTransmission("")}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors duration-150 font-medium text-sm text-gray-700"
                >
                  Toutes
                </button>
                {transmissions.map((transmission) => (
                  <button
                    key={transmission}
                    onMouseDown={() => handleSelectTransmission(transmission)}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors duration-150 font-medium text-sm text-gray-700"
                  >
                    {transmission}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Carburant */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
          Carburant
        </h3>
        <div className="relative" ref={fuelRef}>
          <motion.button
            onClick={handleToggleFuel}
            className={`w-full px-4 py-2.5 rounded-xl border transition-all duration-200 flex items-center justify-between font-medium text-sm ${
              selectedFuel
                ? "bg-blue-100 text-blue border-blue-100"
                : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300"
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center space-x-2">
              <Fuel className="h-4 w-4" />
              <span>{selectedFuel || "Tous"}</span>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                showFuelDropdown ? "rotate-180" : ""
              }`}
            />
          </motion.button>

          <AnimatePresence>
            {showFuelDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <button
                  onMouseDown={() => handleSelectFuel("")}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors duration-150 font-medium text-sm text-gray-700"
                >
                  Tous
                </button>
                {fuels.map((fuel) => (
                  <button
                    key={fuel}
                    onMouseDown={() => handleSelectFuel(fuel)}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors duration-150 font-medium text-sm text-gray-700"
                  >
                    {fuel}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Tri */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></div>
          Trier par
        </h3>
        <div className="relative" ref={sortRef}>
          <motion.button
            onClick={handleToggleSort}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 transition-all duration-200 flex items-center justify-between font-medium text-sm"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center space-x-2">
              <ArrowUpDown className="h-4 w-4" />
              <span>
                {sortBy === "price"
                  ? "Prix"
                  : sortBy === "name"
                  ? "Nom"
                  : "Catégorie"}
              </span>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                showSortDropdown ? "rotate-180" : ""
              }`}
            />
          </motion.button>

          <AnimatePresence>
            {showSortDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <button
                  onMouseDown={() => handleSelectSort("price")}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors duration-150 font-medium text-sm text-gray-700"
                >
                  Prix
                </button>
                <button
                  onMouseDown={() => handleSelectSort("name")}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors duration-150 font-medium text-sm text-gray-700"
                >
                  Nom
                </button>
                <button
                  onMouseDown={() => handleSelectSort("category")}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors duration-150 font-medium text-sm text-gray-700"
                >
                  Catégorie
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default VehicleFilters;
