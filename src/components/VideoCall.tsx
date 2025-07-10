// src/components/VideoCall.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  CallClient,
  CallAgent,
  DeviceManager,
  Call,
  VideoStreamRenderer,
  LocalVideoStream,
  Features,
  VideoDeviceInfo,
} from '@azure/communication-calling';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import io from 'socket.io-client';

const VideoCall: React.FC = () => {
  const [callAgent, setCallAgent] = useState<CallAgent | undefined>();
  const [call, setCall] = useState<Call | undefined>();
  const [localVideoStream, setLocalVideoStream] = useState<LocalVideoStream | null>(null);
  const [deviceManager, setDeviceManager] = useState<DeviceManager | undefined>();
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const localRendererRef = useRef<VideoStreamRenderer | null>(null);
  const socket = io('https://backendgen-hgewftfphagrcbg7.southindia-01.azurewebsites.net/'); // Replace with your backend URL

  useEffect(() => {
    const initializeCall = async () => {
      try {
        const token = await fetch('https://backendgen-hgewftfphagrcbg7.southindia-01.azurewebsites.net/get-token', {
          method: 'GET',
          credentials: 'include', // If using cookies or credentials
        }).then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        }).then((data) => data.token);
        
        const callClient = new CallClient();
        const tokenCredential = new AzureCommunicationTokenCredential(token);
        const agent = await callClient.createCallAgent(tokenCredential);
        setCallAgent(agent);

        // Initialize device manager for camera/microphone
        const deviceMgr = await callClient.getDeviceManager();
        setDeviceManager(deviceMgr);
        
        console.log('Requesting device permissions...');
        await deviceMgr.askDevicePermission({ video: true, audio: true });
        
        const cameras = await deviceMgr.getCameras();
        console.log('Available cameras:', cameras);
        
        if (cameras.length > 0) {
          const videoDevice = cameras[0];
          console.log('Selected camera:', videoDevice);
          
          // Create LocalVideoStream from the camera device
          const localStream = new LocalVideoStream(videoDevice);
          setLocalVideoStream(localStream);
          setIsVideoEnabled(true);
          console.log('Local video stream created');
        } else {
          console.warn('No cameras available');
          setError('No cameras available');
        }
      } catch (error) {
        console.error('Failed to initialize call:', error);
        setError(`Failed to initialize: ${error.message}`);
      }
    };
    initializeCall();
  }, []);

  useEffect(() => {
    const setupLocalVideo = async () => {
      if (localVideoRef.current && localVideoStream) {
        try {
          console.log('Setting up local video preview...');
          
          // Clean up previous renderer
          if (localRendererRef.current) {
            localRendererRef.current.dispose();
          }
          
          // Create renderer for the local video stream
          const renderer = new VideoStreamRenderer(localVideoStream);
          localRendererRef.current = renderer;
          
          const view = await renderer.createView();
          console.log('Local video view created');
          
          // Clear existing content and append the video element
          localVideoRef.current.innerHTML = '';
          localVideoRef.current.appendChild(view.target);
          
          // Ensure the video element is properly styled
          const videoElement = view.target as HTMLVideoElement;
          if (videoElement) {
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.style.objectFit = 'cover';
            videoElement.autoplay = true;
            videoElement.muted = true; // Mute local video to prevent echo
          }
          
          console.log('Local video setup complete');
        } catch (error) {
          console.error('Error setting up local video:', error);
          setError(`Local video error: ${error.message}`);
        }
      }
    };
    setupLocalVideo();
    
    // Cleanup function
    return () => {
      if (localRendererRef.current) {
        localRendererRef.current.dispose();
        localRendererRef.current = null;
      }
    };
  }, [localVideoStream]);

  const startCall = async () => {
    if (callAgent && !call) {
      try {
        console.log('Starting call...');
        
        // Replace with actual doctor's ACS user ID (e.g., from state or API)
        const doctorAcsUserId = await fetchDoctorAcsUserId(); // Implement this function
        const newCall = callAgent.startCall(
          [{ communicationUserId: doctorAcsUserId }],
          {
            videoOptions: { 
              localVideoStreams: localVideoStream ? [localVideoStream] : [] 
            },
          }
        );
        setCall(newCall);
        console.log('Call started');
  
        newCall.on('stateChanged', () => {
          console.log('Call state changed:', newCall.state);
          if (newCall.state === 'Connected') {
            console.log('Call connected');
            newCall.remoteParticipants.forEach(async (participant) => {
              participant.videoStreams.forEach(async (remoteVideoStream) => {
                const renderer = new VideoStreamRenderer(remoteVideoStream);
                const view = await renderer.createView();
                if (remoteVideoRef.current) {
                  remoteVideoRef.current.innerHTML = '';
                  remoteVideoRef.current.appendChild(view.target);
                  
                  // Style the remote video element
                  const videoElement = view.target as HTMLVideoElement;
                  if (videoElement) {
                    videoElement.style.width = '100%';
                    videoElement.style.height = '100%';
                    videoElement.style.objectFit = 'cover';
                  }
                }
              });
            });
          }
        });
  
        newCall.on('remoteParticipantsUpdated', (e) => {
          e.added.forEach(async (participant) => {
            participant.on('videoStreamsUpdated', (e) => {
              e.added.forEach(async (remoteVideoStream) => {
                const renderer = new VideoStreamRenderer(remoteVideoStream);
                const view = await renderer.createView();
                if (remoteVideoRef.current) {
                  remoteVideoRef.current.innerHTML = '';
                  remoteVideoRef.current.appendChild(view.target);
                  
                  // Style the remote video element
                  const videoElement = view.target as HTMLVideoElement;
                  if (videoElement) {
                    videoElement.style.width = '100%';
                    videoElement.style.height = '100%';
                    videoElement.style.objectFit = 'cover';
                  }
                }
              });
            });
          });
        });
  
        // Audio transcription setup (if needed)
        if (localVideoStream) {
          try {
            const mediaStream = await localVideoStream.getMediaStream();
            const audioTrack = mediaStream.getAudioTracks()[0];
            
            if (audioTrack) {
              const audioContext = new AudioContext();
              const source = audioContext.createMediaStreamSource(new MediaStream([audioTrack]));
              const processor = audioContext.createScriptProcessor(4096, 1, 1);
              source.connect(processor);
              processor.connect(audioContext.destination);
  
              processor.onaudioprocess = (e) => {
                const audioData = e.inputBuffer.getChannelData(0);
                const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioData.buffer)));
                fetch('https://backendgen-hgewftfphagrcbg7.southindia-01.azurewebsites.net/api/speech/transcribe', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ audioContent: base64Audio, languageCode: 'en-US' }),
                });
              };
            }
          } catch (error) {
            console.error('Error setting up audio transcription:', error);
          }
        }
      } catch (error) {
        console.error('Error starting call:', error);
        setError(`Call start error: ${error.message}`);
      }
    }
  };

  const fetchDoctorAcsUserId = async () => {
    try {
      const response = await fetch('https://backendgen-hgewftfphagrcbg7.southindia-01.azurewebsites.net/api/get-doctor-acs-id', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.acsUserId;
    } catch (error) {
      console.error('Error fetching doctor ACS ID:', error);
      throw error;
    }
  };

  const endCall = async () => {
    if (call) {
      try {
        await call.hangUp();
        setCall(undefined);
        console.log('Call ended');
      } catch (error) {
        console.error('Error ending call:', error);
      }
    }
  };

  const toggleVideo = async () => {
    if (localVideoStream && call) {
      try {
        if (isVideoEnabled) {
          await call.stopVideo(localVideoStream);
          setIsVideoEnabled(false);
        } else {
          await call.startVideo(localVideoStream);
          setIsVideoEnabled(true);
        }
      } catch (error) {
        console.error('Error toggling video:', error);
      }
    }
  };

  useEffect(() => {
    socket.on('transcript', (transcript) => {
      console.log('Received transcript:', transcript);
      // Update UI with transcript (e.g., display it)
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {/* Error Display */}
      {error && (
        <div className="bg-red-600 text-white p-2 text-center">
          Error: {error}
        </div>
      )}
      
      {/* Video Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        {/* Remote Video - Main view */}
        <div className="relative bg-gray-800 rounded-lg overflow-hidden">
          <div className="absolute top-4 left-4 z-10">
            <h3 className="text-sm font-medium text-white bg-black bg-opacity-50 px-2 py-1 rounded">
              Remote Participant
            </h3>
          </div>
          <div 
            ref={remoteVideoRef} 
            className="w-full h-full min-h-[300px] bg-gray-800 flex items-center justify-center"
          >
            {!call && (
              <div className="text-center text-gray-400">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">👤</span>
                </div>
                <p>Waiting for participant...</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Local Video - Picture in picture */}
        <div className="relative bg-gray-800 rounded-lg overflow-hidden">
          <div className="absolute top-4 left-4 z-10">
            <h3 className="text-sm font-medium text-white bg-black bg-opacity-50 px-2 py-1 rounded">
              You {isVideoEnabled ? '📹' : '📹❌'}
            </h3>
          </div>
          <div 
            ref={localVideoRef} 
            className="w-full h-full min-h-[300px] bg-gray-800 flex items-center justify-center"
          >
            {!localVideoStream && (
              <div className="text-center text-gray-400">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">📹</span>
                </div>
                <p>Camera not available</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Control Panel */}
      <div className="bg-gray-800 p-4 border-t border-gray-700">
        <div className="flex items-center justify-center space-x-4">
          <button 
            onClick={startCall} 
            disabled={!callAgent || !!call}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {call ? 'Call Active' : 'Start Call'}
          </button>
          
          <button 
            onClick={toggleVideo} 
            disabled={!call || !localVideoStream}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {isVideoEnabled ? 'Turn Off Video' : 'Turn On Video'}
          </button>
          
          <button 
            onClick={endCall} 
            disabled={!call}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-medium transition-colors"
          >
            End Call
          </button>
        </div>
        
        {/* Call Status */}
        <div className="text-center mt-3">
          <p className="text-sm text-gray-400">
            {call ? `Call Status: ${call.state}` : 'Ready to start call'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Video: {localVideoStream ? (isVideoEnabled ? 'Active' : 'Available') : 'Not Available'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;