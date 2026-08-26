import { test, expect } from '@playwright/test';

test('a seeded tracking lookup activates the record and keeps real IDs in breadcrumbs', async ({ page }) => {
  await page.goto('/track');
  await page.getByLabel('Application reference').fill('DEMO2026E00005');
  await page.getByLabel('Access code').fill('AN47-KPAN');
  await page.getByRole('button', { name: 'Check demo status' }).click();

  await expect(page).toHaveURL(/\/application\/DEMO2026E00005\/status$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Granted');
  await expect(page.getByText('Application DEMO2026E00005', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })
    .getByRole('link', { name: 'Your application' }))
    .toHaveAttribute('href', '/application/DEMO2026E00005');
});
