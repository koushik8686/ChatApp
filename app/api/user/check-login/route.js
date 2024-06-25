import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'

export async function GET(req, res) {
    const cookieStore = cookies()
    const ID = cookieStore.get('user')
    console.log(ID);
    if (ID) {
    return NextResponse.json({ id: ID }, { status: 200 });
  } else {
    return NextResponse.json({ id: null }, { status: 200 });
  }
}
