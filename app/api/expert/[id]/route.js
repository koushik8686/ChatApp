import { NextResponse } from 'next/server';
import connectMongoDB from '../../../../libs/mongodb';
import Experts from '../../../../models/expertmodel';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    await connectMongoDB();

    const expert = await Experts.findOne({ _id: id });
    if (!expert) {
      return NextResponse.json({ message: 'Expert not found' }, { status: 404 });
    }
    return NextResponse.json({ expert: expert}, { status: 200 });
  } catch (error) {
    console.error('Error fetching expert:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
