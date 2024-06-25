const Expert = require('../../../../models/expertmodel');
const connectMongoDB = require('../../../../libs/mongodb');
import { NextResponse } from 'next/server';

export async function POST(req) {
  await connectMongoDB();

  try {
    const { username } =await req.json();
    console.log(username);
    const user = await Expert.findOne({ username:username });
    if (user) {
      console.log(user);
    }
    return NextResponse.json({ available: !user });
  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
