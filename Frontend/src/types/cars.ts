// src/types.ts

export interface Brand {
  id: string;
  name: string;
  logo: string;
}

export interface CarType {
  id: string;
  name: string;
  brandId: string;      
  image: string;
  gallery: string[];
  category: string;
  transmission: string;
  fuel: string;
  seats: number;
  features: string[];
  available: boolean;
  description: string;

  subscriptionOptions?: {
    engagement: {
      months: number;
      monthlyPrice: number;
      label?: string;
    }[];
    mileage: {
      km: number;
      additionalPrice: number;
      label?: string;
    }[];
    insurance: {
      type: string;
      franchiseAmount: number;
      additionalPrice: number;
      label?: string;
    }[];
    additionalDriverPrice?: number;
  };
}
