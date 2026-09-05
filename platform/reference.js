import {
  VISA_RULESET,
  EVISA_CATEGORIES,
} from "../src/data/visaEligibilityRules.js";
import {
  evaluateVisaRoute,
  getFinderQuestions,
} from "../src/domain/visaEligibility.js";
import { getSteps } from "../src/domain/applicationForm.js";
import { getRequiredDocuments } from "../src/domain/documentRequirements.js";
export function reference(topic, answers = { application_type: "evisa" }) {
  const common = {
    reviewedDate: VISA_RULESET.reviewedDate,
    sources: VISA_RULESET.sources,
  };
  if (topic === "categories")
    return {
      ...common,
      categories: EVISA_CATEGORIES,
      routes: ["evisa", "regular", "afghan", "voa"],
    };
  if (topic === "eligibility")
    return {
      ...common,
      questions: getFinderQuestions(answers)
        .filter((q) => !q.when || q.when(answers))
        .map(({ when, ...q }) => q),
      recommendation: evaluateVisaRoute(answers),
    };
  if (topic === "documents")
    return { ...common, documents: getRequiredDocuments(answers) };
  if (topic === "steps")
    return {
      ...common,
      steps: getSteps(answers.application_type, answers).map((s) => ({
        id: s.id,
        title: s.title,
        fields: s.fields
          ?.filter((f) => !f.visible || f.visible(answers))
          .map((f) => ({
            name: f.name,
            label: f.label,
            type: f.type,
            options: f.options,
            required:
              typeof f.required === "function"
                ? f.required(answers)
                : f.required !== false,
          })),
      })),
    };
  return {
    ...common,
    fees: {
      note: "Government fees depend on nationality, category, and visa duration. Check the official portal for the applicable fee. Sandbox checkout uses a separate test amount.",
      source: "https://indianvisaonline.gov.in/evisa/tvoa.html",
    },
  };
}
