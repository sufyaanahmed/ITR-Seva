import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section">
      <div className="container prose">
        <p className="eyebrow">Page not found</p>
        <h1>This path is not part of the simple demo.</h1>
        <p>Return home or choose one of the three fictional readiness journeys.</p>
        <div className="hero-actions">
          <Link className="button button-primary" to="/">Go home</Link>
          <Link className="button button-secondary" to="/demo">Choose a sample</Link>
        </div>
      </div>
    </section>
  );
}
