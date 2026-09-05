import assert from 'node:assert/strict';
import { test } from 'node:test';
import { interpretAssistantInput, nextAssistantQuestion, runAssistantTool } from '../src/domain/visaAssistant.js';

function session() {
  const calls = { navigations: [], downloads: [] };
  const context = {
    state: { data: {}, docs: [], step: 0, finder: { answers: {}, step: 0 } },
    updateFinder(value) { this.state.finder = { ...this.state.finder, ...value }; },
    updateState(value) { this.state = { ...this.state, ...value }; },
    navigate(path) { calls.navigations.push(path); },
    download(name, body) { calls.downloads.push({ name, body }); },
  };
  context.updateFinder = context.updateFinder.bind(context);
  context.updateState = context.updateState.bind(context);
  return { context, calls };
}

test('chat saves a complete UAE journey and opens its actual arrival flow', () => {
  const { context, calls } = session();
  for (const text of ['U.A.E.', 'ordinary', 'no', 'tourism', '12 days', 'yes', 'yes', 'no', 'yes', 'yes']) {
    const tool = interpretAssistantInput(text, { state: context.state, guiding: true });
    assert.equal(tool.name, 'answer_finder', text);
    runAssistantTool(tool, context);
  }
  assert.equal(nextAssistantQuestion(context.state), undefined);
  assert.equal(context.state.finder.showResult, true);
  runAssistantTool({ name: 'open_route' }, context);
  assert.deepEqual(calls.navigations, ['/flow/voa']);
  assert.equal(context.state.data.nationality, 'United Arab Emirates');
  const result = runAssistantTool({ name: 'check_documents' }, context);
  assert.ok(result.items.some((item) => /Annexure I/.test(item.title)));
  runAssistantTool({ name: 'download_checklist' }, context);
  assert.match(calls.downloads[0].body, /Annexure I/);
});

test('partial answers never initialize an application or assert eligibility', () => {
  const { context, calls } = session();
  const reply = runAssistantTool({ name: 'open_route' }, context);
  assert.equal(reply.guiding, true);
  assert.deepEqual(calls.navigations, []);
  assert.deepEqual(context.state.data, {});
});

test('unsupported requests and stale answer buttons cannot run arbitrary actions', () => {
  const { context, calls } = session();
  runAssistantTool({ name: 'submit_application', args: { url: 'https://example.com' } }, context);
  runAssistantTool({ name: 'answer_finder', args: { id: 'travelReadiness', value: 'yes' } }, context);
  assert.deepEqual(calls.navigations, []);
  assert.deepEqual(context.state.finder.answers, {});
  assert.equal(interpretAssistantInput('pay my visa fee', { state: context.state }).name, 'help');
});

test('resume and progress use the saved application without changing fields', () => {
  const { context, calls } = session();
  context.state.data = { nationality: 'Japan', application_type: 'voa', given_name: 'EXAMPLE' };
  context.state.step = 3;
  runAssistantTool({ name: 'resume_application' }, context);
  assert.equal(calls.navigations[0], '/apply');
  assert.equal(context.state.step, 3);
  assert.match(runAssistantTool({ name: 'check_progress' }, context).text, /step 4/);
});

test('document status respects re-selection after reload', () => {
  const { context } = session();
  context.state.data = { nationality: 'France', application_type: 'evisa', visa_category: 'tourist' };
  context.state.docs = [{ type: 'passport', status: 'needs-reselection' }];
  const reply = runAssistantTool({ name: 'check_documents' }, context);
  assert.equal(reply.items.find((item) => item.title === 'Passport bio page').status, 'Needed');
});
