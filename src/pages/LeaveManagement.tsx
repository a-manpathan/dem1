import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Sample data for leave management
const leaveData = [
  {
    id: '1024',
    name: 'Dr. Abhinand Choudry',
    holidayAllowance: 30,
    openingBalance: 2,
    used: '02',
    remaining: 28,
    lossOfPay: '--'
  },
  {
    id: '1025',
    name: 'Dr. Sarah Johnson',
    holidayAllowance: 25,
    openingBalance: 5,
    used: '03',
    remaining: 22,
    lossOfPay: '01'
  },
  {
    id: '1026',
    name: 'Dr. Michael Chen',
    holidayAllowance: 28,
    openingBalance: 3,
    used: '00',
    remaining: 28,
    lossOfPay: '--'
  },
  {
    id: '1027',
    name: 'Dr. Emily Rodriguez',
    holidayAllowance: 30,
    openingBalance: 0,
    used: '05',
    remaining: 25,
    lossOfPay: '02'
  },
  {
    id: '1028',
    name: 'Dr. James Wilson',
    holidayAllowance: 25,
    openingBalance: 4,
    used: '04',
    remaining: 21,
    lossOfPay: '--'
  },
  {
    id: '1029',
    name: 'Dr. Priya Patel',
    holidayAllowance: 28,
    openingBalance: 2,
    used: '01',
    remaining: 27,
    lossOfPay: '--'
  },
  {
    id: '1030',
    name: 'Dr. Robert Kim',
    holidayAllowance: 30,
    openingBalance: 5,
    used: '07',
    remaining: 23,
    lossOfPay: '03'
  },
  {
    id: '1031',
    name: 'Dr. Lisa Thompson',
    holidayAllowance: 25,
    openingBalance: 1,
    used: '00',
    remaining: 25,
    lossOfPay: '--'
  },
  {
    id: '1032',
    name: 'Dr. David Martinez',
    holidayAllowance: 28,
    openingBalance: 3,
    used: '02',
    remaining: 26,
    lossOfPay: '--'
  },
  {
    id: '1033',
    name: 'Dr. Jennifer Lee',
    holidayAllowance: 30,
    openingBalance: 0,
    used: '06',
    remaining: 24,
    lossOfPay: '01'
  },
  {
    id: '1034',
    name: 'Dr. Thomas Wright',
    holidayAllowance: 25,
    openingBalance: 4,
    used: '03',
    remaining: 22,
    lossOfPay: '--'
  }
];

// Sample data for leave types
const leaveTypes = [
  { name: "Casual Leaves", available: 15, icon: "clock", color: "orange" },
  { name: "Sick Leaves", available: 12, icon: "user", color: "purple" },
  { name: "Emergency Leaves", available: 5, icon: "alert-triangle", color: "red" },
  { name: "Earned Leaves", available: 10, icon: "check-circle", color: "green" },
  { name: "Privilege Leaves", available: 8, icon: "credit-card", color: "blue" },
  { name: "Loss of Pay", available: 15, icon: "dollar-sign", color: "amber" }
];

const LeaveManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState('1 Apr 2025 - 31 Mar 2026');

  // Filter data based on search query
  const filteredData = leaveData.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add these functions to handle pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex h-full">
      {/* Left Sidebar */}
      <div className="w-48 bg-background border-r border-border">
        <div className="py-2">
          <Link to="/staff" className="block py-3 px-4 text-foreground hover:bg-muted">
            Staff Directory
          </Link>
          <Link to="/shift-management" className="block py-3 px-4 text-foreground hover:bg-muted">
            Shift Management
          </Link>
          <Link to="/attendance" className="block py-3 px-4 text-foreground hover:bg-muted">
            Attendance
          </Link>
          <div className="py-3 px-4 bg-blue-50 border-l-4 border-blue-500 text-blue-600 font-medium">
            Leave Management
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Leave Management</h1>
            <div className="flex space-x-2">
              <Button variant="outline" className="text-blue-500 border-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Set Leave Types
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Overview
              </Button>
              <Button variant="outline" className="border-gray-300">
                Request (02)
              </Button>
            </div>
          </div>

          {/* Leave Types Cards */}
          <div className="grid grid-cols-6 gap-4 mb-6">
            {leaveTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full bg-${type.color}-100 flex items-center justify-center mb-2`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-${type.color}-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {type.icon === "clock" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    {type.icon === "user" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
                    {type.icon === "alert-triangle" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />}
                    {type.icon === "check-circle" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    {type.icon === "credit-card" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />}
                    {type.icon === "dollar-sign" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                  </svg>
                </div>
                <h3 className="text-sm font-medium mb-2">{type.name}</h3>
                <p className="text-xs text-gray-500">Available : {type.available}</p>
              </div>
            ))}
          </div>

          {/* Search and Date Range */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search by Name/ Department" 
                className="pl-10 h-10 border-gray-300 rounded-md" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm">{dateRange}</div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Leave Table */}
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">NAME</th>
                  <th className="px-4 py-3 text-center">HOLIDAY ALLOWANCE</th>
                  <th className="px-4 py-3 text-center">OPENING BALANCE</th>
                  <th className="px-4 py-3 text-center">USED</th>
                  <th className="px-4 py-3 text-center">REMAINING</th>
                  <th className="px-4 py-3 text-center">LOSS OF PAY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-500">{item.id}</td>
                    <td className="px-4 py-4 text-sm font-medium">{item.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-500 text-center">{item.holidayAllowance}</td>
                    <td className="px-4 py-4 text-sm text-gray-500 text-center">{item.openingBalance}</td>
                    <td className="px-4 py-4 text-sm text-gray-500 text-center">{item.used}</td>
                    <td className="px-4 py-4 text-sm text-gray-500 text-center">{item.remaining}</td>
                    <td className="px-4 py-4 text-sm text-gray-500 text-center">{item.lossOfPay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-1">
              <button 
                className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-500"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <button 
                    key={i}
                    className={`w-8 h-8 flex items-center justify-center rounded border border-gray-300 ${
                      currentPage === pageNumber ? 'bg-blue-500 text-white' : 'text-gray-700'
                    }`}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              
              {totalPages > 5 && (
                <>
                  <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-700">
                    ...
                  </button>
                  <button 
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-700"
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              
              <button 
                className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-500"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;


