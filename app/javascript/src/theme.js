import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

const fontFamily = '"Open Sans", "Helvetica", "Arial", sans-serif';

const h1 = {
  fontWeight: 700,
  fontSize: '1rem',
  lineHeight: '1.3',
};

let theme = createMuiTheme({
  palette: {
    background: {
      default: '#fff',
    },

    primary: {
      main: 'rgb(0, 123, 255)',
      contrastText: '#fff',
    },

    secondary: {
      main: '#fff',
    },

    level: {
      clear: {
        main: 'rgb(30, 221, 136)',
        contrastText: '#333',
      },

      moderate: {
        light: 'rgb(255, 198, 91)',
        main: 'rgb(230, 126, 34)',
        dark: 'rgb(208, 104, 17)',
        contrastText: '#fff',
      },

      critical: {
        light: 'rgb(252, 81, 84)',
        main: 'rgb(252, 16, 21)',
        dark: 'rgb(207, 14, 18)',
        contrastText: '#fff',
      },
    },
  },

  typography: {
    fontFamily,
    htmlFontSize: 16,

    h1,
    h2: h1,

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
