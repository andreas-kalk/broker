import { createTheme } from '@mui/material/styles';

// Modern flat color palette - refined and contemporary with better contrast
const modernColors = {
  // Primary colors - refined and sophisticated with better contrast
  deepPurple: '#6a1b9a',      // Lighter purple for better contrast
  forestGreen: '#388e3c',     // Slightly lighter green for better readability
  amber: '#f57c00',           // Darker amber for better contrast on white
  coral: '#e64a19',           // Adjusted coral for better contrast
  crimson: '#c62828',         // Slightly lighter red for better readability

  // Supporting colors for modern flat design with improved contrast
  slate: '#263238',           // Darker slate for better text contrast
  lightGray: '#fafafa',       // Slightly lighter background
  mediumGray: '#bdbdbd',      // Darker gray for better border visibility
  darkGray: '#424242',        // Secondary text
  white: '#ffffff',

  // Accent colors for highlights with better contrast
  blue: '#1565c0',            // Darker blue for better contrast
  teal: '#00796b',
  indigo: '#3949ab',
};

// Create a modern flat theme
export const brokerTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: modernColors.deepPurple,
      light: '#7c43bd',
      dark: '#12005e',
      contrastText: modernColors.white,
    },
    secondary: {
      main: modernColors.forestGreen,
      light: '#60ad5e',
      dark: '#005005',
      contrastText: modernColors.white,
    },
    error: {
      main: modernColors.crimson,
      light: '#ff6659',
      dark: '#9a0007',
      contrastText: modernColors.white,
    },
    warning: {
      main: modernColors.amber,
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: modernColors.white,
    },
    info: {
      main: modernColors.blue,
      light: '#63a4ff',
      dark: '#004ba0',
      contrastText: modernColors.white,
    },
    success: {
      main: modernColors.forestGreen,
      light: '#60ad5e',
      dark: '#005005',
      contrastText: modernColors.white,
    },
    background: {
      default: modernColors.lightGray,
      paper: modernColors.white,
    },
    text: {
      primary: modernColors.slate,
      secondary: modernColors.darkGray,
    },
    divider: modernColors.mediumGray,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    h1: {
      color: modernColors.slate,
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      color: modernColors.slate,
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      color: modernColors.slate,
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      color: modernColors.slate,
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      color: modernColors.slate,
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      color: modernColors.slate,
      fontWeight: 500,
      fontSize: '1.1rem',
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 500,
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.12)',
    '0px 2px 6px rgba(0, 0, 0, 0.12)',
    '0px 3px 12px rgba(0, 0, 0, 0.12)',
    '0px 4px 16px rgba(0, 0, 0, 0.12)',
    '0px 6px 20px rgba(0, 0, 0, 0.12)',
    '0px 8px 24px rgba(0, 0, 0, 0.12)',
    ...Array(18).fill('0px 8px 24px rgba(0, 0, 0, 0.12)'),
  ],
  components: {
    // Modern flat button styles
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
          },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },

    // Modern card design
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
          border: `1px solid ${modernColors.mediumGray}`,
          backgroundColor: modernColors.white,
        },
      },
    },

    // Flat chip design
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: '0.75rem',
          height: 28,
        },
        filled: {
          '&.MuiChip-colorPrimary': {
            backgroundColor: modernColors.deepPurple,
            color: modernColors.white,
          },
          '&.MuiChip-colorSecondary': {
            backgroundColor: modernColors.forestGreen,
            color: modernColors.white,
          },
          '&.MuiChip-colorInfo': {
            backgroundColor: modernColors.blue,
            color: modernColors.white,
          },
          '&.MuiChip-colorWarning': {
            backgroundColor: modernColors.amber,
            color: modernColors.white,
          },
          '&.MuiChip-colorError': {
            backgroundColor: modernColors.crimson,
            color: modernColors.white,
          },
          '&.MuiChip-colorSuccess': {
            backgroundColor: modernColors.forestGreen,
            color: modernColors.white,
          },
        },
        outlined: {
          borderWidth: 1.5,
          '&.MuiChip-colorPrimary': {
            borderColor: modernColors.deepPurple,
            color: modernColors.deepPurple,
          },
          '&.MuiChip-colorSecondary': {
            borderColor: modernColors.forestGreen,
            color: modernColors.forestGreen,
          },
        },
      },
    },

    // Clean table design
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: modernColors.slate,
            color: modernColors.white,
            fontWeight: 600,
            fontSize: '0.875rem',
            borderBottom: 'none',
          },
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(even)': {
            backgroundColor: 'rgba(245, 245, 245, 0.5)',
          },
          '&:hover': {
            backgroundColor: 'rgba(74, 20, 140, 0.04)',
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${modernColors.mediumGray}`,
          padding: '12px 16px',
        },
      },
    },

    // Modern accordion
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: `1px solid ${modernColors.mediumGray}`,
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
          '&:before': {
            display: 'none',
          },
          '&:not(:last-child)': {
            marginBottom: 8,
          },
        },
      },
    },

    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(245, 245, 245, 0.8)',
          borderRadius: '8px 8px 0 0',
          minHeight: 56,
          '&.Mui-expanded': {
            backgroundColor: 'rgba(74, 20, 140, 0.08)',
          },
        },
      },
    },

    // Modern alert design
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          borderWidth: 1,
          borderStyle: 'solid',
        },
        standardSuccess: {
          backgroundColor: 'rgba(46, 125, 50, 0.08)',
          borderColor: modernColors.forestGreen,
          color: modernColors.forestGreen,
        },
        standardError: {
          backgroundColor: 'rgba(211, 47, 47, 0.08)',
          borderColor: modernColors.crimson,
          color: modernColors.crimson,
        },
        standardWarning: {
          backgroundColor: 'rgba(255, 152, 0, 0.08)',
          borderColor: modernColors.amber,
          color: '#e65100',
        },
        standardInfo: {
          backgroundColor: 'rgba(25, 118, 210, 0.08)',
          borderColor: modernColors.blue,
          color: modernColors.blue,
        },
      },
    },

    // Modern tab design
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          minHeight: 48,
          borderRadius: '8px 8px 0 0',
          marginRight: 4,
          '&.Mui-selected': {
            backgroundColor: modernColors.deepPurple,
            color: modernColors.white,
          },
          '&:hover': {
            backgroundColor: 'rgba(74, 20, 140, 0.08)',
          },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: {
          display: 'none',
        },
        root: {
          borderBottom: `1px solid ${modernColors.mediumGray}`,
        },
      },
    },

    // Paper component
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: modernColors.white,
        },
        outlined: {
          border: `1px solid ${modernColors.mediumGray}`,
        },
      },
    },

    // Input fields
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: modernColors.mediumGray,
            },
            '&:hover fieldset': {
              borderColor: modernColors.darkGray,
            },
            '&.Mui-focused fieldset': {
              borderColor: modernColors.deepPurple,
              borderWidth: 2,
            },
          },
        },
      },
    },

    // Icon buttons
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover': {
            backgroundColor: 'rgba(74, 20, 140, 0.08)',
          },
        },
      },
    },
  },
});

// Export individual colors for use in components
export { modernColors };
