import OpenAI from 'openai';

const TOPICS = Object.freeze({
  ay: {
    question: 'Explain why Financial Year 2025–26 maps to Assessment Year 2026–27 for this fictional example.',
    sourceTitle: 'Income Tax Department — ITR online filing manual',
    sourceUrl: 'https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/file-itr-2-online/itr-2-UM',
    sourceFact: 'The online filing journey asks the taxpayer to select the applicable assessment year before preparing the return.',
  },
  ais: {
    question: 'Explain the difference between AIS and Form 26AS and why a taxpayer checks both.',
    sourceTitle: 'Income Tax Department — AIS FAQ',
    sourceUrl: 'https://www.incometax.gov.in/iec/foportal/ais-faq',
    sourceFact: 'From AY 2023–24, Form 26AS primarily displays TDS/TCS data; other taxpayer information is available in AIS, which also supports feedback.',
  },
  estimate: {
    question: 'Explain why the KarSaathi regime comparison is illustrative and not a final filing calculation.',
    sourceTitle: 'Income Tax Department — Income and Tax Estimator manual',
    sourceUrl: 'https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/income-and-tax-estimator-um',
    sourceFact: 'The official estimator gathers taxpayer category, status, year, income and deductions to estimate tax under applicable provisions.',
  },
});

const buckets = new Map();
const LIMIT = 15;
const WINDOW_MS = 60_000;

function allowed(ip) {
  const now = Date.now();
  const bucket = buckets.get(ip) || { started: now, count: 0 };
  if (now - bucket.started > WINDOW_MS) {
    buckets.set(ip, { started: now, count: 1 });
    return true;
  }
  bucket.count += 1;
  buckets.set(ip, bucket);
  return bucket.count <= LIMIT;
}
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'demo').split(',')[0];
  if (!allowed(ip)) return res.status(429).json({ error: 'Too many explanation requests. Use the offline guidance for a moment.' });

  const { topic, language, context } = req.body || {};
  if (!TOPICS[topic] || !['en', 'hi'].includes(language) || typeof context !== 'string' || context.length > 40) {
    return res.status(400).json({ error: 'Choose one of the safe explanation topics.' });
  }
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: 'Offline guidance is active.' });

  const source = TOPICS[topic];
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 12_000, maxRetries: 1 });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-5.4-mini',
      store: false,
      instructions: [
        'You are KarSaathi, a calm explainer for a fictional Indian tax-readiness prototype.',
        'Use only the supplied official source fact. Do not add tax rules, legal conclusions, or personal advice.',
        'Write for an eighth-grade reader. State uncertainty. Never imply that anything was filed.',
        language === 'hi' ? 'Answer in simple Hindi.' : 'Answer in plain English.',
      ].join(' '),
      input: `Screen: ${context}\nQuestion: ${source.question}\nOfficial source fact: ${source.sourceFact}\nSource: ${source.sourceTitle} — ${source.sourceUrl}`,
      text: {
        format: {
          type: 'json_schema',
          name: 'karsaathi_guidance',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            required: ['answer', 'nextAction', 'confidence', 'citations', 'escalationRequired'],
            properties: {
              answer: { type: 'string', maxLength: 600 },
              nextAction: { type: 'string', maxLength: 180 },
              confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
              citations: {
                type: 'array', minItems: 1, maxItems: 1,
                items: {
                  type: 'object', additionalProperties: false, required: ['title', 'url'],
                  properties: { title: { type: 'string' }, url: { type: 'string' } },
                },
              },
              escalationRequired: { type: 'boolean' },
            },
          },
        },
        verbosity: 'low',
      },
    });
    const parsed = JSON.parse(response.output_text);
    parsed.citations = [{ title: source.sourceTitle, url: source.sourceUrl }];
    return res.status(200).json(parsed);
  } catch (error) {
    console.error('Guidance request failed', error?.message);
    return res.status(502).json({ error: 'The AI explanation is unavailable; use offline guidance.' });
  }
}
