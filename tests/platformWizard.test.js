import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
import React from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { getSteps } from "../src/domain/applicationForm.js";
import { VISA_RULESET } from "../src/data/visaEligibilityRules.js";
test("every wizard step renders after shared form extraction, including final declarations", async () => {
  const server = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  try {
    const { default: Wizard } = await server.ssrLoadModule(
      "/src/pages/Wizard.jsx",
    );
    const { StoreProvider } = await server.ssrLoadModule("/src/store.jsx");
    for (const type of ["regular", "evisa", "voa", "afghan"]) {
      const data = {
        application_type: type,
        visa_category: type === "afghan" ? "medical" : "tourist",
        eligibility_ruleset_id: VISA_RULESET.id,
        nationality: type === "afghan" ? "Afghanistan" : "Canada",
      };
      for (const [index, step] of getSteps(type, data).entries()) {
        const snapshot = {
          data,
          step: index,
          furthestStep: index,
          docs: [],
          submitted: false,
        };
        globalThis.sessionStorage = { getItem: () => JSON.stringify(snapshot) };
        const html = renderToString(
          React.createElement(
            MemoryRouter,
            {},
            React.createElement(StoreProvider, {}, React.createElement(Wizard)),
          ),
        );
        assert.ok(
          html.includes(step.title.replaceAll("&", "&amp;")),
          `${type}/${step.id} should render`,
        );
      }
    }
  } finally {
    delete globalThis.sessionStorage;
    await server.close();
  }
});
