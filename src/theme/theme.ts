import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1A2824', // Dark moss green
      contrastText: '#F5FBEF', // Ivory white
    },
    secondary: {
      main: '#748B75', // Sage green used for success or action buttons
      contrastText: '#F5FBEF', // Ivory white
    },
    background: {
      default: '#DFE4D9', // Light gray background
      paper: '#F5FBEF', // Ivory white
    },
    text: {
      primary: '#1A1D1A', //  dark text color
      secondary: '#475448', //  muted text color
    },
  },
  typography: {
    fontFamily: `'Roboto', 'Arial', sans-serif`, 
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#050505',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#050505',
    },
    body1: {
      fontSize: '1rem',
      color: '#050505',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#65676b',
    },
    button: {
      textTransform: 'none', // Disable uppercase text in buttons
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px', // Rounded buttons
          textTransform: 'none', // No uppercase
          fontWeight: 600, // Bold text
        },
        containedPrimary: {
          backgroundColor: '#748B75',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#475448', // Slightly darker blue
          },
        },
        containedSecondary: {
          backgroundColor: '#748B75',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#475448', // Slightly darker green
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Subtle shadow

        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
  },
});

export default theme;
