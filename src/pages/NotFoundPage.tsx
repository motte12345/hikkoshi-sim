import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';

export function NotFoundPage() {
  return (
    <>
      <Seo
        title="ページが見つかりません"
        description="お探しのページは存在しないか、移動した可能性があります。"
        path="/404"
      />
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <h1 className="page-title">ページが見つかりません</h1>
        <p className="page-description">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link to="/" className="btn btn-primary">
          トップページへ戻る
        </Link>
      </div>
    </>
  );
}
