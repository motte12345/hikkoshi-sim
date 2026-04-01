import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { EstimatePage } from './pages/EstimatePage';
import { TanshinPage } from './pages/TanshinPage';
import { ShokiHiyoPage } from './pages/ShokiHiyoPage';
import { FuyohinPage } from './pages/FuyohinPage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/estimate" element={<EstimatePage />} />
          <Route path="/tanshin" element={<TanshinPage />} />
          <Route path="/shoki-hiyo" element={<ShokiHiyoPage />} />
          <Route path="/fuyohin" element={<FuyohinPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
