import React from 'react';
import { Link } from 'react-router-dom';
import Page from '../ui/Page.jsx';
import { ROUTES } from '../lib/routes.js';

const GROUPS = [
  ['service', 'Start here'],
  ['guide', 'Guidance'],
  ['info', 'Information'],
  ['demo', 'Reviewers and testers'],
  ['application', 'Inside an application'],
];

const isConcrete = (path) => path !== '*' && !path.includes(':');

export default function SiteMap() {
  return (
    <Page
      routeId="site-map"
      eyebrow="Every part of the prototype"
      title="Site map"
      lede="The complete service, grouped by purpose. Application pages appear after a fictional record has been started or loaded."
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
                    <p className="text-body text-ink-muted max-w-prose mt-1">{route.description}</p>
                    {!isConcrete(route.path) && route.path !== '*' && (
                      <p className="text-meta text-ink-faint mt-2">Available from an application record.</p>
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
