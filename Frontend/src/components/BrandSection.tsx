import React, { useEffect, useState } from "react";
import { ArrowRight, Filter, Grid, List } from "lucide-react";
import { getAuth } from "firebase/auth";

export interface Model {
  id: string;
  name: string;
  image: string;
  category: "compact" | "mini-suv" | "suv";
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

interface BrandSectionProps {
  brandId: string;
  onPageChange: (page: string, data?: any) => void;
}

// Lis l'URL backend depuis .env (ex: /api en prod, http://localhost:5050/api en dev)
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

const BrandSection: React.FC<BrandSectionProps> = ({
  brandId,
  onPageChange,
}) => {
  const [brand, setBrand] = useState<BrandData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categoryLabels: Record<string, string> = {
    all: "Tous les modèles",
    compact: "Compact",
    "mini-suv": "Mini SUV",
    suv: "SUV",
  };

  const categories = ["all", "compact", "mini-suv", "suv"] as const;

  useEffect(() => {
    if (!brandId) return;

    let cancelled = false;
    const controller = new AbortController();

    const fetchBrand = async () => {
      try {
        const token = await getAuth().currentUser?.getIdToken?.();

        const res = await fetch(`${API_BASE_URL}/brands/${brandId}`, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (res.status === 404) {
          if (!cancelled) setBrand(null);
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          const snippet = (await res.text()).slice(0, 120);
          throw new Error(
            `Réponse non-JSON (Content-Type: ${ct}). Extrait: ${snippet}…`
          );
        }

        const data: BrandData = await res.json();
        if (!cancelled) setBrand(data);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        console.error("Erreur lors du chargement de la marque", err);
        if (!cancelled) setBrand(null);
      }
    };

    fetchBrand();
    return () => {
      cancelled = true;
    };
  }, [brandId]);

  if (!brand)
    return <div className="p-8 text-center text-gray-500">Chargement...</div>;

  const filteredModels =
    selectedCategory === "all"
      ? brand.models
      : brand.models.filter((model) => model.category === selectedCategory);

  const ModelCard = ({ car, index }: { car: Model; index: number }) => {
    const animationStyle = {
      animationDelay: `${index * 100}ms`,
      animationName: "fadeInUp",
      animationDuration: "0.6s",
      animationFillMode: "forwards" as const,
      animationTimingFunction: "ease-out",
    };

    if (viewMode === "list") {
      return (
        <div
          className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer border border-gray-100 hover:border-gray-200"
          onClick={() => onPageChange("vehicle-details", car.id)}
          style={animationStyle}
        >
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="relative overflow-hidden h-64 md:h-full">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <div className="space-y-4">
                <div>
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full mb-3">
                    {categoryLabels[car.category]}
                  </span>
                  <h4 className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                    {car.name}
                  </h4>
                </div>

                <p className="text-gray-600 leading-relaxed line-clamp-3">
                  {car.description}
                </p>

                <div className="flex items-center text-gray-900 font-semibold group-hover:text-gray-700 transition-colors duration-300">
                  <span>Voir les détails</span>
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl  overflow-hidden cursor-pointer border border-gray-100 hover:border-gray-200 "
        onClick={() => onPageChange("vehicle-details", car.id)}
        style={animationStyle}
      >
        <div className="relative overflow-hidden">
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="absolute top-4 left-4">
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-800 rounded-full">
              {categoryLabels[car.category]}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            <h4 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
              {car.name}
            </h4>

            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
              {car.description}
            </p>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center text-gray-900 font-semibold text-sm group-hover:text-gray-700 transition-colors duration-300">
                <span>Voir les détails</span>
                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden py-20 px-4">
        <div className="relative max-w-7xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center justify-center">
            <div className="bg-white backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20">
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-10 md:h-16 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0"
              />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            {brand.name}
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            {brand.description}
          </p>
        </div>
      </section>

      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all duration-300"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {categoryLabels[category]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all duration-300 ${
                viewMode === "grid"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all duration-300 ${
                viewMode === "list"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              : "flex flex-col space-y-8"
          }`}
        >
          {filteredModels.map((car, index) => (
            <ModelCard key={car.id} car={car} index={index} />
          ))}
        </div>

        {filteredModels.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun véhicule trouvé
            </h3>
            <p className="text-gray-600">
              Essayez de changer les filtres ou sélectionnez "Tous les modèles"
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default BrandSection;
