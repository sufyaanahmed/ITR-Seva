import { test } from "node:test";
import assert from "node:assert/strict";
import { validateFile } from "../src/domain/documentValidation.js";
import { getRequiredDocuments } from "../src/domain/documentRequirements.js";

test("uploads enforce platform limits even when the route has no published byte limit", async () => {
  const requirement = getRequiredDocuments({
    application_type: "afghan",
    visa_category: "medical",
  }).find((d) => d.extensions.includes("pdf"));
  const file = {
    name: "hospital.pdf",
    type: "application/pdf",
    size: 10 * 1024 * 1024,
  };
  assert.equal(requirement.maxBytes, null);
  assert.deepEqual(await validateFile(file, requirement), { extension: "pdf" });
  assert.match(
    await validateFile({ ...file, size: file.size + 1 }, requirement),
    /10 MB/,
  );
  assert.match(
    await validateFile({ ...file, size: 0 }, requirement),
    /not empty/,
  );
  assert.match(
    await validateFile({ ...file, name: "hospital.exe" }, requirement),
    /Choose a PDF/,
  );
  assert.match(
    await validateFile({ ...file, type: "text/plain" }, requirement),
    /does not match/,
  );
});

test("e-Visa document limits still apply below the platform cap", async () => {
  const requirement = getRequiredDocuments({
    application_type: "evisa",
    visa_category: "tourist",
  }).find((d) => d.extensions.includes("pdf"));
  const file = {
    name: "passport.pdf",
    type: "application/pdf",
    size: 301 * 1024,
  };
  assert.match(await validateFile(file, requirement), /300 KB/);
  assert.match(
    await validateFile({ ...file, size: 1024 }, requirement),
    /10 KB/,
  );
});
