const User = require('../../../../models/usermodel');
const connectMongoDB = require('../../../../libs/mongodb');
import { NextResponse } from 'next/server';
const mongoose = require('mongoose');

export async function POST(request) {
  try {
    await connectMongoDB()
    const { username, email, password } =await request.json();
    const newUser = new User({ username, email, password ,requests:[],chats:[]});
    await newUser.save();
    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
