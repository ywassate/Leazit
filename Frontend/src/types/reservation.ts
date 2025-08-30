
export interface FormData {
  engagementIndex: number;
  mileageIndex: number;
  insuranceIndex: number;
  driversCount: number;
  type: 'particulier' | 'entreprise' | 'touriste' | '';
  nom: string;
  prenom: string;
  email: string;
  birthDate: string;
  tel: string;
  adresse: string;
  codePostal: string;
  etage: string;
  porte: string;
  entreprise: string;
  accepteContrat: boolean;
  assuranceRisque: boolean;
}

export interface CardData {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ReservationStep {
  id: number;
  title: string;
  isValid: boolean;
  isCompleted: boolean;
}