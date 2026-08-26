import { describe, expect, it } from 'vitest';
import {
  ROUTES, REDIRECTS, byId, crumbs, navRoutes, pageTitle, routeForPath,
} from './routes.js';

describe('route registry', () => {
  it('has unique IDs and paths, with a single final catch-all', () => {
    expect(new Set(ROUTES.map((route) => route.id)).size).toBe(ROUTES.length);
    expect(new Set(ROUTES.map((route) => route.path)).size).toBe(ROUTES.length);
    expect(ROUTES.filter((route) => route.path === '*')).toHaveLength(1);
    expect(ROUTES.at(-1).path).toBe('*');
  });

  it('keeps navigation and breadcrumb metadata internally valid', () => {
    for (const route of ROUTES) {
      expect(route.title, route.id).toBeTruthy();
      expect(route.heading, route.id).toBeTruthy();
      expect(route.description.length, route.id).toBeGreaterThan(20);
      if (route.parent) expect(byId[route.parent], route.id).toBeTruthy();
      for (const location of route.nav ?? []) expect(['header', 'footer']).toContain(location);
    }
    expect(navRoutes('header').every((route) => route.nav.includes('header'))).toBe(true);
    expect(crumbs('application-stage').map((route) => route.id)).toEqual([
      'home', 'application', 'application-stage',
    ]);
  });

  it('matches static, parameterised, root and unknown paths', () => {
    expect(routeForPath('/').id).toBe('home');
    expect(routeForPath('/find/q/4/').id).toBe('find');
    expect(routeForPath('/application/DEMO2026E00005/status').id).toBe('application-status');
    expect(routeForPath('/definitely-not-a-page').id).toBe('not-found');
  });

  it('provides meaningful prototype page titles', () => {
    expect(pageTitle(byId.home)).toMatch(/Visa-Seva.*Prototype/);
    expect(pageTitle(byId.track)).toBe('Track an application — Visa-Seva (Prototype)');
    expect(pageTitle(null)).toBe('Visa-Seva — Prototype');
  });

  it('redirects only from unique old paths to registered destinations', () => {
    expect(new Set(REDIRECTS.map((redirect) => redirect.from)).size).toBe(REDIRECTS.length);
    for (const { from, to } of REDIRECTS) {
      expect(from.startsWith('/')).toBe(true);
      expect(routeForPath(to).id, `${from} -> ${to}`).not.toBe('not-found');
    }
  });

  it('can import every registered route component', async () => {
    const results = await Promise.allSettled(ROUTES.map((route) => route.component()));
    const failures = results.flatMap((result, index) => result.status === 'rejected'
      ? [`${ROUTES[index].id}: ${result.reason?.message ?? result.reason}`]
      : []);
    expect(failures).toEqual([]);
    for (const result of results) {
      if (result.status === 'fulfilled') expect(result.value.default).toBeTypeOf('function');
    }
  });
});
