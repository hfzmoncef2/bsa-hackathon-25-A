'use client';

import { InsuranceContractCreator } from './components/InsuranceContractCreator';
import { Shield, MapPin, CloudRain, DollarSign } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Parametric
              <span className="block text-green-200">Agricultural Insurance</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Protect your crops with smart contracts based on weather data
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How does it work?
            </h2>
            <p className="text-lg text-gray-600">
              Transparent and automatic insurance based on real data
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Define your area</h3>
              <p className="text-gray-600">
                Specify your field position and critical weather conditions
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CloudRain className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Automatic monitoring</h3>
              <p className="text-gray-600">
                Our oracle monitors weather conditions in your area in real-time
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Automatic reimbursement</h3>
              <p className="text-gray-600">
                As soon as thresholds are exceeded, you are automatically reimbursed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contract Creation Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Create Your Insurance Contract
            </h2>
            <p className="text-lg text-gray-600">
              Define your area, needs and critical weather conditions
            </p>
          </div>
          
          <InsuranceContractCreator />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to protect your crops?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of farmers who trust our system
          </p>
          <div className="flex items-center justify-center space-x-4 text-green-100">
            <Shield className="h-6 w-6" />
            <span className="text-lg">Automatic protection • Total transparency • Fast payments</span>
          </div>
        </div>
      </section>
    </main>
  );
}