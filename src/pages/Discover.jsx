import React from 'react';
import Page from '../ui/Page.jsx';
import Button from '../ui/Button.jsx';
import { Plate } from '../ui/structure.jsx';
import { PLATES } from '../lib/content.js';
import { usePrefs } from '../state/prefs.jsx';

export default function Discover() {
  const { imagesSuppressed } = usePrefs();

  return (
    <Page
      routeId="discover"
      eyebrow="The country beyond the form"
      title="India contains more than one story"
      lede="Three small observations, offered after the practical work rather than before it. This page is editorial; it is not part of an application and makes no tourism promises."
      width="dashboard"
      decor
    >
      <div className="border-y border-rule-strong py-6 mb-12 grid sm:grid-cols-[4rem_1fr] gap-3 sm:gap-6">
        <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true" className="text-terracotta-ink">
          <g fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2h20l12 12v20L34 46H14L2 34V14Z" />
            <path d="m24 13 11 11-11 11-11-11Z" opacity=".55" />
          </g>
        </svg>
        <p className="text-lede text-ink max-w-prose">
          The first welcome is useful. The second can be beautiful. India has always made room for both.
        </p>
      </div>

      <ol className="list-none m-0 p-0 grid gap-16 lg:gap-24">
        {PLATES.map((plate, index) => (
          <li key={plate.title} className={`grid gap-8 lg:grid-cols-2 lg:items-center ${index % 2 ? '' : ''}`}>
            <Plate
              src={plate.src}
              alt={plate.alt}
              motif={plate.motif}
              caption={plate.caption}
              credit={plate.credit}
              suppressed={imagesSuppressed}
              className={index % 2 ? 'lg:order-2' : ''}
            />
            <article className={index % 2 ? 'lg:order-1' : ''}>
              <p className="text-overline uppercase numeric text-ink-faint mb-3">Plate 0{index + 1}</p>
              <h2 className="font-display text-display-m text-ink mb-5 text-balance">{plate.title}</h2>
              <p className="text-lede text-ink-muted max-w-prose">{plate.body}</p>
            </article>
          </li>
        ))}
      </ol>

      <div className="mt-16 lg:mt-24 border border-rule-strong bg-indigo text-on-indigo on-indigo jali-story p-7 sm:p-10">
        <p className="text-overline uppercase opacity-75 mb-3">When you are ready</p>
        <h2 className="font-display text-title mb-3">Return to the journey itself</h2>
        <p className="text-body opacity-85 max-w-prose mb-6">
          Read the requirements before entering anything, or use the finder for a conservative suggestion based on published rules.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button to="/find/q/1" className="bg-paper-1 text-indigo border-paper-1 hover:bg-paper-2">Find my likely path</Button>
          <Button to="/before-you-travel" variant="secondary" className="text-on-indigo border-paper-1 hover:bg-indigo-600">Before you travel</Button>
        </div>
      </div>
    </Page>
  );
}
