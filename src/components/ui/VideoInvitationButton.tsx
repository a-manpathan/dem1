import React from 'react';
import { Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoInvitationButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const VideoInvitationButton: React.FC<VideoInvitationButtonProps> = ({ 
  onClick, 
  disabled = false, 
  className = "" 
}) => {
  return (
    <Button 
      variant="outline" 
      className={`flex items-center bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 rounded-lg px-4 py-2 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-600 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <Video className="w-4 h-4 mr-2" />
      Invitation
    </Button>
  );
};

export default VideoInvitationButton;