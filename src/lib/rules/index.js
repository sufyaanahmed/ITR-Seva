/**
 * The visa-path rules engine.
 *
 * Design constraints, in priority order:
 *
 *  1. NEVER default to e-Visa. The previous version of this prototype told
 *     every unmatched traveller they were "eligible for a quick, online
 *     e-Visa" — including nationalities the official list does not cover.
 *     The final rule here returns NEEDS_OFFICIAL_REVIEW instead.
 *  2. Exclusions are evaluated before permissions. A rule that stops someone
 *     always runs before a rule that encourages them.
 *  3. Every rule cites a source and carries the date a human read it.
 *  4. The engine describes what the published rules say. It never says a
 *     person is eligible — only the Bureau of Immigration or an Indian
 *     Mission decides that.
 */

import { SOURCES, REVIEWED_AT } from './sources.js';
import {
  EVISA_ELIGIBLE, EVISA_SUBTYPES, EVISA_EXCLUSIONS, VOA, AFGHAN,
  NATIONALITY_ALIASES,
} from './reference.js';

export const RULESET_VERSION = '1.0.0';

/** The four things the finder may conclude. Nothing else is a valid outcome. */
export const OUTCOME = {
  LIKELY_PATH: 'LIKELY_PATH',
  NEEDS_OFFICIAL_REVIEW: 'NEEDS_OFFICIAL_REVIEW',
  NOT_AVAILABLE_ONLINE: 'NOT_AVAILABLE_ONLINE',
  INSUFFICIENT_INFORMATION: 'INSUFFICIENT_INFORMATION',
};

/** The questions the finder asks, in order. Drives both UI and agent schema. */
export const QUESTIONS = [
  {
    id: 'nationality',
    legend: 'Which passport will you travel on?',
    hint: 'Choose the country that issued the passport you will actually carry.',
    why: 'India publishes different routes for different passports. This is the single answer that changes the most.',
    type: 'nationality',
  },
  {
    id: 'passportType',
    legend: 'What kind of passport is it?',
    hint: 'Most travellers hold an ordinary passport.',
    why: 'The online system only accepts ordinary passports. Diplomatic, official and other travel documents go through an Indian Mission instead.',
    type: 'radio',
    options: [
      { value: 'ordinary', label: 'An ordinary passport' },
      { value: 'diplomatic', label: 'A diplomatic or official passport' },
      { value: 'endorsed', label: "I am endorsed on a parent's or spouse's passport" },
      { value: 'other-document', label: 'A travel document that is not a passport' },
    ],
  },
  {
    id: 'purpose',
    legend: 'Why are you travelling to India?',
    hint: 'Choose the main reason. If two apply, choose the one you will spend most time on.',
    why: 'A visa permits particular activities. Travelling on the wrong one causes problems at the border, not just on the form.',
    type: 'radio',
    options: [
      { value: 'tourism', label: 'Tourism, or visiting friends and family' },
      { value: 'business', label: 'Business meetings or trade' },
      { value: 'conference', label: 'A conference, seminar or workshop' },
      { value: 'medical', label: 'Medical treatment' },
      { value: 'medical-attendant', label: 'Accompanying someone having medical treatment' },
      { value: 'study', label: 'Study' },
      { value: 'work', label: 'Work or employment' },
      { value: 'journalism', label: 'Journalism or filming' },
      { value: 'transit', label: 'Passing through on the way somewhere else' },
    ],
  },
  {
    id: 'stayLength',
    legend: 'How long will you stay in India?',
    hint: 'Your longest single visit, not the total across several trips.',
    why: 'Stays beyond 180 days change which visa applies and add a registration step after you arrive.',
    type: 'radio',
    options: [
      { value: 'under-60', label: 'Up to 60 days' },
      { value: '60-to-180', label: 'Between 60 and 180 days' },
      { value: 'over-180', label: 'More than 180 days' },
    ],
  },
  {
    id: 'pakistaniConnection',
    legend: 'Were you, your parents or your grandparents born in Pakistan, or ever resident there?',
    hint: 'Answer for yourself and for both sides of your family.',
    why: 'The official rules treat this differently, and both the e-Visa and Visa on Arrival pages say so explicitly. Answering honestly sends you to the right place first time.',
    type: 'radio',
    options: [
      { value: 'no', label: 'No' },
      { value: 'yes', label: 'Yes, or I am not sure' },
    ],
  },
  {
    id: 'priorIndianVisa',
    legend: 'Have you held an Indian visa before?',
    hint: 'An e-Visa or a regular paper visa both count.',
    why: 'For UAE nationals this decides whether Visa on Arrival is available at all. For everyone else it is simply useful context.',
    type: 'radio',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No, this would be my first' },
    ],
  },
];

