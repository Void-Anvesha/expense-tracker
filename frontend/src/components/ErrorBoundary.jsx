import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console for developer debugging
    console.error('Uncaught error in component tree:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-2xl rounded-xl border border-red-300 bg-red-50 p-8 text-red-900">
            <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
            <p className="mb-4">An unexpected error occurred while loading the app.</p>
            <pre className="whitespace-pre-wrap text-sm">{String(this.state.error)}</pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
