import React, { useState } from 'react';
import VideoInvitationButton from '@/components/ui/VideoInvitationButton';
import VideoCallModal from '@/components/VideoCallModal';

const VideoInvitationDemo: React.FC = () => {
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Video Invitation Button Demo</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Button Features:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
            <li>Label: "Invitation"</li>
            <li>Icon: Video camera symbol positioned to the left</li>
            <li>Style: Rectangular with rounded corners and light gray background</li>
            <li>Purpose: Triggers video call functionality when clicked</li>
            <li>Responsive design with dark mode support</li>
          </ul>
          
          <div className="flex items-center space-x-4">
            <VideoInvitationButton 
              onClick={() => setIsVideoCallOpen(true)}
            />
            <span className="text-gray-500">← Click to open video call</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Integration Example:</h2>
          <p className="text-gray-600 mb-4">
            This button has been integrated into the DoctorMessages.tsx component, replacing the Calendar button. 
            When clicked, it opens a full-screen video call modal with the VideoCall component.
          </p>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Usage in DoctorMessages.tsx:</h3>
            <pre className="text-sm text-gray-700 overflow-x-auto">
{`<VideoInvitationButton 
  onClick={() => setIsVideoCallOpen(true)}
/>

<VideoCallModal 
  isOpen={isVideoCallOpen}
  onClose={() => setIsVideoCallOpen(false)}
  patientName={selectedPatient.name}
/>`}
            </pre>
          </div>
        </div>
      </div>

      <VideoCallModal 
        isOpen={isVideoCallOpen}
        onClose={() => setIsVideoCallOpen(false)}
        patientName="Demo Patient"
      />
    </div>
  );
};

export default VideoInvitationDemo;