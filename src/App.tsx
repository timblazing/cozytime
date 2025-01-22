import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { useVideos } from './hooks/useVideos';

function AppRoutes() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const { videos, loading, refetchVideos } = useVideos(searchQuery);

  return (
    <Layout searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetchVideos={refetchVideos}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home videos={videos} loading={loading} setSearchQuery={setSearchQuery} />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
