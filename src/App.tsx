import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout';
import { SplashScreen } from './components/SplashScreen';
import { Home } from './pages/Home';
import { useVideos } from './hooks/useVideos';

function AppContent() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const { videos, loading, refetchVideos } = useVideos(searchQuery);
  const [showNavbar, setShowNavbar] = useState(false);

  return (
    <>
      <SplashScreen onVisibilityChange={setShowNavbar} />
      <Layout 
        showNavbar={showNavbar}
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        refetchVideos={refetchVideos}
      >
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <Home videos={videos} loading={loading} setSearchQuery={setSearchQuery} />
              }
            />
          </Routes>
        </AnimatePresence>
      </Layout>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
