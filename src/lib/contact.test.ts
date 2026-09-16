import { describe, expect, it } from 'vitest';
import { escapeHtml, parseContactSubmission } from './contact';

const validSubmission = {
  service: 'Repairs',
  areas: ['Kitchen'],
  urgency: 'quote',
  description: 'Repair a cabinet',
  name: 'Alex',
  email: 'alex@example.com',
  phone: '',
  website: '',
  startedAt: 1_000,
};

describe('parseContactSubmission', () => {
  it('accepts a valid request', () => {
    const result = parseContactSubmission(validSubmission, 5_000);
    expect(result.ok).toBe(true);
  });

  it('requires a way to contact the customer', () => {
    const result = parseContactSubmission(
      { ...validSubmission, email: '', phone: '' },
      5_000,
    );
    expect(result).toEqual({ ok: false, reason: 'invalid' });
  });

  it('rejects invalid email addresses', () => {
    const result = parseContactSubmission(
      { ...validSubmission, email: 'not-an-email' },
      5_000,
    );
    expect(result).toEqual({ ok: false, reason: 'invalid-email' });
  });

  it('silently identifies honeypot and impossibly fast submissions as spam', () => {
    expect(
      parseContactSubmission({ ...validSubmission, website: 'spam.example' }, 5_000),
    ).toEqual({ ok: false, reason: 'spam' });
    expect(parseContactSubmission(validSubmission, 2_000)).toEqual({
      ok: false,
      reason: 'spam',
    });
  });

  it('escapes values that are rendered in the notification email', () => {
    expect(escapeHtml('<b>Santi & Co.</b>')).toBe('&lt;b&gt;Santi &amp; Co.&lt;/b&gt;');
  });
});
