const Expert = require('../../../../models/expertmodel');
const Connectmongodb = require('../../../../libs/mongodb');
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'

export async function POST(req, res) {
  await Connectmongodb();
  try {
    const { username, password } = await req.json();
    const user = await Expert.findOne({ username });
    if (user && user.password === password) {
      // Initialize Cookies instance
      cookies().set('expert ', user._id)
      console.log("Successfully logged in");
      return NextResponse.json({ message: 'Success', ExpertID: user._id }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
