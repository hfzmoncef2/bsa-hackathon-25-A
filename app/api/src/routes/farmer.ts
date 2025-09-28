import { Router } from 'express';
import { FarmerController } from '../controllers/FarmerController';
import { WeatherService } from '../services/WeatherService';
import { AppConfig } from '../types';

const router = Router();

// Configuration (à injecter depuis l'extérieur)
const weatherConfig = {
  provider: 'openweather' as const,
  apiKey: process.env.OPENWEATHER_API_KEY || '',
  baseUrl: 'https://api.openweathermap.org/data/2.5',
  updateInterval: 30
};

const weatherService = new WeatherService(weatherConfig);
const farmerController = new FarmerController(weatherService);

/**
 * @route POST /api/farmers
 * @desc Créer un nouveau fermier
 * @access Public
 */
router.post('/', farmerController.createFarmer.bind(farmerController));

/**
 * @route GET /api/farmers
 * @desc Lister tous les fermiers avec pagination
 * @access Public
 */
router.get('/', farmerController.getFarmers.bind(farmerController));

/**
 * @route GET /api/farmers/search
 * @desc Rechercher des fermiers par critères
 * @access Public
 */
router.get('/search', farmerController.searchFarmers.bind(farmerController));

/**
 * @route GET /api/farmers/:id
 * @desc Récupérer un fermier par ID
 * @access Public
 */
router.get('/:id', farmerController.getFarmer.bind(farmerController));

/**
 * @route GET /api/farmers/wallet/:walletAddress
 * @desc Récupérer un fermier par adresse wallet
 * @access Public
 */
router.get('/wallet/:walletAddress', farmerController.getFarmerByWallet.bind(farmerController));

/**
 * @route PUT /api/farmers/:id
 * @desc Mettre à jour un fermier
 * @access Public
 */
router.put('/:id', farmerController.updateFarmer.bind(farmerController));

/**
 * @route GET /api/farmers/:farmerId/lands
 * @desc Récupérer les terres d'un fermier
 * @access Public
 */
router.get('/:farmerId/lands', farmerController.getFarmerLands.bind(farmerController));

/**
 * @route GET /api/farmers/:farmerId/crops
 * @desc Récupérer les cultures d'un fermier
 * @access Public
 */
router.get('/:farmerId/crops', farmerController.getFarmerCrops.bind(farmerController));

/**
 * @route GET /api/farmers/:farmerId/dashboard
 * @desc Obtenir le dashboard complet d'un fermier
 * @access Public
 */
router.get('/:farmerId/dashboard', farmerController.getFarmerDashboard.bind(farmerController));

export default router;
