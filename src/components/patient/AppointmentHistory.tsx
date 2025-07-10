import React from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, User, Video, Heart, Calendar, ChevronRight } from "lucide-react";

interface Appointment {
  date: string;
  day: string;
  hospital: string;
  location: string;
  doctor: string;
  specialty: string;
  slot: string;
  type: string;
  reason: string;
  severity: 'Low' | 'Medium' | 'Severe';
  status: 'Upcoming' | 'Completed' | 'Cancelled';
}

interface AppointmentHistoryProps {
  onBackToBooking: () => void;
}

const AppointmentHistory: React.FC<AppointmentHistoryProps> = ({ onBackToBooking }) => {
  const appointments: Appointment[] = [
    {
      date: '1 March 2024', day: 'Friday', hospital: 'City Hospital', location: 'Austin',
      doctor: 'Dr. Alex Julian', specialty: 'Ophthalmology', slot: '10:00 AM', type: 'In Clinic',
      reason: 'Head ache', severity: 'Medium', status: 'Upcoming'
    },
    {
      date: '1 March 2024', day: 'Friday', hospital: 'City Hospital', location: 'Austin',
      doctor: 'Dr. Alex Julian', specialty: 'Ophthalmology', slot: '10:00 AM', type: 'Video Conference',
      reason: 'Asthma', severity: 'Severe', status: 'Completed'
    },
    {
      date: '1 March 2024', day: 'Friday', hospital: 'City Hospital', location: 'Austin',
      doctor: 'Dr. Alex Julian', specialty: 'Ophthalmology', slot: '10:00 AM', type: 'Long Term Condition',
      reason: 'Breathing Trouble', severity: 'Low', status: 'Completed'
    },
    {
      date: '1 March 2024', day: 'Friday', hospital: 'City Hospital', location: 'Austin',
      doctor: 'Dr. Alex Julian', specialty: 'Ophthalmology', slot: '10:00 AM', type: 'Long Term Condition',
      reason: 'Regular Check up', severity: 'Medium', status: 'Completed'
    },
    {
      date: '1 March 2024', day: 'Friday', hospital: 'City Hospital', location: 'Austin',
      doctor: 'Dr. Alex Julian', specialty: 'Ophthalmology', slot: '10:00 AM', type: 'In Clinic',
      reason: 'Breathing Trouble', severity: 'Medium', status: 'Cancelled'
    },
    {
      date: '1 March 2024', day: 'Friday', hospital: 'City Hospital', location: 'Austin',
      doctor: 'Dr. Alex Julian', specialty: 'Ophthalmology', slot: '10:00 AM', type: 'In Clinic',
      reason: 'Breathing Trouble', severity: 'Medium', status: 'Completed'
    },
    {
      date: '1 March 2024', day: 'Friday', hospital: 'City Hospital', location: 'Austin',
      doctor: 'Dr. Alex Julian', specialty: 'Ophthalmology', slot: '10:00 AM', type: 'In Clinic',
      reason: 'Breathing Trouble', severity: 'Medium', status: 'Completed'
    },
    {
      date: '1 March 2024', day: 'Friday', hospital: 'City Hospital', location: 'Austin',
      doctor: 'Dr. Alex Julian', specialty: 'Ophthalmology', slot: '10:00 AM', type: 'In Clinic',
      reason: 'Breathing Trouble', severity: 'Severe', status: 'Completed'
    },
    {
      date: '1 March 2024', day: 'Friday', hospital: 'City Hospital', location: 'Austin',
      doctor: 'Dr. Alex Julian', specialty: 'Ophthalmology', slot: '10:00 AM', type: 'In Clinic',
      reason: 'Breathing Trouble', severity: 'Low', status: 'Completed'
    },
  ];

  const getSeverityColor = (severity: 'Low' | 'Medium' | 'Severe') => {
    switch (severity) {
      case 'Low': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'Severe': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusColor = (status: 'Upcoming' | 'Completed' | 'Cancelled') => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-500';
      case 'Completed': return 'bg-green-500';
      case 'Cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'In Clinic':
        return <User className="w-5 h-5 mr-1 text-blue-500" />;
      case 'Video Conference':
        return <Video className="w-5 h-5 mr-1 text-purple-500" />;
      case 'Long Term Condition':
        return <Heart className="w-5 h-5 mr-1 text-red-500" />;
      default:
        return <Calendar className="w-5 h-5 mr-1 text-pink-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Main Content */}
      <main className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Appointment History</h1>
          <div className="flex space-x-4">
            <Button 
              variant="outline"
              className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 py-2 px-4 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-gray-700 transition duration-200"
              onClick={onBackToBooking}
            >
              Book Appointment
            </Button>
            <Button className="bg-blue-600 dark:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold shadow-md hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-200">
              Appointment History
            </Button>
          </div>
        </div>

        {/* Appointment Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">DATE</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">HOSPITAL</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">DOCTOR</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">SLOT</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">TYPE</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">REASON/ SEVERE</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">STATUS</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">DETAILS</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {appointments.map((appointment, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{appointment.date}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{appointment.day}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                        <div className="text-sm text-gray-900 dark:text-gray-100">{appointment.hospital}</div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 ml-7">{appointment.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{appointment.doctor}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{appointment.specialty}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{appointment.slot}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex items-center">
                        {getTypeIcon(appointment.type)}
                        {appointment.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{appointment.reason}</div>
                      <div className={`text-sm ${getSeverityColor(appointment.severity)}`}>{appointment.severity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                        <span className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(appointment.status)}`}></span>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppointmentHistory;