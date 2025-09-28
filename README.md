# 🌾 Parametric Agricultural Insurance Platform

A comprehensive decentralized insurance platform built on Sui blockchain that provides automatic crop protection based on real-time weather data and parametric triggers.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Smart Contracts](#smart-contracts)
- [Weather Integration](#weather-integration)
- [Security](#security)
- [Deployment](#deployment)
- [Testing](#testing)
- [Monitoring](#monitoring)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## 🌟 Overview

This platform revolutionizes agricultural insurance by leveraging blockchain technology and real-time weather data to provide:

- **Automatic Claims Processing**: No manual assessment required
- **Real-time Weather Monitoring**: Oracle-based data integration
- **Transparent Payouts**: Smart contract execution
- **Global Coverage**: Support for any geographical location
- **Parametric Insurance**: Payouts based on predefined weather thresholds

### 🎯 Key Benefits

- **For Farmers**: Instant, transparent, and reliable crop protection
- **For Insurers**: Reduced operational costs and fraud prevention
- **For the Ecosystem**: Increased agricultural resilience and food security

## 🚀 Features

### Core Functionality
- **🌤️ Real-time Weather Monitoring**: Oracle-based weather data integration
- **📱 Smart Contract Integration**: Direct Sui blockchain integration
- **🔄 Automatic Claims**: Parametric insurance with automatic payouts
- **🌍 Global Coverage**: Support for any geographical location
- **💼 User-friendly Interface**: Clean, modern web application
- **📊 Dashboard Analytics**: Comprehensive monitoring and reporting
- **🔐 Secure Transactions**: Blockchain-based security

### Advanced Features
- **🎯 Parametric Triggers**: Temperature, rainfall, humidity thresholds
- **📈 Risk Assessment**: AI-powered risk evaluation
- **🔄 Multi-Oracle Support**: Redundant data sources for reliability
- **📱 Mobile Responsive**: Works on all devices
- **🌐 Multi-language Support**: International accessibility
- **📊 Historical Data**: Weather pattern analysis
- **🔔 Real-time Alerts**: Instant notifications for critical conditions

## 🏗️ Architecture

### Frontend Stack
```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                           │
├─────────────────────────────────────────────────────────────┤
│  Next.js 15          │  TypeScript        │  Tailwind CSS  │
│  React 18            │  Radix UI          │  Lucide Icons  │
│  Sui dApp Kit        │  Zustand           │  React Query   │
└─────────────────────────────────────────────────────────────┘
```

### Backend Stack
```
┌─────────────────────────────────────────────────────────────┐
│                    Backend Layer                            │
├─────────────────────────────────────────────────────────────┤
│  Sui Move Contracts  │  Weather Oracles   │  API Gateway   │
│  Smart Contracts     │  Data Processing   │  Authentication│
└─────────────────────────────────────────────────────────────┘
```

### Blockchain Integration
```
┌─────────────────────────────────────────────────────────────┐
│                  Sui Blockchain                            │
├─────────────────────────────────────────────────────────────┤
│  Insurance Policies  │  Policy Caps       │  Claim Objects │
│  Weather Data        │  Oracle Feeds      │  Transactions  │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow
```
Weather APIs → Oracle Service → Smart Contract → User Wallet
     ↓              ↓              ↓              ↓
Real-time Data → Processing → Validation → Payout
```

## 🛠️ Installation

### Prerequisites

#### System Requirements
- **Node.js**: Version 18.0.0 or higher
- **pnpm**: Version 8.0.0 or higher
- **Sui CLI**: Latest version
- **Git**: Version 2.30.0 or higher

#### Development Tools
- **VS Code**: Recommended IDE
- **Sui Wallet**: Browser extension
- **SuiScan**: Blockchain explorer access

#### API Keys Required
- **OpenWeatherMap**: Weather data API
- **Sui Network**: Testnet/Mainnet access

### Step-by-Step Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/your-org/parametric-agricultural-insurance.git
cd parametric-agricultural-insurance
```

#### 2. Install Dependencies
```bash
# Install Node.js dependencies
pnpm install

# Install Sui CLI (if not already installed)
cargo install --locked --git https://github.com/MystenLabs/sui.git --tag main sui
```

#### 3. Environment Setup
```bash
# Copy environment template
cp app/api/env.example app/api/.env

# Edit environment variables
nano app/api/.env
```

#### 4. Sui Network Configuration
```bash
# Configure Sui CLI
sui client new-address ed25519
sui client switch --env testnet

# Get testnet SUI tokens
sui client faucet
```

#### 5. Deploy Smart Contracts
```bash
# Make deployment script executable
chmod +x deploy-insurance.sh

# Deploy to testnet
./deploy-insurance.sh
```

#### 6. Start Development Server
```bash
# Start the application
pnpm dev

# Application will be available at http://localhost:3000
```

## ⚙️ Configuration

### Environment Variables

#### Required Variables
```env
# Sui Network Configuration
SUI_NETWORK=testnet
SUI_RPC_URL=https://fullnode.testnet.sui.io:443

# Weather API Configuration
OPENWEATHER_API_KEY=your_api_key_here
WEATHER_CACHE_DURATION=300000

# Application Configuration
NEXT_PUBLIC_APP_NAME=Parametric Agricultural Insurance
NEXT_PUBLIC_APP_VERSION=1.0.0
```

#### Optional Variables
```env
# Analytics
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
MIXPANEL_TOKEN=your_mixpanel_token

# Monitoring
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=info

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_MONITORING=true
ENABLE_DEBUG_MODE=false
```

### Network Configuration

#### Testnet Configuration
```typescript
// app/networkConfig.ts
export const testnetConfig = {
  rpcUrl: 'https://fullnode.testnet.sui.io:443',
  faucetUrl: 'https://faucet.testnet.sui.io/gas',
  explorerUrl: 'https://suiscan.xyz/testnet',
  packageId: '0x...', // Your deployed package ID
};
```

#### Mainnet Configuration
```typescript
export const mainnetConfig = {
  rpcUrl: 'https://fullnode.mainnet.sui.io:443',
  explorerUrl: 'https://suiscan.xyz/mainnet',
  packageId: '0x...', // Your deployed package ID
};
```

### Weather API Setup

#### OpenWeatherMap Configuration
1. **Create Account**: Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. **Get API Key**: Generate your API key
3. **Configure Service**: Update `app/services/real-weather-api.ts`

```typescript
const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
```

#### Alternative Weather Providers
- **WeatherAPI**: Backup weather data source
- **AccuWeather**: Premium weather data
- **Custom Oracle**: Your own weather data source

## 📖 Usage Guide

### For Farmers

#### 1. Getting Started
1. **Connect Wallet**: Install Sui wallet extension
2. **Fund Account**: Ensure you have SUI tokens
3. **Access Platform**: Navigate to the application

#### 2. Creating an Insurance Policy

##### Step 1: Basic Information
```
Coverage Amount: 1000 SUI
Monthly Premium: 100 SUI
Field Location: GPS coordinates
```

##### Step 2: Weather Thresholds
```
Maximum Temperature: 35°C
Minimum Temperature: 5°C
Maximum Rainfall: 50mm
Humidity Range: 30% - 80%
```

##### Step 3: Review and Create
- Review all parameters
- Confirm weather conditions
- Sign transaction
- Policy created on blockchain

#### 3. Monitoring Your Policy
- **Dashboard**: View all policies
- **Weather Data**: Real-time conditions
- **Claim Status**: Automatic processing
- **Transaction History**: Blockchain records

### For Developers

#### API Integration
```typescript
import { suiInsuranceCleanService } from '@/services/sui-insurance-clean';

// Create insurance policy
const result = await suiInsuranceCleanService.createInsuranceObject(
  coverageAmount,
  premiumAmount,
  riskType,
  maxTemperature,
  minTemperature,
  maxRainfall,
  minHumidity,
  maxHumidity,
  locationLat,
  locationLng,
  signAndExecute,
  currentAccount
);
```

#### Weather Data Integration
```typescript
import { unifiedWeatherService } from '@/services/unified-weather-service';

// Get current weather
const weather = await unifiedWeatherService.getCurrentWeather(lat, lng);

// Check conditions
const conditions = unifiedWeatherService.checkWeatherConditions(
  weather,
  thresholds
);
```

## 📚 API Documentation

### Core Services

#### SuiInsuranceCleanService
```typescript
class SuiInsuranceCleanService {
  // Set contract package ID
  setPackageId(packageId: string): void
  
  // Create insurance object
  createInsuranceObject(
    coverageAmount: number,
    premiumAmount: number,
    riskType: number,
    maxTemperature: number,
    minTemperature: number,
    maxRainfall: number,
    minHumidity: number,
    maxHumidity: number,
    locationLat: number,
    locationLng: number,
    signAndExecute: any,
    currentAccount: any
  ): Promise<{policyObject: InsurancePolicyObject, capObject: PolicyCapObject}>
  
  // Check deployment status
  isDeployed(): boolean
  
  // Get package ID
  getPackageId(): string | null
}
```

#### UnifiedWeatherService
```typescript
class UnifiedWeatherService {
  // Get current weather data
  getCurrentWeather(lat: number, lng: number): Promise<WeatherData>
  
  // Check weather conditions
  checkWeatherConditions(
    weatherData: WeatherData,
    thresholds: WeatherThresholds
  ): {shouldClaim: boolean, reason: string, claimAmount: number}
  
  // Get critical weather data
  getCriticalWeatherData(lat: number, lng: number): WeatherData
  
  // Get normal weather data
  getNormalWeatherData(lat: number, lng: number): WeatherData
  
  // Clear cache
  clearCache(): void
}
```

### Data Types

#### InsurancePolicyObject
```typescript
interface InsurancePolicyObject {
  objectId: string;
  policyId: string;
  clientAddress: string;
  coverageAmount: number;
  premiumAmount: number;
  riskType: number;
  status: number;
  createdAt: number;
  maxTemperature: number;
  minTemperature: number;
  maxRainfall: number;
  minHumidity: number;
  maxHumidity: number;
  locationLat: number;
  locationLng: number;
  claimAmount: number;
}
```

#### WeatherData
```typescript
interface WeatherData {
  temperature: number;
  rainfall: number;
  humidity: number;
  location: {
    lat: number;
    lng: number;
  };
  timestamp: number;
  description?: string;
}
```

## 🔗 Smart Contracts

### Insurance Contract Structure

#### Main Contract: `insurance.move`
```move
module 0x0::insurance {
    // Insurance Policy struct
    struct InsurancePolicy has key, store {
        id: UID,
        policy_id: ID,
        client_address: address,
        coverage_amount: u64,
        premium_amount: u64,
        risk_type: u8,
        status: u8,
        created_at: u64,
        max_temperature: u64,
        min_temperature: u64,
        max_rainfall: u64,
        min_humidity: u64,
        max_humidity: u64,
        location_lat: u64,
        location_lng: u64,
        claim_amount: u64,
    }
    
    // Policy Cap struct
    struct PolicyCap has key, store {
        id: UID,
        policy_id: ID,
    }
}
```

#### Key Functions
```move
// Create new insurance policy
public fun create_policy_entry(
    ctx: &mut TxContext,
    coverage_amount: u64,
    premium_amount: u64,
    risk_type: u8,
    max_temperature: u64,
    min_temperature: u64,
    max_rainfall: u64,
    min_humidity: u64,
    max_humidity: u64,
    location_lat: u64,
    location_lng: u64,
): (InsurancePolicy, PolicyCap)

// Check weather conditions and process claims
public fun check_weather_conditions_and_claim(
    policy: &mut InsurancePolicy,
    current_temperature: u64,
    current_rainfall: u64,
    current_humidity: u64,
    ctx: &mut TxContext,
): u64
```

### Contract Deployment

#### Deployment Script
```bash
#!/bin/bash
# deploy-insurance.sh

echo "🚀 Deploying Insurance Contract to Sui..."

# Build the contract
sui move build

# Deploy to network
sui client publish --gas-budget 100000000

echo "✅ Contract deployed successfully!"
echo "📦 Package ID: [COPY THIS TO FRONTEND]"
```

#### Verification
```bash
# Verify contract on SuiScan
sui client object <PACKAGE_ID>

# Check contract functions
sui client call <PACKAGE_ID>::insurance::create_policy_entry
```

## 🌤️ Weather Integration

### Supported Weather Providers

#### OpenWeatherMap
- **Current Weather**: Real-time conditions
- **Forecast Data**: 5-day predictions
- **Historical Data**: Past weather patterns
- **Global Coverage**: Worldwide data

#### Data Points Collected
```typescript
interface WeatherDataPoint {
  temperature: number;      // Celsius
  humidity: number;         // Percentage
  rainfall: number;         // Millimeters
  windSpeed: number;        // m/s
  pressure: number;         // hPa
  visibility: number;       // km
  uvIndex: number;         // UV index
  timestamp: number;        // Unix timestamp
}
```

### Oracle Architecture

#### Data Flow
```
Weather APIs → Data Processing → Oracle Service → Smart Contract
     ↓              ↓              ↓              ↓
Raw Data → Validation → Aggregation → Blockchain
```

#### Caching Strategy
- **Cache Duration**: 5 minutes
- **Fallback Data**: Consistent simulated data
- **Error Handling**: Graceful degradation
- **Performance**: Optimized for speed

### Weather Thresholds

#### Temperature Ranges
```typescript
const temperatureThresholds = {
  critical_high: 40,    // °C - Crop damage
  high: 35,             // °C - Stress conditions
  optimal_high: 30,     // °C - Good growing
  optimal_low: 15,      // °C - Good growing
  low: 5,               // °C - Stress conditions
  critical_low: 0,      // °C - Frost damage
};
```

#### Rainfall Thresholds
```typescript
const rainfallThresholds = {
  drought: 0,           // mm - No rain
  low: 5,               // mm - Light rain
  normal: 15,           // mm - Normal rain
  high: 30,             // mm - Heavy rain
  flood: 50,            // mm - Flood conditions
};
```

#### Humidity Thresholds
```typescript
const humidityThresholds = {
  very_low: 20,         // % - Arid conditions
  low: 40,              // % - Dry conditions
  normal: 60,            // % - Optimal conditions
  high: 80,             // % - Humid conditions
  very_high: 95,        // % - Saturated conditions
};
```

## 🔐 Security

### Smart Contract Security

#### Security Measures
- **Access Control**: Owner-only functions
- **Input Validation**: Parameter checking
- **Overflow Protection**: Safe math operations
- **Reentrancy Guards**: Attack prevention
- **Upgradeability**: Controlled updates

#### Audit Recommendations
- **Code Review**: Professional audit
- **Testing**: Comprehensive test suite
- **Monitoring**: Real-time security monitoring
- **Updates**: Regular security patches

### Data Security

#### Privacy Protection
- **No Personal Data**: Only coordinates stored
- **Encrypted Storage**: Sensitive data protection
- **Access Control**: Role-based permissions
- **Data Minimization**: Only necessary data collected

#### Network Security
- **HTTPS**: Encrypted communication
- **API Security**: Rate limiting and authentication
- **Wallet Security**: Secure key management
- **Transaction Security**: Signed transactions

### Best Practices

#### For Users
- **Wallet Security**: Use hardware wallets
- **Private Keys**: Never share private keys
- **Network Verification**: Always verify network
- **Transaction Review**: Check before signing

#### For Developers
- **Code Audits**: Regular security reviews
- **Dependency Updates**: Keep dependencies current
- **Error Handling**: Comprehensive error management
- **Logging**: Detailed security logs

## 🚀 Deployment

### Frontend Deployment

#### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Configure environment variables
vercel env add OPENWEATHER_API_KEY
vercel env add SUI_NETWORK
```

#### Netlify Deployment
```bash
# Build the application
pnpm build

# Deploy to Netlify
netlify deploy --prod --dir=out
```

#### Docker Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Smart Contract Deployment

#### Testnet Deployment
```bash
# Configure for testnet
sui client switch --env testnet

# Deploy contract
sui client publish --gas-budget 100000000

# Verify deployment
sui client object <PACKAGE_ID>
```

#### Mainnet Deployment
```bash
# Configure for mainnet
sui client switch --env mainnet

# Deploy contract
sui client publish --gas-budget 100000000

# Verify deployment
sui client object <PACKAGE_ID>
```

### Environment Configuration

#### Production Environment
```env
NODE_ENV=production
SUI_NETWORK=mainnet
OPENWEATHER_API_KEY=your_production_key
LOG_LEVEL=error
ENABLE_ANALYTICS=true
```

#### Staging Environment
```env
NODE_ENV=staging
SUI_NETWORK=testnet
OPENWEATHER_API_KEY=your_staging_key
LOG_LEVEL=info
ENABLE_DEBUG_MODE=true
```

## 🧪 Testing

### Unit Testing

#### Frontend Tests
```bash
# Run component tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run specific test
pnpm test InsuranceContractCreator
```

#### Smart Contract Tests
```bash
# Run Move tests
sui move test

# Run specific test
sui move test insurance::test_create_policy
```

### Integration Testing

#### End-to-End Tests
```bash
# Install Playwright
pnpm add -D @playwright/test

# Run E2E tests
pnpm test:e2e

# Run in headed mode
pnpm test:e2e --headed
```

#### API Testing
```bash
# Test weather API
pnpm test:api

# Test Sui integration
pnpm test:sui
```

### Performance Testing

#### Load Testing
```bash
# Install Artillery
npm install -g artillery

# Run load tests
artillery run load-test.yml
```

#### Stress Testing
```bash
# Test with high load
artillery run stress-test.yml
```

## 📊 Monitoring

### Application Monitoring

#### Health Checks
```typescript
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: Date.now(),
    version: process.env.APP_VERSION,
    uptime: process.uptime()
  });
});
```

#### Performance Metrics
- **Response Time**: API response times
- **Throughput**: Requests per second
- **Error Rate**: Error percentage
- **Uptime**: Service availability

### Blockchain Monitoring

#### Transaction Monitoring
```typescript
// Monitor Sui transactions
const monitorTransactions = async () => {
  const client = new SuiClient({ url: SUI_RPC_URL });
  
  // Watch for new transactions
  client.subscribeEvent({
    filter: { Package: PACKAGE_ID },
    onMessage: (event) => {
      console.log('New transaction:', event);
    }
  });
};
```

#### Smart Contract Events
- **Policy Creation**: New insurance policies
- **Claim Processing**: Automatic payouts
- **Weather Updates**: Oracle data feeds
- **Error Events**: Contract failures

### Weather Data Monitoring

#### Data Quality Metrics
- **Accuracy**: Weather data accuracy
- **Latency**: Data update frequency
- **Availability**: Service uptime
- **Coverage**: Geographic coverage

#### Oracle Health
```typescript
// Check oracle health
const checkOracleHealth = async () => {
  const health = await oracleService.getHealthStatus();
  
  return {
    status: health.status,
    lastUpdate: health.lastUpdate,
    dataQuality: health.dataQuality,
    coverage: health.coverage
  };
};
```

## 🤝 Contributing

### Development Setup

#### Fork and Clone
```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/your-username/parametric-agricultural-insurance.git
cd parametric-agricultural-insurance

# Add upstream remote
git remote add upstream https://github.com/original-org/parametric-agricultural-insurance.git
```

#### Development Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes
# Test changes
pnpm test

# Commit changes
git commit -m "Add your feature"

# Push to fork
git push origin feature/your-feature-name

# Create pull request
```

### Code Standards

#### TypeScript Guidelines
- **Type Safety**: Strict type checking
- **Interface Design**: Clear interfaces
- **Error Handling**: Comprehensive error management
- **Documentation**: JSDoc comments

#### React Guidelines
- **Component Structure**: Functional components
- **State Management**: Hooks and context
- **Performance**: Memoization and optimization
- **Accessibility**: WCAG compliance

#### Move Guidelines
- **Security**: Secure coding practices
- **Gas Optimization**: Efficient operations
- **Documentation**: Clear function documentation
- **Testing**: Comprehensive test coverage

### Pull Request Process

#### Before Submitting
1. **Code Review**: Self-review your code
2. **Testing**: Ensure all tests pass
3. **Documentation**: Update relevant docs
4. **Performance**: Check for performance issues

#### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## 🔧 Troubleshooting

### Common Issues

#### Installation Issues
```bash
# Permission denied error
sudo chmod +x node_modules/.bin/next

# Node version issues
nvm use 18

# Package manager issues
rm -rf node_modules package-lock.json
pnpm install
```

#### Sui Wallet Issues
```bash
# Wallet not connecting
# Check network configuration
sui client active-env

# Switch to correct network
sui client switch --env testnet

# Reset wallet connection
# Clear browser cache and reconnect
```

#### Weather API Issues
```bash
# API key not working
# Check environment variables
echo $OPENWEATHER_API_KEY

# Test API directly
curl "https://api.openweathermap.org/data/2.5/weather?lat=48.8566&lon=2.3522&appid=YOUR_API_KEY"
```

#### Smart Contract Issues
```bash
# Contract not deployed
# Check package ID
sui client object <PACKAGE_ID>

# Redeploy contract
./deploy-insurance.sh

# Check gas balance
sui client gas
```

### Debug Mode

#### Enable Debug Logging
```typescript
// Enable debug mode
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('Debug information:', debugData);
}
```

#### Browser DevTools
```javascript
// Open browser console
// Check for errors
console.error('Error details:', error);

// Monitor network requests
// Check API responses
// Verify wallet connection
```

### Performance Issues

#### Slow Loading
```bash
# Check bundle size
pnpm build
pnpm analyze

# Optimize images
# Use next/image for optimization
# Implement lazy loading
```

#### High Gas Costs
```move
// Optimize Move functions
// Reduce storage operations
// Batch transactions
// Use efficient data structures
```

### Support Channels

#### Community Support
- **GitHub Issues**: Bug reports and feature requests
- **Discord**: Real-time community support
- **Stack Overflow**: Technical questions
- **Reddit**: General discussions

#### Professional Support
- **Enterprise Support**: Commercial support
- **Consulting**: Custom implementations
- **Training**: Team training programs
- **Auditing**: Security audits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### License Summary
- **Commercial Use**: ✅ Allowed
- **Modification**: ✅ Allowed
- **Distribution**: ✅ Allowed
- **Private Use**: ✅ Allowed
- **Liability**: ❌ No warranty provided
- **Warranty**: ❌ No warranty provided

### Third-Party Licenses
- **Sui SDK**: Apache 2.0 License
- **Next.js**: MIT License
- **React**: MIT License
- **Tailwind CSS**: MIT License

## 🔗 Links and Resources

### Official Documentation
- **Sui Documentation**: [docs.sui.io](https://docs.sui.io)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **React Documentation**: [react.dev](https://react.dev)

### Blockchain Resources
- **SuiScan Explorer**: [suiscan.xyz](https://suiscan.xyz)
- **Sui GitHub**: [github.com/MystenLabs/sui](https://github.com/MystenLabs/sui)
- **Sui Discord**: [discord.gg/sui](https://discord.gg/sui)

### Weather Data Sources
- **OpenWeatherMap**: [openweathermap.org](https://openweathermap.org)
- **WeatherAPI**: [weatherapi.com](https://weatherapi.com)
- **AccuWeather**: [developer.accuweather.com](https://developer.accuweather.com)

### Development Tools
- **VS Code**: [code.visualstudio.com](https://code.visualstudio.com)
- **Sui Wallet**: [chrome.google.com/webstore](https://chrome.google.com/webstore)
- **Sui CLI**: [docs.sui.io/build/sui-install](https://docs.sui.io/build/sui-install)

---

## 🌟 Acknowledgments

**Built with ❤️ for the agricultural community**

### Special Thanks
- **Sui Foundation**: For blockchain infrastructure
- **OpenWeatherMap**: For weather data services
- **Agricultural Community**: For feedback and testing
- **Open Source Contributors**: For their valuable contributions

### Inspiration
This project was inspired by the need to provide accessible, transparent, and reliable insurance solutions for farmers worldwide, leveraging the power of blockchain technology and real-time data.

---

**Ready to revolutionize agricultural insurance? Start building today!** 🚀