import 'typeface-open-sans';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import indigo from '@material-ui/core/colors/indigo';

const fontFamily = '"Open Sans", "Helvetica", "Arial", sans-serif';

const h1 = {
  fontWeight: 700,
  fontSize: '1rem',
  lineHeight: '1.3',
};

let theme = createMuiTheme({
  palette: {
    background: {
      default: grey[50],
    },

    primary: {
      main: indigo.A700,
    },

    secondary: {
      main: '#fff',
    },

    level: {
      clear: {
        main: 'rgba(30, 221, 136, 1)',
        contrastText: '#333',
      },

      moderate: {
        light: 'rgba(255, 198, 91, 1)',
        main: 'rgba(238, 136, 75, 1)',
        dark: 'rgba(208, 104, 17, 1)',
        contrastText: '#fff',
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
    fontFamily,

    // Section titles
    h1,
    h2: h1,

    // Tooltips and popups titles
    h3: {
      fontWeight: 700,
      fontSize: '0.8rem',
      lineHeight: '1.1',
    },

    button: {
      textTransform: 'none',
    },
  },

  shape: {
    borderRadius: 8,
  },
});

theme = responsiveFontSizes(theme);

export default theme;
