/**
 * Field validation.
 *
 * Every message names the problem *and* the remedy, because "Please fill out
 * this field" tells someone nothing they did not already know. Messages are
 * written to be read aloud by a screen reader without sounding like an error
 * code, and to be understood by someone whose first language is not English.
 */

import { visibleFields, optionsFor } from './fields.js';

const isBlank = (v) => v === undefined || v === null || String(v).trim() === '';

/** A date-only comparison that ignores the local timezone. */
const day = (v) => (v ? new Date(`${v}T00:00:00Z`).getTime() : NaN);
const DAY_MS = 86400000;

function fieldError(field, data) {
  const value = data[field.name];

  if (field.required && isBlank(value)) {
    return `Enter ${lower(field.label)}.`;
  }
  if (isBlank(value)) return null;

  const v = String(value).trim();

  if (field.validate?.minLength && v.length < field.validate.minLength) {
    return `${field.label} looks too short. It should be at least ${field.validate.minLength} characters.`;
  }
  if (field.validate?.maxLength && v.length > field.validate.maxLength) {
    return `${field.label} looks too long. It should be at most ${field.validate.maxLength} characters.`;
  }
  if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
    return 'Enter an email address in the form name@example.com.';
  }
  if (field.type === 'tel' && !/^[+\d][\d\s()-]{5,}$/.test(v)) {
    return 'Enter a phone number using digits, spaces and an optional leading +.';
  }
  if ((field.type === 'select' || field.type === 'radio')) {
    const opts = optionsFor(field, data);
    if (opts.length && !opts.some((o) => o.value === v)) {
      return `Choose one of the options listed for ${lower(field.label)}.`;
    }
  }
  return null;
}

function lower(label) {
  // Keep proper nouns and acronyms intact; only drop the leading capital.
  return /^[A-Z][a-z]/.test(label) ? label[0].toLowerCase() + label.slice(1) : label;
}

/**
 * Cross-field rules, keyed by the field the error should attach to.
 * These are the ones that actually stop real applications.
 */
export function crossFieldErrors(data) {
  const errors = {};
  const issue = day(data.date_of_issue);
  const expiry = day(data.date_of_expiry);
  const arrival = day(data.expected_arrival_date);
  const departure = day(data.expected_departure_date);
  const birth = day(data.date_of_birth);
  const today = day(new Date().toISOString().slice(0, 10));

  if (!Number.isNaN(birth) && birth > today) {
    errors.date_of_birth = 'The date of birth is in the future. Check the year.';
  }
  if (!Number.isNaN(issue) && !Number.isNaN(expiry) && issue >= expiry) {
    errors.date_of_expiry = 'The passport expiry date must be after the date it was issued.';
  }
  if (!Number.isNaN(arrival) && !Number.isNaN(departure) && departure <= arrival) {
    errors.expected_departure_date = 'The departure date must be after the arrival date.';
  }
  if (!Number.isNaN(expiry) && !Number.isNaN(arrival) && expiry - arrival < 180 * DAY_MS) {
    errors.date_of_expiry =
      'A passport normally needs at least six months of validity left when you arrive. Check the expiry date against your travel dates.';
  }
  if (data.application_type === 'evisa' && !Number.isNaN(arrival) && arrival - today < 4 * DAY_MS) {
    errors.expected_arrival_date =
      'An e-Visa must be applied for at least four days before you arrive. Choose a later arrival date.';
  }
  return errors;
}

/** Errors for one stage, keyed by field name. Empty object means valid. */
export function validateStage(stage, data) {
  const errors = {};
  const cross = crossFieldErrors(data);
  for (const field of visibleFields(stage, data)) {
    const err = fieldError(field, data);
    if (err) errors[field.name] = err;
    else if (cross[field.name]) errors[field.name] = cross[field.name];
  }
  return errors;
}

/** Validate a single field, for on-blur feedback. */
export function validateField(field, data) {
  return fieldError(field, data) || crossFieldErrors(data)[field.name] || null;
}
