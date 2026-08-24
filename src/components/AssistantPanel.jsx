import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

const TOPICS = {
  ay: {
    label: 'Why AY 2026–27?',
    fallback: 'Rahul earned this income during Financial Year 2025–26. The following year, Assessment Year 2026–27, is when that income is assessed and the return is prepared.',
    source: 'Income Tax Department — ITR online filing manual',
    url: 'https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/file-itr-2-online/itr-2-UM',
  },
  ais: {
    label: 'AIS vs Form 26AS',
    fallback: 'AIS is the broader record of information reported about a taxpayer. From AY 2023–24, Form 26AS primarily shows TDS and TCS information. That is why checking both can reveal different things.',
    source: 'Income Tax Department — AIS FAQ',
    url: 'https://www.incometax.gov.in/iec/foportal/ais-faq',
  },
  estimate: {
    label: 'Is this final tax?',
    fallback: 'No. KarSaathi shows a dated, illustrative estimate for one fictional salaried case. It is not a filing calculation and it stops when the answers include income outside the supported scenario.',
    source: 'Income Tax Department — Income and Tax Estimator manual',
    url: 'https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/income-and-tax-estimator-um',
  },
};

export default function AssistantPanel({ context = 'general' }) {
  const { demo } = useApp();
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  async function ask(topic) {
    setLoading(true);
    try {
      const response = await fetch('/api/guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, language: demo.language, context }),
      });
      if (!response.ok) throw new Error('Offline guidance selected');
      const payload = await response.json();
      setAnswer({ ...payload, mode: 'AI explanation' });
    } catch {
      const fallback = TOPICS[topic];
      setAnswer({
        answer: fallback.fallback,
        citations: [{ title: fallback.source, url: fallback.url }],
        nextAction: 'Continue the fictional demo when this makes sense.',
        mode: 'Offline guidance',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="assistant" aria-labelledby="assistant-title">
      <h3 id="assistant-title">Need a plain-language explanation?</h3>
      <p className="fine-print">Choose a safe preset. No real tax information is sent.</p>
      <div className="assistant-topics">
        {Object.entries(TOPICS).map(([id, topic]) => (
          <button key={id} type="button" className="topic-button" disabled={loading} onClick={() => ask(id)}>
            {topic.label}
          </button>
        ))}
      </div>
      {loading && <p role="status">Preparing a simple explanation…</p>}
      {answer && !loading && (
        <div className="assistant-answer" aria-live="polite">
          <strong>{answer.mode}</strong>
          <p>{answer.answer}</p>
          {answer.nextAction && <p><strong>Next:</strong> {answer.nextAction}</p>}
          {(answer.citations || []).map((citation) => (
            <a className="assistant-source" key={citation.url} href={citation.url} target="_blank" rel="noreferrer">
              Source: {citation.title} ↗
            </a>
          ))}
        </div>
      )}
    </aside>
  );
}
