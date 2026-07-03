import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-bg-secondary border border-red-200 dark:border-red-950 rounded-2xl p-12 max-w-[500px] mx-auto my-16 text-center shadow-lg">
          <h2 className="text-red-600 dark:text-red-400 text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-text-secondary mb-8">
            An unexpected error occurred in the application: {this.state.error?.message || "Unknown error"}
          </p>
          <button 
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-md shadow-sm transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            onClick={this.handleReset}
          >
            Go to Homepage
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
