import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { LegacyDemoRedirect, ProfileJourneyRoute } from '../components/DemoRouteGuards.jsx';
import {
  AppProvider,
  LEGACY_STORAGE_KEY,
  STORAGE_KEY,
  loadState,
  useApp,
} from '../context/AppContext.jsx';
import DemoSelector from '../pages/DemoSelector.jsx';

function StateProbe() {
  const { demo, startDemo, setAnswer, setResolution, resetJourney } = useApp();
  return (
    <>
      <pre data-testid="state">{JSON.stringify(demo)}</pre>
      <button type="button" onClick={() => startDemo('individual')}>Start individual</button>
      <button type="button" onClick={() => setAnswer('individual', 'capitalGains', false)}>Answer individual</button>
      <button type="button" onClick={() => setResolution('company', 'advance-tax', { action: 'confirm' })}>Resolve company</button>
      <button type="button" onClick={() => resetJourney('individual')}>Reset individual</button>
    </>
  );
}

function readProbe() {
  return JSON.parse(screen.getByTestId('state').textContent);
}

function LocationProbe() {
  return <p data-testid="location">{useLocation().pathname}</p>;
}

describe('profile-scoped demo state', () => {
  beforeEach(() => localStorage.clear());

  it('migrates valid v1 progress only into the individual journey', () => {
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify({
      version: 1,
      language: 'hi',
      started: true,
      answers: { capitalGains: false },
      resolutions: { 'fd-interest': { action: 'include_from_bank_record' } },
    }));

    const state = loadState();
    expect(state.version).toBe(2);
    expect(state.language).toBe('hi');
    expect(state.journeys.individual.started).toBe(true);
    expect(state.journeys.individual.answers.capitalGains).toBe(false);
    expect(state.journeys.company).toEqual({ started: false, answers: {}, resolutions: {} });
    expect(state.journeys.firm_llp).toEqual({ started: false, answers: {}, resolutions: {} });
  });

  it('sanitizes malformed v2 journey branches', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: 2,
      language: 'not-supported',
      journeys: {
        individual: { started: 'yes', answers: [], resolutions: 'bad' },
        company: { started: true, answers: { audited: true }, resolutions: {} },
        unknown: { started: true },
      },
    }));

    const state = loadState();
    expect(state.language).toBe('en');
    expect(state.journeys.individual).toEqual({ started: false, answers: {}, resolutions: {} });
    expect(state.journeys.company.answers.audited).toBe(true);
    expect(state.journeys.firm_llp).toEqual({ started: false, answers: {}, resolutions: {} });
    expect(state.journeys.unknown).toBeUndefined();
  });

  it('updates and resets one profile without leaking into another', () => {
    render(<AppProvider><StateProbe /></AppProvider>);

    fireEvent.click(screen.getByRole('button', { name: 'Start individual' }));
    fireEvent.click(screen.getByRole('button', { name: 'Answer individual' }));
    fireEvent.click(screen.getByRole('button', { name: 'Resolve company' }));

    let state = readProbe();
    expect(state.journeys.individual.started).toBe(true);
    expect(state.journeys.individual.answers.capitalGains).toBe(false);
    expect(state.journeys.company.resolutions['advance-tax']).toEqual({ action: 'confirm' });

    fireEvent.click(screen.getByRole('button', { name: 'Reset individual' }));
    state = readProbe();
    expect(state.journeys.individual).toEqual({ started: false, answers: {}, resolutions: {} });
    expect(state.journeys.company.resolutions['advance-tax']).toEqual({ action: 'confirm' });
  });
});

describe('profile routes', () => {
  it('offers the three bounded demos at /demo', () => {
    render(<MemoryRouter><DemoSelector /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /who are you checking taxes for/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /explore individual/i })).toHaveAttribute('href', '/demo/individual/documents');
    expect(screen.getByRole('link', { name: /explore company/i })).toHaveAttribute('href', '/demo/company/documents');
    expect(screen.getByRole('link', { name: /explore llp/i })).toHaveAttribute('href', '/demo/firm_llp/documents');
  });

  it('redirects legacy step links into the individual profile', async () => {
    render(
      <MemoryRouter initialEntries={['/demo/questions']}>
        <Routes>
          <Route path="/demo/:stepId" element={<LegacyDemoRedirect />} />
          <Route path="/demo/individual/:stepId" element={<LocationProbe />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByTestId('location')).toHaveTextContent('/demo/individual/questions');
  });

  it('returns unknown profile IDs to the selector route', async () => {
    render(
      <MemoryRouter initialEntries={['/demo/not-real/documents']}>
        <Routes>
          <Route path="/demo/:profileId/:stepId" element={<ProfileJourneyRoute />} />
          <Route path="/demo" element={<LocationProbe />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByTestId('location')).toHaveTextContent('/demo');
  });
});
