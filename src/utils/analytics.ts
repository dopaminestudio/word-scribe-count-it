
// Google Analytics 이벤트 추적 유틸리티
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const trackEvent = (action: string, category: string = 'engagement', label?: string, value?: number) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackTextInput = (charCount: number) => {
  trackEvent('text_input', 'user_interaction', `chars_${charCount > 100 ? '100+' : charCount}`);
};

export const trackCopy = () => {
  trackEvent('copy_text', 'user_interaction');
};

export const trackReset = () => {
  trackEvent('reset_text', 'user_interaction');
};
