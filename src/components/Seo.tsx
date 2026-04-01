import { Helmet } from 'react-helmet-async';

interface SeoProps {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly faqItems?: readonly { question: string; answer: string }[];
}

const SITE_NAME = '引越し費用シミュレーター';
const BASE_URL = 'https://hikkoshi-sim.pages.dev';

export function Seo({ title, description, path, faqItems }: SeoProps) {
  const fullTitle = path === '/' ? SITE_NAME : `${title} | ${SITE_NAME}`;
  const url = `${BASE_URL}${path}`;

  const faqSchema = faqItems && faqItems.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }
    : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* OGP */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={path === '/' ? 'website' : 'article'} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="ja_JP" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {/* FAQ Schema */}
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}
    </Helmet>
  );
}
