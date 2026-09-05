import { resolveNationality, searchNationalities, normalizeCountry } from './countries.js';
import { applyFinderAnswer, applicationFromFinder, firstUnansweredStep, isValidFinderAnswer } from './finderSession.js';
import { evaluateVisaRoute, getFinderQuestions } from './visaEligibility.js';
import { getRequiredDocuments } from './documentRequirements.js';

export const ASSISTANT_ACTIONS = [
  { label: 'Find my visa', name: 'find_route' },
  { label: 'My documents', name: 'check_documents' },
  { label: 'Resume application', name: 'resume_application' },
  { label: 'Check progress', name: 'check_progress' },
];

const hasApplication = (state) => Boolean(state.data?.nationality || state.data?.given_name || state.submitted);
export const nextAssistantQuestion = (state) => getFinderQuestions(state.finder.answers)[firstUnansweredStep(state.finder.answers)];

export function interpretAssistantInput(text, { state, guiding = false }) {
  const input = text.trim().toLowerCase();
  if (/\b(download|export)\b.*\b(checklist|documents)\b/.test(input)) return { name: 'download_checklist' };
  if (/\b(documents?|checklist|uploads?)\b/.test(input) && !guiding) return { name: 'check_documents' };
  if (/\b(resume|continue)\b.*\b(application|draft)\b/.test(input)) return { name: 'resume_application' };
  if (/\b(status|progress)\b/.test(input)) return { name: 'check_progress' };
  if (/\b(e[ -]?arrival|arrival card)\b/.test(input)) return { name: 'open_arrival' };
  if (/\b(funds?|money|balance)\b/.test(input)) return { name: 'explain_funds' };
  if (/^(find|check|help me find|which|what)\b.*\b(visa|route|eligible|eligibility)\b/.test(input)) return { name: 'find_route' };
  if (/^(open|show|view|continue to)\b.*\b(route|result)\b/.test(input)) return { name: 'open_route' };
  if (/^(edit|change) (my )?answers?$/.test(input)) return { name: 'edit_answers' };
  if (/^(stop|cancel|menu|help)$/.test(input)) return { name: 'help' };

  if (guiding) {
    const question = nextAssistantQuestion(state);
    if (!question) return { name: 'find_route' };
    let value;
    if (question.type === 'country_select') {
      const countryInput = input.replace(/^(i am from|i'm from|my passport is from|passport from|i hold a passport from)\s+/i, '');
      value = resolveNationality(countryInput);
      if (!value) return { name: 'country_choices', args: { query: countryInput } };
    } else if (question.type === 'number') {
      const match = input.match(/^(?:for |i plan to stay |i will stay )?(\d+)\s*(?:days?)?$/);
      value = match?.[1];
    } else {
      const normalized = normalizeCountry(input);
      value = question.options.find((option) => normalizeCountry(option.label) === normalized || normalizeCountry(option.value) === normalized)?.value;
      if (question.id === 'voaArrivalPort') value = { yes: 'designated', no: 'other' }[input] || value;
      if (question.id === 'purpose') value = ({ holiday: 'tourism', tourist: 'tourism', vacation: 'tourism', work: 'employment', student: 'study' })[input] || value;
    }
    return value && isValidFinderAnswer(question, value)
      ? { name: 'answer_finder', args: { id: question.id, value } }
      : { name: 'clarify_answer' };
  }
  return { name: 'help' };
}

const routeReply = (state) => {
  const question = nextAssistantQuestion(state);
  if (question) return { text: 'Let’s find your route. Your answers also appear in the visa finder.', guiding: true };
  const result = evaluateVisaRoute(state.finder.answers);
  return { text: `${result.type}. ${result.description}`, guiding: false, actions: [{ label: 'Open my visa route', name: 'open_route' }, { label: 'Edit answers', name: 'edit_answers' }] };
};

export function documentChecklist(state) {
  if (!hasApplication(state)) return null;
  if (state.data.application_type === 'voa') return [
    { title: 'Completed Annexure I form', detail: 'Print and sign for presentation at the airport.', status: 'Prepare' },
    { title: 'Passport', detail: 'At least six months of validity.', status: 'Prepare' },
    { title: 'Return or onward ticket and funds', detail: 'Enough money for your entire stay; no fixed minimum balance is published.', status: 'Prepare' },
    { title: 'e-Arrival Card', detail: 'Submit within 72 hours before arrival.', status: 'Prepare' },
  ];
  return getRequiredDocuments(state.data).map((requirement) => ({
    title: requirement.title,
    detail: `${requirement.desc} ${requirement.rule}`,
    status: state.docs?.some((doc) => doc.type === requirement.type && doc.status === 'selected-this-session') ? 'File chosen' : 'Needed',
  }));
}

// Only these tools can change app state or navigate. Free text never becomes
// a URL, arbitrary field update, script, payment or government submission.
export function runAssistantTool(tool, { state, updateFinder, updateState, navigate, download }) {
  switch (tool.name) {
    case 'find_route': return routeReply(state);
    case 'answer_finder': {
      const question = nextAssistantQuestion(state);
      if (!question || question.id !== tool.args?.id || !isValidFinderAnswer(question, tool.args.value)) return { text: 'That answer no longer matches the current question. Please choose again.', guiding: true };
      const finder = applyFinderAnswer(state.finder, question.id, tool.args.value);
      finder.step = Math.min(firstUnansweredStep(finder.answers), getFinderQuestions(finder.answers).length - 1);
      const nextState = { ...state, finder };
      const reply = routeReply(nextState);
      finder.showResult = !reply.guiding;
      updateFinder(finder);
      return { ...reply, text: reply.guiding ? 'Answer saved.' : reply.text };
    }
    case 'country_choices': {
      const matches = searchNationalities(tool.args?.query || '').slice(0, 6);
      return { text: matches.length ? 'Choose your passport country.' : 'I could not find that country. Try its full name or an abbreviation such as UAE.', guiding: true, actions: matches.map((country) => ({ label: country, name: 'answer_finder', args: { id: 'passport', value: country } })) };
    }
    case 'open_route': {
      if (nextAssistantQuestion(state)) return { text: 'Finish these questions first so I can choose the right route.', guiding: true };
      const result = evaluateVisaRoute(state.finder.answers);
      const handoff = applicationFromFinder(state, state.finder.answers, result);
      if (handoff) updateState(handoff);
      updateFinder({ showResult: true });
      navigate(result.path);
      return { text: `Opened your ${result.type} guide with your answers filled in.`, guiding: false };
    }
    case 'edit_answers':
      updateFinder({ step: 0, showResult: false });
      navigate('/guide/visa-finder?step=passport');
      return { text: 'Opened your saved answers. Select an answer to edit it.', guiding: false };
    case 'resume_application':
      if (!hasApplication(state)) return { text: 'Find your visa route to start an application.', actions: [ASSISTANT_ACTIONS[0]] };
      navigate('/apply');
      return { text: state.submitted ? 'Opened your prepared application.' : 'Opened your application where you left off.', guiding: false };
    case 'check_progress': {
      if (!hasApplication(state)) return { text: 'You haven’t started an application yet.', actions: [ASSISTANT_ACTIONS[0]] };
      const status = state.submitted ? 'Your application is ready to review.' : `Your draft is at step ${state.step + 1}.`;
      return { text: status, actions: [{ name: 'open_dashboard', label: 'Open my dashboard' }, { name: 'open_status', label: 'Visa status options' }] };
    }
    case 'check_documents': {
      const items = documentChecklist(state);
      if (!items) return { text: 'Find your visa route first so I can build the right document checklist.', actions: [ASSISTANT_ACTIONS[0]] };
      return { text: `Here is the checklist for your ${state.data.application_type === 'voa' ? 'arrival' : 'application'}.`, items, actions: [{ name: 'download_checklist', label: 'Download checklist' }, { name: 'resume_application', label: 'Continue application' }] };
    }
    case 'download_checklist': {
      const items = documentChecklist(state);
      if (!items) return { text: 'Find your visa route first to create a checklist.', actions: [ASSISTANT_ACTIONS[0]] };
      const content = ['Visa Seva document checklist', `Route: ${state.data.application_type}`, `Category: ${state.data.visa_category || 'Choose on the official portal'}`, '', ...items.map((item) => `[${item.status}] ${item.title}\n${item.detail}\n`), 'Confirm the latest category requirements on the official portal: https://indianvisaonline.gov.in/'].join('\n');
      download('visa-seva-checklist.txt', content);
      return { text: 'Your document checklist download is ready.' };
    }
    case 'open_dashboard': navigate('/dashboard'); return { text: 'Opened your application dashboard.', guiding: false };
    case 'open_status': navigate('/status'); return { text: 'Opened visa status options.', guiding: false };
    case 'open_arrival': navigate('/e-arrival'); return { text: 'Opened the e-Arrival Card guide.', guiding: false };
    case 'explain_funds': return { text: 'You need enough money for accommodation, meals and travel throughout your stay, plus a return or onward ticket. The official guidance does not publish a fixed minimum bank balance.', link: { label: 'Official travel requirements', url: 'https://indianvisaonline.gov.in/evisa/tvoa.html' } };
    case 'clarify_answer': return { text: 'Please choose one of the answers below or enter a valid number of days.', guiding: true };
    default: return { text: 'I can find your visa route, save your answers, check required documents and open your draft. Choose an action below.', guiding: false, actions: ASSISTANT_ACTIONS };
  }
}
