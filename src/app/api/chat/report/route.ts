import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const { messageId } = await request.json();

    if (!messageId) {
      return NextResponse.json({ msg: 'Missing messageId' }, { status: 400 });
    }

    await prisma.message.update({
      where: { id: messageId },
      data: { reported: true },
    });

    return NextResponse.json({ msg: 'Message reported successfully' });
  } catch (error) {
    console.error('Error reporting message:', error);
    return NextResponse.json({ msg: 'Internal Server Error' }, { status: 500 });
  }
}
