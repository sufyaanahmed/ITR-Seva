import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { reference } from "./reference.js";
import { answerSchema } from "./rules.js";
import { ApiError } from "./service.js";
export async function handleMcp(req, res, service, config) {
  const server = new McpServer({ name: "visa-seva", version: "1.0.0" });
  const actor = req.actor;
  const run = (scope, fn) => async (args) => {
    try {
      if (scope && (!actor || !actor.scopes?.includes(scope)))
        throw new ApiError(
          403,
          `Authorize the ${scope} permission in Visa Seva.`,
        );
      const result = await fn(args);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, (key, value) =>
              key === "path" ? undefined : value,
            ),
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [{ type: "text", text: error.message }],
      };
    }
  };
  const tool = (name, description, inputSchema, scope, fn, readOnly = false) =>
    server.registerTool(
      name,
      {
        description,
        inputSchema,
        annotations: {
          readOnlyHint: readOnly,
          destructiveHint: false,
          openWorldHint: false,
        },
      },
      run(scope, fn),
    );
  const id = z.string().uuid();
  const version = z.number().int().positive();
  tool(
    "visa_information",
    "Get focused categories, eligibility, document requirements, fees, or application steps with official sources.",
    {
      topic: z.enum([
        "categories",
        "eligibility",
        "documents",
        "fees",
        "steps",
      ]),
      answers: z.record(z.string(), z.any()).optional(),
    },
    null,
    ({ topic, answers }) => reference(topic, answers),
    true,
  );
  tool(
    "create_application",
    "Create an authorized draft. Reuse draft_key on retries.",
    { answers: answerSchema, draft_key: z.string().min(8).max(100) },
    "drafts:write",
    (a) => service.create(actor, a.answers, a.draft_key),
  );
  tool(
    "read_application",
    "Read an owned application and its outstanding requests. Document download paths are withheld.",
    { id },
    "applications:read",
    async (a) => {
      const result = await service.get(actor, a.id);
      return {
        ...result,
        documents: result.documents.map(({ path, ...d }) => d),
      };
    },
    true,
  );
  tool(
    "update_draft",
    "Replace draft answers using the version last read. Editing invalidates earlier confirmation.",
    { id, version, answers: answerSchema },
    "drafts:write",
    (a) => service.update(actor, a.id, a.answers, a.version),
  );
  tool(
    "validate_application",
    "Identify missing fields or documents using the same rules as the website.",
    { id },
    "applications:read",
    (a) => service.validate(actor, a.id),
    true,
  );
  tool(
    "prepare_confirmation",
    "Present the complete application to the user for review. The user must open the link and explicitly confirm; this tool does not grant approval.",
    { id },
    "applications:read",
    async (a) => {
      const app = await service.get(actor, a.id);
      return {
        reference: app.reference,
        answers: app.answers,
        validation: await service.validate(actor, a.id),
        confirmation_url: `${config.publicUrl}/applications/${a.id}`,
      };
    },
    true,
  );
  tool(
    "submit_application",
    "Submit only after the applicant has confirmed this exact version on the website and completed checkout.",
    { id, version },
    "applications:submit",
    (a) => service.submit(actor, a.id, a.version),
  );
  tool(
    "application_status",
    "Read status, payment status, and requests for additional information.",
    { id },
    "applications:read",
    async (a) => {
      const app = await service.get(actor, a.id);
      return {
        reference: app.reference,
        status: app.status,
        payment_status: app.payment_status,
        history: app.history,
      };
    },
    true,
  );
  tool(
    "create_checkout",
    "Create a secure checkout link after confirmation. Payment must be authorized by the user in the browser. Never ask for card details.",
    { id, version, request_key: z.string().min(8).max(100) },
    "checkout:create",
    (a) => service.checkout(actor, a.id, a.version, a.request_key),
  );
  tool(
    "payment_status",
    "Check the result of checkout without accepting payment information.",
    { id },
    "applications:read",
    async (a) => {
      const app = await service.get(actor, a.id);
      return { status: app.payment_status, payments: app.payments };
    },
    true,
  );
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  res.on("close", () => {
    transport.close();
    server.close();
  });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
}
