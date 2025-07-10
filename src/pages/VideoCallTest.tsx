import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  CallClient,
  CallAgent,
  DeviceManager,
  Call,
  VideoStreamRenderer,
  LocalVideoStream,
} from '@azure/communication-calling';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import io from 'socket.io-client';

interface TranscriptEntry {
  id: string;
  text: string;
  timestamp: Date;
  confidence?: number;
}

const VideoCallTest: React.FC = () => {
  const [callAgent, setCallAgent] = useState<CallAgent | undefined>();
  const [call, setCall] = useState<Call | undefined>();
  const [localVideoStream, setLocalVideoStream] = useState<LocalVideoStream | null>(null);
  const [deviceManager, setDeviceManager] = useState<DeviceManager | undefined>();
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [error, setError] = useState<string | null>(null);
  
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:8000');
    
    socketRef.current.on('connect', () => {
      console.log('Socket connected');
      setConnectionStatus('connected');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnectionStatus('disconnected');
    });

    socketRef.current.on('transcript', (transcript: string) => {
      console.log('Received transcript:', transcript);
      const newTranscript: TranscriptEntry = {
        id: Date.now().toString(),
        text: transcript,
        timestamp: new Date(),
      };
      setTranscripts(prev => [...prev, newTranscript]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const initializeCall = async () => {
      try {
        setConnectionStatus('connecting');
        const response = await fetch('http://localhost:8000/get-token');
        const data = await response.json();
        
        const callClient = new CallClient();
        const tokenCredential = new AzureCommunicationTokenCredential(data.token);
        const agent = await callClient.createCallAgent(tokenCredential);
        setCallAgent(agent);

        const deviceMgr = await callClient.getDeviceManager();
        setDeviceManager(deviceMgr);
        
        await deviceMgr.askDevicePermission({ video: true, audio: true });
        const cameras = await deviceMgr.getCameras();
        const videoDevice = cameras[0];
        
        if (videoDevice) {
          const localStream = new LocalVideoStream(videoDevice);
          setLocalVideoStream(localStream);
        }
        
        setConnectionStatus('connected');
        setError(null);
      } catch (error) {
        console.error('Failed to initialize call:', error);
        setError('Failed to initialize video call. Please check your backend connection.');
        setConnectionStatus('disconnected');
      }
    };

    initializeCall();
  }, []);

  useEffect(() => {
    const setupLocalVideo = async () => {
      if (localVideoRef.current && localVideoStream) {
        try {
          const renderer = new VideoStreamRenderer(localVideoStream);
          const view = await renderer.createView();
          
          localVideoRef.current.innerHTML = '';
          localVideoRef.current.appendChild(view.target);
        } catch (error) {
          console.error('Error setting up local video:', error);
        }
      }
    };
    setupLocalVideo();
  }, [localVideoStream]);

  const startRecording = async () => {
    if (!localVideoStream) {
      setError('No video stream available');
      return;
    }

    try {
      const mediaStream = await localVideoStream.getMediaStream();
      const audioTrack = mediaStream.getAudioTracks()[0];
      
      if (!audioTrack) {
        setError('No audio track available');
        return;
      }

      // Create a new MediaStream with only audio for transcription
      const audioStream = new MediaStream([audioTrack]);
      const mediaRecorder = new MediaRecorder(audioStream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
        
        // Convert blob to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          
          try {
            const response = await fetch('http://localhost:8000/api/speech/transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                audioContent: base64Audio, 
                languageCode: 'en-US' 
              }),
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Transcription result:', result);
          } catch (error) {
            console.error('Error sending audio for transcription:', error);
            setError('Failed to transcribe audio');
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);

      // Stop recording after 5 seconds for testing
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      }, 5000);

    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const clearTranscripts = () => {
    setTranscripts([]);
  };

  const testTranscription = async () => {
    // Send a test audio sample to verify the transcription pipeline
    try {
      const response = await fetch('http://localhost:8000/api/speech/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          audioContent: '', // Empty for test
          languageCode: 'en-US' 
        }),
      });

      if (response.ok) {
        console.log('Transcription API is working');
      } else {
        console.error('Transcription API error:', response.status);
      }
    } catch (error) {
      console.error('Error testing transcription:', error);
      setError('Failed to connect to transcription service');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Video Call Transcription Test</h1>
        <div className="flex items-center gap-2">
          <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'}>
            {connectionStatus}
          </Badge>
          {isRecording && <Badge variant="secondary">Recording</Badge>}
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Section */}
        <Card>
          <CardHeader>
            <CardTitle>Video Stream</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Local Video</h3>
              <div 
                ref={localVideoRef} 
                className="w-full h-48 bg-gray-100 border rounded-lg flex items-center justify-center"
              >
                {!localVideoStream && (
                  <p className="text-gray-500">No video stream</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Remote Video</h3>
              <div 
                ref={remoteVideoRef} 
                className="w-full h-48 bg-gray-100 border rounded-lg flex items-center justify-center"
              >
                <p className="text-gray-500">No remote participant</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={startRecording} 
                disabled={!callAgent || isRecording}
                variant={isRecording ? "destructive" : "default"}
              >
                {isRecording ? 'Recording...' : 'Start Recording'}
              </Button>
              <Button 
                onClick={stopRecording} 
                disabled={!isRecording}
                variant="outline"
              >
                Stop Recording
              </Button>
              <Button 
                onClick={testTranscription} 
                variant="secondary"
              >
                Test API
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transcript Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Live Transcripts</CardTitle>
            <Button onClick={clearTranscripts} variant="outline" size="sm">
              Clear
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 w-full">
              {transcripts.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  No transcripts yet. Start recording to see transcriptions.
                </div>
              ) : (
                <div className="space-y-3">
                  {transcripts.map((transcript, index) => (
                    <div key={transcript.id}>
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="text-xs">
                          {transcript.timestamp.toLocaleTimeString()}
                        </Badge>
                        <p className="text-sm flex-1">{transcript.text}</p>
                      </div>
                      {index < transcripts.length - 1 && <Separator className="mt-3" />}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Test</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Ensure your backend server is running on localhost:8000</li>
            <li>Allow camera and microphone permissions when prompted</li>
            <li>Click "Start Recording" to begin capturing audio</li>
            <li>Speak clearly into your microphone</li>
            <li>Recording will automatically stop after 5 seconds</li>
            <li>Check the "Live Transcripts" section for generated text</li>
            <li>Use "Test API" to verify backend connectivity</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoCallTest;