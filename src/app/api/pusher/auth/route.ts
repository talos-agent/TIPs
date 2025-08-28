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
    const { socket_id, channel_name } = await request.json();

    // In a real application, you would check if the user is authenticated
    // and has permission to access this channel.
    const user = {
      user_id: `user_${Math.random().toString(36).substr(2, 9)}`,
      user_info: { name: "Test User" },
    };

    const authResponse = pusher.authorizeChannel(socket_id, channel_name, user);
    return NextResponse.json(authResponse);
  } catch (error) {
    console.error('Error authenticating Pusher channel:', error);
    return NextResponse.json({ msg: 'Internal Server Error' }, { status: 500 });
  }
}
