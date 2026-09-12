import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/** PATCH /api/messages/[id] — toggle read status */
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const msg = await prisma.message.update({
      where: { id },
      data: { read: body.read },
    });
    return NextResponse.json(msg);
  } catch (error: any) {
    console.error('Error updating message:', error);
    return NextResponse.json({ error: error.message || 'Failed to update message' }, { status: 500 });
  }
}

/** DELETE /api/messages/[id] — delete a message */
export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.message.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete message' }, { status: 500 });
  }
}
