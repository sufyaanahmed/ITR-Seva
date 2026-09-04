import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

const VOA_PAGE = 'https://indianvisaonline.gov.in/visa/visa-on-arrival.html';
const nationalities = ['Japan', 'South Korea', 'United Arab Emirates'];
const purposes = ['Tourism', 'Business', 'Conference', 'Medical'];
const airports = ['Bangalore', 'Chennai', 'Delhi', 'Hyderabad', 'Kolkata', 'Mumbai'];

const confirmations = [
  ['ordinaryPassport', 'I travel on an ordinary passport (Diplomatic and Official passports are excluded).'],
  ['passportValidity', 'My passport will have at least six months of validity at arrival.'],
  ['noIndiaResidence', 'I do not have a residence or occupation in India.'],
  ['onwardTravel', 'I have a confirmed return or onward ticket.'],
  ['sufficientFunds', 'I have sufficient funds for my stay.'],
  ['noPakistanOrigin', 'Neither I, nor either parent or grandparent, was born in or permanently resident in Pakistan.'],
  ['admissibility', 'I have not been notified that I am persona non grata or otherwise inadmissible; I understand the Government makes the final assessment.'],
];

export default function VoaFlow() {
  const navigate = useNavigate();
  const { state, updateState } = useStore();
  const [form, setForm] = useState(() => {
    const data = state?.data || {};
    return {
      nationality: data.nationality || '',
      priorVisa: data.uae_prior_indian_visa && data.uae_prior_indian_visa !== 'not_applicable' ? data.uae_prior_indian_visa : '',
      purpose: data.visa_category ? data.visa_category.charAt(0).toUpperCase() + data.visa_category.slice(1) : '',
      days: data.intended_stay_days || '',
      airport: data.voa_arrival_port_gate && data.voa_arrival_port_gate !== 'not_applicable' ? data.voa_arrival_port_gate : ''
    };
  });
  const [checked, setChecked] = useState({});
  const [attempted, setAttempted] = useState(false);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const allConfirmed = confirmations.every(([key]) => checked[key]);
  const stayDays = Number(form.days);
  const eligible = useMemo(() => (
    nationalities.includes(form.nationality)
    && (form.nationality !== 'United Arab Emirates' || form.priorVisa === 'yes')
    && purposes.includes(form.purpose)
    && stayDays >= 1
    && stayDays <= 60
    && airports.includes(form.airport)
    && allConfirmed
  ), [form, stayDays, allConfirmed]);

  const hasBasicAnswers = form.nationality && form.purpose && form.days && form.airport
    && (form.nationality !== 'United Arab Emirates' || form.priorVisa);

  const checkEligibility = (event) => {
    event.preventDefault();
    setAttempted(true);
  };

  const startFormPreparation = () => {
    if (!eligible) return;
    updateState({
      type: 'voa',
      step: 0,
      data: {
        ...(state?.data || {}),
        application_type: 'voa',
        nationality: form.nationality,
        visa_category: form.purpose.toLowerCase(),
        intended_stay_days: form.days,
        arrival_port: form.airport,
        passport_type: 'ordinary',
        uae_previous_indian_visa: form.nationality === 'United Arab Emirates' ? form.priorVisa : 'not_applicable',
        no_india_residence_occupation: true,
        onward_ticket_confirmed: true,
        sufficient_funds_confirmed: true,
        pakistan_origin: 'no',
        persona_non_grata: 'no',
        undesirable_person: 'no',
      },
      docs: [],
      submitted: false,
    });
    navigate('/apply');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-10 border-b border-border-dark pb-8">
        <p className="uppercase tracking-widest text-sm text-primary mb-2 font-bold">Eligibility and form preparation</p>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Visa-on-Arrival for India</h1>
        <p className="text-xl text-text-secondary leading-relaxed">This facility is limited to qualifying citizens of Japan, South Korea, and the United Arab Emirates. Complete every published gate before relying on it.</p>
      </div>



      <form onSubmit={checkEligibility} className="space-y-10" noValidate>
        <section>
          <h2 className="text-2xl font-bold mb-5 text-gray-900">1. Journey details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <label className="text-sm font-bold text-gray-800">Passport nationality
              <select className="input-field mt-2 font-normal" value={form.nationality} onChange={(e) => update('nationality', e.target.value)} required>
                <option value="">Select nationality</option>
                {nationalities.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="text-sm font-bold text-gray-800">Permitted purpose
              <select className="input-field mt-2 font-normal" value={form.purpose} onChange={(e) => update('purpose', e.target.value)} required>
                <option value="">Select purpose</option>
                {purposes.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="text-sm font-bold text-gray-800">Intended stay (days)
              <input className="input-field mt-2 font-normal" type="number" min="1" max="60" value={form.days} onChange={(e) => update('days', e.target.value)} placeholder="Maximum 60" required />
            </label>
            <label className="text-sm font-bold text-gray-800">Arrival airport
              <select className="input-field mt-2 font-normal" value={form.airport} onChange={(e) => update('airport', e.target.value)} required>
                <option value="">Select designated airport</option>
                {airports.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>
          {form.nationality === 'United Arab Emirates' && (
            <fieldset className="mt-5 border border-border p-5 rounded">
              <legend className="px-2 font-bold text-gray-900">UAE prior-visa condition</legend>
              <p className="text-sm text-text-secondary mb-3">Have you previously obtained an Indian e-Visa or regular/paper visa?</p>
              <div className="flex gap-6">
                {['yes', 'no'].map((value) => (
                  <label key={value} className="flex gap-2 items-center capitalize"><input type="radio" name="priorVisa" value={value} checked={form.priorVisa === value} onChange={(e) => update('priorVisa', e.target.value)} />{value}</label>
                ))}
              </div>
              {form.priorVisa === 'no' && <p className="mt-3 text-sm font-bold text-red-700">First-time UAE visitors are not eligible for Visa-on-Arrival; use the official e-Visa or regular/paper route instead.</p>}
            </fieldset>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-gray-900">2. Published eligibility conditions</h2>
          <p className="text-sm text-text-secondary mb-5">Confirm each condition. These declarations do not guarantee entry or replace the Government&apos;s assessment.</p>
          <div className="space-y-3">
            {confirmations.map(([key, label]) => (
              <label key={key} className="flex items-start gap-3 border border-border rounded bg-white p-4 cursor-pointer">
                <input type="checkbox" checked={Boolean(checked[key])} onChange={(e) => setChecked((current) => ({ ...current, [key]: e.target.checked }))} className="mt-1" />
                <span className="text-sm text-gray-800">{label}</span>
              </label>
            ))}
          </div>
        </section>

        <button type="submit" className="btn-primary">Check these answers</button>

        {attempted && (
          <section role="status" className={`border p-6 rounded ${eligible ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
            <h2 className={`text-xl font-bold mb-2 ${eligible ? 'text-green-950' : 'text-red-950'}`}>{eligible ? 'These answers meet the published basic gates' : 'Visa-on-Arrival is not available from these answers'}</h2>
            <p className={`text-sm ${eligible ? 'text-green-900' : 'text-red-900'}`}>
              {eligible
                ? 'This is not approval. Recheck current rules, prepare Annexure I and arrival documents, complete e-Arrival, and present yourself to the Visa Officer.'
                : !hasBasicAnswers || !allConfirmed
                  ? 'Complete every field and confirmation. If any condition is not true, use another official visa route.'
                  : 'The selected nationality, UAE history, purpose, duration, airport, or eligibility declaration does not meet the published scheme.'}
            </p>
            {eligible && (
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button type="button" onClick={startFormPreparation} className="btn-primary cursor-pointer">Prepare Annexure I Form</button>
                <Link to="/e-arrival" className="btn-secondary">Review e-Arrival Requirements</Link>
              </div>
            )}
          </section>
        )}
      </form>

      <section className="mt-12 bg-blue-50 border-l-4 border-primary p-6">
        <h2 className="text-xl font-bold mb-4 text-[#081e33]">3. Airport procedure</h2>
        <ol className="list-decimal pl-5 space-y-3 text-gray-800">
          <li>Complete and print the official Annexure I form in advance, complete it on arrival, or obtain it from the airline.</li>
          <li>Complete the separate e-Arrival Card online within 72 hours before arrival. It is arrival information, not a visa.</li>
          <li>Carry the completed VoA form, disembarkation card, passport, return/onward ticket, and evidence of sufficient funds.</li>
          <li>Present the paperwork at one of the six listed airports and pay ₹2,000 or equivalent foreign currency per passenger, including children, before grant.</li>
        </ol>
        <p className="mt-4 font-bold text-blue-950">If granted, the Visa-on-Arrival may allow double entry for up to 60 days. It is non-extendable and non-convertible.</p>
      </section>

    </div>
  );
}
