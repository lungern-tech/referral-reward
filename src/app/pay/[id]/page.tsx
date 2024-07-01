import Submit from '@/components/pay/submit'
import { auth } from '@/app/auth'
import mongoClient from "@/lib/mongodb"
import Task from '@/models/Task'
import { ObjectId } from 'mongodb'
import { StarOutlined } from '@ant-design/icons'
import Image from 'next/image'


const getTask = async (id: string) => {
  const task = await mongoClient.collection<Task>('task').findOne({ _id: new ObjectId(id) })
  return task
}

export default async function ({ params }: { params: { id: string } }) {

  const task = await getTask(params.id)
  return (
    <div className="mx-auto mb-16" style={{ width: '720px' }}>
      <h1 className="text-2xl font-bold">Reward Page Preview</h1>
      <div className="mt-8 text-3xl font-bold">{task.title}</div>
      <div className='mt-4 flex'>
        <div className="mr-2">Status</div>
        <div>{String(task.start_time)}-{String(task.end_time)}</div>
        <div className="ml-auto">
          <StarOutlined />
        </div>
      </div>
      <Image className='rounded-md' src={`/uploads/${task.cover_image}`} width="720" height="20" alt='cover_image'></Image>
      <div className='mt-8'>
        <div className='' dangerouslySetInnerHTML={{ __html: task.description }}>

        </div>

      </div>
    </div>
  )
}