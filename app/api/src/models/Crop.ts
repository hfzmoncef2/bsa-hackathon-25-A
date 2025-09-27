import mongoose, { Document, Schema } from 'mongoose';
import { Crop as ICrop } from '../types';

export interface CropDocument extends Omit<ICrop, 'id'>, Document {}

const CropSchema = new Schema<CropDocument>({
  landId: { 
    type: String, 
    required: true,
    ref: 'Land',
    index: true 
  },
  farmerId: { 
    type: String, 
    required: true,
    ref: 'Farmer',
    index: true 
  },
  name: { type: String, required: true },
  variety: { type: String, required: true },
  plantingDate: { type: Date, required: true },
  expectedHarvestDate: { type: Date, required: true },
  area: { 
    type: Number, 
    required: true, 
    min: 0.01 
  },
  seedType: { 
    type: String, 
    required: true,
    enum: ['conventional', 'hybrid', 'organic', 'gmo']
  },
  growthStage: { 
    type: String, 
    required: true,
    enum: ['planting', 'germination', 'vegetative', 'flowering', 'fruiting', 'harvest'],
    default: 'planting'
  },
  expectedYield: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  currentYield: { 
    type: Number, 
    min: 0 
  },
  status: { 
    type: String, 
    required: true,
    enum: ['active', 'harvested', 'failed', 'abandoned'],
    default: 'active'
  }
}, {
  timestamps: true,
  collection: 'crops'
});

// Indexes pour optimiser les requêtes
CropSchema.index({ farmerId: 1, status: 1 });
CropSchema.index({ landId: 1 });
CropSchema.index({ plantingDate: 1 });
CropSchema.index({ growthStage: 1 });
CropSchema.index({ name: 1 });

export const Crop = mongoose.model<CropDocument>('Crop', CropSchema);
