import React from 'react';
import ChatInterface from '@/components/ChatInterface';

const AdminChatPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Chat</h1>
      <ChatInterface />
    </div>
  );
};

export default AdminChatPage;
