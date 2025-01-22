import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout';
import { SplashScreen } from './components/SplashScreen';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { useVideos } from './hooks/useVideos';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

interface AppRoutesProps {
  showNavbar: boolean;
}

function AppRoutes({ showNavbar }: AppRoutesProps) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const { videos, loading, refetchVideos } = useVideos(searchQuery);

  return (
    <Layout 
      showNavbar={showNavbar && isAuthenticated} 
      searchQuery={searchQuery} 
      setSearchQuery={setSearchQuery} 
      refetchVideos={refetchVideos}
    >
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home videos={videos} loading={loading} setSearchQuery={setSearchQuery} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

function AppContent() {
  const [showNavbar, setShowNavbar] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <SplashScreen onVisibilityChange={setShowNavbar} />}
      <AppRoutes showNavbar={showNavbar} />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
