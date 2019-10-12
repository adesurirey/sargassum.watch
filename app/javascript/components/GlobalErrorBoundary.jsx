import React, { Component } from 'react';
import * as Sentry from '@sentry/browser';

import GlobalErrorScreen from './GlobalErrorScreen';

class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eventId: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo);
      scope.setExtra('errorBoundary', true);

      const eventId = Sentry.captureException(error);

      this.setState({ eventId });
    });
  }

  render() {
    if (this.state.hasError) {
      return <GlobalErrorScreen />;
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
