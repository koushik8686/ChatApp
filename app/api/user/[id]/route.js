import { NextResponse } from 'next/server';
import connectMongoDB from '../../../../libs/mongodb';
import Users from '../../../../models/usermodel';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    await connectMongoDB();
    const user = await Users.findOne({ _id: id });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ user: user }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
