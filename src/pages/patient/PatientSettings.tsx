import React from 'react';
import { CheckCircle } from 'lucide-react';

interface PatientSettingsProps {
  onBack?: () => void;
}

const PatientSettings: React.FC<PatientSettingsProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">Share medical record</h1>
          {onBack && (
            <button 
              onClick={onBack}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Back
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-6">Invitation to share records</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <span className="text-gray-700 dark:text-gray-300 text-lg">Hospital 1</span>
              <div className="flex space-x-3">
                <button className="px-5 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors text-sm">
                  Accept
                </button>
                <button className="px-5 py-2 bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 rounded-md shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm">
                  Decline
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <span className="text-gray-700 dark:text-gray-300 text-lg">Hospital 2</span>
              <div className="flex items-center space-x-4">
                <span className="text-green-600 dark:text-green-400 font-medium flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-1" /> Accepted
                </span>
                <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors text-sm">
                  Remove access
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <span className="text-gray-700 dark:text-gray-300 text-lg">Hospital 3</span>
              <div className="flex items-center space-x-4">
                <span className="text-green-600 dark:text-green-400 font-medium flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-1" /> Accepted
                </span>
                <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors text-sm">
                  Remove access
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-gray-700 dark:text-gray-300 text-lg">Hospital 4</span>
              <div className="flex items-center space-x-4">
                <span className="text-green-600 dark:text-green-400 font-medium flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-1" /> Accepted
                </span>
                <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors text-sm">
                  Remove access
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientSettings;