import { trackCtaClick } from '../utils/analytics';

const AFFILIATE_URL = 'https://px.a8.net/svt/ejp?a8mat=4B1BLL+E0VLRM+ZXM+HY7W2';
const IMPRESSION_URL = 'https://www17.a8.net/0.gif?a8mat=4B1BLL+E0VLRM+ZXM+HY7W2';

interface CtaButtonProps {
  readonly label?: string;
  readonly toolName?: string;
}

export function CtaButton({ label = '正確な見積もりを取る（無料）', toolName = 'unknown' }: CtaButtonProps) {
  return (
    <div style={{ marginTop: '1.5rem' }}>
      <p style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'right', marginBottom: '0.25rem' }}>PR</p>
      <a
        href={AFFILIATE_URL}
        className="btn btn-cta"
        target="_blank"
        rel="noopener noreferrer nofollow"
        style={{ display: 'block', textAlign: 'center' }}
        onClick={() => trackCtaClick(toolName)}
      >
        {label}
      </a>
      <img src={IMPRESSION_URL} width="1" height="1" alt="" style={{ border: 0 }} />
    </div>
  );
}
