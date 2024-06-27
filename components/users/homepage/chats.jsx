import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';  // Assuming this is correct, otherwise adjust as needed
import { io } from 'socket.io-client';

export default function Chats() {
  const { id } = useParams(); // Fetching route parameter
  const [user, setUser] = useState({ chats: [] }); // State for user data
  const [error, setError] = useState(null); // State for error handling
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [currentChat, setCurrentChat] = useState(null); // State for current chat room
  const [messages, setMessages] = useState([]); // State for chat messages
  const [newMessage, setNewMessage] = useState(''); // State for new message input
  const [socket, setSocket] = useState(null); // State for socket connection
  const messagesEndRef = useRef(null); // Ref for scrolling to bottom of messages

  // Establishing socket connection and setting up event listeners
  useEffect(() => {
    const newSocket = io('http://localhost:4000'); // Connecting to socket server
    setSocket(newSocket); // Setting socket in state

    // Event listener for receiving new messages
    newSocket.on('receive_msg', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]); // Adding new message to state
    });

    // Event listener for receiving last 10 messages when joining chat
    newSocket.on('last_10_msgs', (data) => {
      setMessages(data); // Setting initial messages when joining chat
    });

    // Cleanup function to disconnect socket when component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []); // Empty dependency array means this effect runs only once, on mount

  // Function to fetch user data from API
  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/user/${id}`); // Fetching user data based on id
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      const data = await response.json(); // Parsing response JSON
      setUser(data.user); // Setting user data in state
    } catch (error) {
      setError('Error fetching user'); // Handling fetch error
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false); // Updating loading state
    }
  };

  // Effect to fetch user data on component mount
  useEffect(() => {
    fetchUser();
  }, []); // Empty dependency array ensures this effect runs once, on mount

  // Effect to scroll to bottom of messages whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Dependency on 'messages' state

  // Function to scroll to the bottom of the messages container
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  // Function to join a chat room
  const joinChatRoom = (chatId) => {
    socket.emit('join_room', chatId); // Emitting 'join_room' event to server
    setCurrentChat(chatId); // Updating current chat room state
  };

  // Function to send a message
  const sendMessage = () => {
    if (newMessage.trim() === '') return; // Ensuring message is not empty
    const messageData = {
      roomId: currentChat, 
      message: newMessage, 
      sent_by: user._id,
      name: user.username,
      time: new Date(), 
    };
    socket.emit('send_msg', messageData); // Emitting 'send_msg' event with message data
    setMessages((prevMessages) => [...prevMessages, messageData]); // Adding message to state
    setNewMessage(''); // Clearing message input after sending
  };

  // Function to disconnect from current chat room
  const disconnect = () => {
    setCurrentChat(null); // Clearing current chat room
    socket.emit('leave_room', currentChat); // Emitting 'leave_room' event to server
  };

  // Rendering different UI based on loading state and current chat room
  if (loading) {
    return <p>Loading...</p>; // Displaying loading indicator
  }

  if (error) {
    return <p>{error}</p>; // Displaying error message if fetchUser encountered an error
  }

  // Rendering chat interface if currentChat is set, otherwise rendering list of chats
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
            > Send</button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              onClick={disconnect}
            > Back </button>
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
