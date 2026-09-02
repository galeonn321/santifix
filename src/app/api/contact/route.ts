import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const clean = (value: unknown, max = 500) =>
  String(value ?? '')
    .trim()
    .slice(0, max)
    .replace(/[&<>'"]/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
    })[character]!);

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!apiKey || !contactEmail) {
    return NextResponse.json({ error: 'Contact service is not configured' }, { status: 503 });
  }

  const resend = new Resend(apiKey);

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const service = clean(body.service, 80);
  const urgency = clean(body.urgency, 30);
  const description = clean(body.description, 2000);
  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 40);
  const areas = Array.isArray(body.areas) ? body.areas.slice(0, 20).map((area: unknown) => clean(area, 80)) : [];

  if (!service || areas.length === 0 || !['asap', 'quote'].includes(urgency) || !name || (!email && !phone)) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const urgencyLabel = urgency === 'asap' ? 'ASAP' : 'Quote first';
  const areasLabel = areas.join(', ');

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
    to: contactEmail,
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
