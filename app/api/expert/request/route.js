const User = require('../../../../models/usermodel');
const Experts = require('../../../../models/expertmodel');
const connectMongoDB = require('../../../../libs/mongodb');
import { NextResponse } from 'next/server';
var nodemailer = require('nodemailer');

const email = "hexart637@gmail.com";
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email,
    pass: 'ovss zdzg ktkf rptu'
  }
});

export async function POST(request) {
  await connectMongoDB();
  try {
    const { userID, expertID ,expertname } = await request.json();
    console.log(userID, expertID);
    
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

    // Send email to the expert
    var mailOptions = {
      from: email,
      to: expert.email, // Assuming expert object has an email field
      subject: 'New Request Received',
      html: `<h3>New Request Received</h3>
      <p>You have received a new request from ${user.username}.</p>
      <h5>Request Details :</h5>
      <p>User Name: ${user.username}</p>
      <p>Timestamp: ${new Date().toLocaleString()}</p>`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log("Mail sent: " + info.response);
      }
    });

    return NextResponse.json({ message: 'Request added successfully', username: user.username }, { status: 201 });
  } catch (error) {
    console.error('Error adding request:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
