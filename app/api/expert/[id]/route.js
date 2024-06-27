import { NextResponse } from 'next/server'; // Importing Next.js response handler
import connectMongoDB from '../../../../libs/mongodb'; // Importing MongoDB connection function
import Experts from '../../../../models/expertmodel'; // Importing Expert model

export async function GET(request, { params }) {
  const { id } = params; // Extracting id from request parameters

  try {
    await connectMongoDB(); // Connecting to MongoDB

    // Finding expert by id in MongoDB
    const expert = await Experts.findOne({ _id: id });
    if (!expert) {
      // If expert not found, return 404 status with message
      return NextResponse.json({ message: 'Expert not found' }, { status: 404 });
    }

    // If expert found, return 200 status with expert data
    return NextResponse.json({ expert: expert }, { status: 200 });
  } catch (error) {
    console.error('Error fetching expert:', error); // Logging error to console

    // If error occurs, return 500 status with error message
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
