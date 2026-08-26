import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('critical public-service smoke', () => {
  test('machine-readable discovery documents are served and explicit about safety', async ({ request }) => {
    const [agent, llms] = await Promise.all([request.get('/agent.md'), request.get('/llms.txt')]);
    expect(agent.ok()).toBe(true);
    expect(llms.ok()).toBe(true);
    const agentText = await agent.text();
    const llmsText = await llms.text();
    expect(agentText).toContain('# Visa-Seva: agent interface');
    expect(agentText).toContain('not an official Government of India service');
    expect(agentText).toContain('/application/:appId/status');
    expect(llmsText).toContain('[Complete agent interface](/agent.md)');
  });

  test('home is identifiable, keyboard reachable, and free of serious axe findings', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Visa-Seva/i);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/not an official/i).first()).toBeVisible();

    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: /skip/i });
    await expect(skip).toBeFocused();
    await skip.press('Enter');
    await expect(page.locator('#main')).toBeFocused();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact)))
      .toEqual([]);
  });

  test('mobile home and finder do not overflow horizontally', async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.includes('mobile'), 'Mobile reflow assertion');
    for (const path of ['/', '/find/q/1']) {
      await page.goto(path);
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
      }));
      expect(dimensions.content, path).toBeLessThanOrEqual(dimensions.viewport);
    }
  });

  test('mobile accessibility and Data Saver preferences remain usable', async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.includes('mobile'), 'Mobile preference reflow assertion');
    await page.goto('/demo');
    await page.getByRole('button', { name: 'Apply review mode' }).click();
    await page.getByRole('button', { name: 'Turn Data Saver on' }).click();

    await expect(page.locator('html')).toHaveAttribute('data-text-size', 'x-large');
    await expect(page.locator('html')).toHaveAttribute('data-contrast', 'high');
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
    await expect(page.locator('html')).toHaveAttribute('data-saver', 'on');

    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);

    await page.goto('/discover-india');
    await expect(page.getByText(/image not loaded in Data Saver mode/i).first()).toBeVisible();
  });

  test('unknown routes offer a visible recovery path', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/not|here/i);
    await expect(page.getByRole('link', { name: /home|start/i }).first()).toBeVisible();
  });
});
