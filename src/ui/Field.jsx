import React, { forwardRef, useId } from 'react';
import { fieldId, optionsFor } from '../lib/fields.js';

/**
 * Form controls.
 *
 * Contract, enforced here so no page can get it wrong:
 *  - one visible <label for> per control, never a placeholder standing in
 *  - hint and error text joined into aria-describedby
 *  - aria-invalid on error
 *  - "Required" as a word, not a lone asterisk
 *  - a real <fieldset>/<legend> + real radios for single-select groups, so
 *    arrow keys, grouping and "2 of 5" announcements come from the platform
 */

const CONTROL =
  'w-full min-h-touch bg-paper-1 border border-rule-control rounded-control ' +
  'px-4 py-3 text-body text-ink font-sans ' +
  'transition-colors duration-quick placeholder:text-ink-faint ' +
  'aria-[invalid=true]:border-danger aria-[invalid=true]:border-emph';

export const Required = () => (
  <span className="text-meta font-semibold text-ink-muted"> (required)</span>
);

export function FieldShell({ id, label, hint, help, error, required, children }) {
  const hintId = hint || help ? `${id}-hint` : undefined;
  const errId = error ? `${id}-error` : undefined;
  return (
    <div className="mb-6">
      <label htmlFor={id} className="block text-label font-semibold text-ink mb-1">
        {label}
        {required && <Required />}
      </label>
      {(hint || help) && (
        <p id={hintId} className="text-meta text-ink-muted mb-2 max-w-prose">
          {hint}
          {hint && help ? ' ' : ''}
          {help}
        </p>
      )}
      {error && (
        <p id={errId} className="flex gap-2 text-body text-danger font-medium mb-2 border-l-rail border-danger pl-3">
          <span aria-hidden="true">⚠</span>
          <span>{error}</span>
        </p>
      )}
      {React.cloneElement(children, {
        'aria-describedby': [hintId, errId].filter(Boolean).join(' ') || undefined,
        'aria-invalid': error ? 'true' : undefined,
      })}
    </div>
  );
}

/** One registry field, rendered. */
export const Field = forwardRef(function Field({ field, value, onChange, onBlur, error, data = {} }, ref) {
  const id = fieldId(field.name);
  const common = {
    id,
    name: field.name,
    ref,
    value: value ?? '',
    onChange: (e) => onChange(field.name, e.target.value),
    onBlur: onBlur ? () => onBlur(field.name) : undefined,
    required: field.required || undefined,
    autoComplete: field.autocomplete,
    inputMode: field.inputMode,
    'data-agent-field': field.name,
    className: CONTROL,
  };

  if (field.type === 'radio') {
    return (
      <RadioGroup
        field={field}
        value={value}
        onChange={onChange}
        error={error}
        options={optionsFor(field, data)}
      />
    );
  }

  return (
    <FieldShell id={id} label={field.label} hint={field.hint} help={field.help} error={error} required={field.required}>
      {field.type === 'select' ? (
        <select {...common}>
          <option value="">Choose an option</option>
          {optionsFor(field, data).map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : (
        <input
          {...common}
          type={field.type}
          placeholder={field.type === 'date' ? undefined : field.example}
        />
      )}
    </FieldShell>
  );
});

/**
 * A real radio group. The previous version used styled <button>s, which gave
 * a screen reader five unrelated buttons with no group, no position and no
 * checked state — and no arrow-key movement at all.
 */
export function RadioGroup({ field, value, onChange, error, options, size = 'default' }) {
  const groupId = fieldId(field.name);
  const errId = error ? `${groupId}-error` : undefined;
  const hintId = field.hint ? `${groupId}-hint` : undefined;

  return (
    <fieldset
      className="mb-6 border-0 p-0 m-0"
      aria-describedby={[hintId, errId].filter(Boolean).join(' ') || undefined}
      aria-invalid={error ? 'true' : undefined}
    >
      <legend className={size === 'large'
        ? 'text-title font-display text-ink mb-2 p-0'
        : 'text-label font-semibold text-ink mb-1 p-0'}>
        {field.legend || field.label}
        {field.required && size !== 'large' && <Required />}
      </legend>
      {field.hint && <p id={hintId} className="text-meta text-ink-muted mb-4 max-w-prose">{field.hint}</p>}
      {error && (
        <p id={errId} className="flex gap-2 text-body text-danger font-medium mb-3 border-l-rail border-danger pl-3">
          <span aria-hidden="true">⚠</span><span>{error}</span>
        </p>
      )}
      <div className="border-t border-rule-control">
        {options.map((o) => {
          const id = `${groupId}-${o.value}`;
          const checked = value === o.value;
          return (
            <label
              key={o.value}
              htmlFor={id}
              className={`flex items-start gap-4 min-h-touch px-4 py-4 cursor-pointer
                border-b border-rule-control transition-colors duration-quick
                ${checked
                  ? 'border-l-rail border-l-indigo bg-indigo-50 font-semibold'
                  : 'bg-transparent hover:bg-paper-2'}`}
            >
              <input
                type="radio"
                id={id}
                name={field.name}
                value={o.value}
                checked={checked}
                onChange={() => onChange(field.name, o.value)}
                data-agent-field={field.name}
                className="mt-1 h-5 w-5 shrink-0 accent-[color:var(--indigo)]"
              />
              <span className="text-body text-ink">{o.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * The summary shown above a form after a failed submit.
 *
 * Focus goes here rather than to the first bad field, so a screen-reader user
 * hears how many problems there are before being dropped into one of them.
 */
export const ErrorSummary = forwardRef(function ErrorSummary({ errors, title }, ref) {
  const entries = Object.entries(errors);
  if (entries.length === 0) return null;
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      className="mb-8 border border-emph border-danger bg-danger-bg p-5 rounded-control"
    >
      <h2 className="text-heading font-semibold text-danger mb-3">
        {title || `There ${entries.length === 1 ? 'is 1 problem' : `are ${entries.length} problems`} to fix`}
      </h2>
      <ol className="grid gap-2 list-decimal pl-5">
        {entries.map(([name, message]) => (
          <li key={name}>
            <a
              href={`#${fieldId(name)}`}
              className="text-danger underline underline-offset-4 decoration-1 hover:decoration-2 inline-block min-h-touch py-2"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(fieldId(name))
                  || document.querySelector(`[name="${name}"]`);
                el?.focus();
                el?.scrollIntoView({ block: 'center' });
              }}
            >
              {message}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
});

export function Checkbox({ id, label, checked, onChange, describedBy }) {
  const auto = useId();
  const inputId = id || auto;
  return (
    <label htmlFor={inputId} className="flex items-start gap-4 min-h-touch py-2 cursor-pointer">
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-describedby={describedBy}
        className="mt-1 h-6 w-6 shrink-0 accent-[color:var(--indigo)]"
      />
      <span className="text-body text-ink">{label}</span>
    </label>
  );
}