export const QUESTION_IDS = QUESTIONS.map((q) => q.id);

/** Which e-Visa sub-types cover a given purpose, if any. */
function subtypesFor(purpose) {
  return EVISA_SUBTYPES.filter((s) => s.purpose === purpose);
}

export function isEvisaEligibleNationality(nationality) {
  if (!nationality) return false;
  const canonical = NATIONALITY_ALIASES[nationality.trim().toLowerCase()] || nationality.trim();
  return EVISA_ELIGIBLE.some((c) => c.toLowerCase() === canonical.toLowerCase());
}

const PURPOSE_LABEL = Object.fromEntries(
  QUESTIONS.find((q) => q.id === 'purpose').options.map((o) => [o.value, o.label.toLowerCase()]),
);

/**
 * Rules are evaluated in array order. The first whose `when` returns true wins.
 * Order is deliberate: everything that stops or redirects a traveller comes
 * before anything that encourages them.
 */
export const RULES = [
  {
    id: 'passport-diplomatic',
    version: RULESET_VERSION,
    source: SOURCES.evisa,
    reviewedAt: REVIEWED_AT,
    coverage: 'complete',
    rationale:
      'The official e-Visa page states the facility is not available to diplomatic or official passport holders, or to laissez-passer holders. The Visa on Arrival page excludes them too.',
    when: (a) => a.passportType === 'diplomatic',
    outcome: () => ({
      kind: OUTCOME.NEEDS_OFFICIAL_REVIEW,
      headline: 'A diplomatic or official passport goes through a Mission',
      summary:
        'Neither the online e-Visa system nor Visa on Arrival accepts diplomatic or official passports. That is a rule about the channel, not about you — your application is handled directly by an Indian Mission or Post, usually through your own foreign ministry.',
      conditions: [EVISA_EXCLUSIONS.find((e) => e.id === 'diplomatic-passport').detail],
      officialUrl: SOURCES.categories.url,
      officialLabel: 'See the regular visa categories',
    }),
  },
  {
    id: 'passport-endorsed',
    version: RULESET_VERSION,
    source: SOURCES.evisa,
    reviewedAt: REVIEWED_AT,
    coverage: 'complete',
    rationale:
      'The official e-Visa page states the facility is not available to individuals endorsed on a parent\'s or spouse\'s passport; each applicant needs their own passport.',
    when: (a) => a.passportType === 'endorsed',
    outcome: () => ({
      kind: OUTCOME.NOT_AVAILABLE_ONLINE,
      headline: 'You will need a passport of your own first',
      summary:
        'The online system needs one passport per traveller, so an endorsement on a parent’s or spouse’s passport cannot be used to apply. Getting your own passport issued is the step before this one. Once you have it, come back and start again.',
      conditions: [EVISA_EXCLUSIONS.find((e) => e.id === 'endorsed-passport').detail],
      officialUrl: SOURCES.categories.url,
      officialLabel: 'See the regular visa categories',
    }),
  },
  {
    id: 'passport-other-document',
    version: RULESET_VERSION,
    source: SOURCES.evisa,
    reviewedAt: REVIEWED_AT,
    coverage: 'complete',
    rationale:
      'The official e-Visa page states the facility is not available to holders of international travel documents other than a passport.',
    when: (a) => a.passportType === 'other-document',
    outcome: () => ({
      kind: OUTCOME.NEEDS_OFFICIAL_REVIEW,
      headline: 'A travel document that is not a passport needs a person to look at it',
      summary:
        'The online system only accepts passports. Travel documents issued to refugees, stateless people and others are considered case by case by an Indian Mission or Post. Go to them directly — it is the fastest route, not a detour.',
      conditions: [EVISA_EXCLUSIONS.find((e) => e.id === 'non-passport').detail],
      officialUrl: SOURCES.categories.url,
      officialLabel: 'Find an Indian Mission or Post',
    }),
  },
  {
    id: 'afghan-national',
    version: RULESET_VERSION,
    source: SOURCES.afghan,
    reviewedAt: REVIEWED_AT,
    coverage: 'complete',
    rationale:
      'The official portal provides a separate application route for Afghan nationals, listing six categories. Tourism is not among them.',
    when: (a) => normalise(a.nationality) === 'afghanistan',
    outcome: (a) => {
      const covered = {
        business: 'Business Visa',
        study: 'Student Visa',
        medical: 'Medical Visa',
        'medical-attendant': 'Medical Attendant Visa',
      }[a.purpose];
      if (covered) {
        return {
          kind: OUTCOME.LIKELY_PATH,
          headline: `The published rules point to the ${covered}`,
          summary:
            'Afghan nationals apply through a separate official portal, not the general e-Visa system. Of the six categories open there, the one matching your answers is shown above. This is where the published rules point — it is not a decision about your application.',
          route: 'afghan',
          conditions: AFGHAN.documents,
          notes: AFGHAN.notes,
          officialUrl: AFGHAN.portalUrl,
          officialLabel: 'Go to the Afghan nationals portal',
        };
      }
      return {
        kind: OUTCOME.NEEDS_OFFICIAL_REVIEW,
        headline: 'Your reason for travelling is not one of the six categories listed',
        summary:
          `Afghan nationals apply through a separate official portal, which lists six categories: ${AFGHAN.categories.join(', ')}. Travel for ${PURPOSE_LABEL[a.purpose] || 'this reason'} is not among them, so we will not guess which one applies. The portal itself, or an Indian Mission, can tell you.`,
        conditions: [
          'Tourism is not one of the categories currently listed for Afghan nationals.',
          'A National Identity Card (Tazkira) upload is mandatory for every listed category.',
        ],
        officialUrl: AFGHAN.portalUrl,
        officialLabel: 'Go to the Afghan nationals portal',
      };
    },
  },
  {
    id: 'pakistani-connection',
    version: RULESET_VERSION,
    source: SOURCES.evisa,
    reviewedAt: REVIEWED_AT,
    coverage: 'complete',
    rationale:
      'The e-Visa page excludes foreigners of Pakistani origin or holding a Pakistani passport. The Visa on Arrival page additionally excludes those whose parents or grandparents were born in or resident in Pakistan.',
    when: (a) => a.pakistaniConnection === 'yes' || normalise(a.nationality) === 'pakistan',
    outcome: () => ({
      kind: OUTCOME.NEEDS_OFFICIAL_REVIEW,
      headline: 'This one is decided by a person, not by a form',
      summary:
        'The published rules route applications with a Pakistani connection — by passport, by birth, or through parents or grandparents — to an Indian Mission or Post rather than through the online system. That is not a bad sign. It means the right person to answer you is a consular officer, and going to them first saves time rather than costing it.',
      conditions: [
        EVISA_EXCLUSIONS.find((e) => e.id === 'pakistani-origin').detail,
        VOA.exclusions[0],
        'A dedicated "Pakistan Specific" category exists among the regular visa categories.',
      ],
      officialUrl: SOURCES.categories.url,
      officialLabel: 'See the regular visa categories',
    }),
  },
  {
    id: 'purpose-no-online-route',
    version: RULESET_VERSION,
    source: SOURCES.categories,
    reviewedAt: REVIEWED_AT,
    coverage: 'complete',
    rationale:
      'No e-Visa sub-type covers employment or journalism. Both exist as separate regular visa categories (Work, Journalist), issued through an Indian Mission.',
    when: (a) => a.purpose === 'work' || a.purpose === 'journalism',
    outcome: (a) => ({
      kind: OUTCOME.NOT_AVAILABLE_ONLINE,
      headline:
        a.purpose === 'work'
          ? 'Working in India needs a Work Visa, and that is not an online route'
          : 'Journalism and filming need their own visa, applied for in person',
      summary:
        'There is no online sub-type for this. India issues it as one of its twelve regular visa categories through a Mission or Post abroad, where a person reviews the whole file. You will apply on paper or at a Visa Application Centre and your passport will be handled in person, so start earlier than you otherwise would.',
      conditions: [
        a.purpose === 'work'
          ? 'A "Work" category exists among the regular visa categories.'
          : 'A "Journalist" category exists among the regular visa categories.',
        'Travelling on a tourist visa to work or report is a serious problem at the border, not a paperwork shortcut.',
      ],
      officialUrl: SOURCES.categories.url,
      officialLabel: 'See the regular visa categories',
    }),
  },
  {
    id: 'stay-over-180',
    version: RULESET_VERSION,
    source: SOURCES.evisa,
    reviewedAt: REVIEWED_AT,
    coverage: 'complete',
    rationale:
      'The official e-Visa page caps a continuous stay at 180 days and requires FRRO/FRO registration beyond it. Longer stays are not an online e-Visa scenario.',
    when: (a) => a.stayLength === 'over-180',
    outcome: () => ({
      kind: OUTCOME.NEEDS_OFFICIAL_REVIEW,
      headline: 'A stay over 180 days is handled by a Mission',
      summary:
        'The online route caps a single continuous stay at 180 days, and staying longer means registering with the local Foreigners Regional Registration Office within two weeks of day 180. For a trip planned to run past that, apply through an Indian Mission or Post so the right visa is issued from the start.',
      conditions: [
        'A single continuous stay on an e-Visa must not exceed 180 days.',
        'Beyond 180 days, register with the FRRO or FRO within two weeks.',
      ],
      officialUrl: SOURCES.categories.url,
      officialLabel: 'See the regular visa categories',
    }),
  },
  {
    id: 'purpose-conference',
    version: RULESET_VERSION,
    source: SOURCES.evisa,
    reviewedAt: REVIEWED_AT,
    coverage: 'partial',
    rationale:
      'The official e-Visa page mentions attending a conference organised by a Ministry or Department of the Government of India within its general eligibility text, but publishes no distinct e-Conference sub-type. We will not invent one.',
    when: (a) => a.purpose === 'conference',
    outcome: () => ({
      kind: OUTCOME.NEEDS_OFFICIAL_REVIEW,
      headline: 'Conferences are mentioned, but no separate online type is published',
      summary:
        'The official page mentions conferences organised by a Government of India Ministry or Department within its e-Visa eligibility text, but it does not publish a distinct conference sub-type the way it does for tourism, business and medical travel. Rather than guess which one your event falls under, check with the organiser and the official portal — the organiser usually knows, because they have sent people through it before.',
      conditions: [
        'Whether an event qualifies depends on who is organising it.',
        'Visa on Arrival, where available, does list conference as a permitted purpose.',
      ],
      officialUrl: SOURCES.evisa.url,
      officialLabel: 'Read the official e-Visa page',
    }),
  },
  {
    id: 'evisa-eligible',
    version: RULESET_VERSION,
    source: SOURCES.evisa,
    reviewedAt: REVIEWED_AT,
    coverage: 'complete',
    rationale:
      'The nationality appears on the published e-Visa eligible list, and an e-Visa sub-type covers the stated purpose.',
    when: (a) => isEvisaEligibleNationality(a.nationality) && subtypesFor(a.purpose).length > 0,
    outcome: (a) => {
      const subtypes = subtypesFor(a.purpose);
      const primary = subtypes[0];
      return {
        kind: OUTCOME.LIKELY_PATH,
        headline: `The published rules point to the ${primary.name}`,
        summary:
          'Your passport is on the published e-Visa list and there is an online sub-type covering your reason for travelling. This is where the rules point — it is not a decision about your application, and only the Bureau of Immigration can make that, after you apply on the official portal.',
        route: 'evisa',
        subtypes,
        alsoVoa: voaAvailable(a),
        officialUrl: SOURCES.evisa.url,
        officialLabel: 'Read the official e-Visa rules',
      };
    },
  },
  {
    id: 'evisa-eligible-purpose-uncovered',
    version: RULESET_VERSION,
    source: SOURCES.evisa,
    reviewedAt: REVIEWED_AT,
    coverage: 'partial',
    rationale:
      'The nationality is on the eligible list but no published e-Visa sub-type covers the stated purpose.',
    when: (a) => isEvisaEligibleNationality(a.nationality),
    outcome: () => ({
      kind: OUTCOME.NEEDS_OFFICIAL_REVIEW,
      headline: 'Your passport is covered, but your reason for travelling is not',
      summary:
        'Your passport is on the published e-Visa list, but none of the online sub-types covers what you are going to India to do. One of the regular visa categories will, and an Indian Mission can tell you which. We would rather send you to them than pick a category on your behalf.',
      officialUrl: SOURCES.categories.url,
      officialLabel: 'See the regular visa categories',
    }),
  },
  {
    id: 'nationality-not-on-list',
    version: RULESET_VERSION,
    source: SOURCES.evisa,
    reviewedAt: REVIEWED_AT,
    coverage: 'complete',
    rationale:
      'The nationality does not appear on the published e-Visa eligible list, so the online route is not open to this passport.',
    when: (a) => Boolean(a.nationality),
    outcome: (a) => ({
      kind: OUTCOME.NOT_AVAILABLE_ONLINE,
      headline: 'There is no online route for this passport — but there is a route',
      summary:
        `A ${a.nationality} passport is not on the published e-Visa list. That is a rule about which applications the online system accepts, not a judgement about you or your trip. India issues twelve regular visa categories through its Missions and Posts abroad, and one of them will cover you. It takes longer than applying online, so start earlier than you otherwise would.`,
      conditions: [
        'The eligible list is published on the official e-Visa page and changes without notice — check it yourself before you rely on this.',
      ],
      officialUrl: SOURCES.categories.url,
      officialLabel: 'See the regular visa categories',
    }),
  },
];

