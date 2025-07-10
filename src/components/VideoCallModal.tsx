import React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import VideoCall from '@/components/VideoCall';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
}

const VideoCallModal: React.FC<VideoCallModalProps> = ({ 
  isOpen, 
  onClose, 
  patientName = "Patient" 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold dark:text-gray-100">
              Video Call with {patientName}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 overflow-auto">
          <VideoCall />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCallModal;