import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await prisma.message.update({
      where: { id },
      data: { reported: false },
    });
    return NextResponse.json({ msg: 'Report dismissed successfully' });
  } catch (error) {
    console.error('Error dismissing report:', error);
    return NextResponse.json({ msg: 'Internal Server Error' }, { status: 500 });
  }
}
