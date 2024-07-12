import { auth } from "@/app/auth";
import client from "@/lib/mongodb";
import Interaction, { InteractStatus } from "@/models/Interaction";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  const session = await auth()
  const formData = await request.formData();
  const file = formData.get('proof');
  const taskId = formData.get('taskId');
  const check = await client.collection<Interaction>("interaction").findOne({
    task_id: new ObjectId(taskId as string),
    user_id: new ObjectId(session.id),
  })
  if (check) {
    return NextResponse.json({ message: 'You have already joined this task' }, { status: 400 });
  }
  await client.collection<Interaction>("interaction").insertOne({
    task_id: new ObjectId(taskId as string),
    proof: {
      image_link: file,
    },
    created_at: new Date(),
    user_id: new ObjectId(session.id),
    status: InteractStatus.Joined
  })
  return NextResponse.json({ message: 'Join in successfully' });
}