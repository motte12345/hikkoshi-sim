import { affiliateProducts, getAmazonSearchUrl, getRakutenSearchUrl } from '../data/affiliateProducts';
import { trackEvent } from '../utils/analytics';

export function ProductLinks() {
  const handleClick = (store: string, product: string) => {
    trackEvent('affiliate_click', { store, product });
  };

  return (
    <div className="card product-links">
      <h2 className="card__title">引越しに便利なグッズ</h2>
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
