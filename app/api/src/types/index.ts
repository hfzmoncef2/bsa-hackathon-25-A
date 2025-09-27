// RainGuard Backend Types
// Types pour la gestion des données des fermiers et l'assurance agricole

export interface Farmer {
  id: string;
  walletAddress: string;
  name: string;
  email: string;
  phone: string;
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    region: string;
    country: string;
  };
  profile: {
    experience: number; // années d'expérience
    farmSize: number; // hectares
    certification: string[];
    languages: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Land {
  id: string;
  farmerId: string;
  name: string;
  area: number; // hectares
  coordinates: {
    latitude: number;
    longitude: number;
  };
  soilType: 'clay' | 'sandy' | 'loamy' | 'silty' | 'peaty' | 'chalky';
  irrigation: boolean;
  drainage: 'excellent' | 'good' | 'fair' | 'poor';
  elevation: number; // meters above sea level
  slope: number; // degrees
  createdAt: Date;
  updatedAt: Date;
}

export interface Crop {
  id: string;
  landId: string;
  farmerId: string;
  name: string;
  variety: string;
  plantingDate: Date;
  expectedHarvestDate: Date;
  area: number; // hectares
  seedType: 'conventional' | 'hybrid' | 'organic' | 'gmo';
  growthStage: 'planting' | 'germination' | 'vegetative' | 'flowering' | 'fruiting' | 'harvest';
  expectedYield: number; // tons per hectare
  currentYield?: number; // tons per hectare
  status: 'active' | 'harvested' | 'failed' | 'abandoned';
  createdAt: Date;
  updatedAt: Date;
}

export interface WeatherData {
  id: string;
  location: {
    latitude: number;
    longitude: number;
  };
  timestamp: Date;
  temperature: {
    current: number; // Celsius
    min: number;
    max: number;
    feelsLike: number;
  };
  humidity: number; // percentage
  rainfall: {
    current: number; // mm
    last24h: number; // mm
    last7days: number; // mm
    last30days: number; // mm
  };
  wind: {
    speed: number; // km/h
    direction: number; // degrees
    gust: number; // km/h
  };
  pressure: number; // hPa
  visibility: number; // km
  uvIndex: number;
  source: 'api' | 'sensor' | 'manual';
  quality: 'high' | 'medium' | 'low';
  createdAt: Date;
}

export interface InsurancePolicy {
  id: string;
  farmerId: string;
  policyId: string; // Sui blockchain ID
  coverageAmount: number; // SUI tokens
  premiumAmount: number; // SUI tokens
  coveragePeriodDays: number;
  startDate: Date;
  endDate: Date;
  riskTypes: RiskType[];
  landIds: string[];
  cropIds: string[];
  status: 'active' | 'expired' | 'cancelled' | 'claimed';
  deductible: number; // percentage
  maxPayout: number; // SUI tokens
  weatherThresholds: WeatherThreshold[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WeatherThreshold {
  riskType: RiskType;
  metric: 'temperature' | 'rainfall' | 'humidity' | 'wind_speed';
  operator: 'greater_than' | 'less_than' | 'equals';
  value: number;
  unit: string;
}

export type RiskType = 
  | 'drought' 
  | 'flood' 
  | 'hail' 
  | 'excessive_rain' 
  | 'frost' 
  | 'heat_wave' 
  | 'storm' 
  | 'pest_infestation';

export interface InsuranceClaim {
  id: string;
  claimId: string; // Sui blockchain ID
  policyId: string;
  farmerId: string;
  claimAmount: number; // SUI tokens
  damageAssessment: string;
  weatherData: WeatherData[];
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  payoutAmount?: number; // SUI tokens
  validatorNotes?: string;
  submittedAt: Date;
  processedAt?: Date;
  paidAt?: Date;
}

export interface WeatherAlert {
  id: string;
  farmerId: string;
  landId: string;
  alertType: RiskType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  weatherData: WeatherData;
  threshold: WeatherThreshold;
  triggeredAt: Date;
  acknowledged: boolean;
  acknowledgedAt?: Date;
}

export interface FarmAssessment {
  id: string;
  farmerId: string;
  landId: string;
  assessmentDate: Date;
  assessor: string;
  soilHealth: {
    ph: number;
    organicMatter: number; // percentage
    nutrients: {
      nitrogen: number;
      phosphorus: number;
      potassium: number;
    };
    moisture: number; // percentage
  };
  cropHealth: {
    growthStage: string;
    plantHeight: number; // cm
    leafColor: 'healthy' | 'yellowing' | 'browning' | 'wilting';
    pestDamage: number; // percentage
    diseaseSigns: string[];
  };
  recommendations: string[];
  riskScore: number; // 0-100
  createdAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
  message?: string;
  timestamp: Date;
}

// Configuration types
export interface WeatherApiConfig {
  provider: 'openweather' | 'weatherbit' | 'accuweather';
  apiKey: string;
  baseUrl: string;
  updateInterval: number; // minutes
}

export interface SuiConfig {
  network: 'testnet' | 'mainnet' | 'devnet';
  rpcUrl: string;
  privateKey: string;
  packageId: string;
}

export interface DatabaseConfig {
  mongodb: {
    uri: string;
    database: string;
  };
}

export interface AppConfig {
  port: number;
  environment: 'development' | 'production' | 'test';
  jwtSecret: string;
  weather: WeatherApiConfig;
  sui: SuiConfig;
  database: DatabaseConfig;
}
