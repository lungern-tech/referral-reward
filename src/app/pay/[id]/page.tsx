import Submit from "@/components/pay/submit"
import mongoClient from "@/lib/mongodb"
import Task, { TaskStatus } from '@/models/Task'
import { format } from "@/utils/DateFormat"
import { ObjectId } from 'mongodb'
import Image from 'next/image'


const getTask = async (id: string) => {
  const task = await mongoClient.collection<Task>('task').findOne({ _id: new ObjectId(id) })
  return task
}

export default async function ({ params }: { params: { id: string } }) {

  const task = await getTask(params.id)
  return (
    <div className="mx-auto mb-16" style={{ width: '720px' }}>
      <h1 className="text-2xl font-bold mt-16">Reward Page Preview</h1>
      <div className="mt-8 text-3xl font-bold">{task.title}</div>
      <div className='mt-5 flex'>
        <div>(UTC+8){format(new Date(task.start_time), 'YYYY-MM-DD hh:mm')} ~ {format(new Date(task.end_time), 'YYYY-MM-DD hh:mm')}</div>
      </div>
      <Image className='rounded-md mt-5' src={`${task.cover_image}`} width="720" height="20" alt='cover_image'></Image>
      <div className="font-xl text-gray-dark-400">
        <div className='mt-5'>
          <div className='' dangerouslySetInnerHTML={{ __html: task.description }}>
          </div>
        </div>
      </div>
      <div className='mt-8 font-bold text-xl'>
        Cost Overview
      </div>
      <div className='mt-5'>
        <div className='flex'>
          <div className='mr-2'>Reward Amount: </div>
          <div>{task.reward} * {task.reward_count} = {task.reward * task.reward_count} USDT</div>
        </div>

        <div className='flex mt-2'>
          <div className='mr-2'>Total Cost: </div>
          <div>{task.reward * task.reward_count} USDT</div>
        </div>
      </div>
      {
        task.status === TaskStatus.Created ? (
          <Submit
            className="mt-8"
            reward={
              task.reward
            }
            reward_count={
              task.reward_count
            }
            start={
              new Date(task.start_time).getTime()
            }
            end={
              new Date(task.end_time).getTime()
            }
            chain={task.chain}
            task_id={params.id}
          >Submit</Submit>
        ) : (
          <div>Contract has been deployed</div>
        )
      }

    </div>
  )
}