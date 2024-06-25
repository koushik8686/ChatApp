'use client'
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Requests from './homepage/requests'
import Experts from './homepage/experts'
import Chats from './homepage/chats'
import Usernav from './usernav';

const Page = () => {
  const params = useParams();
  const [experts, setExperts] = useState([]); // variablle for experts
  const [user, setuser] = useState({});  // variablle for users
  const [error, setError] = useState(null);
  const [display , setDisplay] = useState("experts")
  const fetchExperts = async () => {
    try {
      const response = await fetch('/api/expert/experts');
      if (!response.ok) {
        throw new Error('Failed to fetch experts');
      }
      const data = await response.json();
      setExperts(data.Expertlist);
    } catch (error) {
      setError('Error fetching experts');
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
      setError('Error fetching experts');
      console.error('Error fetching experts:', error);
    }
  };

  const displaychats= ()=>{ setDisplay('chats'); fetchuser();}
  const displayrequests= ()=>{setDisplay('requests'); fetchuser();}
  const displayexperts= ()=>{setDisplay('experts'); fetchuser();}


  useEffect(() => {
    fetchExperts();
    fetchuser();
  }, []);
  
  return(
    <div>
      <Usernav username={user.username}onChatsClick={displaychats}onExpertsClick={displayexperts}onRequestsClick={displayrequests}/>
      <div className="container mx-auto mt-8 px-4">
        {/* Render content based on display state */}
        {display === 'experts' && <Experts user={user} experts={experts} />}
        {display === 'requests' && <Requests user={user} />}
        {display === 'chats' && <Chats user={user} />}
      </div>
    </div>
  )
 
};

export default Page;
