import 'typeface-open-sans';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';

let theme = createMuiTheme({
  palette: {
    background: {
      default: '#fff',
    },

    primary: {
      main: indigo.A700,
    },

    secondary: {
      main: '#fff',
      dark: '#EBEBEB',
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

    h3: {
      fontWeight: 700,
      fontSize: '0.8rem',
      lineHeight: '1.1',
    },

    button: {
      textTransform: 'none',
    },
  },

  },
});

theme = responsiveFontSizes(theme);

export default theme;
