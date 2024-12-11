import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Main } from './pages/main/Main';
import { Login } from './pages/Login';
import { Navbar } from './components/Navbar';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase';

function App() {
  const [user] = useAuthState(auth);

  return (
    <ThemeProvider theme={theme}>
      <div className='App'>
        <Router>
          <Navbar />
          <Routes>
            {user ? 
            <>
            <Route path='/' element={<Main />} />
            </>
            :
            <>
            <Route path='/login' element={<Login />} />          
            </>
            }
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
