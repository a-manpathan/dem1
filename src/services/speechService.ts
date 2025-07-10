// services/speechService.ts
import axios from 'axios';

interface SpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string) => void;
  onError?: (error: any) => void;
  onEnd?: () => void; // Add onEnd callback
}

class SpeechService {
  private recognition: any = null;
  private isRecording: boolean = false;
  private audioChunks: Blob[] = [];
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private finalTranscript: string = ''; // Store final transcript

  // Method to get the final transcript
  getFinalTranscript(): string {
    return this.finalTranscript;
  }

  startRecording(options: SpeechRecognitionOptions = {}): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.isRecording) {
        resolve(true);
        return;
      }

      this.finalTranscript = ''; // Clear previous transcript

      // Check if browser supports SpeechRecognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();

        // Configure recognition
        this.recognition.lang = options.language || 'en-US';
        this.recognition.continuous = options.continuous || true;
        this.recognition.interimResults = options.interimResults || true;

        this.recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let final = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              final += transcript + ' ';
            } else {
              interimTranscript += transcript + ' ';
            }
          }
          this.finalTranscript = final.trim(); // Store final transcript
          const currentTranscript = (final || interimTranscript).trim();
          if (options.onResult && currentTranscript) {
            options.onResult(currentTranscript);
          }
        };

        this.recognition.onerror = (event: any) => {
          console.error('Web Speech API error:', event.error);
          this.isRecording = false;

          // Fallback to MediaRecorder if Web Speech API fails
          if (event.error === 'network' || event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            console.log('Web Speech API failed, switching to MediaRecorder...');
            this.recognition = null;

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
                this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

                this.mediaRecorder.ondataavailable = (event) => {
                  if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                  }
                };

                this.mediaRecorder.onstop = async () => {
                  const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                  try {
                    const transcriptResult = await this.transcribeAudio(audioBlob, options.language || 'en-US');
                    this.finalTranscript = transcriptResult.transcript.trim(); // Store final transcript
                    if (options.onResult) {
                      options.onResult(this.finalTranscript);
                    }
                  } catch (error) {
                    if (options.onError) {
                      options.onError(error);
                    }
                  } finally {
                    if (options.onEnd) {
                      options.onEnd(); // Call onEnd callback
                    }
                    if (this.stream) {
                      this.stream.getTracks().forEach(track => track.stop());
                      this.stream = null;
                    }
                  }
                };

                this.mediaRecorder.onerror = (event) => {
                  console.error('MediaRecorder error:', event);
                  if (options.onError) {
                    options.onError('Recording error: ' + event);
                  }
                };

                this.mediaRecorder.start(1000);
                this.isRecording = true;
                resolve(true);
              })
              .catch(fallbackError => {
                console.error('MediaRecorder fallback also failed:', fallbackError);
                if (options.onError) {
                  options.onError('Speech recognition failed: ' + fallbackError.message);
                }
                reject(fallbackError);
              });
          } else {
            if (options.onError) {
              options.onError('Speech recognition error: ' + event.error);
            }
            reject(new Error('Speech recognition error: ' + event.error));
          }
        };

        this.recognition.onend = () => {
          console.log('Web Speech API ended');
          this.isRecording = false;
          if (options.onEnd) {
            options.onEnd(); // Call onEnd callback
          }
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
        // Fallback to MediaRecorder API
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
            this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

            this.mediaRecorder.ondataavailable = (event) => {
              if (event.data.size > 0) {
                this.audioChunks.push(event.data);
              }
            };

            this.mediaRecorder.onstop = async () => {
              const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
              try {
                const transcriptResult = await this.transcribeAudio(audioBlob, options.language || 'en-US');
                this.finalTranscript = transcriptResult.transcript.trim(); // Store final transcript
                if (options.onResult) {
                  options.onResult(this.finalTranscript);
                }
              } catch (error) {
                if (options.onError) {
                  options.onError(error);
                }
              } finally {
                if (options.onEnd) {
                  options.onEnd(); // Call onEnd callback
                }
                if (this.stream) {
                  this.stream.getTracks().forEach(track => track.stop());
                  this.stream = null;
                }
              }
            };

            this.mediaRecorder.onerror = (event) => {
              console.error('MediaRecorder error:', event);
              if (options.onError) {
                options.onError('Recording error: ' + event);
              }
            };

            this.mediaRecorder.start(1000);
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

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    this.isRecording = false;
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  private async transcribeAudio(audioBlob: Blob, language: string): Promise<{ transcript: string }> {
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
            headers: { 'Content-Type': 'application/json' }
          });

          const transcript = response.data.transcript;
          console.log('Transcription result:', transcript);
          resolve({ transcript });
        } catch (error) {
          console.error('Error sending audio to server:', error);
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
            let detectedLanguage = response.data.language;
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