import { useEffect, useRef } from 'react';

const PUBLISHER_ID = import.meta.env.VITE_ADSENSE_PUBLISHER_ID || '';

interface AdSenseProps {
  readonly slot: string;
  readonly format?: 'auto' | 'rectangle' | 'horizontal';
  readonly style?: React.CSSProperties;
}

export function AdSense({ slot, format = 'auto', style }: AdSenseProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!PUBLISHER_ID || pushed.current) return;
    try {
      const adsbygoogle = (window as unknown as Record<string, unknown[]>).adsbygoogle;
      if (adsbygoogle) {
        adsbygoogle.push({});
        pushed.current = true;
      }
    } catch {
      // AdSense not loaded (dev environment, ad blocker, etc.)
    }
  }, []);

  if (!PUBLISHER_ID) return null;

  return (
    <div style={{ marginTop: '1.5rem', textAlign: 'center', ...style }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
