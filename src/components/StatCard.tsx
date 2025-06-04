
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  isPositive = true,
  className = "" 
}) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="flex flex-col space-y-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          {change && (
            <div className={`flex items-center space-x-1 text-sm ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{change}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
