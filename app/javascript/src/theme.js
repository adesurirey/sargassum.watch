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
      light: 'rgb(46, 147, 255)',
      main: 'rgb(0, 123, 255)',
      dark: 'rgb(0, 101, 209)',
      contrastText: '#fff',
    },

    level: {
      clear: {
        light: 'rgb(70, 227, 157)',
        main: 'rgb(30, 221, 136)',
        dark: 'rgb(25, 181, 112)',
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
    fontSize: 16,

    h1,
    h2: h1,
  },

  shape: {
    borderRadius: 8,
  },
});

theme = responsiveFontSizes(theme);

export default theme;
