import {
  EVISA_ELIGIBLE_NATIONALITIES,
  EVISA_CATEGORIES,
  PURPOSES,
  VISA_RULESET,
  VOA_NATIONALITIES,
  VOA_PURPOSES,
} from '../data/visaEligibilityRules.js';

const purposeByValue = new Map(PURPOSES.map((purpose) => [purpose.value, purpose]));

export function getEvisaWizardGate(data = {}) {
  if (data.eligibility_ruleset_id !== VISA_RULESET.id) {
    return { allowed: false, reason: 'reviewed-ruleset-required' };
  }
  if (data.visa_category === 'student' && data.study_in_india_institution !== 'yes') {
    return { allowed: false, reason: 'study-in-india-required' };
  }
  if (!EVISA_CATEGORIES.includes(data.visa_category)) {
    return { allowed: false, reason: 'unsupported-category' };
  }
  return { allowed: true, reason: null };
}

const recommendation = ({
  type,
  applicationType,
  visaCategory,
  path,
  description,
  rationale,
  cautions = [],
  actionLabel = 'Continue to application',
}) => ({
  type,
  applicationType,
  visaCategory,
  path,
  description,
  rationale,
  cautions,
  actionLabel,
  rulesetId: VISA_RULESET.id,
});

const regularRoute = (description, rationale, cautions = []) => recommendation({
  type: 'Regular / Paper Visa or Official Review',
  applicationType: 'regular',
  visaCategory: 'unconfirmed',
  path: '/flow/regular',
  description,
  rationale,
  cautions: [
    ...cautions,
    'Confirm the exact category and documents with the nearest Indian Mission/Post before travel.',
  ],
  actionLabel: 'Review regular visa route',
});

export function isPotentialVoaJourney(answers) {
  const days = Number(answers.durationDays);
  return VOA_NATIONALITIES.has(answers.passport)
    && VOA_PURPOSES.has(answers.purpose)
    && Number.isFinite(days)
    && days > 0
    && days <= 60;
}

export function getFinderQuestions(answers) {
  const questions = [
    {
      id: 'passport',
      title: 'Which country or territory issued your passport?',
      type: 'country_select',
      help: 'The reviewed e-Visa and Visa-on-Arrival programmes are limited by passport nationality.',
    },
    {
      id: 'passportType',
      title: 'What type of passport or travel document will you use?',
      type: 'select',
      options: [
        { value: 'ordinary', label: 'Ordinary passport' },
        { value: 'diplomatic', label: 'Diplomatic passport' },
        { value: 'official', label: 'Official / service passport' },
        { value: 'other-document', label: 'Laissez-passer or another travel document' },
      ],
      help: 'The reviewed e-Visa and Visa-on-Arrival rules exclude Diplomatic/Official passports and non-passport travel documents.',
    },
    {
      id: 'pakistanOrigin',
      title: 'Were you, either parent, or any grandparent born in—or permanently resident in—Pakistan?',
      type: 'select',
      options: [
        { value: 'no', label: 'No' },
        { value: 'yes', label: 'Yes' },
        { value: 'unsure', label: 'I am not sure' },
      ],
      when: (state) => Boolean(state.passport) && state.passport !== 'Afghanistan',
      help: 'Pakistan-origin rules can require the regular visa route even when the current passport was issued elsewhere.',
    },
    {
      id: 'purpose',
      title: 'What is the main purpose of this trip?',
      type: 'select',
      options: PURPOSES,
      help: 'Different purposes use different categories and evidence. Employment is not an e-Visa purpose.',
    },
    {
      id: 'durationDays',
      title: 'How many days do you intend to remain in India on this trip?',
      type: 'number',
      min: 1,
      max: 3650,
      suffix: 'days',
      help: 'Use the intended continuous stay, not the overall validity printed on a visa. Visa-on-Arrival is limited to 60 days.',
    },
    {
      id: 'studyInIndiaInstitution',
      title: 'Is the admitting institution registered on the Government Study in India programme?',
      type: 'select',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'unsure', label: 'I need to verify this' },
      ],
      when: (state) => state.purpose === 'study',
      help: 'The current portal includes e-Student routes, but eligibility depends on the recognised institution and course evidence.',
    },
    {
      id: 'uaePriorVisa',
      title: 'Have you previously obtained an Indian e-Visa or regular/paper visa?',
      type: 'select',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No, this would be my first Indian visa' },
        { value: 'unsure', label: 'I am not sure' },
      ],
      when: (state) => state.passport === 'United Arab Emirates' && VOA_PURPOSES.has(state.purpose),
      help: 'This is a specific condition for UAE citizens considering Visa-on-Arrival. First-time UAE visitors must use e-Visa or a regular visa.',
    },
    {
      id: 'voaArrivalPort',
      title: 'Would you arrive through a designated Visa-on-Arrival airport?',
      type: 'select',
      options: [
        { value: 'designated', label: 'Yes — Bengaluru, Chennai, Delhi, Hyderabad, Kolkata or Mumbai' },
        { value: 'other', label: 'No — another airport, seaport or landport' },
        { value: 'unsure', label: 'I have not decided' },
      ],
      when: isPotentialVoaJourney,
      help: 'Visa-on-Arrival is available only at the six airports named in the reviewed Government guidance.',
    },
    {
      id: 'voaIndiaResidenceOrOccupation',
      title: 'Do you have a residence or occupation in India?',
      type: 'select',
      options: [
        { value: 'no', label: 'No' },
        { value: 'yes', label: 'Yes' },
        { value: 'unsure', label: 'I am not sure' },
      ],
      when: isPotentialVoaJourney,
      help: 'The published Visa-on-Arrival facility is for travellers who do not have a residence or occupation in India.',
    },
    {
      id: 'voaAdmissibility',
      title: 'Are you free of the published adverse-admissibility exclusions?',
      type: 'select',
      options: [
        { value: 'yes', label: 'Yes — not persona non grata and not declared undesirable' },
        { value: 'no', label: 'No' },
        { value: 'unsure', label: 'I need official review' },
      ],
      when: isPotentialVoaJourney,
      help: 'An Immigration Officer makes the final decision. This finder cannot resolve immigration alerts or admissibility records.',
    },
    {
      id: 'travelReadiness',
      title: 'Do you meet the passport and travel-readiness conditions?',
      type: 'select',
      options: [
        { value: 'yes', label: 'Yes — 6+ months validity, onward ticket/funds, and 2 blank pages if using e-Visa' },
        { value: 'no', label: 'No' },
        { value: 'unsure', label: 'I need to verify' },
      ],
      help: 'These are published baseline conditions. Visa-on-Arrival also requires no residence or occupation in India and remains subject to assessment on arrival.',
    },
  ];

  return questions.filter((question) => !question.when || question.when(answers));
}

