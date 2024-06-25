const User = require('../../../../models/usermodel');
const Experts = require('../../../../models/expertmodel');
const connectMongoDB = require('../../../../libs/mongodb');
import { NextResponse } from 'next/server';

export async function POST(request) {
  await connectMongoDB();
  try {
    const { userID, expertname, expertID } = await request.json();
    console.log(userID, expertname, expertID);
    // Find the user by ID and check if the request already exists
    const user = await User.findOne({ _id: userID });
    // Check if the request already exists for the user
    const existingUserRequest = user.requests.find(req => req.expertid === expertID);
    if (existingUserRequest) {
      return NextResponse.json({ message: 'Request already sent for this expert' }, { status: 400 });
    }

    // Push data into the user's requests array
    user.requests.push({
      expertname: expertname,
      expertid: expertID,
      timeStamp: Date.now()
    });

    // Save the updated user object
    await user.save();

    // Find the expert by ID and check if the request already exists
    const expert = await Experts.findOne({ _id: expertID });
    if (!expert) {
      return NextResponse.json({ message: 'Expert not found' }, { status: 404 });
    }
    // Check if the request already exists for the expert
    const existingExpertRequest = expert.requests.find(req => req.uid === userID);
    if (existingExpertRequest) {
      return NextResponse.json({ message: 'Request already sent for this expert' }, { status: 400 });
    }
    // Push data into the expert's requests array
    expert.requests.push({
      name: user.username,
      uid: userID,
      timeStamp: Date.now()
    });

    // Save the updated expert object
    await expert.save();

    return NextResponse.json({ message: 'Request added successfully', username: user.username }, { status: 201 });
  } catch (error) {
    console.error('Error adding request:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// export async function GET(request) {
//   return NextResponse.json("hello");
// }