import mongoose, { Document, Schema } from 'mongoose';
import { Land as ILand } from '../types';

export interface LandDocument extends Omit<ILand, 'id'>, Document {}

const CoordinatesSchema = new Schema({
  latitude: { type: Number, required: true, min: -90, max: 90 },
  longitude: { type: Number, required: true, min: -180, max: 180 }
});

const LandSchema = new Schema<LandDocument>({
  farmerId: { 
    type: String, 
    required: true,
    ref: 'Farmer',
    index: true 
  },
  name: { type: String, required: true },
  area: { 
    type: Number, 
    required: true, 
    min: 0.01 // minimum 0.01 hectare
  },
  coordinates: { type: CoordinatesSchema, required: true },
  soilType: { 
    type: String, 
    required: true,
    enum: ['clay', 'sandy', 'loamy', 'silty', 'peaty', 'chalky']
  },
  irrigation: { type: Boolean, default: false },
  drainage: { 
    type: String, 
    required: true,
    enum: ['excellent', 'good', 'fair', 'poor']
  },
  elevation: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  slope: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 90 
  }
}, {
  timestamps: true,
  collection: 'lands'
});

// Index géospatial pour les requêtes de proximité
LandSchema.index({ coordinates: '2dsphere' });
LandSchema.index({ farmerId: 1 });
LandSchema.index({ soilType: 1 });

export const Land = mongoose.model<LandDocument>('Land', LandSchema);
