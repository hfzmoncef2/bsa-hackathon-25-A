import mongoose, { Document, Schema } from 'mongoose';
import { Farmer as IFarmer } from '../types';

export interface FarmerDocument extends  Omit<IFarmer, 'id'>, Document {}

const LocationSchema = new Schema({
  address: { type: String, required: true },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  region: { type: String, required: true },
  country: { type: String, required: true }
});

const ProfileSchema = new Schema({
  experience: { type: Number, required: true, min: 0 },
  farmSize: { type: Number, required: true, min: 0 },
  certification: [{ type: String }],
  languages: [{ type: String }]
});

const FarmerSchema = new Schema<FarmerDocument>({
  walletAddress: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true 
  },
  phone: { type: String, required: true },
  location: { type: LocationSchema, required: true },
  profile: { type: ProfileSchema, required: true }
}, {
  timestamps: true,
  collection: 'farmers'
});

// Indexes pour optimiser les requêtes
FarmerSchema.index({ 'location.coordinates': '2dsphere' });
FarmerSchema.index({ 'location.region': 1 });
FarmerSchema.index({ 'profile.farmSize': 1 });

export const Farmer = mongoose.model<FarmerDocument>('Farmer', FarmerSchema);
