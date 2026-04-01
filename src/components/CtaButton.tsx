import { trackCtaClick } from '../utils/analytics';

const AFFILIATE_URL = import.meta.env.VITE_AFFILIATE_URL || '#';

interface CtaButtonProps {
  readonly label?: string;
  readonly toolName?: string;
}

export function CtaButton({ label = '正確な見積もりを取る（無料）', toolName = 'unknown' }: CtaButtonProps) {
  return (
    <a
      href={AFFILIATE_URL}
      className="btn btn-cta"
      target="_blank"
      rel="noopener noreferrer nofollow"
      style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem' }}
      onClick={() => trackCtaClick(toolName)}
    >
      {label}
    </a>
  );
}
