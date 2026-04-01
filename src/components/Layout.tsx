import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="site-header__logo" onClick={closeMenu}>
            引越し費用シミュレーター
          </Link>
          <nav className="site-header__nav" aria-label="メインナビゲーション">
            <Link to="/estimate" onClick={closeMenu}>費用計算</Link>
            <Link to="/tanshin" onClick={closeMenu}>単身パック</Link>
            <Link to="/shoki-hiyo" onClick={closeMenu}>初期費用</Link>
            <Link to="/fuyohin" onClick={closeMenu}>不用品処分</Link>
          </nav>
          <button
            className={`hamburger${menuOpen ? ' hamburger--open' : ''}`}
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            <span className="hamburger__bar" />
            <span className="hamburger__bar" />
            <span className="hamburger__bar" />
          </button>
        </div>
        {menuOpen && (
          <nav
            id="mobile-nav"
            className="site-header__nav--mobile"
            aria-label="モバイルナビゲーション"
          >
            <Link to="/estimate" onClick={closeMenu}>費用計算</Link>
            <Link to="/tanshin" onClick={closeMenu}>単身パック</Link>
            <Link to="/shoki-hiyo" onClick={closeMenu}>初期費用</Link>
            <Link to="/fuyohin" onClick={closeMenu}>不用品処分</Link>
          </nav>
        )}
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
