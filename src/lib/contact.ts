export interface ContactSubmission {
  service: string;
  areas: string[];
  urgency: 'asap' | 'quote';
  description: string;
  name: string;
  email: string;
  phone: string;
}

export type ContactParseResult =
  | { ok: true; value: ContactSubmission }
  | { ok: false; reason: 'invalid' | 'invalid-email' | 'spam' };

const value = (input: unknown, max: number) =>
  (typeof input === 'string' ? input : '').trim().slice(0, max);

export const escapeHtml = (input: string) =>
  input.replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character]!);

export function parseContactSubmission(
  input: unknown,
  now = Date.now(),
): ContactParseResult {
  if (!input || typeof input !== 'object') return { ok: false, reason: 'invalid' };

  const body = input as Record<string, unknown>;
  const website = value(body.website, 200);
  const startedAt = typeof body.startedAt === 'number' ? body.startedAt : null;

  if (website || (startedAt !== null && now - startedAt >= 0 && now - startedAt < 1500)) {
    return { ok: false, reason: 'spam' };
  }

  const service = value(body.service, 80);
  const urgency = value(body.urgency, 30);
  const description = value(body.description, 2000);
  const name = value(body.name, 120);
  const email = value(body.email, 200);
  const phone = value(body.phone, 40);
  const areas = Array.isArray(body.areas)
    ? body.areas.slice(0, 20).map(area => value(area, 80)).filter(Boolean)
    : [];

  if (
    !service ||
    areas.length === 0 ||
    (urgency !== 'asap' && urgency !== 'quote') ||
    !name ||
    (!email && !phone)
  ) {
    return { ok: false, reason: 'invalid' };
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, reason: 'invalid-email' };
  }

  return {
    ok: true,
    value: {
      service: escapeHtml(service),
      areas: areas.map(escapeHtml),
      urgency,
      description: escapeHtml(description),
      name: escapeHtml(name),
      email: escapeHtml(email),
      phone: escapeHtml(phone),
    },
  };
}
