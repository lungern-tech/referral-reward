import { auth } from "@/app/auth"
import client from "@/lib/mongodb"
import Task from "@/models/Task"
import { ObjectId } from "mongodb"
import { NextRequest, NextResponse } from "next/server"
export async function PATCH(request: Request) {
  const session = await auth()
  let body = await request.json() as { deploy_hash?: string, task_id: string, contract_address?: string }
  let task = await client.collection<Task>("task").findOne({
    _id: new ObjectId(body.task_id),
    creator: new ObjectId(session.id)
  })
  if (!task) {
    return new Response("Task not found", {
      status: 404
    })
  }
  let updateParams = JSON.parse(JSON.stringify({
    ...body,
    task_id: undefined,
    creator: undefined,
    updated_at: new Date()
  }))
  await client.collection("task").updateOne({
    _id: new ObjectId(body.task_id)
  }, {
    $set: {
      ...updateParams
    }
  })
  return NextResponse.json({ message: "Update Successfully" })
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams
  const task = await client.collection("task").findOne({
    _id: new ObjectId(query.get("id")!)
  })
  return new NextResponse(JSON.stringify(task), {
    status: 200
  })
}


export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  let wallet = session.address
  const user = await client.collection("user").findOne({ wallet: wallet })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }
  let body = (await request.json()) as Task

  const task = await client.collection("task").insertOne({
    ...body,
    _id: undefined,
    wallet: wallet,
    creator: user._id,
    start_time: new Date(body.start_time),
    end_time: new Date(body.end_time),
    created_at: new Date(),
    updated_at: new Date(),
  })
  return NextResponse.json(task)
}

export async function DELETE(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  let wallet = session.address
  const user = await client.collection("user").findOne({ wallet: wallet })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }
  const body = await request.json() as { task_id: string }
  const task = await client.collection<Task>("task").findOne({
    _id: new ObjectId(body.task_id)
  })
  console.log(task.creator, session.userInfo._id)
  if (task.creator.toString() !== session.userInfo._id) {
    return NextResponse.json({ error: "User not creator" }, { status: 403 })
  }
  await client.collection<Task>("task").deleteOne({
    _id: new ObjectId(body.task_id)
  })
  return NextResponse.json({ message: "Delete Successfully" })
}