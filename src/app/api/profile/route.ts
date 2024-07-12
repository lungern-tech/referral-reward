import { auth } from '@/app/auth';
import mongoClient from "@/lib/mongodb";
import User from '@/models/User';
import { ObjectId } from "mongodb";
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest, response: NextResponse) {
  const user = await auth()
  if (!user) {
    return NextResponse.json({
      error: 'User not found'
    })
  }
  const userInfo = await mongoClient.collection<User>('user').findOne({ wallet: user.address })

  if (userInfo) {
    return NextResponse.json(userInfo)
  } else {
    await mongoClient.collection('user').insertOne({
      wallet: user.address,
    })
  }
  return NextResponse.json({

  })
}

export async function POST(request: NextRequest, response: NextResponse) {
  const user = await auth()
  if (!user) {
    return NextResponse.json({
      error: 'User not found'
    })
  }
  const body = await (request.json() as Promise<Partial<User>>)
  const { _id, ...updateInfo } = body
  const userInfo = await mongoClient.collection<User>('user').updateOne({ _id: new ObjectId(body._id) }, {
    $set: {
      ...updateInfo
    }
  })
  return NextResponse.json(userInfo)
}