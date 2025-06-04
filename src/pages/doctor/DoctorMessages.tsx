import React, { useState } from 'react';
import { Search, Paperclip, Phone, Calendar, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import TelephoneInvitationModal from '@/components/doctor/TelephoneInvitationModal';

const DoctorMessages = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState({
    name: 'Karthika Vishwanath',
    age: 42,
    gender: 'Female',
    nhs: '990 915 3955',
    dob: '24 June, 1983'
  });
  
  const [isPhoneInvitationOpen, setIsPhoneInvitationOpen] = useState(false);
  
  const patients = Array(10).fill(null).map((_, i) => ({
    id: i + 1,
    name: 'Karthika Vishwanath',
    age: 42,
    gender: 'Female',
    nhs: '990 915 3955',
    dob: '24 June, 1983',
    avatar: 'https://via.placeholder.com/40'
  }));

  return (
    <>
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left sidebar - Patient list */}
        <div className="w-72 border-r bg-white dark:bg-gray-900 dark:border-gray-700">
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 dark:text-gray-100">Messages</h1>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search by Name/ NHS num" 
                className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              />
            </div>
            
            <div className="space-y-1">
              {patients.map((patient) => (
                <div 
                  key={patient.id}
                  className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={patient.avatar} alt={patient.name} />
                    <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">{patient.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate dark:text-gray-100">{patient.name}</p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">({patient.age}, {patient.gender})</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <p className="truncate">NHS: {patient.nhs}</p>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <p className="truncate">DOB: {patient.dob}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right side - Chat area */}
        <div className="flex-1 flex flex-col dark:bg-gray-900">
          {/* Chat header */}
          <div className="bg-gray-100 dark:bg-gray-800 p-4 flex items-center justify-between border-b dark:border-gray-700">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src="https://via.placeholder.com/40" alt={selectedPatient.name} />
                <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">{selectedPatient.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center">
                  <h2 className="font-medium dark:text-gray-100">{selectedPatient.name} ({selectedPatient.age}y, {selectedPatient.gender})</h2>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  NHS: {selectedPatient.nhs}, DOB: {selectedPatient.dob}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Select defaultValue="you">
                <SelectTrigger className="w-40 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
                  <SelectValue placeholder="Assign" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="you" className="dark:text-gray-100">Assign to me</SelectItem>
                  <SelectItem value="dr-smith" className="dark:text-gray-100">Dr. Smith</SelectItem>
                  <SelectItem value="dr-jones" className="dark:text-gray-100">Dr. Jones</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 dark:bg-gray-900">
            <div className="flex justify-end mb-4">
              <div className="text-right text-xs text-gray-500 dark:text-gray-400">25/04/2025</div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700 max-w-md">
              <div className="mb-2">
                <p className="font-medium dark:text-gray-100">Dear Karthika Vishwanath (42, Female)</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">NHS: 990 915 3955, DOB: 24 June, 1983</p>
              </div>
              <p className="text-gray-700 dark:text-gray-300">Type a message</p>
              
              <div className="mt-4 flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-2 rounded border border-blue-100 dark:border-blue-800/30">
                <div className="flex items-center">
                  <span className="text-blue-600 dark:text-blue-400 text-sm">http://invitation.telephoneinterview</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mt-3">
                <p className="font-medium dark:text-gray-100">Dr. Abhinand Choudry</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Endocrinologist</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center">
                  <span className="mr-1">🏥</span> City Hospital
                </p>
              </div>
            </div>
          </div>
          
          {/* Chat input */}
          <div className="border-t p-4 bg-white dark:bg-gray-800 dark:border-gray-700">
            <div className="flex space-x-2">
              <Button variant="outline" className="flex items-center dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-600">
                <Paperclip className="w-4 h-4 mr-2" />
                Attach
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
                onClick={() => setIsPhoneInvitationOpen(true)}
              >
                <Phone className="w-4 h-4 mr-2" />
                Invitation
              </Button>
              <Button variant="outline" className="flex items-center dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                Invitation
              </Button>
              <div className="flex-1"></div>
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
                Send as text message
              </Button>
              <Button className="bg-green-500 hover:bg-green-600 text-white flex items-center">
                Send
                <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.51 12.02c-.18.3-.33.61-.45.92C2.34 14.79 2 16.55 2 18.33v1c0 .56.45 1 1 1h5c.55 0 1-.45 1-1v-1c0-1.78-.34-3.54-1.06-5.39-.12-.31-.27-.62-.45-.92-.23-.4-.66-.67-1.14-.67-.48 0-.91.27-1.14.67zM12 16c-1.66 0-3-1.34-3-3 0-1.31.84-2.41 2-2.83V9.83c-2.79.5-5 2.94-5 5.92V17c0 .55.45 1 1 1h4v-2zm10.99-6.66c-.12-.31-.27-.62-.45-.92-.23-.4-.66-.67-1.14-.67-.48 0-.91.27-1.14.67-.18.3-.33.61-.45.92C19.34 10.79 19 12.55 19 14.33v1c0 .56.45 1 1 1h5c.55 0 1-.45 1-1v-1c0-1.78-.34-3.54-1.06-5.39-.12-.31-.27-.62-.45-.92z" fill="currentColor"/>
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Telephone Invitation Modal */}
      <TelephoneInvitationModal 
        isOpen={isPhoneInvitationOpen}
        onClose={() => setIsPhoneInvitationOpen(false)}
      />
    </>
  );
};

export default DoctorMessages;




