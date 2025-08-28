import React, { useEffect, useState } from 'react';

interface ReportedMessage {
  id: string;
  text: string;
  user: { username: string };
  stream: { title: string };
}

const ModerationQueue: React.FC = () => {
  const [reportedMessages, setReportedMessages] = useState<ReportedMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReportedMessages = async () => {
    try {
      const response = await fetch('/api/chat/reported');
      const data = await response.json();
      setReportedMessages(data);
    } catch (error) {
      console.error('Error fetching reported messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportedMessages();
  }, []);

  const handleDismiss = async (messageId: string) => {
    try {
      await fetch(`/api/chat/report/${messageId}`, { method: 'PUT' });
      fetchReportedMessages(); // Refresh the list
    } catch (error) {
      console.error('Error dismissing report:', error);
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      await fetch(`/api/chat/message/${messageId}`, { method: 'DELETE' });
      fetchReportedMessages(); // Refresh the list
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  if (loading) {
    return <div>Loading moderation queue...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Moderation Queue</h2>
      <div>
        {reportedMessages.map((msg) => (
          <div key={msg.id} className="border rounded-lg p-4 mb-4">
            <p><strong>Message:</strong> {msg.text}</p>
            <p><strong>User:</strong> {msg.user.username}</p>
            <p><strong>Stream:</strong> {msg.stream.title}</p>
            <div className="mt-2">
              <button onClick={() => handleDismiss(msg.id)} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Dismiss</button>
              <button onClick={() => handleDelete(msg.id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModerationQueue;
