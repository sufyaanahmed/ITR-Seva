import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import React from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";

test("public routes render and reference existing local images", async () => {
  const server = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  try {
    const { StoreProvider } = await server.ssrLoadModule("/src/store.jsx");
    for (const page of [
      "Home",
      "Help",
      "Tourism",
      "EArrival",
      "Resume",
      "Reviews",
      "NotFound",
      "flows/RegularFlow",
      "flows/NormalFlow",
      "flows/AfghanFlow",
      "flows/VoaFlow",
      "guide/VisaFinder",
    ]) {
      const { default: Page } = await server.ssrLoadModule(
        `/src/pages/${page}.jsx`,
      );
      const html = renderToString(
        React.createElement(
          MemoryRouter,
          {},
          React.createElement(StoreProvider, {}, React.createElement(Page)),
        ),
      );
      assert.ok(html.length > 100, `${page} should render content`);
      for (const [, src] of html.matchAll(/<img[^>]*src="(\/[^"?]+)"/g))
        assert.ok(existsSync(`public${src}`), `${page}: missing image ${src}`);
    }
  } finally {
    await server.close();
  }
});
