import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';

interface TelephoneInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TelephoneInvitationModal: React.FC<TelephoneInvitationModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-gray-100">Create Telephone Invitation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="dark:text-gray-100">Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                id="date" 
                type="date" 
                className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" 
                defaultValue={new Date().toISOString().split('T')[0]} 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="time" className="dark:text-gray-100">Time</Label>
            <Input 
              id="time" 
              type="time" 
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" 
              defaultValue="09:00" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration" className="dark:text-gray-100">Duration</Label>
            <select 
              id="duration" 
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm dark:text-gray-100"
            >
              <option value="15">15 minutes</option>
              <option value="30" selected>30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes" className="dark:text-gray-100">Notes (optional)</Label>
            <textarea 
              id="notes" 
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm dark:text-gray-100"
              rows={3}
              placeholder="Add any additional information here"
            ></textarea>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-600">
            Cancel
          </Button>
          <Button className="bg-green-500 hover:bg-green-600 text-white">
            Create Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TelephoneInvitationModal;

