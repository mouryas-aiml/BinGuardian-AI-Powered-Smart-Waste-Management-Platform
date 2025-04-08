import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GetStarted from './GetStarted';
import UserHomeScreen from './UserHomeScreen';
import AboutUs from './AboutUs';
import ReportWaste from './ReportWaste';
import RecyclingAwareness from './RecyclingAwareness';
import MunicipalityDashboard from './MunicipalityDashboard';
import ChatbotPage from './ChatbotPage';
import UserProfile from './UserProfile';
import Login from './components/Login';
import Signup from './components/Signup';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TranslationProvider } from './context/TranslationContext';
import ApiKeySettings from './components/ApiKeySettings';
import { TTSProvider } from './context/TTSContext';

// Protected route component
function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/get-started" />;
  }

  return children;
}

// Municipal admin route
function MunicipalRoute({ children }) {
  const { userDetails, loading } = useAuth();

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!userDetails || userDetails.userType !== 'municipal') {
    return <Navigate to="/" />;
  }

  return children;
}

// Public routes that should redirect to home if user is logged in
function PublicOnlyRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return children;
}

// Remove Router from here since it's already in AppWithProviders
function App() {
  const { currentUser } = useAuth();

  return (
    <div className="App">
      {/* Only show Navbar if user is logged in */}
      {currentUser && <Navbar />}

      <div className={`content ${!currentUser ? 'full-height' : ''}`}>
        <Routes>
          {/* Public routes for non-authenticated users */}
          <Route path="/get-started" element={
            <PublicOnlyRoute>
              <GetStarted />
            </PublicOnlyRoute>
          } />
          <Route path="/login" element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          } />
          <Route path="/signup" element={
            <PublicOnlyRoute>
              <Signup />
            </PublicOnlyRoute>
          } />

          {/* Protected routes that require authentication */}
          <Route path="/" element={
            <ProtectedRoute>
              <UserHomeScreen />
            </ProtectedRoute>
          } />
          <Route path="/about-us" element={
            <ProtectedRoute>
              <AboutUs />
            </ProtectedRoute>
          } />
          <Route path="/report-waste" element={
            <ProtectedRoute>
              <ReportWaste />
            </ProtectedRoute>
          } />
          <Route path="/recycling-awareness" element={
            <ProtectedRoute>
              <RecyclingAwareness />
            </ProtectedRoute>
          } />
          <Route path="/municipality-dashboard" element={
            <MunicipalRoute>
              <MunicipalityDashboard />
            </MunicipalRoute>
          } />
          <Route path="/chatbot" element={
            <ProtectedRoute>
              <ChatbotPage />
            </ProtectedRoute>
          } />
          <Route path="/user-profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />

          {/* Redirect any other route to GetStarted if not logged in or Home if logged in */}
          <Route path="*" element={<Navigate to="/get-started" replace />} />
        </Routes>
      </div>

      {/* Only show Footer if user is logged in */}
      {currentUser && <Footer />}

      {/* Add ApiKeySettings component */}
      <ApiKeySettings />
    </div>
  );
}

// Keep only one Router here
function AppWithProviders() {
  return (
    <Router>
      <AuthProvider>
        <TranslationProvider>
          <TTSProvider>
            <App />
          </TTSProvider>
        </TranslationProvider>
      </AuthProvider>
    </Router>
  );
}

export default AppWithProviders;
