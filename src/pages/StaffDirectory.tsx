
import React, { useState } from 'react';
import { Search, Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import doctorImage from '@/assets/doctor.jpg';

const StaffDirectory = () => {
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterLocation, setFilterLocation] = useState('ALL LOCATION');
  const [selectedStaff, setSelectedStaff] = useState<number[]>([]);
  
  // Sample staff data
  const staff = Array(8).fill(null).map((_, index) => ({
    id: index + 1,
    idNumber: '1202',
    name: 'Dr. Abhinand Choudry',
    position: 'Endocrinologist',
    location: 'City Hospital',
    contact: '7025682057',
    email: 'drabhinand@gmail.com',
    status: index === 4 ? 'Not Active' : 'Active',
    image: doctorImage,
    joinDate: '01 May 2024'
  }));

  const handleCheckboxChange = (id: number) => {
    setSelectedStaff(prev => {
      if (prev.includes(id)) {
        return prev.filter(staffId => staffId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <div className="flex h-full">
      {/* Left Sidebar */}
      <div className="w-48 bg-background border-r border-border">
        <div className="py-2">
          <div className="py-3 px-4 bg-blue-50 border-l-4 border-blue-500 text-blue-600 font-medium">
            Staff Directory
          </div>
          <Link to="/shift-management" className="block py-3 px-4 text-foreground hover:bg-muted">
            Shift Management
          </Link>
          <Link to="/attendance" className="block py-3 px-4 text-foreground hover:bg-muted">
            Attendance
          </Link>
          <Link to="/leave-management" className="block py-3 px-4 text-foreground hover:bg-muted">
            Leave Management
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Staff Directory</h1>

          {/* Search and Filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search by Name/ Department" 
                  className="pl-10 w-64 h-10 border-gray-300 rounded-md" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32 h-10 border-gray-300 rounded-md">
                    <SelectValue placeholder="ALL" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">ALL</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Deactivated">Deactivated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="relative">
                <Select value={filterLocation} onValueChange={setFilterLocation}>
                  <SelectTrigger className="w-40 h-10 border-gray-300 rounded-md">
                    <SelectValue placeholder="ALL LOCATION" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL LOCATION">ALL LOCATION</SelectItem>
                    <SelectItem value="City Hospital">City Hospital</SelectItem>
                    <SelectItem value="Metro Clinic">Metro Clinic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                className="bg-blue-500 hover:bg-blue-600 text-white h-10 rounded-md" 
                onClick={() => setAddStaffOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Staff
              </Button>
              
              <Button 
                variant="outline" 
                className="h-10 border-gray-300 text-gray-700 rounded-md"
                disabled={selectedStaff.length === 0}
              >
                Deactivate Staff
              </Button>
              
              <Button 
                variant="outline" 
                className="h-10 border-gray-300 text-gray-700 rounded-md"
              >
                Edit Details
              </Button>
            </div>
          </div>

          {/* Staff Table */}
          <div className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 dark:border-gray-600" 
                    />
                  </th>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">NAME</th>
                  <th className="px-4 py-3 text-left">SPECIALISATION</th>
                  <th className="px-4 py-3 text-left">LOCATION</th>
                  <th className="px-4 py-3 text-left">CONTACT</th>
                  <th className="px-4 py-3 text-left">JOIN DATE</th>
                  <th className="px-4 py-3 text-center">AV</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {staff.map((member, index) => (
                  <tr 
                    key={member.id} 
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${index === 1 ? 'border-l-4 border-blue-500' : ''}`}
                  >
                    <td className="px-4 py-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 dark:border-gray-600" 
                        checked={selectedStaff.includes(member.id)}
                        onChange={() => handleCheckboxChange(member.id)}
                      />
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {`00${index + 1}`}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {member.idNumber}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{member.name}</p>
                          <div className="flex items-center mt-1">
                            <div className={`w-2 h-2 rounded-full ${
                              member.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                            } mr-1`}></div>
                            <span className={`text-xs ${
                              member.status === 'Active' ? 'text-green-500' : 'text-red-500'
                            }`}>{member.status}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {member.position}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {member.location}
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.contact}</p>
                        <p className="text-xs text-blue-500">{member.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {member.joinDate}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="w-5 h-5 rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 mx-auto"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-1">
              <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 bg-blue-500 text-white">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                2
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                ...
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                4
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                5
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Staff Dialog */}
      <Dialog open={addStaffOpen} onOpenChange={setAddStaffOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Add Staff</h2>
            {/* Dialog content would go here */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffDirectory;
