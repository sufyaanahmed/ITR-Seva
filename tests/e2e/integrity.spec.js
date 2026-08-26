import { test, expect } from '@playwright/test';

test('finder validation moves focus to the unanswered control', async ({ page }) => {
  await page.goto('/find/q/1');
  await page.getByRole('button', { name: 'Next question' }).click();
  await expect(page.getByRole('alert')).toContainText('Choose an answer');
  await expect(page.locator('main select, main input').first()).toBeFocused();
});

test('reviewer scenarios never hide or overwrite a personal saved application', async ({ page }) => {
  await page.goto('/start');
  await page.getByRole('button', { name: 'Start an e-Visa demo' }).click();
  const personalId = page.url().match(/DEMO\d{4}E\d{5}/)?.[0];
  expect(personalId).toBeTruthy();
  await page.waitForFunction(() => Boolean(localStorage.getItem('visaseva.app.v1')));

  await page.goto('/demo');
  await page.getByRole('button', { name: 'Load Granted application scenario' }).click();
  await expect(page.getByText('Session scenario')).toBeVisible();

  await page.goto('/start');
  await expect(page.locator('main').getByText(personalId, { exact: true }).first()).toBeVisible();
  await expect(page.locator('main').getByText('Saved on this device', { exact: true })).toBeVisible();
});

test('starting again asks before replacing the saved record', async ({ page }) => {
  await page.goto('/start');
  await page.getByRole('button', { name: 'Start an e-Visa demo' }).click();
  const firstId = page.url().match(/DEMO\d{4}E\d{5}/)?.[0];
  await page.goto('/start');

  await page.getByRole('button', { name: 'Start an e-Visa demo' }).click();
  const dialog = page.getByRole('dialog', { name: 'Replace the saved demo application?' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Go back' }).click();
  await expect(page.locator('main').getByText(firstId, { exact: true }).first()).toBeVisible();
});

test('a meaningful old draft is adopted with a stable reference', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('bharat-visa-drafts', JSON.stringify({
      submitted: false,
      data: {
        application_type: 'evisa',
        visa_category: 'tourist',
        given_name: 'Fictional',
      },
      docs: [],
    }));
  });
  await page.goto('/start');

  await expect(page.locator('main').getByText('Saved on this device', { exact: true })).toBeVisible();
  const savedId = await page.locator('main .numeric').first().textContent();
  expect(savedId).toMatch(/^DEMO\d{4}E\d{5}$/);
  const storage = await page.evaluate(() => ({
    current: JSON.parse(localStorage.getItem('visaseva.app.v1')),
    legacy: localStorage.getItem('bharat-visa-drafts'),
  }));
  expect(storage.current.id).toBe(savedId);
  expect(storage.legacy).toBeNull();
});

test('print media removes the service chrome from the demo record', async ({ page }) => {
  await page.goto('/application/DEMO2026E00005/print');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Demo application record');
  await page.emulateMedia({ media: 'print' });
  const chromeIsHidden = await page.locator('.no-print').evaluateAll((elements) =>
    elements.every((element) => getComputedStyle(element).display === 'none'));
  expect(chromeIsHidden).toBe(true);
});
