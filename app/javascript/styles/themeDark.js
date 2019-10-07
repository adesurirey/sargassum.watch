import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

import theme from './theme';

let themeDark = createMuiTheme({
  ...theme,

  palette: {
    ...theme.palette,

    type: 'dark',

    secondary: {
      main: '#424242',
    },

    grey: {
      '100': '#303030',
      '200': '#383838',
    },
  },
});

themeDark = responsiveFontSizes(themeDark);

export default themeDark;
