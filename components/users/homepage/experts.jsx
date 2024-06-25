'use client'

import React from 'react'
import Usernav from '../usernav'
import { useState ,useEffect } from 'react';
import { useParams } from 'next/navigation';
export default function Experts()  {
  const params= useParams()
  const [successfulRequests, setSuccessfulRequests] = useState([]);
  const [experts, setExperts] = useState([]); // variablle for experts
  const [user, setuser] = useState({});  // variablle for users
  const fetchExperts = async () => {
    try {
      const response = await fetch('/api/expert/experts');
      if (!response.ok) {
        throw new Error('Failed to fetch experts');
      }
      const data = await response.json();
      setExperts(data.Expertlist);
    } catch (error) {
      console.error('Error fetching experts:', error);
    }
  };
  const fetchuser = async () => {
    try {
      const response = await fetch(`/api/user/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch experts');
      }
      const data = await response.json();
      setuser(data.user);
    } catch (error) {
  
      console.error('Error fetching experts:', error);
    }
  };
  const getRandomGradient = () => {
    const colors = [
      '#ff9a9e', '#fad0c4', '#fad0c4', '#ff9a9e',
      '#a18cd1', '#fbc2eb', '#fbc2eb', '#a18cd1',
      '#fad0c4', '#ffd1ff', '#ffd1ff', '#fad0c4',
      '#ffecd2', '#fcb69f', '#fcb69f', '#ffecd2',
      '#ff9a9e', '#fecfef', '#fecfef', '#ff9a9e',
      '#a1c4fd', '#c2e9fb', '#c2e9fb', '#a1c4fd',
      '#d4fc79', '#96e6a1', '#96e6a1', '#d4fc79',
      '#fbc2eb', '#a6c1ee', '#a6c1ee', '#fbc2eb',
      '#84fab0', '#8fd3f4', '#8fd3f4', '#84fab0',
      '#fccb90', '#d57eeb', '#d57eeb', '#fccb90',
      '#e0c3fc', '#8ec5fc', '#8ec5fc', '#e0c3fc',
      '#a8edea', '#fed6e3', '#fed6e3', '#a8edea',
      '#f093fb', '#f5576c', '#f5576c', '#f093fb',
      '#4facfe', '#00f2fe', '#00f2fe', '#4facfe',
      '#43e97b', '#38f9d7', '#38f9d7', '#43e97b',
      '#fa709a', '#fee140', '#fee140', '#fa709a'
    ];
    const randomIndex = () => Math.floor(Math.random() * colors.length);
    return `linear-gradient(to right, ${colors[randomIndex()]}, ${colors[randomIndex()]})`;
  };
  
  useEffect(() => {
    fetchExperts();
    fetchuser();
  }, []);
  
  const handleRequestChat = async (expertId, username) => {
    try {
      const response = await fetch(`/api/expert/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expertID: expertId,
          expertname: username,
          userID: params.id, 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send request');
      }
      console.log('Request sent successfully');
      setSuccessfulRequests(prevState => [...prevState, expertId]);
      fetchExperts();
      fetchuser();
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-2 xl:grid-cols-2">
      {experts.map((expert) => (
        <div key={expert.email} className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 flex">
          <div
            className="w-40 h-full rounded-l-lg"
            style={{ background: getRandomGradient() }}
          ></div>
          <div className="p-4 flex-1">
            <h2 className="text-xl font-semibold mb-2">{expert.username}</h2>
            <p className="text-gray-600 mb-2">{expert.email}</p>
            <p className="text-gray-600 mb-4">{expert.description}</p>
            <button
              className={`px-4 py-2 rounded ${
                successfulRequests.includes(expert._id) ? 'bg-green-500' : 'bg-blue-500'
              } text-white`}
              onClick={() => handleRequestChat(expert._id, expert.username)}
              disabled={successfulRequests.includes(expert._id)}
            >
              {successfulRequests.includes(expert._id) ? 'Request Sent' : 'Request for Chat'}
            </button>
            {successfulRequests.includes(expert._id) && (
              <p className="text-green-500 mt-2">Request sent successfully!</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
