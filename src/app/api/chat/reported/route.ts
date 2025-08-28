import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(request: Request) {
  try {
    const reportedMessages = await prisma.message.findMany({
      where: { reported: true },
      include: { user: true, stream: true }, // Include user and stream info
    });

    return NextResponse.json(reportedMessages);
  } catch (error) {
    console.error('Error fetching reported messages:', error);
    return NextResponse.json({ msg: 'Internal Server Error' }, { status: 500 });
  }
}
