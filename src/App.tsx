import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
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
      {/* Inject Umami Tracking Script */}
        <Helmet>
      <script
        async
        src="https://umami.blasinga.me/script.js"
        data-website-id="0884ff1b-90d7-407e-a394-9f0bb756a46f"
      ></script>
    </Helmet>
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
