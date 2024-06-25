const Experts = require('../../../../models/expertmodel');
const connectMongoDB = require('../../../../libs/mongodb');
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectMongoDB()
    var Expertlist=[]
    await Experts.find().then((arr)=>{Expertlist=arr})
    return NextResponse.json({ Expertlist });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
