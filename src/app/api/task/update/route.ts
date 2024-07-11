import { auth } from "@/app/auth"
import client from "@/lib/mongodb"
import Task from "@/models/Task"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"
export async function POST(request: Request) {
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