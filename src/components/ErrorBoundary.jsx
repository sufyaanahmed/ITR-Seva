import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error('KarSaathi recovered from an unexpected error', error);
  }

  render() {
    if (this.state.failed) {
      return (
        <main className="section">
          <div className="container prose">
            <p className="eyebrow">Something went wrong</p>
            <h1>Let’s start this step again.</h1>
            <p>No real taxpayer data has been stored. Reset the fictional demo to continue safely.</p>
            <button className="button button-primary" onClick={() => { localStorage.clear(); window.location.assign('/'); }}>
              Restart demo
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
