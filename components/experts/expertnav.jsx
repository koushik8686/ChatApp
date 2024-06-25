'use client'

import React from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Expertrnav(params) {
    const router = useRouter();
    const handleLogout = () => {
      // Remove the authentication cookie
      Cookies.remove('expert'); // Change 'authToken' to the name of your cookie
      router.push('/expert/login'); // Change '/login' to your desired route
    };
  return (
<div className="bg-blue-600">
<nav className="container mx-auto px-6 py-3 flex-row">
        <div className="flex items-center justify-between">
          <div className="text-white">
              <p className="text-lg font-semibold">{params.username}</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-4">
                <p onClick={params.onChatsClick}className="text-gray-300 hover:text-white">Chats</p>
                <p onClick={params.onRequestsClick} className="text-gray-300 hover:text-white">My Requests</p>
             <button className='text-red-600 hover:text-red cursor-pointer' onClick={handleLogout}>Logout</button>
            </div>
            <div className="flex items-center">
              <form className="flex space-x-2">
                <input
                  type="text"
                  className="px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Search"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:border-blue-300">
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="md:hidden flex items-center">
          <button className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>
    </div>
  );
}
