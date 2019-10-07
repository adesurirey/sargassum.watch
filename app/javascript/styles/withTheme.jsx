import React, { useState, useEffect } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import themeLight from './themeLight';
import themeDark from './themeDark';

const themes = {
  light: themeLight,
  dark: themeDark,
};

const getMode = () => {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const toggleBodyClass = mode => {
  document.body.className = `theme-${mode}`;
};

const withTheme = Component => {
  const WithTheme = props => {
    const [mode, setMode] = useState(getMode());
    const theme = themes[mode];

    const activateDarkMode = () => setMode('dark');
    const activateLightMode = () => setMode('light');

    useEffect(() => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addListener(e => e.matches && activateDarkMode());
      window
        .matchMedia('(prefers-color-scheme: light)')
        .addListener(e => e.matches && activateLightMode());
    }, []);

    useEffect(() => toggleBodyClass(mode), [mode]);

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
