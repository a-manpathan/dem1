import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DoctorAvailability = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [availability, setAvailability] = useState({
    morningSession: {
      startTime: '09:00 AM',
      endTime: '01:00 PM'
    },
    afternoonSession: {
      startTime: '02:00 PM',
      endTime: '08:00 PM'
    },
    availableDays: ['Monday', 'Friday', 'Saturday']
  });

  const handleSaveAvailability = (newAvailability) => {
    setAvailability(newAvailability);
    setIsEditModalOpen(false);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Availability</h1>
      
      <Card className="bg-white dark:bg-gray-800 shadow-sm mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6">Schedule</h2>
          
          {/* Morning Session */}
          <div className="border-b pb-6 mb-6">
            <h3 className="font-medium mb-4">Morning Session</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">START TIME</p>
                <p className="font-medium">{availability.morningSession.startTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">END TIME</p>
                <p className="font-medium">{availability.morningSession.endTime}</p>
              </div>
            </div>
          </div>
          
          {/* Afternoon Session */}
          <div className="border-b pb-6 mb-6">
            <h3 className="font-medium mb-4">Afternoon Session</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">START TIME</p>
                <p className="font-medium">{availability.afternoonSession.startTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">END TIME</p>
                <p className="font-medium">{availability.afternoonSession.endTime}</p>
              </div>
            </div>
          </div>
          
          {/* Available Days */}
          <div className="mb-6">
            <h3 className="font-medium mb-4">Available days</h3>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {availability.availableDays.length} DAYS A WEEK
              </p>
              <p className="font-medium">{availability.availableDays.join(', ')}</p>
            </div>
          </div>
          
          {/* Edit Button */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">Edit Details</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Availability</DialogTitle>
              </DialogHeader>
              <EditAvailabilityForm 
                availability={availability} 
                onSave={handleSaveAvailability} 
                onCancel={() => setIsEditModalOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

const EditAvailabilityForm = ({ availability, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    morningSession: {
      startHour: availability.morningSession.startTime.split(':')[0],
      startMinute: availability.morningSession.startTime.split(':')[1].split(' ')[0],
      startPeriod: availability.morningSession.startTime.includes('AM') ? 'AM' : 'PM',
      endHour: availability.morningSession.endTime.split(':')[0],
      endMinute: availability.morningSession.endTime.split(':')[1].split(' ')[0],
      endPeriod: availability.morningSession.endTime.includes('AM') ? 'AM' : 'PM'
    },
    afternoonSession: {
      startHour: availability.afternoonSession.startTime.split(':')[0],
      startMinute: availability.afternoonSession.startTime.split(':')[1].split(' ')[0],
      startPeriod: availability.afternoonSession.startTime.includes('AM') ? 'AM' : 'PM',
      endHour: availability.afternoonSession.endTime.split(':')[0],
      endMinute: availability.afternoonSession.endTime.split(':')[1].split(' ')[0],
      endPeriod: availability.afternoonSession.endTime.includes('AM') ? 'AM' : 'PM'
    },
    availableDays: availability.availableDays
  });
  
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const periods = ['AM', 'PM'];
  
  const handleDayToggle = (day) => {
    const fullDay = {
      'SUN': 'Sunday',
      'MON': 'Monday',
      'TUE': 'Tuesday',
      'WED': 'Wednesday',
      'THU': 'Thursday',
      'FRI': 'Friday',
      'SAT': 'Saturday'
    }[day];
    
    const currentDays = [...formData.availableDays];
    if (currentDays.includes(fullDay)) {
      setFormData({
        ...formData,
        availableDays: currentDays.filter(d => d !== fullDay)
      });
    } else {
      setFormData({
        ...formData,
        availableDays: [...currentDays, fullDay]
      });
    }
  };
  
  const handleSave = () => {
    // Convert form data back to the format expected by the parent component
    const newAvailability = {
      morningSession: {
        startTime: `${formData.morningSession.startHour}:${formData.morningSession.startMinute} ${formData.morningSession.startPeriod}`,
        endTime: `${formData.morningSession.endHour}:${formData.morningSession.endMinute} ${formData.morningSession.endPeriod}`
      },
      afternoonSession: {
        startTime: `${formData.afternoonSession.startHour}:${formData.afternoonSession.startMinute} ${formData.afternoonSession.startPeriod}`,
        endTime: `${formData.afternoonSession.endHour}:${formData.afternoonSession.endMinute} ${formData.afternoonSession.endPeriod}`
      },
      availableDays: formData.availableDays
    };
    
    onSave(newAvailability);
  };
  
  return (
    <div className="space-y-8 py-4">
      <h2 className="text-2xl font-bold mb-6">Set Schedule</h2>
      
      {/* Morning Session */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Morning Session</h3>
        
        {/* Start Time */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="morningStartHour">Start Time (Hour)</Label>
            <Select 
              value={formData.morningSession.startHour}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  morningSession: {
                    ...formData.morningSession,
                    startHour: value
                  }
                });
              }}
            >
              <SelectTrigger id="morningStartHour">
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent>
                {hours.map(hour => (
                  <SelectItem key={`morning-start-hour-${hour}`} value={hour}>{hour}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="morningStartMinute">Start Time (min)</Label>
            <Select 
              value={formData.morningSession.startMinute}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  morningSession: {
                    ...formData.morningSession,
                    startMinute: value
                  }
                });
              }}
            >
              <SelectTrigger id="morningStartMinute">
                <SelectValue placeholder="Minute" />
              </SelectTrigger>
              <SelectContent>
                {minutes.map(minute => (
                  <SelectItem key={`morning-start-minute-${minute}`} value={minute}>{minute}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="morningStartPeriod">AM/PM</Label>
            <Select 
              value={formData.morningSession.startPeriod}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  morningSession: {
                    ...formData.morningSession,
                    startPeriod: value
                  }
                });
              }}
            >
              <SelectTrigger id="morningStartPeriod">
                <SelectValue placeholder="AM/PM" />
              </SelectTrigger>
              <SelectContent>
                {periods.map(period => (
                  <SelectItem key={`morning-start-period-${period}`} value={period}>{period}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* End Time */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="morningEndHour">End Time (Hour)</Label>
            <Select 
              value={formData.morningSession.endHour}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  morningSession: {
                    ...formData.morningSession,
                    endHour: value
                  }
                });
              }}
            >
              <SelectTrigger id="morningEndHour">
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent>
                {hours.map(hour => (
                  <SelectItem key={`morning-end-hour-${hour}`} value={hour}>{hour}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="morningEndMinute">End Time (min)</Label>
            <Select 
              value={formData.morningSession.endMinute}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  morningSession: {
                    ...formData.morningSession,
                    endMinute: value
                  }
                });
              }}
            >
              <SelectTrigger id="morningEndMinute">
                <SelectValue placeholder="Minute" />
              </SelectTrigger>
              <SelectContent>
                {minutes.map(minute => (
                  <SelectItem key={`morning-end-minute-${minute}`} value={minute}>{minute}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="morningEndPeriod">AM/PM</Label>
            <Select 
              value={formData.morningSession.endPeriod}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  morningSession: {
                    ...formData.morningSession,
                    endPeriod: value
                  }
                });
              }}
            >
              <SelectTrigger id="morningEndPeriod">
                <SelectValue placeholder="AM/PM" />
              </SelectTrigger>
              <SelectContent>
                {periods.map(period => (
                  <SelectItem key={`morning-end-period-${period}`} value={period}>{period}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Evening Session */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Evening Session</h3>
        
        {/* Start Time */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="afternoonStartHour">Start Time (Hour)</Label>
            <Select 
              value={formData.afternoonSession.startHour}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  afternoonSession: {
                    ...formData.afternoonSession,
                    startHour: value
                  }
                });
              }}
            >
              <SelectTrigger id="afternoonStartHour">
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent>
                {hours.map(hour => (
                  <SelectItem key={`afternoon-start-hour-${hour}`} value={hour}>{hour}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="afternoonStartMinute">Start Time (min)</Label>
            <Select 
              value={formData.afternoonSession.startMinute}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  afternoonSession: {
                    ...formData.afternoonSession,
                    startMinute: value
                  }
                });
              }}
            >
              <SelectTrigger id="afternoonStartMinute">
                <SelectValue placeholder="Minute" />
              </SelectTrigger>
              <SelectContent>
                {minutes.map(minute => (
                  <SelectItem key={`afternoon-start-minute-${minute}`} value={minute}>{minute}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="afternoonStartPeriod">AM/PM</Label>
            <Select 
              value={formData.afternoonSession.startPeriod}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  afternoonSession: {
                    ...formData.afternoonSession,
                    startPeriod: value
                  }
                });
              }}
            >
              <SelectTrigger id="afternoonStartPeriod">
                <SelectValue placeholder="AM/PM" />
              </SelectTrigger>
              <SelectContent>
                {periods.map(period => (
                  <SelectItem key={`afternoon-start-period-${period}`} value={period}>{period}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* End Time */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="afternoonEndHour">End Time (Hour)</Label>
            <Select 
              value={formData.afternoonSession.endHour}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  afternoonSession: {
                    ...formData.afternoonSession,
                    endHour: value
                  }
                });
              }}
            >
              <SelectTrigger id="afternoonEndHour">
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent>
                {hours.map(hour => (
                  <SelectItem key={`afternoon-end-hour-${hour}`} value={hour}>{hour}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="afternoonEndMinute">End Time (min)</Label>
            <Select 
              value={formData.afternoonSession.endMinute}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  afternoonSession: {
                    ...formData.afternoonSession,
                    endMinute: value
                  }
                });
              }}
            >
              <SelectTrigger id="afternoonEndMinute">
                <SelectValue placeholder="Minute" />
              </SelectTrigger>
              <SelectContent>
                {minutes.map(minute => (
                  <SelectItem key={`afternoon-end-minute-${minute}`} value={minute}>{minute}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="afternoonEndPeriod">AM/PM</Label>
            <Select 
              value={formData.afternoonSession.endPeriod}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  afternoonSession: {
                    ...formData.afternoonSession,
                    endPeriod: value
                  }
                });
              }}
            >
              <SelectTrigger id="afternoonEndPeriod">
                <SelectValue placeholder="AM/PM" />
              </SelectTrigger>
              <SelectContent>
                {periods.map(period => (
                  <SelectItem key={`afternoon-end-period-${period}`} value={period}>{period}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Availability Days */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Availability</h3>
        <div className="flex flex-wrap gap-2">
          {daysOfWeek.map((day) => {
            const fullDay = {
              'SUN': 'Sunday',
              'MON': 'Monday',
              'TUE': 'Tuesday',
              'WED': 'Wednesday',
              'THU': 'Thursday',
              'FRI': 'Friday',
              'SAT': 'Saturday'
            }[day];
            
            const isSelected = formData.availableDays.includes(fullDay);
            
            return (
              <Button
                key={day}
                type="button"
                variant={isSelected ? "default" : "outline"}
                className={`w-16 ${isSelected ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => handleDayToggle(day)}
              >
                {day}
              </Button>
            );
          })}
        </div>
      </div>
      
      {/* Save Button */}
      <div className="pt-4">
        <Button 
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default DoctorAvailability;


