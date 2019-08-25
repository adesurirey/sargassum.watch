import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

const fontFamily = '"Open Sans", "Helvetica", "Arial", sans-serif';

let theme = createMuiTheme({
  palette: {
    background: {
      default: '#fff',
    },
  },

  typography: {
    fontFamily,
    fontSize: 16,
  },

  shape: {
    borderRadius: 8,
  },
});

theme = responsiveFontSizes(theme);

export default theme;
