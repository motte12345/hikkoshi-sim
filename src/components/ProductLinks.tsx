import { affiliateProducts, getAmazonSearchUrl, getRakutenSearchUrl } from '../data/affiliateProducts';
import { trackEvent } from '../utils/analytics';

export function ProductLinks() {
  const handleClick = (store: string, product: string) => {
    trackEvent('affiliate_click', { store, product });
  };

  return (
    <div className="card product-links">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--color-primary)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>引越しに便利なグッズ</h2>
        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>PR</span>
      </div>
      <div className="product-grid">
        {affiliateProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-card__name">{product.name}</div>
            <p className="product-card__desc">{product.description}</p>
            <div className="product-card__links">
              <a
                href={getAmazonSearchUrl(product.amazonSearchQuery)}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="btn-amazon"
                onClick={() => handleClick('amazon', product.id)}
              >
                Amazonで探す
              </a>
              <a
                href={getRakutenSearchUrl(product.rakutenSearchQuery)}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="btn-rakuten"
                onClick={() => handleClick('rakuten', product.id)}
              >
                楽天で探す
              </a>
            </div>
          </div>
        ))}
      </div>
      <p className="affiliate-note">※ 上記リンクはアフィリエイトリンクです</p>
    </div>
  );
}
