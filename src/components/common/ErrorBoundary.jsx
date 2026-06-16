import React, { Component } from 'react';
import Button from './Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
          <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-2xl max-w-md border border-red-100 dark:border-red-900/50">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
              Something went wrong
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
              We encountered an unexpected error while loading this section. Please try reloading the page or go back to home.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                Go to Home
              </Button>
              <Button variant="primary" onClick={this.handleReload}>
                Reload Page
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left p-3 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-auto max-h-40 text-xs font-mono text-red-600 dark:text-red-400">
                {this.state.error?.toString()}
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
