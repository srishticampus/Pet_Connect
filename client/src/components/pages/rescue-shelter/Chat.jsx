import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null); // State to hold the selected user
  return (
    <div className="flex h-[80vh] text-gray-800">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 flex flex-col gap-4 overflow-y-auto">
        {/* Adopter Section */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Adopter</h3>
          <div className="relative mb-4">
            <Input type="text" placeholder="Search here..." className="pl-8" />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="space-y-2">
            {/* Example User */}
            <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md" onClick={() => setSelectedUser({ name: 'Priya' })}>
              <Avatar>
                <AvatarImage src="/path/to/adopter-avatar-1.jpg" />
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <span>Abisha</span>
            </div>
             <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md" onClick={() => setSelectedUser({ name: 'Richard' })}>
              <Avatar>
                <AvatarImage src="/path/to/adopter-avatar-2.jpg" />
                <AvatarFallback>PR</AvatarFallback>
              </Avatar>
              <span>Priya</span>
            </div>
             <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md" onClick={() => setSelectedUser({ name: 'Abisha' })}>
              <Avatar>
                <AvatarImage src="/path/to/adopter-avatar-3.jpg" />
                <AvatarFallback>JE</AvatarFallback>
              </Avatar>
              <span>Jersha</span>
            </div>
          </div>
        </div>

        {/* Foster Section */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Foster</h3>
           <div className="relative mb-4">
            <Input type="text" placeholder="Search here..." className="pl-8" />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="space-y-2">
            {/* Example User */}
            <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md" onClick={() => setSelectedUser({ name: 'Abisha' })}>
              <Avatar>
                <AvatarImage src="/path/to/foster-avatar-1.jpg" />
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <span>Abisha</span>
            </div>
             <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md" onClick={() => setSelectedUser({ name: 'Priya' })}>
              <Avatar>
                <AvatarImage src="/path/to/foster-avatar-2.jpg" />
                <AvatarFallback>PR</AvatarFallback>
              </Avatar>
              <span>Priya</span>
            </div>
             <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md" onClick={() => setSelectedUser({ name: 'Jersha' })}>
              <Avatar>
                <AvatarImage src="/path/to/foster-avatar-3.jpg" />
                <AvatarFallback>JE</AvatarFallback>
              </Avatar>
              <span>Jersha</span>
            </div>
          </div>
        </div>

        {/* Pet Owner Section */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Pet Owner</h3>
           <div className="relative mb-4">
            <Input type="text" placeholder="Search here..." className="pl-8" />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="space-y-2">
            {/* Example User */}
            <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md" onClick={() => setSelectedUser({ name: 'Abisha' })}>
              <Avatar>
                <AvatarImage src="/path/to/pet-owner-avatar-1.jpg" />
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <span>Abisha</span>
            </div>
             <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md" onClick={() => setSelectedUser({ name: 'Priya' })}>
              <Avatar>
                <AvatarImage src="/path/to/pet-owner-avatar-2.jpg" />
                <AvatarFallback>PR</AvatarFallback>
              </Avatar>
              <span>Priya</span>
            </div>
             <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md" onClick={() => setSelectedUser({ name: 'Jersha' })}>
              <Avatar>
                <AvatarImage src="/path/to/pet-owner-avatar-3.jpg" />
                <AvatarFallback>JE</AvatarFallback>
              </Avatar>
              <span>Jersha</span>
            </div>
          </div>
        </div>
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
                <AvatarImage src="/src/assets/profile-pic.png" /> {/* Placeholder image */}
                <AvatarFallback>RI</AvatarFallback>
              </Avatar>
              <span className="text-lg font-semibold">{selectedUser.name}</span>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto w-full">
              {/* Example Incoming Message */}
              <div className="flex items-start space-x-3 mb-4">
                <Avatar>
                  <AvatarImage src="/src/assets/profile-pic.png" /> {/* Placeholder image */}
                  <AvatarFallback>RI</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="bg-gray-200 p-3 rounded-lg max-w-xs">
                    Hiiii
                  </div>
                  <span className="text-xs text-gray-500 mt-1 self-start">4:20 PM</span>
                </div>
              </div>

              {/* Example Outgoing Message */}
              <div className="flex items-start justify-end space-x-3 mb-4">
                 <div className="flex flex-col items-end">
                  <div className="bg-purple-500 text-white p-3 rounded-lg max-w-xs">
                    How can I help you ?
                  </div>
                  <span className="text-xs text-gray-500 mt-1 self-end">4:20 PM</span>
                </div>
                 <Avatar>
                  <AvatarImage src="/src/assets/profile-pic.png" /> {/* Placeholder image */}
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
              </div>

               {/* Example Incoming Message */}
              <div className="flex items-start space-x-3 mb-4">
                <Avatar>
                  <AvatarImage src="/src/assets/profile-pic.png" /> {/* Placeholder image */}
                  <AvatarFallback>RI</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="bg-gray-200 p-3 rounded-lg max-w-xs">
                    Pets update...?
                  </div>
                  <span className="text-xs text-gray-500 mt-1 self-start">4:20 PM</span>
                </div>
              </div>

               {/* Example Outgoing Message */}
              <div className="flex items-start justify-end space-x-3 mb-4">
                 <div className="flex flex-col items-end">
                  <div className="bg-purple-500 text-white p-3 rounded-lg max-w-xs">
                    It's Good.
                  </div>
                  <span className="text-xs text-gray-500 mt-1 self-end">4:20 PM</span>
                </div>
                 <Avatar>
                  <AvatarImage src="/src/assets/profile-pic.png" /> {/* Placeholder image */}
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Message Input Area */}
            <div className="p-4 border-t flex items-center space-x-3 w-full">
              <Input type="text" placeholder="Text..." className="flex-1" />
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-2">Welcome 👋 Ashika ✨</h2>
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

export default Chat;