import { User as FirebaseUser, getAuth, signOut } from "firebase/auth";
import {
  CalendarClock,
  CarFront,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Handshake,
  LayoutGrid,
  LogOut,
  Menu,
  PhoneCall,
  Star,
  TimerReset,
  Truck,
  User,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { auth } from "../firebase";
import AuthModal from "./AuthModal";
import DropdownMenu, { DropdownItem } from "./DropDown";

// API base URL (ex: /api en prod, http://localhost:5050/api en dev)
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

interface Model {
  id: string;
  name: string;
  image: string;
  category: "compact" | "mini-suv" | "suv" | "utilitaire";
  description: string;
}

interface BrandWithModels {
  id: string;
  name: string;
  logo: string;
  models: Model[];
}

interface HeaderProps {
  user: FirebaseUser | null;
  userChecked: boolean;
  onPageChange: (page: string, data?: unknown) => void;
  scrollToFaq?: () => void;
  onLogout?: () => void;
}

type BrandLite = { id: string; name: string; logo: string };

/**
 * Header component with mega menus and account dropdowns.
 *
 * This version has been updated to more closely match the visual treatment of
 * the dropdown panels found on Flease.fr. Key differences include:
 *  - Use of right‑facing chevron icons in category lists instead of down arrows.
 *  - Light backgrounds for dropdown panels with subtle borders and shadows.
 *  - Distinct grey backgrounds for secondary panels (e.g. reference listings).
 *  - Cards with white backgrounds, rounded corners and thin borders to separate
 *    individual items, mirroring the vehicle and offer cards on Flease.fr.
 */
const Header: React.FC<HeaderProps> = ({
  user,
  userChecked,
  onPageChange,
  scrollToFaq,
  onLogout,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<
    "voitures" | "offres" | "marques" | null
  >(null);
  const [dropdownAccountOpen, setDropdownAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [, setIsAnimating] = useState(false);
  const [, setHoveredDropdown] = useState<
    "voitures" | "offres" | "marques" | null
  >(null);
  const [allVehicles, setAllVehicles] = useState<
    (Model & { brandName: string; brandLogo: string })[]
  >([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [vehiclesError, setVehiclesError] = useState<string | null>(null);

  // Marques depuis Firestore via API
  const [brands, setBrands] = useState<BrandLite[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [brandsError, setBrandsError] = useState<string | null>(null);

  // Mega menu specific state & data
  const [voitureCategory, setVoitureCategory] = useState<"all" | "utilitaire">(
    "all"
  );
  const vehicleCategories = [
    { label: "Tous les modèles", slug: "all" as const },
    { label: "Véhicules utilitaires", slug: "utilitaire" as const },
  ];

  // Refs for dropdowns and buttons
  const dropdownAccountRef = useRef<HTMLDivElement>(null);
  const voituresRef = useRef<HTMLDivElement>(null);
  const offresRef = useRef<HTMLDivElement>(null);
  const marquesRef = useRef<HTMLDivElement>(null);
  const btnVoituresRef = useRef<HTMLButtonElement>(null);
  const btnOffresRef = useRef<HTMLButtonElement>(null);
  const btnMarquesRef = useRef<HTMLButtonElement>(null);
  const accountButtonRef = useRef<HTMLButtonElement>(null);

  const voituresContainerRef = useRef<HTMLDivElement>(null);
  const offresContainerRef = useRef<HTMLDivElement>(null);
  const marquesContainerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [, setBrandsWithModels] = useState<BrandWithModels[]>([]);
  const [favoriteModels, setFavoriteModels] = useState<
    (Model & { brandName: string; brandLogo: string })[]
  >([]);

  // Ajouter cet useEffect pour récupérer tous les véhicules :
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setVehiclesLoading(true);
        setVehiclesError(null);
        const token = await getAuth().currentUser?.getIdToken?.();

        // Fetch des marques
        const brandsRes = await fetch(`${API_BASE_URL}/brands`, {
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!brandsRes.ok) {
          throw new Error(`HTTP ${brandsRes.status}`);
        }

        const brandsData = (await brandsRes.json()) as BrandLite[];
        const allVehiclesData: (Model & {
          brandName: string;
          brandLogo: string;
        })[] = [];

        // Fetch des modèles pour chaque marque
        for (const brand of brandsData) {
          try {
            const modelsRes = await fetch(
              `${API_BASE_URL}/brands/${brand.id}`,
              {
                headers: {
                  Accept: "application/json",
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
              }
            );

            if (modelsRes.ok) {
              const brandData = await modelsRes.json();
              if (brandData.models && Array.isArray(brandData.models)) {
                const vehiclesWithBrand = brandData.models.map(
                  (model: Model) => ({
                    ...model,
                    brandName: brand.name,
                    brandLogo: brand.logo,
                  })
                );
                allVehiclesData.push(...vehiclesWithBrand);
              }
            }
          } catch (error) {
            console.error(
              `Erreur lors du chargement des modèles pour ${brand.name}:`,
              error
            );
          }
        }

        if (alive) {
          setAllVehicles(allVehiclesData);
          setVehiclesLoading(false);
        }
      } catch (err: unknown) {
        console.error("Erreur chargement véhicules:", err);
        if (alive) {
          setVehiclesError(
            "Impossible de charger les véhicules pour le moment."
          );
          setAllVehicles([]);
          setVehiclesLoading(false);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Filtrer les véhicules par catégorie
  const getFilteredVehicles = (category: "all" | "utilitaire") => {
    if (category === "all") {
      return allVehicles; // Retourner tous les véhicules
    }
    // Filtrer les véhicules utilitaires par catégorie ou nom contenant "utilitaire"
    return allVehicles.filter(
      (vehicle) =>
        vehicle.category === "utilitaire" ||
        vehicle.name.toLowerCase().includes("utilitaire") ||
        vehicle.name.toLowerCase().includes("van") ||
        vehicle.name.toLowerCase().includes("fourgon") ||
        vehicle.description?.toLowerCase().includes("utilitaire")
    );
  };

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobile menu animation toggle
  const toggleMobileMenu = () => {
    setIsAnimating(true);
    setMenuOpen(!menuOpen);
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Open/close dropdowns
  const handleOpenDropdown = (
    name: "voitures" | "offres" | "marques" | null
  ) => {
    setOpenDropdown(name);
    setDropdownAccountOpen(false);
  };

  // Hover helpers
  const clearHoverTimeout = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };
  const handleMouseEnter = (dropdown: "voitures" | "offres" | "marques") => {
    if (window.innerWidth >= 768) {
      clearHoverTimeout();
      setHoveredDropdown(dropdown);
      setOpenDropdown(dropdown);
      setDropdownAccountOpen(false);
    }
  };
  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) {
      clearHoverTimeout();
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredDropdown(null);
        setOpenDropdown(null);
      }, 150);
    }
  };
  const handleDropdownMouseEnter = () => clearHoverTimeout();
  const handleDropdownMouseLeave = () => {
    if (window.innerWidth >= 768) {
      clearHoverTimeout();
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredDropdown(null);
        setOpenDropdown(null);
      }, 150);
    }
  };
  useEffect(
    () => () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    },
    []
  );

  // Close menus when navigating
  const handleNav = useCallback(
    (...args: Parameters<typeof onPageChange>) => {
      setDropdownAccountOpen(false);
      setOpenDropdown(null);
      setMenuOpen(false);
      setHoveredDropdown(null);
      clearHoverTimeout();
      onPageChange(...args);
    },
    [onPageChange]
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setBrandsLoading(true);
        setBrandsError(null);
        const token = await getAuth().currentUser?.getIdToken?.();

        // Fetch des marques avec leurs modèles
        const res = await fetch(`${API_BASE_URL}/brands`, {
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          if (res.status === 404) {
            if (alive) {
              setBrands([]);
              setBrandsWithModels([]);
              setFavoriteModels([]);
              setBrandsLoading(false);
            }
            return;
          }
          throw new Error(`HTTP ${res.status}`);
        }

        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          const snippet = (await res.text()).slice(0, 120);
          throw new Error(
            `Réponse non-JSON (Content-Type: ${ct}). Extrait: ${snippet}…`
          );
        }

        const brandsData = (await res.json()) as BrandLite[];

        if (alive) {
          setBrands(Array.isArray(brandsData) ? brandsData : []);

          // Fetch des modèles pour chaque marque
          const brandsWithModelsData: BrandWithModels[] = [];
          const allFavoriteModels: (Model & {
            brandName: string;
            brandLogo: string;
          })[] = [];

          for (const brand of brandsData.slice(0, 6)) {
            // Limiter aux 6 premières marques pour les favoris
            try {
              const modelsRes = await fetch(
                `${API_BASE_URL}/brands/${brand.id}`,
                {
                  headers: {
                    Accept: "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                  },
                }
              );

              if (modelsRes.ok) {
                const brandData = await modelsRes.json();
                if (brandData.models && Array.isArray(brandData.models)) {
                  brandsWithModelsData.push({
                    id: brand.id,
                    name: brand.name,
                    logo: brand.logo,
                    models: brandData.models,
                  });

                  // Ajouter le premier modèle de chaque marque aux favoris
                  if (brandData.models.length > 0) {
                    allFavoriteModels.push({
                      ...brandData.models[0],
                      brandName: brand.name,
                      brandLogo: brand.logo,
                    });
                  }
                }
              }
            } catch (error) {
              console.error(
                `Erreur lors du chargement des modèles pour ${brand.name}:`,
                error
              );
            }
          }

          setBrandsWithModels(brandsWithModelsData);
          setFavoriteModels(allFavoriteModels);
          setBrandsLoading(false);
        }
      } catch (err: unknown) {
        console.error("Erreur chargement brands:", err);
        if (alive) {
          setBrandsError("Impossible de charger les marques pour le moment.");
          setBrands([]);
          setBrandsWithModels([]);
          setFavoriteModels([]);
          setBrandsLoading(false);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Show skeleton while waiting for auth check
  if (!userChecked) {
    return (
      <header className="bg-gradient-to-r from-slate-900 via-black to-slate-900 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl animate-pulse"></div>
            <div className="w-32 h-6 bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-lg animate-pulse"></div>
          </div>
          <div className="flex space-x-6">
            <div className="w-20 h-4 bg-gray-700/50 rounded animate-pulse"></div>
            <div className="w-24 h-4 bg-gray-700/50 rounded animate-pulse"></div>
            <div className="w-16 h-4 bg-gray-700/50 rounded animate-pulse"></div>
          </div>
          <div className="w-32 h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
        </div>
      </header>
    );
  }

  // Compute user initials
  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : (user?.email ?? "").slice(0, 2).toUpperCase();

  const handleLogoutClick = async (
    e?:
      | React.MouseEvent
      | { preventDefault?: () => void; stopPropagation?: () => void }
  ) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    try {
      await signOut(auth);
      setDropdownAccountOpen(false);
      setMenuOpen(false);
      onLogout?.();
    } catch (err) {
      console.error("❌ Erreur lors du signOut :", err);
    }
  };

  const offresItems: DropdownItem[] = [
    {
      label: "Location longue durée",
      desc: "Abonnements premium de 12 à 36 mois",
      icon: <Handshake className="w-5 h-5 text-gray-600" />,
      onClick: () => {
        setOpenDropdown(null);
        handleNav("service-detail", "longue");
      },
    },
    {
      label: "Location moyenne durée",
      desc: "Flexibilité maximale de 3 à 12 mois",
      icon: <CalendarClock className="w-5 h-5 text-gray-600" />,
      onClick: () => {
        setOpenDropdown(null);
        handleNav("service-detail", "moyenne");
      },
    },
    {
      label: "Sans engagement",
      desc: "Louez et stoppez à tout moment.",
      icon: <TimerReset className="w-5 h-5 text-gray-600" />,
      onClick: () => {
        setOpenDropdown(null);
        handleNav("service-detail", "sans");
      },
    },
  ];

  const accountItems: DropdownItem[] = [
    {
      label: "Mon profil",
      desc: "Gérez vos informations personnelles",
      icon: <User className="w-4 h-4 text-gray-400" />,
      onClick: () => {
        setDropdownAccountOpen(false);
        handleNav("profile");
      },
    },
    {
      label: "Mon abonnement",
      desc: "Vue d'ensemble de votre offre actuelle",
      icon: <Star className="w-4 h-4 text-gray-400" />,
      onClick: () => {
        setDropdownAccountOpen(false);
        handleNav("subscription");
      },
    },
    {
      label: "Mes paiements",
      desc: "Historique et gestion des paiements",
      icon: <CreditCard className="w-4 h-4 text-gray-400" />,
      onClick: () => {
        setDropdownAccountOpen(false);
        handleNav("payment");
      },
    },
    {
      label: "Se déconnecter",
      desc: "Déconnexion sécurisée de votre compte",
      icon: <LogOut className="w-4 h-4 text-gray-400" />,
      onClick: (e?: unknown) => {
        setDropdownAccountOpen(false);
        handleLogoutClick(
          e as
            | React.MouseEvent
            | { preventDefault?: () => void; stopPropagation?: () => void }
        );
      },
    },
  ];

  // NavButton component
  const NavButton = React.forwardRef<
    HTMLButtonElement,
    {
      children: React.ReactNode;
      onClick: () => void;
      onMouseEnter?: () => void;
      onMouseLeave?: () => void;
      hasDropdown?: boolean;
      isActive?: boolean;
      ariaExpanded?: boolean;
      ariaControls?: string;
    }
  >(
    (
      {
        children,
        onClick,
        onMouseEnter,
        onMouseLeave,
        hasDropdown,
        isActive,
        ariaExpanded,
        ariaControls,
      },
      ref
    ) => (
      <button
        ref={ref}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-expanded={ariaExpanded ?? undefined}
        aria-controls={ariaControls ?? undefined}
        className={`
        group relative flex items-center space-x-1 px-4 py-2 rounded-xl
        transition-all duration-200 ease-out
        hover:bg-gray-800/70
        ${
          isActive
            ? "bg-gray-800/90 text-white shadow-lg"
            : "text-gray-200 hover:text-white"
        }
      `}
      >
        <span className="relative z-10 font-medium tracking-wide">
          {children}
        </span>
        {hasDropdown && (
          <ChevronDown
            className={`
            w-4 h-4 relative z-10 transition-all duration-200 ease-out
            ${
              isActive
                ? "rotate-180 text-white"
                : "group-hover:rotate-180 group-hover:text-white"
            }
          `}
          />
        )}
      </button>
    )
  );
  NavButton.displayName = "NavButton";

  const MobileMenuItem: React.FC<{
    label: string;
    onClick: () => void;
    closeMenu: () => void;
    icon?: React.ReactNode;
  }> = ({ label, onClick, closeMenu, icon }) => (
    <button
      onClick={() => {
        onClick();
        closeMenu();
      }}
      className={`
        group flex items-center space-x-3 w-full text-left p-4 rounded-2xl
        transition-all duration-300 ease-out
        hover:bg-gray-800
        hover:transform hover:translateX-2
      `}
    >
      {icon && (
        <span className="text-gray-400 group-hover:text-white transition-colors duration-300">
          {icon}
        </span>
      )}
      <span className="text-white font-medium group-hover:text-gray-200 transition-colors duration-300">
        {label}
      </span>
    </button>
  );

  return (
    <>
      <header
        className={`
          sticky top-0 z-50 transition-all duration-300 ease-out
          ${
            scrolled
              ? "bg-black backdrop-blur-xl shadow-2xl shadow-black/20"
              : "bg-black backdrop-blur-sm"
          }
        `}
      >
        <div className="relative max-w-auto mx-auto flex items-center justify-between px-10 py-1">
          {/* Mobile hamburger + logo */}
          <div className="flex items-center md:hidden space-x-1">
            <button
              onClick={toggleMobileMenu}
              className={`
                relative p-2 rounded-xl transition-all duration-200 ease-out
                hover:bg-gray-800/70 hover:scale-105
                ${menuOpen ? "bg-gray-800/90" : ""}
              `}
            >
              <div className="relative w-6 h-6">
                <Menu
                  className={`
                    absolute inset-0 w-6 h-6 text-white transition-all duration-200
                    ${
                      menuOpen
                        ? "opacity-0 rotate-90 scale-75"
                        : "opacity-100 rotate-0 scale-100"
                    }
                  `}
                />
                <X
                  className={`
                    absolute inset-0 w-6 h-6 text-white transition-all duration-200
                    ${
                      menuOpen
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 rotate-90 scale-75"
                    }
                  `}
                />
              </div>
            </button>
            <div
              className="flex items-center space-x-1 cursor-pointer group"
              onClick={() => handleNav("home")}
            >
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="h-10 md:h-16 object-contain opacity-70 group-hover:opacity-100 transition-all duration-200 filter grayscale group-hover:grayscale-0"
                />
              </div>
            </div>
          </div>

          {/* Desktop logo */}
          <div
            className="hidden md:flex items-start space-x-1 cursor-pointer group"
            onClick={() => handleNav("home")}
          >
            <div className="relative">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-10 md:h-16 object-contain opacity-70 group-hover:opacity-100 transition-all duration-200 filter grayscale group-hover:grayscale-0"
              />
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-2 text-sm font-medium">
            {/* Nos voitures */}
            <div
              className=""
              ref={voituresContainerRef}
              onMouseEnter={() => handleMouseEnter("voitures")}
              onMouseLeave={handleMouseLeave}
            >
              <NavButton
                onClick={() =>
                  handleOpenDropdown(
                    openDropdown === "voitures" ? null : "voitures"
                  )
                }
                hasDropdown
                isActive={openDropdown === "voitures"}
                ref={btnVoituresRef}
                ariaExpanded={openDropdown === "voitures"}
                ariaControls="mega-menu-voitures"
              >
                Nos voitures
              </NavButton>
              <div
                id="mega-menu-voitures"
                className={`
                  absolute top-16 left-0 right-0 mt-2 mx-auto max-w-5xl
                  transition-all duration-200 ease-out z-50
                  ${
                    openDropdown === "voitures"
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible translate-y-2"
                  }
                `}
              >
                <div
                  ref={voituresRef}
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                  className="bg-black rounded-b-2xl shadow-xl  overflow-hidden w-full"
                >
                  {vehiclesLoading ? (
                    <div className="flex">
                      <div className="w-1/2 bg-black ">
                        <div className="space-y-3">
                          {Array.from({ length: 2 }).map((_, i) => (
                            <div
                              key={i}
                              className="h-12 bg-gray-600 rounded-lg animate-pulse"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="w-1/2 p-4 bg-gray-50">
                        <div className="grid grid-cols-3 gap-2 pr-2">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <div
                              key={i}
                              className="h-20 bg-gray-600 rounded-lg animate-pulse"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : vehiclesError ? (
                    <div className="text-sm text-gray-100 p-4">
                      {vehiclesError}
                    </div>
                  ) : (
                    <div className="flex">
                      {/* Left column: category list */}
                      <div className="w-1/2 bg-black  p-8">
                        <ul className="space-y-2">
                          {vehicleCategories.map((cat) => (
                            <li
                              key={cat.slug}
                              className={`flex items-center justify-between px-4 py-4 rounded-lg cursor-pointer transition-colors duration-150
                              ${
                                voitureCategory === cat.slug
                                  ? "bg-gray-600 text-white"
                                  : "hover:bg-gray-500 text-white"
                              }`}
                              onMouseEnter={() => setVoitureCategory(cat.slug)}
                              onClick={() => {
                                setOpenDropdown(null);
                                handleNav("vehicles", {
                                  initialCategory:
                                    cat.slug === "utilitaire"
                                      ? "Utilitaire"
                                      : undefined,
                                });
                              }}
                            >
                              <span className="text-2xl font-medium">
                                {cat.label}
                              </span>
                              <ChevronRight className="w-5 h-5 text-2xl text-white" />
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Right column: grid of vehicles depuis Firebase avec scroll */}
                      <div className="w-1/2 p-8 bg-gray-700">
                        <h2 className="text-2xl font-semibold text-white mb-3">
                          Nos modèles
                        </h2>
                        <div className="max-h-80 overflow-y-auto overflow-x-hidden scrollbar-none">
                          <div className="grid grid-cols-2 gap-4">
                            {getFilteredVehicles(voitureCategory).map(
                              (vehicle) => (
                                <button
                                  key={`${vehicle.id}-${vehicle.brandName}`}
                                  className="flex items-center space-x-3  p-3  transition-colors duration-150"
                                  onClick={() => {
                                    setOpenDropdown(null);
                                    handleNav("vehicle-details", vehicle.id);
                                  }}
                                >
                                  {/* Image du modèle */}
                                  <div className="flex-shrink-0">
                                    <img
                                      src={vehicle.image}
                                      alt={vehicle.name}
                                      className="h-10 md:h-16 object-contain rounded-lg bg-white"
                                    />
                                  </div>

                                  {/* Informations du modèle */}
                                  <div className="flex-1 flex flex-col items-start text-left">
                                    <span className="text-sm font-semibold text-white">
                                      {vehicle.name}
                                    </span>
                                    <span className="text-xs text-gray-200 capitalize">
                                      {vehicle.category}
                                    </span>
                                  </div>
                                </button>
                              )
                            )}
                          </div>
                        </div>

                        {getFilteredVehicles(voitureCategory).length === 0 && (
                          <div className="text-center py-8">
                            <div className="text-sm text-gray-500">
                              Aucun véhicule disponible pour cette catégorie
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Nos marques — avec états de chargement/erreur */}
            <div
              className=""
              ref={marquesContainerRef}
              onMouseEnter={() => handleMouseEnter("marques")}
              onMouseLeave={handleMouseLeave}
            >
              <NavButton
                onClick={() =>
                  handleOpenDropdown(
                    openDropdown === "marques" ? null : "marques"
                  )
                }
                hasDropdown
                isActive={openDropdown === "marques"}
                ref={btnMarquesRef}
                ariaExpanded={openDropdown === "marques"}
                ariaControls="mega-menu-marques"
              >
                Nos marques
              </NavButton>
              <div
                id="mega-menu-marques"
                className={`
                  absolute top-16 left-0 right-0 mt-2 mx-auto max-w-5xl
                  transition-all duration-200 ease-out z-50
                  ${
                    openDropdown === "marques"
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible translate-y-2"
                  }
                `}
              >
                <div
                  ref={marquesRef}
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                  className="bg-black rounded-b-2xl shadow-xl overflow-hidden w-full "
                >
                  {brandsLoading ? (
                    <div className="space-y-3 w-full">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-9 bg-gray-100 rounded-md animate-pulse"
                        />
                      ))}
                    </div>
                  ) : brandsError ? (
                    <div className="text-sm text-gray-600">{brandsError}</div>
                  ) : brands.length === 0 ? (
                    <div className="text-sm text-gray-600">
                      Aucune marque disponible.
                    </div>
                  ) : (
                    <div className="flex">
                      {/* Left: all brands grid */}
                      <div className="w-1/2 p-8">
                        <h2 className="text-2xl font-semibold text-white mb-8">
                          Toutes nos marques
                        </h2>
                        <div className="grid grid-cols-4 gap-4 ">
                          {brands.map((brand) => (
                            <button
                              key={brand.id}
                              onClick={() => {
                                setOpenDropdown(null);
                                handleNav("brand", brand.id);
                              }}
                              className="flex flex-col items-center justify-center bg-white rounded-xl p-4 "
                            >
                              <img
                                src={brand.logo}
                                alt={brand.name}
                                className="h-10 md:h-10 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Right: favourite references avec modèles de voitures */}
                      <div className="w-1/2 p-8  bg-gray-700">
                        <h2 className="text-2xl font-semibold text-white mb-3">
                          Références favorites
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                          {favoriteModels.slice(0, 6).map((model) => (
                            <button
                              key={`fav-model-${model.id}`}
                              onClick={() => {
                                setOpenDropdown(null);
                                handleNav("vehicle-details", model.id);
                              }}
                              className="flex items-center space-x-3  p-3  transition-colors duration-150"
                            >
                              {/* Image du modèle */}
                              <div className="flex-shrink-0">
                                <img
                                  src={model.image}
                                  alt={model.name}
                                  className="h-10 md:h-16 object-contain rounded-lg bg-white"
                                />
                              </div>

                              {/* Informations du modèle */}
                              <div className="flex-1 flex flex-col items-start text-left">
                                <span className="text-sm font-semibold text-white">
                                  {model.name}
                                </span>
                                <span className="text-xs text-gray-200 capitalize">
                                  {model.category}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Nos offres */}
            <div
              className=""
              ref={offresContainerRef}
              onMouseEnter={() => handleMouseEnter("offres")}
              onMouseLeave={handleMouseLeave}
            >
              <NavButton
                onClick={() =>
                  handleOpenDropdown(
                    openDropdown === "offres" ? null : "offres"
                  )
                }
                hasDropdown
                isActive={openDropdown === "offres"}
                ref={btnOffresRef}
                ariaExpanded={openDropdown === "offres"}
                ariaControls="mega-menu-offres"
              >
                Nos offres
              </NavButton>
              <div
                id="mega-menu-offres"
                className={`
                absolute top-16 left-0 right-0 mt-2 mx-auto max-w-5xl
                transition-all duration-200 ease-out z-50
                  ${
                    openDropdown === "offres"
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible translate-y-2"
                  }
                `}
              >
                <div
                  ref={offresRef}
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                  className="bg-black rounded-b-2xl shadow-xl overflow-hidden w-full p-8"
                >
                  {/* Mega menu for Nos offres */}
                  <div className="flex space-x-6">
                    {offresItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          item.onClick();
                        }}
                        className="flex-1 flex items-start space-x-4 bg-gray-700  rounded-xl p-6 hover:shadow-lg hover:bg-gray-600 transition-all duration-200"
                      >
                        {/* Icon container */}
                        <div className="flex-shrink-0 p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                          {item.icon}
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-lg text-white mb-2">
                            {item.label}
                          </span>
                          <span className="text-base text-gray-200 leading-relaxed max-w-sm">
                            {item.desc}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <NavButton onClick={() => handleNav("comment")}>
              Comment ça marche ?
            </NavButton>
            <NavButton onClick={() => scrollToFaq?.()}>FAQ</NavButton>
          </nav>

          {/* Actions droite */}
          <div className="flex items-center space-x-4">
            {/* Contact button */}
            <button
              onClick={() => handleNav("contact")}
              className="group hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-gray-800/70 transition-all duration-200"
            >
              <PhoneCall className="w-4 h-4 text-gray-200 group-hover:text-white transition-colors duration-200" />
              <span className="text-gray-200 font-medium group-hover:text-white transition-colors duration-200">
                Contactez-nous
              </span>
            </button>

            {/* User account ou login */}
            {user ? (
              <div className="relative" ref={dropdownAccountRef}>
                <button
                  ref={accountButtonRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownAccountOpen(!dropdownAccountOpen);
                    setOpenDropdown(null);
                    setHoveredDropdown(null);
                    clearHoverTimeout();
                  }}
                  className="relative group w-12 h-12 rounded-full overflow-hidden bg-gray-700 hover:bg-gray-600 hover:scale-105 transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-gray-500/30 shadow-lg hover:shadow-xl"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm tracking-wider">
                      {initials}
                    </span>
                  </div>
                </button>

                {/* Desktop dropdown */}
                {dropdownAccountOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-64 z-50 hidden md:block transition-all duration-200 ease-out ${
                      dropdownAccountOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible translate-y-2"
                    }`}
                  >
                    <DropdownMenu items={accountItems} />
                  </div>
                )}

                {/* Mobile account dropdown */}
                {dropdownAccountOpen && (
                  <div
                    className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ease-out ${
                      dropdownAccountOpen ? "visible" : "invisible"
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity duration-300 ease-out ${
                        dropdownAccountOpen ? "opacity-100" : "opacity-0"
                      }`}
                      onClick={() => setDropdownAccountOpen(false)}
                    />
                    <div
                      className={`absolute top-20 left-4 right-4 max-h-[80vh] bg-black/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl shadow-black/50 transition-all duration-300 ease-out ${
                        dropdownAccountOpen
                          ? "opacity-100 scale-100 translate-y-0"
                          : "opacity-0 scale-95 translate-y-4"
                      } overflow-y-auto`}
                    >
                      <div className="p-6 space-y-6">
                        <div className="flex items-center space-x-4 pb-4 border-b border-white/10">
                          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                            <span className="text-white font-bold text-sm tracking-wider">
                              {initials}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {user?.displayName || "Utilisateur"}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {accountItems.map((item, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                item.onClick?.();
                                setDropdownAccountOpen(false);
                              }}
                              className="group flex items-center space-x-3 w-full text-left p-4 rounded-2xl transition-all duration-200 ease-out hover:bg-gray-800/70 hover:transform hover:translateX-1"
                            >
                              {item.icon && (
                                <span className="text-gray-400 group-hover:text-white transition-colors duration-200">
                                  {item.icon}
                                </span>
                              )}
                              <div className="flex-1">
                                <span className="text-white font-medium group-hover:text-gray-200 transition-colors duration-200 block">
                                  {item.label}
                                </span>
                                {item.desc && (
                                  <span className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-200">
                                    {item.desc}
                                  </span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="group relative px-4 py-2 rounded-full font-medium bg-gray-700 hover:bg-gray-600 text-white transition-all duration-200 ease-out hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-500/30 overflow-hidden mb-2 mt-2"
              >
                <span className="relative z-10">Mon compte</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ease-out ${
          menuOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity duration-300 ease-out ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute top-20 left-4 right-4 max-h-[80vh] bg-black/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl shadow-black/50 transition-all duration-300 ease-out ${
            menuOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          } overflow-y-auto`}
        >
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <MobileMenuItem
                label="Accueil"
                onClick={() => handleNav("home")}
                closeMenu={() => setMenuOpen(false)}
                icon={<LayoutGrid className="w-5 h-5" />}
              />

              <div className="pt-4">
                <h3 className="text-xs uppercase text-gray-400 mb-4 px-4 font-semibold tracking-wider">
                  Nos véhicules
                </h3>
                <div className="space-y-2">
                  <MobileMenuItem
                    label="Tous les modèles"
                    onClick={() => handleNav("vehicles")}
                    closeMenu={() => setMenuOpen(false)}
                    icon={<CarFront className="w-5 h-5" />}
                  />
                  <MobileMenuItem
                    label="Utilitaires"
                    onClick={() =>
                      handleNav("vehicles", { initialCategory: "Utilitaire" })
                    }
                    closeMenu={() => setMenuOpen(false)}
                    icon={<Truck className="w-5 h-5" />}
                  />
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-xs uppercase text-gray-400 mb-4 px-4 font-semibold tracking-wider">
                  Nos marques premium
                </h3>

                {/* État de chargement/erreur pour les marques en mobile */}
                {brandsLoading ? (
                  <div className="grid grid-cols-2 gap-3 px-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-[52px] bg-gray-800 rounded-2xl animate-pulse"
                      />
                    ))}
                  </div>
                ) : brandsError ? (
                  <div className="px-4 text-sm text-gray-400">
                    {brandsError}
                  </div>
                ) : brands.length === 0 ? (
                  <div className="px-4 text-sm text-gray-400">
                    Aucune marque disponible.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 px-4">
                    {brands.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => {
                          handleNav("brand", brand.id);
                          setMenuOpen(false);
                        }}
                        className="group bg-white backdrop-blur-sm rounded-2xl p-4 flex items-center space-x-3 hover:bg-gray-50 transition-all duration-200 border border-white hover:border-gray-50"
                      >
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="h-6 object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                        />
                        <span className="text-black text-sm font-medium">
                          {brand.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4">
                <h3 className="text-xs uppercase text-gray-400 mb-4 px-4 font-semibold tracking-wider">
                  Nos offres
                </h3>
                <div className="space-y-2">
                  <MobileMenuItem
                    label="Location longue durée"
                    onClick={() => handleNav("service-detail", "longue")}
                    closeMenu={() => setMenuOpen(false)}
                    icon={<Handshake className="w-5 h-5" />}
                  />
                  <MobileMenuItem
                    label="Location moyenne durée"
                    onClick={() => handleNav("service-detail", "moyenne")}
                    closeMenu={() => setMenuOpen(false)}
                    icon={<CalendarClock className="w-5 h-5" />}
                  />
                  <MobileMenuItem
                    label="Location utilitaire"
                    onClick={() => handleNav("service-detail", "sans")}
                    closeMenu={() => setMenuOpen(false)}
                    icon={<TimerReset className="w-5 h-5" />}
                  />
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-xs uppercase text-gray-400 mb-4 px-4 font-semibold tracking-wider">
                  Support & Aide
                </h3>
                <div className="space-y-2">
                  <MobileMenuItem
                    label="Comment ça marche ?"
                    onClick={() => handleNav("comment")}
                    closeMenu={() => setMenuOpen(false)}
                    icon={<LayoutGrid className="w-5 h-5" />}
                  />
                  <MobileMenuItem
                    label="FAQ"
                    onClick={() => scrollToFaq?.()}
                    closeMenu={() => setMenuOpen(false)}
                    icon={<CalendarClock className="w-5 h-5" />}
                  />
                  <MobileMenuItem
                    label="Contactez-nous"
                    onClick={() => handleNav("contact")}
                    closeMenu={() => setMenuOpen(false)}
                    icon={<PhoneCall className="w-5 h-5" />}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                {user ? (
                  <MobileMenuItem
                    label="Se déconnecter"
                    onClick={() =>
                      handleLogoutClick({
                        preventDefault: () => {},
                        stopPropagation: () => {},
                      })
                    }
                    closeMenu={() => setMenuOpen(false)}
                    icon={<LogOut className="w-5 h-5" />}
                  />
                ) : (
                  <MobileMenuItem
                    label="Mon compte"
                    onClick={() => setShowAuthModal(true)}
                    closeMenu={() => setMenuOpen(false)}
                    icon={<User className="w-5 h-5" />}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
};

export default Header;
