import mongoose, { Document, Schema } from 'mongoose';
import { WeatherData as IWeatherData } from '../types';

export interface WeatherDataDocument extends Omit<IWeatherData, 'id'>, Document {}

const LocationSchema = new Schema({
  latitude: { type: Number, required: true, min: -90, max: 90 },
  longitude: { type: Number, required: true, min: -180, max: 180 }
});

const TemperatureSchema = new Schema({
  current: { type: Number, required: true },
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  feelsLike: { type: Number, required: true }
});

const RainfallSchema = new Schema({
  current: { type: Number, required: true, min: 0 },
  last24h: { type: Number, required: true, min: 0 },
  last7days: { type: Number, required: true, min: 0 },
  last30days: { type: Number, required: true, min: 0 }
});

const WindSchema = new Schema({
  speed: { type: Number, required: true, min: 0 },
  direction: { type: Number, required: true, min: 0, max: 360 },
  gust: { type: Number, required: true, min: 0 }
});

const WeatherDataSchema = new Schema<WeatherDataDocument>({
  location: { type: LocationSchema, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
  temperature: { type: TemperatureSchema, required: true },
  humidity: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 100 
  },
  rainfall: { type: RainfallSchema, required: true },
  wind: { type: WindSchema, required: true },
  pressure: { 
    type: Number, 
    required: true, 
    min: 800, 
    max: 1100 
  },
  visibility: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  uvIndex: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 11 
  },
  source: { 
    type: String, 
    required: true,
    enum: ['api', 'sensor', 'manual'],
    default: 'api'
  },
  quality: { 
    type: String, 
    required: true,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  }
}, {
  timestamps: true,
  collection: 'weather_data'
});

// Indexes pour optimiser les requêtes météo
WeatherDataSchema.index({ location: '2dsphere' });
WeatherDataSchema.index({ timestamp: -1 });
WeatherDataSchema.index({ 'location.latitude': 1, 'location.longitude': 1, timestamp: -1 });
WeatherDataSchema.index({ source: 1, quality: 1 });

export const WeatherData = mongoose.model<WeatherDataDocument>('WeatherData', WeatherDataSchema);
