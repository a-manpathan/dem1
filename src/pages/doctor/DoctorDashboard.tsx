import React, { useState } from 'react';
import { Calendar, ChevronDown, Filter, ChevronLeft, ChevronRight, Settings, Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import genixLogo from '../../pages/jok.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const DoctorDashboard = () => {
  const [filterPeriod, setFilterPeriod] = useState('Monthly');
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  
  // Sample data for statistics
  const stats = {
    totalAppointments: 1580,
    completed: 1268,
    cancelled: 34,
    newPatients: 564,
    returnPatients: 1016,
    followUps: 820,
  };
  
  // Sample data for appointment trend
  const appointmentTrendData = [
    { month: 'May', appointments: 35 },
    { month: 'Jun', appointments: 45 },
    { month: 'Jul', appointments: 25 },
    { month: 'Aug', appointments: 20 },
    { month: 'Sep', appointments: 40 },
    { month: 'Oct', appointments: 50 },
    { month: 'Nov', appointments: 35 },
    { month: 'Dec', appointments: 25 },
    { month: 'Jan', appointments: 55 },
    { month: 'Feb', appointments: 45 },
    { month: 'Mar', appointments: 50 },
    { month: 'Apr', appointments: 40 }
  ];

  // Sample data for patient statistics
  const patientStatsData = [
    { name: 'Male', value: 34, color: '#9CA3AF' },
    { name: 'Female', value: 34, color: '#FCA5A5' },
    { name: 'Children', value: 34, color: '#A7F3D0' }
  ];
  
  // Sample data for today's appointments
  const todaysAppointments = [
    { time: '11:00 PM', name: 'Karthik Vishwanath', profile: 'Male, 34y', phone: '7025682057', reason: 'Body Ache', status: 'Booked', type: 'clinic' },
    { time: '11:00 PM', name: 'Karthik Vishwanath', profile: 'Male, 34y', phone: '7025682057', reason: 'Report Show', status: 'Arrived', type: 'phone' },
    { time: '11:00 PM', name: 'Karthik Vishwanath', profile: 'Male, 34y', phone: '7025682057', reason: 'Report Show', status: 'Cancelled', type: 'phone' },
    { time: '11:00 PM', name: 'Karthik Vishwanath', profile: 'Male, 34y', phone: '7025682057', reason: 'Rabis Vaccination', status: 'Sent patient in', type: 'vaccination' },
    { time: '11:00 PM', name: 'Karthik Vishwanath', profile: 'Male, 34y', phone: '7025682057', reason: 'Report Show', status: 'Completed', type: 'clinic' },
    { time: '11:00 PM', name: 'Karthik Vishwanath', profile: 'Male, 34y', phone: '7025682057', reason: 'Report Show', status: 'Booked', type: 'clinic' },
    { time: '11:00 PM', name: 'Karthik Vishwanath', profile: 'Male, 34y', phone: '7025682057', reason: 'Report Show', status: 'Completed', type: 'phone' },
    { time: '11:00 PM', name: 'Karthik Vishwanath', profile: 'Male, 34y', phone: '7025682057', reason: 'Report Show', status: 'Completed', type: 'phone' },
  ];
  
  // Sample data for appointment history
  const appointmentHistory = [
    { type: 'In Clinic', icon: '👨‍⚕️', count: 182 },
    { type: 'Telephonic', icon: '📞', count: 64 },
    { type: 'Home Visit', icon: '🏠', count: 25 },
    { type: 'Video Conference', icon: '💻', count: 168 },
    { type: 'Vaccination', icon: '💉', count: 800 },
    { type: 'Show Report', icon: '📊', count: 287 },
    { type: 'Emergency', icon: '🚨', count: 101 },
    { type: 'Long term Condition', icon: '❤️', count: 658 },
    { type: 'Routine appointment', icon: '📅', count: 194 },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Booked': return 'text-blue-500';
      case 'Arrived': return 'text-purple-500';
      case 'Cancelled': return 'text-red-500';
      case 'Sent patient in': return 'text-orange-500';
      case 'Completed': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'clinic': return <span className="text-blue-500">👨‍⚕️</span>;
      case 'phone': return <span className="text-green-500">📞</span>;
      case 'home': return <span className="text-orange-500">🏠</span>;
      case 'video': return <span className="text-purple-500">💻</span>;
      case 'vaccination': return <span className="text-yellow-500">💉</span>;
      default: return <span className="text-gray-500">📋</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Remove the header section that contains the duplicate navigation */}
      
      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Doctor info and filter */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold">Dr. Abhinand Choudry</h1>
            <p className="text-gray-500">Endocrinologist</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Popover open={showFilterOptions} onOpenChange={setShowFilterOptions}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  <span>{filterPeriod}</span>
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0">
                <div className="py-1">
                  <button 
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setFilterPeriod("Today's");
                      setShowFilterOptions(false);
                    }}
                  >
                    Today's
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setFilterPeriod("This Month");
                      setShowFilterOptions(false);
                    }}
                  >
                    This Month
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setFilterPeriod("Monthly");
                      setShowFilterOptions(false);
                    }}
                  >
                    Monthly
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setFilterPeriod("Yearly");
                      setShowFilterOptions(false);
                    }}
                  >
                    Yearly
                  </button>
                </div>
              </PopoverContent>
            </Popover>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Start date
              </Button>
              <Button variant="outline" className="flex items-center">
                End date
              </Button>
            </div>
          </div>
        </div>
        
        {/* Statistics cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500">Total Appointments</h3>
                <span className="text-green-500 text-xs flex items-center">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  +8.1%
                </span>
              </div>
              <p className="text-3xl font-bold text-blue-500">{stats.totalAppointments}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500">Completed</h3>
                <span className="text-green-500 text-xs flex items-center">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  +8.1%
                </span>
              </div>
              <p className="text-3xl font-bold text-green-500">{stats.completed}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500">Cancelled</h3>
                <span className="text-green-500 text-xs flex items-center">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  +8.1%
                </span>
              </div>
              <p className="text-3xl font-bold text-red-500">{stats.cancelled}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500">New Patient</h3>
                <span className="text-red-500 text-xs flex items-center">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  -3.2%
                </span>
              </div>
              <p className="text-3xl font-bold text-purple-500">{stats.newPatients}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500">Return Patients</h3>
                <span className="text-green-500 text-xs flex items-center">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  +8.1%
                </span>
              </div>
              <p className="text-3xl font-bold text-orange-500">{stats.returnPatients}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500">Follow Ups</h3>
                <span className="text-green-500 text-xs flex items-center">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  +8.1%
                </span>
              </div>
              <p className="text-3xl font-bold text-cyan-500">{stats.followUps}</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Trend Chart */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Trend in Total Appointments</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={appointmentTrendData}>
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                    />
                    <YAxis hide />
                    <Line 
                      type="monotone" 
                      dataKey="appointments" 
                      stroke="#06B6D4" 
                      strokeWidth={2}
                      dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Patient Statistics Pie Chart */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Statistics</h3>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                      <Pie
                        data={patientStatsData}
                        cx={100}
                        cy={100}
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {patientStatsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-500">TOTAL</span>
                    <span className="text-xl font-bold">1580</span>
                  </div>
                </div>
                <div className="ml-8 space-y-2">
                  {patientStatsData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Appointment History */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment History</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointmentHistory.slice(0, 8).map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">{item.type}</h4>
                      <p className="text-sm text-gray-500">{item.count} appointments</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Today's Appointments */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Appointments</h3>
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500 uppercase">
                    <th className="text-left pb-2">Slot</th>
                    <th className="text-left pb-2">Name</th>
                    <th className="text-left pb-2">Profile</th>
                    <th className="text-left pb-2">Phone Num</th>
                    <th className="text-left pb-2">Reason</th>
                    <th className="text-right pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todaysAppointments.slice(0, 5).map((appointment, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-3 text-sm">{appointment.time}</td>
                      <td className="py-3 text-sm font-medium">{appointment.name}</td>
                      <td className="py-3 text-sm text-gray-500">{appointment.profile}</td>
                      <td className="py-3 text-sm">{appointment.phone}</td>
                      <td className="py-3 text-sm">{appointment.reason}</td>
                      <td className={`py-3 text-sm text-right ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;






