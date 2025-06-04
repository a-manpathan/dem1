import React from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Pricing = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Pricing</h1>
        <p className="text-gray-500 text-lg">Flexible plans designed to support healthcare practices of all sizes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Basic Plan */}
        <div className="bg-gray-50 rounded-lg p-8 flex flex-col">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-center mb-2">Basic</h2>
            <p className="text-gray-500 text-center">Perfect for small practices who are getting started</p>
          </div>
          
          <div className="text-center mb-8">
            <span className="text-4xl font-bold">₹ 4410</span>
            <span className="text-gray-500">/ month</span>
            <p className="text-sm text-gray-500 mt-1">Billed Annually</p>
          </div>
          
          <div className="space-y-4 mb-8 flex-grow">
            <div className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Up to 10 Appointments</span>
            </div>
            <div className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Basic Reporting</span>
            </div>
            <div className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Email Support</span>
            </div>
            <div className="flex items-start">
              <X className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-500">Patient Records</span>
            </div>
            <div className="flex items-start">
              <X className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-500">Advanced Analytics</span>
            </div>
          </div>
          
          <Button className="bg-white hover:bg-gray-100 text-black border border-gray-200 group">
            Purchase Now
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Professional Plan */}
        <div className="bg-primary text-white rounded-lg p-8 flex flex-col shadow-lg transform scale-105">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-center mb-2">Professional</h2>
            <p className="text-primary-foreground/80 text-center">Ideal for growing medical practices</p>
          </div>
          
          <div className="text-center mb-8">
            <span className="text-4xl font-bold">₹ 8910</span>
            <span className="text-primary-foreground/80">/ month</span>
            <p className="text-sm text-primary-foreground/80 mt-1">Billed Annually</p>
          </div>
          
          <div className="space-y-4 mb-8 flex-grow">
            <div className="flex items-start">
              <Check className="w-5 h-5 text-white mr-2 flex-shrink-0 mt-0.5" />
              <span>Unlimited Appointments</span>
            </div>
            <div className="flex items-start">
              <Check className="w-5 h-5 text-white mr-2 flex-shrink-0 mt-0.5" />
              <span>Comprehensive Reporting</span>
            </div>
            <div className="flex items-start">
              <Check className="w-5 h-5 text-white mr-2 flex-shrink-0 mt-0.5" />
              <span>Email & Phone Support</span>
            </div>
            <div className="flex items-start">
              <Check className="w-5 h-5 text-white mr-2 flex-shrink-0 mt-0.5" />
              <span>Patient Records</span>
            </div>
            <div className="flex items-start">
              <Check className="w-5 h-5 text-white mr-2 flex-shrink-0 mt-0.5" />
              <span>Advanced Analytics</span>
            </div>
          </div>
          
          <Button className="bg-white hover:bg-gray-100 text-primary border border-white group">
            Purchase Now
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-gray-50 rounded-lg p-8 flex flex-col">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-center mb-2">Enterprise</h2>
            <p className="text-gray-500 text-center">Comprehensive solution for large healthcare organizations</p>
          </div>
          
          <div className="text-center mb-8">
            <span className="text-4xl font-bold">₹ 17910</span>
            <span className="text-gray-500">/ month</span>
            <p className="text-sm text-gray-500 mt-1">Billed Annually</p>
          </div>
          
          <div className="space-y-4 mb-8 flex-grow">
            <div className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Unlimited Appointments</span>
            </div>
            <div className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Custom Reporting</span>
            </div>
            <div className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Dedicated Support</span>
            </div>
            <div className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Advanced Patient Management</span>
            </div>
            <div className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Machine Learning Insights</span>
            </div>
          </div>
          
          <Button className="bg-white hover:bg-gray-100 text-black border border-gray-200 group">
            Purchase Now
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;