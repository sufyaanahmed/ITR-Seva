import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { countryFlag, searchNationalities } from '../domain/countries';
import { ASSISTANT_ACTIONS, interpretAssistantInput, nextAssistantQuestion, runAssistantTool } from '../domain/visaAssistant';

const welcome = { role: 'assistant', text: 'What can I help you get done?', actions: ASSISTANT_ACTIONS };

function downloadChecklist(filename, content) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function VisaAssistant() {
  const { state, updateState, updateFinder } = useStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([welcome]);
  const [input, setInput] = useState('');
  const [guiding, setGuiding] = useState(false);
  const inputRef = useRef(null);
  const triggerRef = useRef(null);
  const scrollRef = useRef(null);
  const question = guiding ? nextAssistantQuestion(state) : null;

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, question?.id, open]);

  const close = () => { setOpen(false); triggerRef.current?.focus(); };
  const execute = (tool, label = tool.label) => {
    try {
      const reply = runAssistantTool(tool, { state, updateFinder, updateState, navigate, download: downloadChecklist });
      setMessages((previous) => [...previous, ...(label ? [{ role: 'user', text: label }] : []), { role: 'assistant', ...reply }]);
      if (reply.guiding !== undefined) setGuiding(reply.guiding);
    } catch {
      setMessages((previous) => [...previous, { role: 'assistant', text: 'That action could not finish. Please try again.' }]);
    }
    setInput('');
    inputRef.current?.focus();
  };
  const submit = (event) => {
    event.preventDefault();
    if (!input.trim()) return;
    execute(interpretAssistantInput(input, { state, guiding }), input.trim());
  };
  const actionClass = 'rounded-lg border border-border bg-white px-3 py-2 text-left text-xs font-medium text-primary transition-colors hover:border-primary hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';

  return (
    <div className="fixed bottom-4 right-4 z-[90] font-sans print:hidden sm:bottom-6 sm:right-6">
      {open && (
        <section id="visa-assistant" role="dialog" aria-label="Visa Seva assistant" onKeyDown={(event) => { if (event.key === 'Escape') close(); }} className="mb-3 flex h-[min(640px,calc(100dvh-110px))] w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">
          <header className="flex items-center justify-between bg-primary px-5 py-4 text-white">
            <div><h2 className="text-sm font-semibold">Visa Seva assistant</h2><p className="mt-1 text-xs text-white/70">Find, prepare and continue</p></div>
            <button type="button" onClick={close} aria-label="Close assistant" className="rounded p-2 hover:bg-white/10"><svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg></button>
          </header>
          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
            <div role="log" aria-live="polite" aria-label="Conversation" className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={message.role === 'user' ? 'ml-10 rounded-xl bg-primary px-3 py-2 text-sm text-white' : 'mr-2 text-sm leading-relaxed text-text'}>
                  <p>{message.text}</p>
                  {message.items && <ul className="mt-3 space-y-2">{message.items.map((item) => <li key={item.title} className="rounded-lg bg-surface p-3"><span className="block text-xs text-text-secondary">{item.status}</span><strong className="text-xs font-semibold">{item.title}</strong></li>)}</ul>}
                  {message.link && <a href={message.link.url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-primary underline">{message.link.label} ↗</a>}
                  {message.actions && <div className="mt-3 flex flex-wrap gap-2">{message.actions.map((action) => <button type="button" key={action.label} className={actionClass} onClick={() => execute(action)}>{action.label}</button>)}</div>}
                </div>
              ))}
            </div>
            {question && (
              <div className="mt-4 border-t border-border pt-4" aria-live="polite">
                <p className="text-sm font-semibold text-primary">{question.title}</p>
                {question.description && <p className="mt-2 text-xs leading-relaxed text-text-secondary">{question.description}</p>}
                {question.type === 'country_select' ? (
                  <div className="mt-3 flex flex-wrap gap-2">{(input.trim() ? searchNationalities(input).slice(0, 5) : ['United Arab Emirates', 'Japan', 'United States', 'United Kingdom']).map((country) => <button type="button" className={actionClass} key={country} onClick={() => execute({ name: 'answer_finder', args: { id: question.id, value: country } }, country)}><span aria-hidden="true">{countryFlag(country)}</span> {country}</button>)}</div>
                ) : question.type === 'number' ? <p className="mt-2 text-xs text-text-secondary">Enter the number of days below.</p> : (
                  <div className="mt-3 flex flex-wrap gap-2">{question.options.map((option) => <button type="button" className={actionClass} key={option.value} onClick={() => execute({ name: 'answer_finder', args: { id: question.id, value: option.value } }, option.label)}>{option.label}</button>)}</div>
                )}
              </div>
            )}
          </div>
          <div className="border-t border-border p-3">
            <form onSubmit={submit} className="flex items-center gap-2">
              <label htmlFor="assistant-input" className="sr-only">Message the visa assistant</label>
              <input ref={inputRef} id="assistant-input" value={input} onChange={(event) => setInput(event.target.value)} maxLength={500} autoComplete="off" placeholder={question?.type === 'country_select' ? 'Type your country or UAE…' : question?.type === 'number' ? 'e.g. 14 days' : 'Ask or choose an action…'} className="min-w-0 flex-1 rounded-lg border border-border bg-white px-3 py-3 text-sm outline-none focus:border-primary" />
              <button type="submit" disabled={!input.trim()} aria-label="Send message" className="rounded-lg bg-primary p-3 text-white disabled:opacity-40"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 12 7-7 7 7M12 5v14" /></svg></button>
            </form>
            <div className="mt-2 flex justify-end text-[10px] text-text-secondary"><button type="button" className="p-1 underline" onClick={() => { setMessages([welcome]); setGuiding(false); setInput(''); }}>Clear chat</button></div>
          </div>
        </section>
      )}
      <button ref={triggerRef} type="button" onClick={() => open ? close() : setOpen(true)} aria-expanded={open} aria-controls="visa-assistant" className="ml-auto flex items-center gap-2 rounded-full border border-white/20 bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-primary-dark">
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-1 1V11.5a9 9 0 0 1 18 0Z" /><path d="M8 10h8M8 14h5" /></svg>
        {open ? 'Close chat' : 'Ask Visa Seva'}
      </button>
    </div>
  );
}
