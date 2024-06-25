const Experts = require('../../../../models/expertmodel');
const connectMongoDB = require('../../../../libs/mongodb');
import { NextResponse } from 'next/server';
const mongoose = require('mongoose');

export async function POST(request) {
  try {
    await connectMongoDB()
    const { username, email, password ,description } =await request.json();
    const newUser = new Experts({ username, email,description, password ,requests:[],chats:[] });
    await newUser.save();
    return NextResponse.json({ message: 'Expert created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
