import axios from 'axios';

interface TranslationOptions {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

interface TranslationResponse {
  translatedText: string;
  detectedSourceLanguage: string;
  targetLanguage: string;
}

class TranslationService {
  private readonly apiUrl = 'https://backendgen-hgewftfphagrcbg7.southindia-01.azurewebsites.net/api/translate';

  async translateText(options: TranslationOptions): Promise<TranslationResponse> {
    try {
      if (!options.text.trim()) {
        throw new Error('Text is required for translation');
      }

      if (!options.targetLanguage) {
        throw new Error('Target language is required');
      }

      console.log('Translating text:', {
        text: options.text.substring(0, 100) + '...',
        targetLanguage: options.targetLanguage,
        sourceLanguage: options.sourceLanguage || 'auto'
      });

      const response = await axios.post(`${this.apiUrl}/translate`, {
        text: options.text,
        targetLanguage: options.targetLanguage,
        sourceLanguage: options.sourceLanguage || 'auto'
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.translatedText) {
        console.log('Translation successful');
        return response.data;
      } else {
        throw new Error('Invalid response from translation service');
      }
    } catch (error) {
      console.error('Translation error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(`Translation failed: ${error.response.data?.error || error.message}`);
        } else if (error.request) {
          throw new Error('Network error: Unable to reach translation service');
        } else {
          throw new Error(`Request error: ${error.message}`);
        }
      } else {
        throw error;
      }
    }
  }

  async getSupportedLanguages(): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}/languages`, {
        timeout: 10000
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching supported languages:', error);
      throw new Error('Failed to fetch supported languages');
    }
  }

  // Helper method to get language name from code
  getLanguageName(languageCode: string): string {
    const languageNames: { [key: string]: string } = {
      'en-US': 'English (US)',
      'hi-IN': 'Hindi',
      'es-ES': 'Spanish',
      'fr-FR': 'French',
      'de-DE': 'German',
      'ja-JP': 'Japanese',
      'zh-CN': 'Chinese (Mandarin)',
      'en': 'English',
      'hi': 'Hindi',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'ja': 'Japanese',
      'zh': 'Chinese'
    };

    return languageNames[languageCode] || languageCode;
  }

  // Helper method to check if translation is needed
  isTranslationNeeded(sourceLanguage: string, targetLanguage: string): boolean {
    // Extract base language codes
    const sourceLang = sourceLanguage.split('-')[0];
    const targetLang = targetLanguage.split('-')[0];
    
    return sourceLang !== targetLang;
  }

  async detectLanguage(text: string): Promise<{ language: string; confidence?: number }> {
    try {
      if (!text.trim()) {
        throw new Error('Text is required for language detection');
      }
      // Call your backend API instead of Google directly
      const response = await axios.post('/api/translate/detect', { text }, {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.data && response.data.language) {
        return response.data;
      } else {
        throw new Error('Invalid response from backend language detection');
      }
    } catch (error) {
      console.error('Language detection error:', error);
      throw new Error('Failed to detect language');
    }
  }
}

export default new TranslationService();