function normalise(v) {
  return (v || '').trim().toLowerCase();
}

/** Whether Visa on Arrival is additionally available, as a second option. */
export function voaAvailable(a) {
  const nat = NATIONALITY_ALIASES[normalise(a.nationality)] || a.nationality;
  if (!VOA.nationalities.some((n) => n.toLowerCase() === normalise(nat))) return false;
  if (!VOA.purposes.includes(a.purpose)) return false;
  if (a.stayLength !== 'under-60') return false;
  if (a.pakistaniConnection === 'yes') return false;
  if (a.passportType !== 'ordinary') return false;
  // The UAE condition: only travellers who have held an Indian visa before.
  if (normalise(nat) === 'uae' && a.priorIndianVisa !== 'yes') return false;
  return true;
}

/**
 * Evaluate a complete or partial answer set.
 *
 * Returns an outcome object the UI renders directly. The `rule` field is
 * always present on a determined outcome so every screen can show which rule
 * fired, what it cites, and when a human last read that source.
 */
export function evaluate(answers = {}) {
  const missing = QUESTION_IDS.filter((id) => !answers[id]);
  if (missing.length > 0) {
    return {
      kind: OUTCOME.INSUFFICIENT_INFORMATION,
      headline: 'We do not know enough to point you anywhere',
      summary:
        'Something is missing that we would need in order to say anything useful, and we would rather tell you that than guess. Guessing here can send you down a route that costs a fee you cannot get back — e-Visa fees are not refunded whether or not the visa is granted.',
      missing,
      rulesetVersion: RULESET_VERSION,
      reviewedAt: REVIEWED_AT,
      officialUrl: SOURCES.evisa.url,
      officialLabel: 'Go to the official portal',
    };
  }

  const rule = RULES.find((r) => r.when(answers));

  // Deliberately not a fallthrough to e-Visa. If no rule matched, we say so.
  if (!rule) {
    return {
      kind: OUTCOME.NEEDS_OFFICIAL_REVIEW,
      headline: 'We do not have a rule that covers this combination',
      summary:
        'Your answers form a combination our published rules do not cover, and we will not guess. An Indian Mission or Post handles exactly this kind of case, and going to them first is the shortest path, not a detour.',
      rulesetVersion: RULESET_VERSION,
      reviewedAt: REVIEWED_AT,
      officialUrl: SOURCES.categories.url,
      officialLabel: 'See the regular visa categories',
    };
  }

  return {
    ...rule.outcome(answers),
    rule: {
      id: rule.id,
      version: rule.version,
      rationale: rule.rationale,
      coverage: rule.coverage,
      sourceUrl: rule.source.url,
      sourceTitle: rule.source.title,
      reviewedAt: rule.reviewedAt,
    },
    rulesetVersion: RULESET_VERSION,
    reviewedAt: REVIEWED_AT,
    answers,
  };
}

/** Plain-language restatement of the answers that produced an outcome. */
export function explainAnswers(answers) {
  return QUESTIONS.filter((q) => answers[q.id]).map((q) => {
    const opt = q.options?.find((o) => o.value === answers[q.id]);
    return { question: q.legend, answer: opt ? opt.label : answers[q.id] };
  });
}
