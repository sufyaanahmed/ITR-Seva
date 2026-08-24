import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../App.jsx';
import { AppProvider } from '../context/AppContext.jsx';

function renderApp(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppProvider>
        <App />
      </AppProvider>
    </MemoryRouter>,
  );
}

describe('KarSaathi citizen journey', () => {
  beforeEach(() => localStorage.clear());

  it('takes Rahul from fictional records to a readiness report', async () => {
    renderApp('/');

    fireEvent.click(screen.getByRole('link', { name: /start guided demo/i }));
    expect(await screen.findByRole('heading', { name: /rahul has four fictional records/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /compare these records/i }));
    fireEvent.click(await screen.findByRole('button', { name: /mark one as duplicate/i }));
    fireEvent.click(screen.getByRole('button', { name: /include from bank certificate/i }));
    fireEvent.click(screen.getByRole('button', { name: /continue with these answers/i }));

    expect(await screen.findByRole('heading', { name: /seven quick questions/i })).toBeInTheDocument();
    for (const option of screen.getAllByLabelText('No')) fireEvent.click(option);
    fireEvent.click(screen.getByLabelText('0'));
    fireEvent.click(screen.getByRole('button', { name: /show rahul/i }));

    expect(await screen.findByRole('heading', { name: /likely itr-1 candidate/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /create readiness report/i }));

    expect(await screen.findByRole('heading', { name: /rahul.*filing readiness/i })).toBeInTheDocument();
    expect(screen.getByText('Ready to continue')).toBeInTheDocument();
    expect(screen.getByText(/nothing was filed/i)).toBeInTheDocument();
  });
});
