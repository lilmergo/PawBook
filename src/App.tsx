import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { Main } from './pages/main/Main';
import { Login } from './pages/Login';
import { Navbar } from './components/Navbar';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase';
import { Profile } from './pages/Profile';
import { PageNotFound } from './pages/PageNotFound';
import { AuthProvider } from './context/AuthContext';
import PublicRoute from './guards/PublicRoute';
import ProtectedRoute from './guards/ProtectedRoute';


function App() {
  const DebugRouter = () => {
    const location = useLocation();
    console.log("Current Route:", location.pathname);
    return null;
  };
  const [user] = useAuthState(auth);

  useEffect(() => {
    console.log('logged in:' + user);
  }, [user])

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Navbar />
          <DebugRouter />
          <Routes>
             {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Main />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          {/* Catch-all 404 Route */}
          <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
