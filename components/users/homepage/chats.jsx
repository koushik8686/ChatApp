import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { io } from 'socket.io-client';

export default function Chats() {
  const { id } = useParams();
  const [user, setUser] = useState({ chats: [] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io('http://localhost:4000');
    setSocket(newSocket);

    newSocket.on('receive_msg', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    newSocket.on('last_10_msgs', (data) => {
      setMessages(data);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/user/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      setError('Error fetching user');
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  const joinChatRoom = (chatId) => {
    socket.emit('join_room', chatId);
    setCurrentChat(chatId);
  };

  const sendMessage = () => {
    if (newMessage.trim() === '') return;
    const messageData = {
      roomId: currentChat,
      message: newMessage,
      sent_by: user._id,
      name: user.username,
      time: new Date(),
    };
    socket.emit('send_msg', messageData);
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setNewMessage('');
  };

  const disconnect = () => {
    setCurrentChat(null);
    socket.emit('leave_room', currentChat);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto mt-8 px-4">
      {currentChat ? (
        <div className="chat-box bg-white p-6 rounded-lg shadow-lg">     
          <div className="messages space-y-4 overflow-y-auto max-h-72">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message flex ${msg.sent_by === user._id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-4 rounded-lg max-w-xs ${msg.sent_by === user._id ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'}`}
                >
                  <p>
                    <strong>{msg.name}:</strong> {msg.message}
                  </p>
                  <p className="text-xs mt-2">{new Date(msg.time).toLocaleString()}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} /> {/* Empty div for scrolling to bottom */}
          </div>
          <div className="flex space-x-2 mt-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-grow p-2 border rounded"
            />
            <button
              onClick={sendMessage}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Send
            </button>
            <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            onClick={disconnect}
          >
            Back
          </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Chats</h2>
          {user.chats.length === 0 ? (
            <p>No chats found.</p>
          ) : (
            <ul className="space-y-4">
              {user.chats.map((chat) => (
                <li
                  key={chat.chatid}
                  className="bg-white p-4 rounded-lg shadow-lg border border-gray-200"
                >
                  <p className="text-gray-800 mb-1">
                    <strong>Name:</strong> {chat.expertname}
                  </p>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    onClick={() => joinChatRoom(chat.chatid)}
                  >
                    Chat
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
