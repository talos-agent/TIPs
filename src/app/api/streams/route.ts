import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
  try {
    // In a real application, you would get the user's wallet address from their session.
    // For this MVP, we will use a hardcoded wallet address.
    const userWalletAddress = '0x1234567890123456789012345678901234567890';

    let user = await prisma.user.findUnique({
      where: { walletAddress: userWalletAddress },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress: userWalletAddress,
          username: 'testuser',
        },
      });
    }

    const newStream = await prisma.stream.create({
      data: {
        streamKey: `sk_${randomBytes(16).toString('hex')}`,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return NextResponse.json(newStream, { status: 201 });
  } catch (error) {
    console.error('Error creating stream:', error);
    return NextResponse.json({ msg: 'Internal Server Error' }, { status: 500 });
  }
}
