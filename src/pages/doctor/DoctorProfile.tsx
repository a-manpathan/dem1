import React from 'react';
import { Building, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

const DoctorProfile = () => {
  // Doctor data - in a real app, this would come from an API or context
  const doctor = {
    name: 'Dr. Abhinand Choudry',
    specialty: 'Endocrinologist',
    hospital: 'City Hospital',
    location: 'Bandra, Mumbai, Maharashtra, India',
    avatar: '/avatar.png',
    mobile: '91 7208 1254 4025',
    email: 'dr.abhinand@gmail.com',
    gender: 'Male',
    birthDate: '01/01/1972',
    bloodGroup: 'O +ve',
    languages: ['English', 'Spanish'],
    maritalStatus: 'Unmarried'
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Personal Details</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column - Profile card */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardContent className="p-6 flex flex-col items-center">
            <Avatar className="h-32 w-32 mb-4">
              <AvatarImage src={doctor.avatar} alt={doctor.name} />
              <AvatarFallback className="text-2xl">{doctor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <h2 className="text-xl font-semibold text-center">{doctor.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-2">{doctor.specialty}</p>
            
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-1">
              <Building className="h-4 w-4 mr-1" />
              <span>{doctor.hospital}</span>
            </div>
            
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-4 text-center">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{doctor.location}</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Right column - Personal details */}
        <div className="md:col-span-2">
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8">
                {/* Name */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">NAME</p>
                  <p className="font-medium">{doctor.name.replace('Dr. ', '')}</p>
                </div>
                
                {/* Mobile */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">MOBILE</p>
                  <p className="font-medium">{doctor.mobile}</p>
                </div>
                
                {/* Email */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">EMAIL</p>
                  <p className="font-medium">{doctor.email}</p>
                </div>
                
                {/* Gender */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">GENDER</p>
                  <p className="font-medium">{doctor.gender}</p>
                </div>
                
                {/* Birth Date */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">BIRTH DATE</p>
                  <p className="font-medium">{doctor.birthDate}</p>
                </div>
                
                {/* Blood Group */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">BLOOD GROUP</p>
                  <p className="font-medium">{doctor.bloodGroup}</p>
                </div>
                
                {/* Language */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">LANGUAGE</p>
                  <div>
                    {doctor.languages.map((language, index) => (
                      <p key={index} className="font-medium">{language}</p>
                    ))}
                  </div>
                </div>
                
                {/* Marital Status */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">MARITAL STATUS</p>
                  <p className="font-medium">{doctor.maritalStatus}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;