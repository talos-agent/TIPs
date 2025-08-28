import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await prisma.message.delete({
      where: { id },
    });
    return NextResponse.json({ msg: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ msg: 'Internal Server Error' }, { status: 500 });
  }
}
