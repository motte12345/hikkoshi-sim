const GA_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || '';

type GtagCommand = 'config' | 'event' | 'js';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: [GtagCommand, ...unknown[]]) => void;
  }
}

export function initGA() {
  if (!GA_ID) return;

  // gtag.js script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  // gtag initialization
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: [GtagCommand, ...unknown[]]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);
}

export function trackEvent(eventName: string, params?: Record<string, string | number>) {
  if (!GA_ID || !window.gtag) return;
  window.gtag('event', eventName, params);
}

// 計算ツール使用イベント
export function trackCalculation(toolName: string, params?: Record<string, string | number>) {
  trackEvent('calculate', {
    tool_name: toolName,
    ...params,
  });
}

// CTAクリックイベント
export function trackCtaClick(toolName: string) {
  trackEvent('cta_click', { tool_name: toolName });
}
