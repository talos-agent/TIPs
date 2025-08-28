import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, stream, param } = body;

    console.log(`Received SRS Webhook: ${action} for stream ${stream}`);

    const streamKey = new URLSearchParams(param).get('token');
    if (!streamKey) {
      console.log('No stream key provided');
      return NextResponse.json({ code: 1, msg: 'No stream key' });
    }

    switch (action) {
      case 'on_publish': {
        console.log('Handling on_publish webhook');
        const existingStream = await prisma.stream.findUnique({
          where: { streamKey },
        });

        if (existingStream) {
          console.log(`Stream key ${streamKey} is valid. Approving stream.`);
          await prisma.stream.update({
            where: { streamKey },
            data: { isLive: true },
          });
          return NextResponse.json({ code: 0, msg: 'Success' });
        } else {
          console.log(`Stream key ${streamKey} is invalid. Rejecting stream.`);
          return NextResponse.json({ code: 1, msg: 'Invalid stream key' });
        }
      }

      case 'on_unpublish': {
        console.log('Handling on_unpublish webhook');
        await prisma.stream.update({
          where: { streamKey },
          data: { isLive: false },
        });
        console.log(`Stream ${stream} has ended.`);
        return NextResponse.json({ code: 0, msg: 'Success' });
      }

      case 'on_play': {
        console.log('Handling on_play webhook');
        await prisma.stream.update({
            where: { streamKey },
            data: { viewerCount: { increment: 1 } },
        });
        console.log(`New viewer for stream ${stream}.`);
        return NextResponse.json({ code: 0, msg: 'Success' });
      }

      case 'on_stop': {
        console.log('Handling on_stop webhook');
        await prisma.stream.update({
            where: { streamKey },
            data: { viewerCount: { decrement: 1 } },
        });
        console.log(`Viewer left stream ${stream}.`);
        return NextResponse.json({ code: 0, msg: 'Success' });
      }

      default:
        console.log(`Unknown SRS webhook action: ${action}`);
        return NextResponse.json({ code: 1, msg: 'Unknown action' });
    }
  } catch (error) {
    console.error('Error handling SRS webhook:', error);
    return NextResponse.json({ code: 1, msg: 'Internal Server Error' }, { status: 500 });
  }
}
