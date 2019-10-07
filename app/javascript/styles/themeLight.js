import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

import theme from './theme';

let themeLight = createMuiTheme({
  ...theme,

  palette: {
    ...theme.palette,

    type: 'light',

    background: {
      default: '#fff',
    },

    secondary: {
      main: '#fff',
      dark: '#ebebeb',
    },
  },
});

themeLight = responsiveFontSizes(themeLight);

export default themeLight;
