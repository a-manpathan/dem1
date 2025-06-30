import axios from 'axios';
import { EventEmitter } from 'events';
import { transcriptAnalysisService } from './transcriptAnalysisService';

// Type definitions for Web Audio API
interface MediaRecorderOptions {
  mimeType?: string;
  audioBitsPerSecond?: number;
}

declare class MediaRecorder {
  constructor(stream: MediaStream, options?: MediaRecorderOptions);
  start(timeSlice?: number): void;
  stop(): void;
  ondataavailable: (event: { data: Blob }) => void;
  onstop: () => void;
  onError: (event: Event) => void;
  state: 'inactive' | 'recording' | 'paused';
  mimeType: string;
  static isTypeSupported(type: string): boolean;
}

interface SpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string) => void;
  onError?: (error: any) => void;
}

class SpeechService {
  private recognition: any = null;
  private isRecording: boolean = false;
  private audioChunks: Blob[] = [];
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;

  startRecording(options: SpeechRecognitionOptions = {}): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.isRecording) {
        resolve(true);
        return;
      }

      // Check if browser supports SpeechRecognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        // Configure recognition
        this.recognition.lang = options.language || 'en-US';
        this.recognition.continuous = options.continuous || true;
        this.recognition.interimResults = options.interimResults || true;
        
        this.recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join(' ');
          
          if (options.onResult) {
            options.onResult(transcript);
          }
        };
        
        this.recognition.onerror = (event: any) => {
          console.error('Web Speech API error:', event.error);
          this.isRecording = false;

          // If Web Speech API fails, try MediaRecorder fallback
          if (event.error === 'network' || event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            console.log('Web Speech API failed, switching to MediaRecorder...');
            this.recognition = null;

            // Try MediaRecorder fallback
            navigator.mediaDevices.getUserMedia({ audio: true })
              .then(stream => {
                this.stream = stream;
                this.audioChunks = [];
                this.mediaRecorder = new MediaRecorder(stream);

                this.mediaRecorder.ondataavailable = (event) => {
                  if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                  }
                };

                this.mediaRecorder.onstop = async () => {
                  const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                  try {
                    const transcriptResult = await this.transcribeAudio(audioBlob, options.language || 'en-US');
                    if (options.onResult) {
                      options.onResult(transcriptResult.transcript);
                    }
                  } catch (error) {
                    if (options.onError) {
                      options.onError(error);
                    }
                  }

                  // Stop all tracks in the stream
                  if (this.stream) {
                    this.stream.getTracks().forEach(track => track.stop());
                    this.stream = null;
                  }
                };

                this.mediaRecorder.start(1000);
                this.isRecording = true;
              })
              .catch(fallbackError => {
                console.error('MediaRecorder fallback also failed:', fallbackError);
                if (options.onError) {
                  options.onError('Speech recognition failed: ' + fallbackError.message);
                }
              });
          } else {
            if (options.onError) {
              options.onError('Speech recognition error: ' + event.error);
            }
          }
        };
        
        this.recognition.onend = () => {
          console.log('Web Speech API ended');
          this.isRecording = false;
        };

        this.recognition.onstart = () => {
          console.log('Web Speech API started');
          this.isRecording = true;
        };

        try {
          this.recognition.start();
          resolve(true);
        } catch (error) {
          console.error('Failed to start Web Speech API:', error);
          if (options.onError) {
            options.onError('Failed to start speech recognition: ' + error);
          }
          reject(error);
        }
      } else {
        // Fallback to MediaRecorder API for audio capture and Google API for transcription
        console.log('Using MediaRecorder API for speech recognition...');
        navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 48000
          }
        })
          .then(stream => {
            this.stream = stream;
            this.audioChunks = [];

            // Use default MIME type for MediaRecorder
            const mimeType = 'audio/webm';

            this.mediaRecorder = new MediaRecorder(stream, {
              mimeType: mimeType || undefined
            });

            console.log('MediaRecorder using MIME type:', this.mediaRecorder.mimeType);

            this.mediaRecorder.ondataavailable = (event) => {
              if (event.data.size > 0) {
                this.audioChunks.push(event.data);
              }
            };

            this.mediaRecorder.onstop = async () => {
              const audioBlob = new Blob(this.audioChunks, {
                type: this.mediaRecorder?.mimeType || 'audio/webm'
              });
              console.log('Audio recorded:', audioBlob.size, 'bytes, type:', audioBlob.type);

              try {
                const transcriptResult = await this.transcribeAudio(audioBlob, options.language || 'en-US');
                if (options.onResult) {
                  options.onResult(transcriptResult.transcript);
                }
              } catch (error) {
                console.error('Error transcribing audio:', error);
                if (options.onError) {
                  options.onError(error);
                }
              }

              // Stop all tracks in the stream
              if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
                this.stream = null;
              }
            };

            this.mediaRecorder.onError = (event) => {
              console.error('MediaRecorder error:', event);
              if (options.onError) {
                options.onError('Recording error: ' + event);
              }
            };

            this.mediaRecorder.start(1000); // Collect data every second
            this.isRecording = true;
            resolve(true);
          })
          .catch(error => {
            console.error('Failed to access microphone:', error);
            if (options.onError) {
              options.onError('Microphone access denied: ' + error.message);
            }
            reject(error);
          });
      }
    });
  }

  stopRecording(): void {
    console.log('Stopping speech recognition...');

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping Web Speech API:', error);
      }
      this.recognition = null;
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (error) {
        console.error('Error stopping MediaRecorder:', error);
      }
    }

    // Stop all tracks in the stream
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    this.isRecording = false;
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  private async transcribeAudio(audioBlob: Blob, language: string): Promise<{ transcript: string; analysis?: { symptoms: string[]; diagnosis: string; notes: string } }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = async () => {
        try {
          const base64Audio = reader.result?.toString().split(',')[1];
          if (!base64Audio) {
            throw new Error('Failed to convert audio to base64');
          }

          console.log('Sending audio to server:', {
            size: audioBlob.size,
            type: audioBlob.type,
            language: language
          });

          const response = await axios.post('https://backendgen-hgewftfphagrcbg7.southindia-01.azurewebsites.net/api/speech/transcribe', {
            audioContent: base64Audio,
            languageCode: language
          }, {
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json'
            }
          });

          const transcript = response.data.transcript;
          console.log('Transcription result:', transcript);
          
          // Only return the transcript, analysis will be handled separately in DoctorAppointments
          resolve({ transcript });
        } catch (error) {
          console.error('Error sending audio to server:', error);
          reject(error);
          if (axios.isAxiosError(error)) {
            if (error.response) {
              reject(new Error(`Server error: ${error.response.status} - ${error.response.data?.error || error.message}`));
            } else if (error.request) {
              reject(new Error('Network error: Unable to reach the server'));
            } else {
              reject(new Error(`Request error: ${error.message}`));
            }
          } else {
            reject(error);
          }
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read audio file'));
      };

      reader.readAsDataURL(audioBlob);
    });
  }

  async detectLanguageFromAudio(audioBlob: Blob): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Audio = reader.result?.toString().split(',')[1];
          if (!base64Audio) {
            throw new Error('Failed to convert audio to base64');
          }

          console.log('Sending audio for language detection:', {
            size: audioBlob.size,
            type: audioBlob.type
          });

          const response = await axios.post('http://localhost:8000/api/speech/detect-language', {
            audioContent: base64Audio
          }, {
            timeout: 30000,
            headers: { 'Content-Type': 'application/json' }
          });

          console.log('Language detection response:', response.data);

          if (response.data && response.data.language) {
            // Normalize language code to match UI expectations
            let detectedLanguage = response.data.language;

            // Map common language codes to our expected format
            const languageMapping: { [key: string]: string } = {
              'en': 'en-US',
              'hi': 'hi-IN',
              'bn': 'bn-IN',
              'te': 'te-IN',
              'ta': 'ta-IN',
              'mr': 'mr-IN',
              'gu': 'gu-IN',
              'kn': 'kn-IN',
              'ml': 'ml-IN',
              'pa': 'pa-IN',
              'or': 'or-IN',
              'as': 'as-IN',
              'ur': 'ur-IN',
              'fr': 'fr-FR',
              'de': 'de-DE',
              'es': 'es-ES',
              'it': 'it-IT',
              'zh': 'zh-CN',
              'ja': 'ja-JP',
              'ko': 'ko-KR'
            };

            // If the detected language is in our mapping, use the mapped value
            if (languageMapping[detectedLanguage]) {
              detectedLanguage = languageMapping[detectedLanguage];
            }

            resolve(detectedLanguage);
          } else {
            resolve(null);
          }
        } catch (error) {
          console.error('Language detection API error:', error);
          reject(error);
        }
      };
      reader.onerror = () => {
        reject(new Error('Failed to read audio file'));
      };
      reader.readAsDataURL(audioBlob);
    });
  }
}

export default new SpeechService();
