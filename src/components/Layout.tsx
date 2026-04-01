import { Link, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="site-header__logo">
            引越し費用シミュレーター
          </Link>
          <nav className="site-header__nav">
            <Link to="/estimate">費用計算</Link>
            <Link to="/tanshin">単身パック</Link>
            <Link to="/shoki-hiyo">初期費用</Link>
            <Link to="/fuyohin">不用品処分</Link>
          </nav>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="site-footer__links">
          <Link to="/about">概要・免責事項</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} 引越し費用シミュレーター</p>
      </footer>
    </>
  );
}
