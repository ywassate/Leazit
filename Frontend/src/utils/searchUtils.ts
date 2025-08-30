export interface SearchableVehicle {
  id: string;
  name: string;
  category: string;
  brandId: string;
  transmission: string;
  fuel: string;
  description?: string;
  features?: string[];
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
}

/**
 * Normalise une chaîne pour la recherche (supprime accents, met en minuscules, etc.)
 */
export const normalizeSearchString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/[^\w\s]/g, "") // Supprime la ponctuation
    .trim();
};

/**
 * Divise une requête de recherche en mots individuels
 */
export const getSearchTerms = (query: string): string[] => {
  return normalizeSearchString(query)
    .split(/\s+/)
    .filter((term) => term.length > 0);
};

/**
 * Vérifie si un véhicule correspond à la requête de recherche
 * La recherche se fait sur tous les champs pertinents et chaque mot doit être trouvé quelque part
 */
export const matchesSearchQuery = (
  vehicle: SearchableVehicle,
  brands: Brand[],
  searchQuery: string
): boolean => {
  if (!searchQuery.trim()) return true;

  const searchTerms = getSearchTerms(searchQuery);
  if (searchTerms.length === 0) return true;

  // Trouve la marque correspondante
  const brand = brands.find((b) => b.id === vehicle.brandId);

  // Combine tous les textes cherchables
  const searchableText = normalizeSearchString(
    [
      vehicle.name,
      vehicle.category,
      brand?.name || "",
      vehicle.transmission,
      vehicle.fuel,
      vehicle.description || "",
      ...(vehicle.features || []),
    ].join(" ")
  );

  // Chaque terme de recherche doit être trouvé dans le texte
  return searchTerms.every((term) => searchableText.includes(term));
};

/**
 * Filtre et trie les véhicules selon tous les critères
 */
export const filterAndSortVehicles = (
  vehicles: SearchableVehicle[],
  brands: Brand[],
  filters: {
    searchQuery: string;
    selectedCategory: string;
    selectedBrand: string;
    selectedTransmission: string;
    selectedFuel: string;
    selectedEngagement: number | null;
    sortBy: "price" | "name" | "category";
  }
): SearchableVehicle[] => {
  let filteredVehicles = vehicles.filter((vehicle) => {
    // Recherche par mots-clés
    if (!matchesSearchQuery(vehicle, brands, filters.searchQuery)) {
      return false;
    }

    // Filtre par catégorie
    if (
      filters.selectedCategory &&
      vehicle.category !== filters.selectedCategory
    ) {
      return false;
    }

    // Filtre par marque
    if (filters.selectedBrand && vehicle.brandId !== filters.selectedBrand) {
      return false;
    }

    // Filtre par transmission
    if (
      filters.selectedTransmission &&
      vehicle.transmission !== filters.selectedTransmission
    ) {
      return false;
    }

    // Filtre par carburant
    if (filters.selectedFuel && vehicle.fuel !== filters.selectedFuel) {
      return false;
    }

    // Filtre par engagement (si applicable, selon votre logique métier)
    // Cette partie dépend de la structure de vos données d'abonnement
    // Vous pouvez l'adapter selon votre interface CarType

    return true;
  });

  // Tri
  filteredVehicles.sort((a, b) => {
    switch (filters.sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "category":
        return a.category.localeCompare(b.category);
      case "price":
        // Vous devrez adapter cette logique selon vos données de prix
        // Pour l'instant, on trie par nom comme fallback
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return filteredVehicles;
};
