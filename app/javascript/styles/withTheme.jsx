import React, { useState, useEffect } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import light from './themeLight';
import dark from './themeDark';

const themes = { light, dark };

const getColorScheme = () => {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const withTheme = Component => {
  const WithTheme = props => {
    const [mode, setMode] = useState(getColorScheme());
    const theme = themes[mode];

    useEffect(() => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addListener(({ matches }) => {
          matches && setMode('dark');
        });
      window
        .matchMedia('(prefers-color-scheme: light)')
        .addListener(({ matches }) => {
          matches && setMode('light');
        });
    }, []);

    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    );
  };

  return WithTheme;
};

export default withTheme;
