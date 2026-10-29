export type TourStyle =
  | 'historical'
  | 'gastronomic'
  | 'nature'
  | 'adventure'
  | 'cultural'
  | 'relaxation';

export type Language = 'pt-BR' | 'en-US' | 'es-ES' | 'fr-FR' | 'it-IT';

export type UserRole = 'tourist' | 'guide';

export interface TouristProfile {
  id: string;
  name: string;
  email: string;
  destination: string;
  period: string;
  budget: number;
  languages: Language[];
  interests: TourStyle[];
  experienceType: string;
  maxDistanceKm: number;
}

export interface GuideProfile {
  id: string;
  name: string;
  email: string;
  city: string;
  specialties: TourStyle[];
  languages: Language[];
  hourlyRate: number;
  availability: string[];
  experience: string;
  rating: number;
  bio: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface CompatibilityMatch {
  guideId: string;
  score: number;
  reasons: string[];
}

export const touristSchema = {
  name: 'tourist',
  fields: {
    name: 'string',
    email: 'string',
    destination: 'string',
    period: 'string',
    budget: 'number',
    languages: 'array',
    interests: 'array',
    experienceType: 'string',
    maxDistanceKm: 'number'
  }
} as const;

export const guideSchema = {
  name: 'guide',
  fields: {
    name: 'string',
    email: 'string',
    city: 'string',
    specialties: 'array',
    languages: 'array',
    hourlyRate: 'number',
    availability: 'array',
    experience: 'string',
    rating: 'number',
    bio: 'string'
  }
} as const;
