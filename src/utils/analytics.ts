declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params?: Record<string, string | number>) {
  if (!window.gtag) return;
  window.gtag('event', eventName, params);
}

export function trackCalculation(toolName: string, params?: Record<string, string | number>) {
  trackEvent('calculate', {
    tool_name: toolName,
    ...params,
  });
}

export function trackCtaClick(toolName: string) {
  trackEvent('cta_click', { tool_name: toolName });
}
