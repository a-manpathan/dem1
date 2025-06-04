import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface VitalsData {
  temp: string;
  bp: string;
  pulse: string;
  spo2: string;
  weight: string;
}

interface AddVitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vitals: VitalsData) => void;
  initialVitals?: VitalsData;
}

const AddVitalsModal: React.FC<AddVitalsModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  initialVitals = { temp: '', bp: '', pulse: '', spo2: '', weight: '' }
}) => {
  const [vitals, setVitals] = useState<VitalsData>(initialVitals);

  const handleChange = (field: keyof VitalsData, value: string) => {
    setVitals(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(vitals);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="relative">
          <DialogTitle className="text-xl font-semibold">Vital Signs</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="h-8 w-8 rounded-full absolute right-0 top-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Temp</label>
            <div className="flex">
              <Input 
                placeholder="Eg: 98" 
                value={vitals.temp}
                onChange={(e) => handleChange('temp', e.target.value)}
                className="rounded-r-none"
              />
              <div className="bg-gray-100 dark:bg-gray-800 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md px-3 flex items-center text-gray-500 dark:text-gray-400">
                F
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">BP</label>
            <Input 
              placeholder="125/75" 
              value={vitals.bp}
              onChange={(e) => handleChange('bp', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Pulse Rate</label>
            <div className="flex">
              <Input 
                placeholder="Eg: 52" 
                value={vitals.pulse}
                onChange={(e) => handleChange('pulse', e.target.value)}
                className="rounded-r-none"
              />
              <div className="bg-gray-100 dark:bg-gray-800 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md px-3 flex items-center text-gray-500 dark:text-gray-400">
                BPM
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">SPO2</label>
            <div className="flex">
              <Input 
                placeholder="Eg: 95" 
                value={vitals.spo2}
                onChange={(e) => handleChange('spo2', e.target.value)}
                className="rounded-r-none"
              />
              <div className="bg-gray-100 dark:bg-gray-800 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md px-3 flex items-center text-gray-500 dark:text-gray-400">
                %
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Weight</label>
            <div className="flex">
              <Input 
                placeholder="Eg: 95" 
                value={vitals.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
                className="rounded-r-none"
              />
              <div className="bg-gray-100 dark:bg-gray-800 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md px-3 flex items-center text-gray-500 dark:text-gray-400">
                Kg
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <Button 
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Save Vitals
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddVitalsModal;
