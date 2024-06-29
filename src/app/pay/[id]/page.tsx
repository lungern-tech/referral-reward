import Submit from '@/components/pay/submit'
import { auth } from '@/app/auth'
import mongoClient from "@/lib/mongodb"
import Task from '@/models/Task'
import { ObjectId } from 'mongodb'


const getTask = async (id: string) => {
  const task = await mongoClient.collection<Task>('task').findOne({ _id: new ObjectId(id) })
  return task
}

export default async function ({ params }: { params: { id: string } }) {

  const session = await auth()

  const task = await getTask(params.id)



  return (
    <>
      <div>{String(task._id)}</div>
      <div>{task.title}</div>
      <div>{String(task.start_time)}</div>
      <div>{task.status}</div>
      <div>{task.chain}</div>
      <div>spend: </div>
      <div>{task.reward * task.reward_count}</div>
      <div className="interaction"></div>
      <Submit account={session.address} taskId={params.id}></Submit>
    </>
  )
}