const User = require('../../../../models/usermodel');
const Expert = require('../../../../models/expertmodel');
const Chat = require('../../../../models/chatmodel'); // Import the Chat model
const connectMongoDB = require('../../../../libs/mongodb');
import { NextResponse } from 'next/server';

export async function POST(request) {
  await connectMongoDB();
  try {
    const { userID, expertID } = await request.json();
    console.log(userID, expertID);
    
    // Find the user by ID
    const user = await User.findOne({ _id: userID });
    if (!user) {
      console.log("User not found");
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Find the expert by ID
    const expert = await Expert.findOne({ _id: expertID });
    if (!expert) {
      console.log("Expert not found");
      return NextResponse.json({ message: 'Expert not found' }, { status: 404 });
    }

    // Check if the request exists in the user's requests
    const userRequestIndex = user.requests.findIndex(req => req.expertid === expertID);
    if (userRequestIndex === -1) {
      return NextResponse.json({ message: 'Request not found' }, { status: 401 });
    }

    // Check if the request exists in the expert's requests
    const expertRequestIndex = expert.requests.findIndex(req => req.uid === userID);
    if (expertRequestIndex === -1) {
      return NextResponse.json({ message: 'Request not found' }, { status: 400 });
    }

    // Create a new chat document
    const newChat = new Chat({
      user: {
        name: user.username,
        id: userID,
      },
      expert: {
        name: expert.username,
        id: expertID,
      },
      messages: []
    });

    // Save the chat document
    const savedChat = await newChat.save();

    // Add the chat ID to the user's chats
    user.chats.push({
      expertid: expertID,
      expertname: expert.username,
      chatid: savedChat._id, // Add the chat ID
    });

    // Add the chat ID to the expert's chats
    expert.chats.push({
      userid: userID,
      name: user.username,
      chatid: savedChat._id, // Add the chat ID
    });

    // Remove the request from the user's requests
    user.requests.splice(userRequestIndex, 1);

    // Remove the request from the expert's requests
    expert.requests.splice(expertRequestIndex, 1);

    // Save the updated user and expert objects
    await user.save();
    await expert.save();

    return NextResponse.json({ message: 'Request accepted successfully', chatId: savedChat._id }, { status: 200 });
  } catch (error) {
    console.error('Error accepting request:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
