import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { parseContactSubmission } from '@/lib/contact';

export const runtime = 'nodejs';

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(req: Request) {
  const now = Date.now();
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
  const current = attempts.get(ip);

  if (!current || current.resetAt <= now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > MAX_REQUESTS;
}

export async function POST(req: Request) {
  const contentLength = Number(req.headers.get('content-length') ?? 0);
  if (contentLength > 25_000) {
    return NextResponse.json({ error: 'Request too large' }, { status: 413 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!apiKey || !contactEmail) {
    return NextResponse.json({ error: 'Contact service is not configured' }, { status: 503 });
  }

  const resend = new Resend(apiKey);

  const body = await req.json().catch(() => null);
  const parsed = parseContactSubmission(body);

  // Quietly accept bot submissions so automated senders do not learn how to bypass the trap.
  if (!parsed.ok && parsed.reason === 'spam') {
    return NextResponse.json({ success: true });
  }

  if (!parsed.ok) {
    const error = parsed.reason === 'invalid-email' ? 'Invalid email' : 'Missing required fields';
    return NextResponse.json({ error }, { status: 400 });
  }

  if (isRateLimited(req)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '600' } },
    );
  }

  const { service, areas, urgency, description, name, email, phone } = parsed.value;

  const urgencyLabel = urgency === 'asap' ? 'ASAP' : 'Quote first';
  const areasLabel = areas.join(', ');

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
    to: contactEmail,
    replyTo: email || undefined,
    subject: `[Santi Handyman] ${urgencyLabel} — ${service} request from ${name}`,
    html: `
      <h2>New service request from Santi Handyman</h2>
      <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
        <tr><td style="padding:6px 16px 6px 0;color:#666">Name</td><td><strong>${name}</strong></td></tr>
        <tr><td style="padding:6px 16px 6px 0;color:#666">Email</td><td>${email || '—'}</td></tr>
        <tr><td style="padding:6px 16px 6px 0;color:#666">Phone</td><td>${phone || '—'}</td></tr>
        <tr><td style="padding:6px 16px 6px 0;color:#666">Service</td><td>${service}</td></tr>
        <tr><td style="padding:6px 16px 6px 0;color:#666">Areas</td><td>${areasLabel}</td></tr>
        <tr><td style="padding:6px 16px 6px 0;color:#666">Urgency</td><td>${urgencyLabel}</td></tr>
        <tr><td style="padding:6px 16px 6px 0;color:#666">Description</td><td>${description || '—'}</td></tr>
      </table>
    `,
  });

  if (error) {
    return NextResponse.json({ error: 'Unable to send request' }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
