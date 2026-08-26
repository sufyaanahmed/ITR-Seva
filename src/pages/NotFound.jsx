import React from 'react';
import { useLocation } from 'react-router-dom';
import Page from '../ui/Page.jsx';
import Button from '../ui/Button.jsx';

export default function NotFound() {
  const { pathname } = useLocation();

  return (
    <Page
      routeId="not-found"
      eyebrow="404"
      title="This page is not here"
      lede="The address may be incomplete, or the page may have moved. Nothing in your saved demo application has been changed."
      width="prose"
    >
      <div className="border-t border-rule-strong pt-5">
        <p className="text-overline uppercase text-ink-muted mb-2">Address requested</p>
        <p className="text-body numeric text-ink break-words mb-6">{pathname}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button to="/" size="lg">Return home</Button>
          <Button to="/site-map" variant="secondary" size="lg">See every page</Button>
        </div>
      </div>
    </Page>
  );
}
