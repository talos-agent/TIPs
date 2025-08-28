import { NextResponse } from 'next/server';
import Pusher from 'pusher';

// In a real application, these would be in environment variables.
const pusher = new Pusher({
  appId: "PUSHER_APP_ID",
  key: "PUSHER_KEY",
  secret: "PUSHER_SECRET",
  cluster: "PUSHER_CLUSTER",
  useTLS: true
});

export async function POST(request: Request) {
  try {
    const { channel_name, message } = await request.json();

    if (!channel_name || !message) {
      return NextResponse.json({ msg: 'Missing required fields' }, { status: 400 });
    }

    await pusher.trigger(channel_name, 'new-message', { message });

    return NextResponse.json({ msg: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending chat message:', error);
    return NextResponse.json({ msg: 'Internal Server Error' }, { status: 500 });
  }
}
