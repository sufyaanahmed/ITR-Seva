import React from 'react';
import { Link } from 'react-router-dom';
import Page from '../ui/Page.jsx';
import { ROUTES } from '../lib/routes.js';

const GROUPS = [
  ['service', 'Start here'],
  ['guide', 'Guidance'],
  ['info', 'Information'],
];

const isConcrete = (path) => path !== '*' && !path.includes(':');

export default function SiteMap() {
  return (
    <Page
      routeId="site-map"
      eyebrow="Directory"
      title="Site map"
      lede="Public guidance and services."
      width="dashboard"
    >
      <div className="grid gap-12 lg:grid-cols-2">
        {GROUPS.map(([id, label]) => {
          const routes = ROUTES.filter((route) => route.group === id);
          if (!routes.length) return null;
          return (
            <section key={id} aria-labelledby={`sitemap-${id}`}>
              <p className="text-overline uppercase text-ink-muted mb-2">{label}</p>
              <h2 id={`sitemap-${id}`} className="sr-only">{label}</h2>
              <ul className="list-none m-0 p-0 border-t border-rule-strong">
                {routes.map((route) => (
                  <li key={route.id} className="border-b border-rule py-4">
                    {isConcrete(route.path) ? (
                      <Link to={route.path} className="inline-flex min-h-touch items-center text-subhead font-semibold text-indigo underline underline-offset-4">
                        {route.title}
                      </Link>
                    ) : (
                      <p className="text-subhead font-semibold text-ink">{route.title}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </Page>
  );
}
