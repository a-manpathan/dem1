import React from 'react';
import { Plus, Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Billing = () => {
  const transactions = [
    { date: 'Nov 23, 2024', amount: '$8910', method: 'Credit Card' },
    { date: 'Oct 23, 2024', amount: '$8910', method: 'Credit Card' },
    { date: 'Sep 23, 2024', amount: '$8910', method: 'Credit Card' },
    { date: 'Nov 23, 2024', amount: '$8910', method: 'Credit Card' },
    { date: 'Nov 23, 2024', amount: '$8910', method: 'Credit Card' },
    { date: 'Nov 23, 2024', amount: '$8910', method: 'Credit Card' },
    { date: 'Nov 23, 2024', amount: '$8910', method: 'Credit Card' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing Details</h1>
        <p className="text-gray-500">Overview of financial transaction</p>
      </div> 

      <div className="grid grid-cols-3 gap-6">
        {/* Wallet Balance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Wallet Balance</h3>
              <p className="text-3xl font-bold text-gray-900">$258.64</p>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add money to wallet
            </Button>
          </div>
        </div>

        {/* Customer Details */}
        <div className="col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer details</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Hospital :</span>
                <span className="ml-2 text-sm text-gray-900">City Hospital</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Email :</span>
                <span className="ml-2 text-sm text-gray-900">admincityhospital@gmail.com</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Phone num :</span>
                <span className="ml-2 text-sm text-gray-900">7086452067</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500">Country :</span>
                <span className="ml-2 text-sm text-gray-900">🇮🇳</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Transaction History</h3>
          <Button className="bg-primary hover:bg-primary/90" asChild>
            <Link to="/pricing">Recharge Now</Link>
          </Button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-gray-900 dark:text-gray-100">Active Plan : Professional</p>
          </div>
          <div>
            <p className="text-sm text-gray-900 dark:text-gray-100">Validity : till 23 May, 2025</p>
          </div>
          <Button variant="outline" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <Eye className="w-4 h-4 mr-2" />
            View pricing details
          </Button>
        </div>

        {/* Transaction Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.date}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.amount}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.method}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Billing;
