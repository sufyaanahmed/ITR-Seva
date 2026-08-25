import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../App.jsx';
import { AppProvider } from '../context/AppContext.jsx';
import { getEntityJourneyProfile } from '../data/index.js';

function renderApp(route) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppProvider><App /></AppProvider>
    </MemoryRouter>,
  );
}

function chooseOption(groupName, optionName) {
  const escapedName = groupName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const group = screen.getByRole('group', { name: new RegExp(escapedName, 'i') });
  fireEvent.click(within(group).getByLabelText(optionName));
}

async function completeEntityJourney(profileId) {
  const profile = getEntityJourneyProfile(profileId);
  fireEvent.click(screen.getByRole('button', { name: /review this pack/i }));
  expect(await screen.findByRole('heading', { name: /three checks/i })).toBeInTheDocument();
  profile.reviewChecks.forEach((check) => chooseOption(check.label, 'Looks ready'));
  fireEvent.click(screen.getByRole('button', { name: /continue to quick questions/i }));
  expect(await screen.findByRole('heading', { name: /few questions/i })).toBeInTheDocument();
  profile.questions.forEach((question) => chooseOption(question.label, question.safeAnswer === 'yes' ? 'Yes' : 'No'));
  fireEvent.click(screen.getByRole('button', { name: /show the safest route/i }));
  expect(await screen.findByRole('heading', { name: new RegExp(profile.possibleForm.id, 'i') })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /no entity tax estimate/i })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /create review pack/i }));
  expect(await screen.findByRole('heading', { name: new RegExp(`${profile.identity.name} review pack`, 'i') })).toBeInTheDocument();
  expect(screen.getByText('Pack ready for review')).toBeInTheDocument();
  expect(screen.getByText(/nothing was filed/i)).toBeInTheDocument();
}

describe('KarSaathi entity journeys', () => {
  beforeEach(() => localStorage.clear());

  it('takes the private-company sample to a bounded professional review pack', async () => {
    renderApp('/demo/company/documents');
    expect(screen.getByRole('heading', { name: /fictional company review pack/i })).toBeInTheDocument();
    await completeEntityJourney('company');
    expect(screen.queryByText(/rahul/i)).not.toBeInTheDocument();
  });

  it('takes the LLP sample to a distinct ITR-5 starting point', async () => {
    renderApp('/demo/firm_llp/documents');
    expect(screen.getByText(/fictional LLP preparing/i)).toBeInTheDocument();
    await completeEntityJourney('firm_llp');
    expect(screen.getByText(/does not cover every firm, trust, society/i)).toBeInTheDocument();
  });

  it('keeps uncertain company facts on a needs-attention report without guessing a form', async () => {
    const profile = getEntityJourneyProfile('company');
    renderApp('/demo/company/documents');
    fireEvent.click(screen.getByRole('button', { name: /review this pack/i }));
    profile.reviewChecks.forEach((check) => chooseOption(check.label, 'Not sure'));
    fireEvent.click(screen.getByRole('button', { name: /continue to quick questions/i }));
    profile.questions.forEach((question) => chooseOption(question.label, 'Not sure'));
    fireEvent.click(screen.getByRole('button', { name: /show the safest route/i }));
    expect(await screen.findByRole('heading', { name: /qualified entity-tax review needed/i })).toBeInTheDocument();
    expect(screen.queryByText(/possible itr-6 starting point/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /create review pack/i }));
    expect(await screen.findByText('Needs attention')).toBeInTheDocument();
    expect(screen.getAllByText(/confirm/i).length).toBeGreaterThan(0);
  });
});
