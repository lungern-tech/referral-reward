import { auth } from "@/app/auth"
import mongoClient from "@/lib/mongodb"
import Task from "@/models/Task"
import { NextRequest, NextResponse } from "next/server"
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  let wallet = session.address
  const user = await mongoClient.collection("user").findOne({ wallet: wallet })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }
  let body = (await request.json()) as Task

  const task = await mongoClient.collection("task").insertOne({
    ...body,
    _id: undefined,
    wallet: wallet,
    creator: user._id,
    created_at: new Date(),
    updated_at: new Date(),
  })
  return NextResponse.json(task)
}