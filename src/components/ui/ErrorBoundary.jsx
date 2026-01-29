import React from "react";
import StyleCss from "./UiComponent.module.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={StyleCss.ErrorBoundary}>
          <div className={StyleCss["ErrorBoundary__Content"]}>
            <h2 className={StyleCss["ErrorBoundary__Title"]}>Something went wrong</h2>
            <p className={StyleCss["ErrorBoundary__Message"]}>
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              className={StyleCss["ErrorBoundary__Button"]}
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
