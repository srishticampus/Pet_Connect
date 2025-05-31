import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router'; // Import useLocation
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import api from '@/utils/api'; // Import the API client
import { useAuth } from '@/hooks/auth'; // Import the useAuth hook

const ChatInterface = () => {
  const { user: currentUser } = useAuth(); // Get the current authenticated user
  const location = useLocation(); // Get the current location object
  const queryParams = new URLSearchParams(location.search);
  const initialChatPartnerId = queryParams.get('initialChatPartnerId');
  const chatTargetRole = queryParams.get('chatTargetRole');
  const [selectedUser, setSelectedUser] = useState(null); // State to hold the selected user
  const [categorizedConversations, setCategorizedConversations] = useState({}); // State to hold categorized conversations
  const [messages, setMessages] = useState([]); // State to hold messages for the selected conversation
  const [searchTerm, setSearchTerm] = useState(''); // State to hold the search term for filtering conversations
  const [inputMessage, setInputMessage] = useState(''); // State to hold the current message input
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  // Fetch conversations on component mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await api.get('/chat/conversations');
        // Flatten the conversations object into a single array
        setCategorizedConversations(response.data);
        console.log(response.data);

        if (initialChatPartnerId) {
          // Find the partner across all categories
          let partner = null;
          for (const category in response.data) {
            partner = response.data[category].find(user => user.id === initialChatPartnerId);
            if (partner) break;
          }
          if (partner) {
            setSelectedUser(partner);
          }
        }

      } catch (err) {
        setError("Failed to fetch conversations.");
        console.error("Error fetching conversations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [initialChatPartnerId, chatTargetRole]); // Rerun when initialChatPartnerId or chatTargetRole changes

  // Fetch messages when a user is selected
  useEffect(() => {
    if (selectedUser) {
      const fetchMessagesAndMarkAsRead = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/chat/conversations/${selectedUser.id}/messages`);
          setMessages(response.data);

          await api.post(`/chat/conversations/${selectedUser.id}/mark-as-read`);

          // Update unread count in categorizedConversations state
          setCategorizedConversations(prevCategorizedConversations => {
            const newCategorizedConversations = { ...prevCategorizedConversations };
            for (const category in newCategorizedConversations) {
              newCategorizedConversations[category] = newCategorizedConversations[category].map(user =>
                user.id === selectedUser.id ? { ...user, unreadCount: 0 } : user
              );
            }
            return newCategorizedConversations;
          });

        } catch (err) {
          setError(`Failed to fetch messages or mark as read for ${selectedUser.name}.`);
          console.error(`Error fetching messages or marking as read for user ${selectedUser.id}:`, err);
          setMessages([]); // Clear messages on error
        } finally {
          setLoading(false);
        }
      };

      fetchMessagesAndMarkAsRead();

    } else {
      setMessages([]); // Clear messages when no user is selected
    }
  }, [selectedUser, currentUser?.id]); // Rerun effect when selectedUser or currentUser changes

  // Function to handle sending a message
  const handleSendMessage = async (content) => {
    if (!selectedUser || !content.trim()) return;

    try {
      const response = await api.post(`/chat/conversations/${selectedUser.id}/messages`, { content });
      setMessages([...messages, response.data]);
      setInputMessage('');
    } catch (err) {
      setError(`Failed to send message to ${selectedUser.name}.`);
      console.error(`Error sending message to user ${selectedUser.id}:`, err);
    }
  };

  const allFilteredConversations = Object.values(categorizedConversations)
    .flat() // Flatten all categories into a single array for filtering and sorting
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = chatTargetRole ? user.role === chatTargetRole : true; // Filter by role if provided
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => (b.unreadCount || 0) - (a.unreadCount || 0)); // Sort by unread count descending

  return (
    <div className="flex h-[80vh] text-gray-800">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 flex flex-col gap-4 overflow-y-auto">
        {loading && <p>Loading conversations...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-2">
              {chatTargetRole ? `Chat with ${chatTargetRole.charAt(0).toUpperCase() + chatTargetRole.slice(1)}s` : 'All Chats'}
            </h3>
            <div className="relative mb-4">
              <Input
                type="text"
                placeholder="Search here..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="space-y-2">
              {allFilteredConversations.length === 0 ? (
                <p className="text-gray-600 text-sm">No conversations found.</p>
              ) : (
                allFilteredConversations.map(user => (
                  <div key={user.id} className={`flex items-center justify-between space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md ${user.role === 'admin' ? 'border-2 border-purple-500' : ''}`} onClick={() => setSelectedUser(user)}>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={import.meta.env.VITE_API_URL + "/" + user.profilePic} />
                        <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="flex items-center">
                          {user.name}
                          {user.role === 'admin' && (
                            <span className="ml-2 px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">Admin</span>
                          )}
                        </span>
                        {user.role && <span className="text-xs text-gray-500 capitalize">{user.role.replace('-', ' ')}</span>}
                      </div>
                    </div>
                    {user.unreadCount > 0 && (
                      <span className="flex h-2 w-2 translate-x-1 translate-y-1 rounded-full bg-red-500" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Chat Area */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white w-full">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center space-x-3 p-4 border-b w-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={() => setSelectedUser(null)}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <Avatar>
                <AvatarImage src={import.meta.env.VITE_API_URL + selectedUser.profilePic} />
                <AvatarFallback>{selectedUser.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="text-lg font-semibold">{selectedUser.name}</span>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto w-full">
              {loading && <p>Loading messages...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {!loading && !error && messages.map((message, index) => (
                <div key={index} className={`flex items-start space-x-3 mb-4 ${message.sender === selectedUser.id ? '' : 'justify-end'}`}>
                   {message.sender === selectedUser.id && (
                     <Avatar>
                       <AvatarImage src={import.meta.env.VITE_API_URL + selectedUser.profilePic} />
                       <AvatarFallback>{selectedUser.name.substring(0, 2)}</AvatarFallback>
                     </Avatar>
                   )}
                   <div className="flex flex-col">
                    <div className={`p-3 rounded-lg max-w-xs ${message.sender === selectedUser.id ? 'bg-gray-200' : 'bg-purple-500 text-white'}`}>
                      {message.content}
                    </div>
                    <span className={`text-xs text-gray-500 mt-1 ${message.sender === selectedUser.id ? 'self-start' : 'self-end'}`}>
                      {message.timestamp}
                    </span>
                  </div>
                   {message.sender !== selectedUser.id && (
                     <Avatar>
                       <AvatarImage src={currentUser?.profilePic || "/src/assets/profile-pic.png"} />
                       <AvatarFallback>{currentUser?.name?.substring(0, 2) || 'ME'}</AvatarFallback>
                     </Avatar>
                   )}
                 </div>
              ))}
            </div>

            {/* Message Input Area */}
            <div className="p-4 border-t flex items-center space-x-3 w-full">
              <Input
                type="text"
                placeholder="Text..."
                className="flex-1"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(inputMessage); }}
              />
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 className="h-6 w-6 text-gray-500 cursor-pointer"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke="currentColor"
                 onClick={() => handleSendMessage(inputMessage)}
               >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-2">Welcome 👋 {currentUser?.name} ✨</h2>
            <p className="text-gray-600 mb-4">Select a chat to start messaging</p>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-.5 4.5a1 1 0 01-1.9.1L12 16h-3z" />
            </svg>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
