import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      <h1 className="page-title">ページが見つかりません</h1>
      <p className="page-description">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Link to="/" className="btn btn-primary">
        トップページへ戻る
      </Link>
    </div>
  );
}
