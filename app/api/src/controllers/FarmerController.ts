import { Request, Response } from 'express';
import { Farmer } from '../models/Farmer';
import { Land } from '../models/Land';
import { Crop } from '../models/Crop';
import { WeatherService } from '../services/WeatherService';
import { ApiResponse, PaginatedResponse, Farmer as IFarmer } from '../types';
import { logger } from '../utils/logger';

export class FarmerController {
  private weatherService: WeatherService;

  constructor(weatherService: WeatherService) {
    this.weatherService = weatherService;
  }

  /**
   * Créer un nouveau fermier
   */
  async createFarmer(req: Request, res: Response): Promise<void> {
    try {
      const farmerData: Partial<IFarmer> = req.body;

      // Vérifier si le fermier existe déjà
      const existingFarmer = await Farmer.findOne({
        $or: [
          { walletAddress: farmerData.walletAddress },
          { email: farmerData.email }
        ]
      });

      if (existingFarmer) {
        res.status(400).json({
          success: false,
          error: 'Farmer already exists with this wallet address or email',
          timestamp: new Date()
        });
        return;
      }

      const farmer = new Farmer(farmerData);
      await farmer.save();

      const response: ApiResponse<IFarmer> = {
        success: true,
        data: farmer.toObject() as IFarmer,
        message: 'Farmer created successfully',
        timestamp: new Date()
      };

      res.status(201).json(response);
      logger.info(`New farmer created: ${farmer.id}`);
    } catch (error) {
      logger.error('Error creating farmer:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create farmer',
        timestamp: new Date()
      });
    }
  }

  /**
   * Récupérer un fermier par ID
   */
  async getFarmer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const farmer = await Farmer.findById(id);

      if (!farmer) {
        res.status(404).json({
          success: false,
          error: 'Farmer not found',
          timestamp: new Date()
        });
        return;
      }

      const response: ApiResponse<IFarmer> = {
        success: true,
        data: farmer.toObject() as IFarmer,
        timestamp: new Date()
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching farmer:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch farmer',
        timestamp: new Date()
      });
    }
  }

  /**
   * Récupérer un fermier par adresse wallet
   */
  async getFarmerByWallet(req: Request, res: Response): Promise<void> {
    try {
      const { walletAddress } = req.params;
      const farmer = await Farmer.findOne({ walletAddress });

      if (!farmer) {
        res.status(404).json({
          success: false,
          error: 'Farmer not found',
          timestamp: new Date()
        });
        return;
      }

      const response: ApiResponse<IFarmer> = {
        success: true,
        data: farmer.toObject() as IFarmer,
        timestamp: new Date()
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching farmer by wallet:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch farmer',
        timestamp: new Date()
      });
    }
  }

  /**
   * Mettre à jour un fermier
   */
  async updateFarmer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const farmer = await Farmer.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!farmer) {
        res.status(404).json({
          success: false,
          error: 'Farmer not found',
          timestamp: new Date()
        });
        return;
      }

      const response: ApiResponse<IFarmer> = {
        success: true,
        data: farmer.toObject() as IFarmer,
        message: 'Farmer updated successfully',
        timestamp: new Date()
      };

      res.json(response);
      logger.info(`Farmer updated: ${farmer.id}`);
    } catch (error) {
      logger.error('Error updating farmer:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update farmer',
        timestamp: new Date()
      });
    }
  }

  /**
   * Lister tous les fermiers avec pagination
   */
  async getFarmers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const farmers = await Farmer.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Farmer.countDocuments();
      const totalPages = Math.ceil(total / limit);

      const response: PaginatedResponse<IFarmer> = {
        success: true,
        data: farmers.map(farmer => farmer.toObject() as IFarmer),
        pagination: {
          page,
          limit,
          total,
          totalPages
        },
        timestamp: new Date()
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching farmers:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch farmers',
        timestamp: new Date()
      });
    }
  }

  /**
   * Récupérer les terres d'un fermier
   */
  async getFarmerLands(req: Request, res: Response): Promise<void> {
    try {
      const { farmerId } = req.params;
      const lands = await Land.find({ farmerId });

      const response: ApiResponse<any[]> = {
        success: true,
        data: lands.map(land => land.toObject()),
        timestamp: new Date()
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching farmer lands:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch farmer lands',
        timestamp: new Date()
      });
    }
  }

  /**
   * Récupérer les cultures d'un fermier
   */
  async getFarmerCrops(req: Request, res: Response): Promise<void> {
    try {
      const { farmerId } = req.params;
      const crops = await Crop.find({ farmerId });

      const response: ApiResponse<any[]> = {
        success: true,
        data: crops.map(crop => crop.toObject()),
        timestamp: new Date()
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching farmer crops:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch farmer crops',
        timestamp: new Date()
      });
    }
  }

  /**
   * Obtenir le dashboard complet d'un fermier
   */
  async getFarmerDashboard(req: Request, res: Response): Promise<void> {
    try {
      const { farmerId } = req.params;

      // Récupérer les données du fermier
      const farmer = await Farmer.findById(farmerId);
      if (!farmer) {
        res.status(404).json({
          success: false,
          error: 'Farmer not found',
          timestamp: new Date()
        });
        return;
      }

      // Récupérer les terres
      const lands = await Land.find({ farmerId });

      // Récupérer les cultures
      const crops = await Crop.find({ farmerId });

      // Récupérer les données météo pour chaque terre
      const weatherData = [];
      for (const land of lands) {
        try {
          const weather = await this.weatherService.getCurrentWeather(
            land.coordinates.latitude,
            land.coordinates.longitude
          );
          weatherData.push({
            landId: land.id,
            weather: weather.toObject()
          });
        } catch (error) {
          logger.warn(`Failed to fetch weather for land ${land.id}:`, error);
        }
      }

      const dashboard = {
        farmer: farmer.toObject(),
        lands: lands.map(land => land.toObject()),
        crops: crops.map(crop => crop.toObject()),
        weatherData,
        summary: {
          totalLands: lands.length,
          totalCrops: crops.length,
          activeCrops: crops.filter(crop => crop.status === 'active').length,
          totalArea: lands.reduce((sum, land) => sum + land.area, 0)
        }
      };

      const response: ApiResponse<any> = {
        success: true,
        data: dashboard,
        timestamp: new Date()
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching farmer dashboard:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch farmer dashboard',
        timestamp: new Date()
      });
    }
  }

  /**
   * Rechercher des fermiers par critères
   */
  async searchFarmers(req: Request, res: Response): Promise<void> {
    try {
      const { 
        region, 
        farmSizeMin, 
        farmSizeMax, 
        experience, 
        certification 
      } = req.query;

      const query: any = {};

      if (region) {
        query['location.region'] = new RegExp(region as string, 'i');
      }

      if (farmSizeMin || farmSizeMax) {
        query['profile.farmSize'] = {};
        if (farmSizeMin) query['profile.farmSize'].$gte = parseInt(farmSizeMin as string);
        if (farmSizeMax) query['profile.farmSize'].$lte = parseInt(farmSizeMax as string);
      }

      if (experience) {
        query['profile.experience'] = { $gte: parseInt(experience as string) };
      }

      if (certification) {
        query['profile.certification'] = new RegExp(certification as string, 'i');
      }

      const farmers = await Farmer.find(query).limit(50);

      const response: ApiResponse<IFarmer[]> = {
        success: true,
        data: farmers.map(farmer => farmer.toObject() as IFarmer),
        timestamp: new Date()
      };

      res.json(response);
    } catch (error) {
      logger.error('Error searching farmers:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search farmers',
        timestamp: new Date()
      });
    }
  }
}
