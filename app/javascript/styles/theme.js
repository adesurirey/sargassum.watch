import 'typeface-open-sans';

export default {
  palette: {
    primary: {
      main: '#256eff',
    },

    level: {
      clear: {
        main: 'rgba(30, 221, 136, 1)',
        dark: 'rgba(25, 181, 112, 1)',
        contrastText: '#333',
      },

      moderate: {
        light: 'rgba(255, 198, 91, 1)',
        main: 'rgba(249, 160, 63, 1)',
        dark: 'rgba(204, 131, 52, 1)',
      },

      na: {
        main: 'rgba(250, 113, 76, 1)',
      },

      critical: {
        light: 'rgba(252, 92, 120, 1)',
        main: 'rgba(253, 56, 91, 1)',
        dark: 'rgba(207, 46, 75, 1)',
        contrastText: '#fff',
      },
    },
  },

  typography: {
    fontFamily: '"Open Sans", "Helvetica", "Arial", sans-serif',
    fontWeightMedium: 600,
    fontWeightBold: 700,

    h1: {
      fontWeight: 700,
      fontSize: '1.1rem',
      lineHeight: '1.3',
    },

    h2: {
      fontWeight: 700,
      fontSize: '1rem',
      lineHeight: '1.3',
    },

    button: {
      textTransform: 'none',
    },
  },

  overrides: {
    MuiButton: {
      text: {
        fontWeight: 600,
      },
    },
    MuiFab: {
      label: {
        fontWeight: 600,
      },
    },
    MuiToggleButtonGroup: {
      root: {
        width: '100%',
      },
      grouped: {
        width: '100%',
      },
      groupedSizeSmall: {
        padding: '3px 9px !important',
        height: 'unset !important',
      },
    },
    MuiToggleButton: {
      root: {
        fontWeight: 600,
      },
    },
  },
};
