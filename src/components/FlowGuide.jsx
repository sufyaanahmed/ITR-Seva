import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';

export default function FlowGuide({ title, intro, children }) {
  const { state } = useStore();
  const finderLink = state.finder?.showResult ? '/guide/visa-finder?view=result' : '/guide/visa-finder';
  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-6 sm:py-12">
      <Link to={finderLink} className="mb-7 inline-flex text-sm font-medium text-text-secondary hover:text-primary">← Back to my visa route</Link>
      <header className="mb-8">
        <h1 className="mb-3 font-serif text-3xl font-bold text-primary sm:text-4xl">{title}</h1>
        <p className="leading-relaxed text-text-secondary">{intro}</p>
      </header>
      <div className="space-y-8">{children}</div>
    </div>
  );
}
