import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/** GET /api/messages — returns all messages newest first (admin use) */
export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

/** POST /api/messages — save a new contact message */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sender, message: bodyText } = body as { sender?: string; message: string };

    if (!bodyText?.trim()) {
      return NextResponse.json({ error: 'Message body is required' }, { status: 400 });
    }

    const msg = await prisma.message.create({
      data: {
        sender: sender?.trim() || null,
        body: bodyText.trim(),
      },
    });

    return NextResponse.json(msg, { status: 201 });
  } catch (error: any) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save message' },
      { status: 500 }
    );
  }
}
