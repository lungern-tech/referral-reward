import CdnImage from '@/components/cdn-image'
import Submit from '@/components/pay/submit'
import mongoClient from '@/lib/mongodb'
import type Task from '@/models/Task'
import { TaskStatus } from '@/models/Task'
import { format } from '@/utils/DateFormat'
import { ObjectId } from 'mongodb'

const getTask = async (id: string) => {
  const task = await mongoClient
    .collection<Task>('task')
    .findOne({ _id: new ObjectId(id) })
  return task
}

export default async function ({ params }: { params: { id: string } }) {
  const task = await getTask(params.id)
  return (
    <div
      className="mx-auto mb-16"
      style={{ width: '720px' }}
    >
      <h1 className="text-2xl font-bold mt-16 pb-8 border-b border-slate-200 text-slate-500">
        Preview
      </h1>
      <div className="mt-8 text-3xl font-bold text-slate-700">{task.title}</div>
      <div className="mt-5 flex">
        <div className="text-slate-500">
          (UTC+8){format(new Date(task.start_time), 'YYYY-MM-DD hh:mm')} ~{' '}
          {format(new Date(task.end_time), 'YYYY-MM-DD hh:mm')}
        </div>
      </div>
      <CdnImage
        className="rounded-md mt-5"
        src={`${task.cover_image}`}
        width={720}
        height={20}
        alt="cover_image"
      />
      <div className="text-slate-700 text-2xl font-bold mt-10">Task</div>
      <div className="font-xl text-gray-dark-400">
        <div className="mt-5">
          <div
            className="text-slate-500 font-medium raw-html"
            dangerouslySetInnerHTML={{ __html: task.description || '<p></p>' }}
          ></div>
        </div>
      </div>
      <div className="text-slate-700 text-2xl font-bold mt-10">Description</div>
      <div className="mt-5">
        <div
          className="text-slate-500 font-medium raw-html"
          dangerouslySetInnerHTML={{ __html: task.task || '<p></p>' }}
        ></div>
      </div>
      <div className="mt-8 font-bold text-xl text-slate-700">Cost Overview</div>
      <div className="mt-5">
        <div className="flex">
          <div className="mr-2 text-slate-600">Reward Amount: </div>
          <div className="text-slate-900 font-semibold">
            {task.reward} * {task.reward_count} *{task.token_price_usd} ={' '}
            {task.reward * task.reward_count * task.token_price_usd} USDT
          </div>
        </div>

        <div className="flex mt-2">
          <div className="mr-2 text-slate-600">Total Cost: </div>
          <div className="text-slate-900 font-semibold">
            {task.reward * task.reward_count * task.token_price_usd} USDT
          </div>
        </div>
      </div>
      {task.status === TaskStatus.Created ? (
        <Submit
          className="mt-8"
          task={task}
        />
      ) : (
        <div>Contract has been deployed</div>
      )}
    </div>
  )
}
