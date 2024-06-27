// Enable client-side rendering
'use client';

// Import necessary hooks and components from React and Next.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Requests from './homepage/requests';
import Experts from './homepage/experts';
import Chats from './homepage/chats';
import Usernav from './usernav';

// Define the main Page component
const Page = () => {
  // Get route parameters using useParams hook
  const params = useParams();

  // Initialize state variables
  const [experts, setExperts] = useState([]); // Variable to store list of experts
  const [user, setUser] = useState({});  // Variable to store user data
  const [display, setDisplay] = useState("experts"); // Variable to control what is displayed

  // Fetch experts from the API
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

  // Fetch user data from the API
  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/user/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // Set display state to 'chats' and fetch user data
  const displayChats = () => { 
    setDisplay('chats'); 
    fetchUser();
  };

  // Set display state to 'requests' and fetch user data
  const displayRequests = () => { 
    setDisplay('requests'); 
    fetchUser();
  };

  // Set display state to 'experts' and fetch user data
  const displayExperts = () => { 
    setDisplay('experts'); 
    fetchUser();
  };

  // Fetch experts and user data when the component mounts
  useEffect(() => {
    fetchExperts();
    fetchUser();
  }, []);
  
  return (
    <div>
      {/* Render user navigation bar with props */}
      <Usernav 
        username={user.username}
        onChatsClick={displayChats}
        onExpertsClick={displayExperts}
        onRequestsClick={displayRequests}
      />
      <div className="container mx-auto mt-8 px-4">
        {/* Render content based on the current display state */}
        {display === 'experts' && <Experts user={user} experts={experts} />}
        {display === 'requests' && <Requests user={user} />}
        {display === 'chats' && <Chats user={user} />}
      </div>
    </div>
  );
};

export default Page;
