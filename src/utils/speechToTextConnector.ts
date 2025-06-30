// Optimized speech-to-text connector with better performance

let isInitialized = false;
let cachedTranscriptTextarea: HTMLTextAreaElement | null = null;

export function initializeSpeechToText() {
  if (isInitialized) return;
  
  const initializeButton = () => {
    const recordButton = document.querySelector('button:has(.lucide-mic)') as HTMLButtonElement;
    if (recordButton && !recordButton.dataset.sttInitialized) {
      recordButton.dataset.sttInitialized = 'true';
      
      recordButton.addEventListener('click', (e) => {
        e.stopPropagation();
        document.dispatchEvent(new CustomEvent('toggle-recording'));
      }, { passive: true });
      
      return true;
    }
    return false;
  };

  // Use MutationObserver for better performance than setInterval
  const observer = new MutationObserver(() => {
    if (initializeButton()) {
      observer.disconnect();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  } else {
    if (!initializeButton()) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }
  
  isInitialized = true;
}

// Optimized function to update transcript textarea
export function updateTranscriptTextarea(transcript: string) {
  if (!transcript) return;
  
  // Use cached textarea if available and still in DOM
  if (cachedTranscriptTextarea && document.contains(cachedTranscriptTextarea)) {
    updateTextareaValue(cachedTranscriptTextarea, transcript);
    return;
  }
  
  // Find and cache the transcript textarea
  const textareas = document.querySelectorAll('textarea');
  for (const textarea of textareas) {
    const parent = textarea.closest('div');
    if (parent?.textContent?.includes('Transcript')) {
      cachedTranscriptTextarea = textarea as HTMLTextAreaElement;
      updateTextareaValue(textarea as HTMLTextAreaElement, transcript);
      break;
    }
  }
}

function updateTextareaValue(textarea: HTMLTextAreaElement, value: string) {
  if (textarea.value !== value) {
    textarea.value = value;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }
}