export function evaluateVisaRoute(answers) {
  const purpose = purposeByValue.get(answers.purpose);
  const days = Number(answers.durationDays);

  if (answers.passport === 'Afghanistan') {
    return recommendation({
      type: 'Dedicated Afghan Online Visa / ETA Route',
      applicationType: 'afghan',
      visaCategory: 'unselected',
      path: '/flow/afghan',
      description: 'Afghan nationals use the dedicated Afghan visa portal, not the standard e-Visa or ordinary paper-visa form.',
      rationale: [
        'The Government portal publishes a separate Afghan-national route with its own categories and documents.',
        answers.passportType === 'ordinary'
          ? 'You selected an ordinary Afghan passport.'
          : 'Your passport type may be an edge case, so the dedicated portal or Indian Mission must confirm the route.',
      ],
      cautions: [
        'Choose among the dedicated Business, Student, Medical, Medical Attendant, Entry or UN Diplomat categories on the official service.',
      ],
      actionLabel: 'Review Afghan visa route',
    });
  }

  if (answers.passport === 'Pakistan') {
    return regularRoute(
      'Pakistani passport holders are directed to the regular visa process at an Indian Mission/Post.',
      ['You selected a Pakistan-issued passport; the standard e-Visa and Visa-on-Arrival routes do not apply.'],
    );
  }

  if (answers.pakistanOrigin !== 'no') {
    return regularRoute(
      'Pakistani-origin cases require the regular visa route or individual official review.',
      [answers.pakistanOrigin === 'yes'
        ? 'You reported a Pakistan birth, residence or ancestry connection covered by the reviewed exclusion.'
        : 'The Pakistan-origin question is unresolved, so this finder will not assert e-Visa eligibility.'],
    );
  }

  if (answers.passportType !== 'ordinary') {
    return regularRoute(
      'The reviewed online programmes do not accept this passport or travel-document type.',
      ['e-Visa and Visa-on-Arrival require an eligible ordinary passport.'],
    );
  }

  if (!purpose || purpose.value === 'employment' || purpose.value === 'other') {
    return regularRoute(
      purpose?.value === 'employment'
        ? 'Employment or paid work requires an appropriate regular visa; it is not covered by the e-Visa purposes reviewed here.'
        : 'This purpose needs category-specific review and should not be guessed by an automated finder.',
      [`Trip purpose: ${purpose?.label || 'not confirmed'}.`],
    );
  }

  if (answers.travelReadiness !== 'yes') {
    return regularRoute(
      'The baseline passport or travel-readiness conditions are not confirmed.',
      [answers.travelReadiness === 'no'
        ? 'At least one published passport validity, blank-page, onward-travel or funds condition is not met.'
        : 'The baseline conditions are uncertain, so this finder will not assert online eligibility.'],
      ['Resolve passport validity and travel-document requirements before making any non-refundable booking or payment.'],
    );
  }

  if (answers.purpose === 'study' && answers.studyInIndiaInstitution !== 'yes') {
    return regularRoute(
      'The current portal has an e-Student route, but this study journey does not yet satisfy its verified institution gate.',
      [answers.studyInIndiaInstitution === 'no'
        ? 'You indicated that the institution is not registered on Study in India.'
        : 'The institution registration is unconfirmed.'],
      ['Study is not automatically a paper-visa case; verify the institution and course on the official services first.'],
    );
  }

  const canUseVoa = isPotentialVoaJourney(answers)
    && answers.voaArrivalPort === 'designated'
    && answers.voaIndiaResidenceOrOccupation === 'no'
    && answers.voaAdmissibility === 'yes'
    && (answers.passport !== 'United Arab Emirates' || answers.uaePriorVisa === 'yes');

  if (canUseVoa) {
    return recommendation({
      type: 'Visa on Arrival Option',
      applicationType: 'voa',
      visaCategory: purpose.evisaCategory,
      path: '/flow/voa',
      description: 'Your answers match the published preliminary Visa-on-Arrival route. Final eligibility and grant are assessed by Indian immigration on arrival.',
      rationale: [
        `${answers.passport} is one of the three published Visa-on-Arrival nationalities.`,
        `${purpose.label} is a permitted purpose and ${days} ${days === 1 ? 'day is' : 'days are'} within the 60-day maximum.`,
        'You selected a designated Visa-on-Arrival airport and confirmed the baseline travel conditions.',
        'You confirmed no residence or occupation in India and no known adverse-admissibility exclusion.',
        ...(answers.passport === 'United Arab Emirates'
          ? ['You confirmed a previous Indian e-Visa or regular/paper visa.']
          : []),
      ],
      cautions: [
        'Prepare Annexure I and the disembarkation card for presentation at the designated airport.',
        'Complete the separate e-Arrival Card within 72 hours before arrival. It is arrival information, not a visa.',
      ],
      actionLabel: 'Review Visa-on-Arrival flow',
    });
  }

  if (!Number.isFinite(days) || days < 1 || days > purpose.finderStayLimitDays) {
    return regularRoute(
      'The intended continuous stay is outside the conservative limit used by this finder for the selected online category.',
      [`You entered ${Number.isFinite(days) ? `${days} days` : 'an invalid duration'}; the reviewed finder limit for ${purpose.label.toLowerCase()} is ${purpose.finderStayLimitDays} days.`],
      ['Visa validity and permitted continuous stay are different. Ask the official service or an Indian Mission/Post to confirm the correct category.'],
    );
  }

  if (!EVISA_ELIGIBLE_NATIONALITIES.has(answers.passport)) {
    return regularRoute(
      'This passport nationality is not in the reviewed e-Visa eligibility snapshot.',
      [`${answers.passport} was not confirmed in the reviewed live e-Visa registration list.`],
      ['Government lists can change; check the official portal and use an Indian Mission/Post if the nationality is still unavailable.'],
    );
  }

  const voaFallback = [];
  if (isPotentialVoaJourney(answers)) {
    if (answers.passport === 'United Arab Emirates' && answers.uaePriorVisa !== 'yes') {
      voaFallback.push('Visa-on-Arrival is unavailable to a first-time or unconfirmed UAE visitor, so the online route is the safer recommendation.');
    }
    if (answers.voaArrivalPort !== 'designated') {
      voaFallback.push('Your arrival port does not confirm the six-airport Visa-on-Arrival gate.');
    }
    if (answers.voaIndiaResidenceOrOccupation !== 'no' || answers.voaAdmissibility !== 'yes') {
      voaFallback.push('The Visa-on-Arrival residence/occupation or admissibility conditions are not fully confirmed.');
    }
  } else if (VOA_NATIONALITIES.has(answers.passport) && VOA_PURPOSES.has(answers.purpose) && days > 60) {
    voaFallback.push(`${days} days exceeds the exact 60-day Visa-on-Arrival limit.`);
  }

  return recommendation({
    type: purpose.value === 'study' ? 'e-Student Visa Route' : 'Standard e-Visa Route',
    applicationType: 'evisa',
    visaCategory: purpose.evisaCategory,
    path: '/flow/normal',
    description: 'Your answers match a reviewed online visa route, subject to the exact live purpose, document, arrival-port and application-date controls on the Government portal.',
    rationale: [
      `${answers.passport} is present in the reviewed e-Visa nationality snapshot.`,
      `${purpose.label} maps to the reviewed ${purpose.value === 'study' ? 'e-Student' : `e-${purpose.evisaCategory}`} category family.`,
      ...voaFallback,
    ],
    cautions: [],
    actionLabel: 'Continue to e-Visa Application',
  });
}
