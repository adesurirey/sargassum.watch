import { Component } from 'react';
import * as Sentry from '@sentry/browser';

class LocalErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo);
      scope.setExtra('errorBoundary', 'local');

      Sentry.captureException(error);
    });
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

export default LocalErrorBoundary;
