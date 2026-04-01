import { useEffect, useRef } from 'react';

const PUBLISHER_ID = 'ca-pub-6514048542181621';

interface AdSenseProps {
  readonly slot: string;
  readonly format?: 'auto' | 'rectangle' | 'horizontal';
  readonly style?: React.CSSProperties;
}

export function AdSense({ slot, format = 'auto', style }: AdSenseProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
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
