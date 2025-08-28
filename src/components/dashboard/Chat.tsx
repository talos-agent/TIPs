import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

interface Message {
  id: string;
  text: string;
  user: string;
}

interface ChatProps {
  streamId: string;
}

const Chat: React.FC<ChatProps> = ({ streamId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const channelName = `private-chat-${streamId}`;

  useEffect(() => {
    const pusher = new Pusher('PUSHER_KEY', {
      cluster: 'PUSHER_CLUSTER',
      authEndpoint: '/api/pusher/auth',
    });

    const channel = pusher.subscribe(channelName);

    channel.bind('new-message', (data: { id: string, message: string, user: string }) => {
      setMessages((prevMessages) => [...prevMessages, { id: data.id, text: data.message, user: data.user }]);
    });

    return () => {
      pusher.unsubscribe(channelName);
    };
  }, [streamId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    try {
      // In a real app, the message would be saved to the DB and then broadcasted.
      // The broadcasted message would include the ID. For now, we'll just mock it.
      const tempId = `msg_${Math.random().toString(36).substr(2, 9)}`;
      const user = "Me";

      await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel_name: channelName,
          message: { id: tempId, text: newMessage, user: user },
        }),
      });

      setMessages((prevMessages) => [...prevMessages, { id: tempId, text: newMessage, user: user }]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleReportMessage = async (messageId: string) => {
    try {
      await fetch('/api/chat/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId }),
      });
      alert('Message reported');
    } catch (error) {
      console.error('Error reporting message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2 flex justify-between items-center">
            <div>
                <span className="font-bold">{msg.user}: </span>
                <span>{msg.text}</span>
            </div>
            <button
              onClick={() => handleReportMessage(msg.id)}
              className="text-xs bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
            >
              Report
            </button>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full p-2 border rounded-md"
        />
      </form>
    </div>
  );
};

export default Chat;
