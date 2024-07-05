import { auth } from "@/app/auth";
import client from "@/lib/mongodb";
import Interaction, { InteractStatus } from "@/models/Interaction";
import Task from "@/models/Task";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PUT(request) {
  const formData = await request.json();
  const taskId = formData.task_id
  const id = formData.id
  const session = await auth();

  const task = await client.collection<Task>("task").findOne({
    _id: new ObjectId(taskId as string),
  })
  if (task.creator.toString() !== session.id) {
    return NextResponse.json({ message: 'You are not the creator of this task' }, { status: 400 });
  }

  const check = await client.collection<Interaction>("interaction").findOne({
    _id: new ObjectId(id as string),
  })
  if (check.transition_hash) {
    return NextResponse.json({ message: 'User reward has been sent', data: { transition_hash: check.transition_hash } }, { status: 400 });
  }

  await client.collection<Interaction>("interaction").updateOne({
    _id: new ObjectId(id as string),
  }, {
    $set: {
      transition_hash: formData.get('transition_hash'),
      status: InteractStatus.RewardSent
    }
  })

  return NextResponse.json({ message: 'update successfully' });
}