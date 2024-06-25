"use client";

import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { useParams, useRouter } from 'next/navigation';
import Nav from './expertnav';
import { io } from 'socket.io-client';

export default function Page() {
  const router = useRouter();
  const { id } = useParams();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayRequests, setDisplayRequests] = useState(true);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const handleRequestsClick = () => {
    fetchData();
    setDisplayRequests(true);
    setCurrentChat(null);
  };

  const handleChatsClick = () => {
    fetchData();
    setDisplayRequests(false);
    setCurrentChat(null);
  };

  const handleLogout = () => {
    Cookies.remove('expert');
    router.push('/expert/login');
  };

  const handleAcceptRequest = async (requestID, userID) => {
    try {
      const response = await fetch('/api/expert/acceptrequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expertID: id,
          userID: userID,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to accept request');
      }

      const data = await response.json();
      setExpert(prevExpert => ({
        ...prevExpert,
        requests: prevExpert.requests.filter(request => request._id !== requestID),
        chats: [...prevExpert.chats, { name: data.username, uid: userID, chatid: requestID }],
      }));
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/expert/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch expert');
      }
      const data = await response.json();
      setExpert(data.expert);
      setLoading(false);
    } catch (error) {
      setError('Error fetching expert');
      setLoading(false);
      console.error('Error fetching expert:', error);
    }
  };

  useEffect(() => {
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);

    newSocket.on("receive_msg", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    newSocket.on("last_10_msgs", (data) => {
      console.log("data receivrd ",data);
      setMessages(data);
      console.log( "messages", messages);
      console.log("yo");
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const joinChatRoom = (chatId) => {
    if (socket) {
      socket.emit("join_room", chatId);
      setCurrentChat(chatId);
    }
  };

  const leaveChatRoom = () => {
    if (socket && currentChat) {
      socket.emit('leave_room', currentChat);
      setCurrentChat(null);
      setMessages([]);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    const messageData = {
      roomId: currentChat,
      message: newMessage,
      sent_by: expert._id,
      name: expert.username,
      time: new Date(),
    };

    if (socket) {
      socket.emit("send_msg", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage("");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <Nav onRequestsClick={handleRequestsClick} onChatsClick={handleChatsClick} username={expert.username} />
      <div className="container mx-auto mt-8 px-4">
        {currentChat ? (
          <div className="chat-box border p-4 rounded shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Chat Room: {currentChat}</h3>
            <div className="messages space-y-4 mb-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {messages.map((msg, index) => (
                <div key={index} className={`message flex ${msg.sent_by === expert._id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-4 rounded-lg max-w-xs ${msg.sent_by === expert._id ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'}`}>
                    <p><strong>{msg.name}:</strong> {msg.message}</p>
                    <p className="text-xs mt-2">{new Date(msg.time).toLocaleString()}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef}></div> {/* Ref element for scrolling to the end */}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-grow p-2 border rounded"
              />
              <button onClick={sendMessage} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                Send
              </button>
              <button onClick={leaveChatRoom} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-2">
                Back
              </button>
            </div>
          </div>
        ) : displayRequests ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Requests</h2>
            {expert.requests.length === 0 ? (
              <p>No requests found.</p>
            ) : (
              <ul className="space-y-4">
                {expert.requests.map((request) => (
                  <li key={request._id} className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                    <p className="text-gray-800 mb-1"><strong>Name:</strong> {request.name}</p>
                    <p className="text-gray-800 mb-2">{new Date(request.timeStamp).toLocaleString()}</p>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                      onClick={() => handleAcceptRequest(request._id, request.uid)}
                    >
                      Accept
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">Chats</h2>
            {expert.chats.length === 0 ? (
              <p>No chats found.</p>
            ) : (
              <ul className="space-y-4">
                {expert.chats.map((chat) => (
                  <li key={chat.chatid} className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                    <p className="text-gray-800 mb-1"><strong>Name:</strong> {chat.name}</p>
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
    </div>
  );
}
