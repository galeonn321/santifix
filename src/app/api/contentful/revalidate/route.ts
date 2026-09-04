import { timingSafeEqual } from 'node:crypto';
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

function secretsMatch(received: string, expected: string) {
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);

  return (
    receivedBuffer.length === expectedBuffer.length
    && timingSafeEqual(receivedBuffer, expectedBuffer)
  );
}

export async function POST(request: Request) {
  const expectedSecret = process.env.CONTENTFUL_WEBHOOK_SECRET;

  if (!expectedSecret) {
    return NextResponse.json(
      { error: 'Contentful webhook is not configured' },
      { status: 503 },
    );
  }

  const receivedSecret = request.headers.get('x-contentful-webhook-secret');

  if (!receivedSecret || !secretsMatch(receivedSecret, expectedSecret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  revalidateTag('contentful', 'max');
  revalidatePath('/', 'layout');

  return NextResponse.json({
    revalidated: true,
    timestamp: new Date().toISOString(),
  });
}
