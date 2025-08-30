import React, { useEffect, useState } from "react";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import BrandSection, { BrandData } from "../components/BrandSection";
import { getAuth } from "firebase/auth";

interface BrandPageProps {
  brandId: string;
  onPageChange: (page: string, data?: any) => void;
}

// Lis l'URL backend depuis .env
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

const BrandPage: React.FC<BrandPageProps> = ({ brandId, onPageChange }) => {
  const [brand, setBrand] = useState<BrandData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!brandId) return;
    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const token = await getAuth().currentUser?.getIdToken?.();

        const res = await fetch(`${API_BASE_URL}/brands/${brandId}`, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (res.status === 404) throw new Error("Marque introuvable.");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json"))
          throw new Error(`Réponse non-JSON (Content-Type: ${ct})`);
        const data = await res.json();
        if (!cancelled) setBrand(data);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        if (!cancelled) {
          setLoadError(err.message || "Erreur lors du chargement.");
          setBrand(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [brandId]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
          <p className="text-gray-300">Chargement de la marque…</p>
        </div>
      </div>
    );
  }

  // Not found / error
  if (loadError || !brand) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {loadError || "Marque introuvable"}
            </h1>
            {!loadError && (
              <p className="text-gray-400 text-lg leading-relaxed">
                Cette marque n'existe pas dans notre catalogue ou a été
                supprimée
              </p>
            )}
          </div>

          <button
            onClick={() => onPageChange("vehicles")}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux véhicules
          </button>
        </div>
      </div>
    );
  }

  // OK
  return <BrandSection brandId={brandId} onPageChange={onPageChange} />;
};

export default BrandPage;
