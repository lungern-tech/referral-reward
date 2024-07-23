import { auth } from '@/app/auth'
import CdnImage from '@/components/cdn-image'
import Proof from '@/components/proof'
import client from '@/lib/mongodb'
import Interaction, { InteractStatus } from '@/models/Interaction'
import Task from '@/models/Task'
import User from '@/models/User'
import { format } from '@/utils/DateFormat'
import { CalendarOutlined } from '@ant-design/icons'
import { ObjectId } from 'mongodb'
import EndTime from './EndTime'

export const metadata = {
  title: 'Join And Earn',
}

export default async function ({ params }: { params: { id: string } }) {
  const task = await client
    .collection<Task>('task')
    .findOne({ _id: new ObjectId(params.id) })
  const session = await auth()
  let interaction
  if (session) {
    interaction = await client.collection<Interaction>('interaction').findOne({
      task_id: new ObjectId(params.id),
      user_id: new ObjectId(session.id),
    })
  }
  const joinCount = await client
    .collection<Interaction>('interaction')
    .countDocuments({
      task_id: new ObjectId(params.id),
    })

  const topWinners = (await client
    .collection<Interaction>('interaction')
    .aggregate([
      {
        $match: {
          task_id: new ObjectId(params.id),
          status: InteractStatus.RewardSent,
        },
      },
      {
        $lookup: {
          from: 'user',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $sort: {
          created_at: -1,
        },
      },
      {
        $limit: 20,
      },
    ])
    .toArray()) as Array<Interaction & { user: User }>

  return (
    <div className="grid grid-cols-5">
      <div className="col-span-3 pr-12 pb-8 border-r border-slate-200 pt-8">
        <CdnImage
          className="rounded-md shadow-lg border"
          width={1000}
          height={500}
          alt="cover_image"
          src={`${task.cover_image}`}
        />
        <div className="text-3xl font-bold text-slate-700 mt-8">
          {task.title}
        </div>
        <div className="flex mt-4 mb-8">
          <div className="text-green-500 bg-slate-200  px-4 py-1 rounded-md mr-2 font-semibold">
            Ongoing
          </div>
          <div className="text-slate-500 bg-white px-4 py-1 rounded-md mr-2 font-semibold">
            (UTC+8)
            {format(new Date(task.start_time), 'YYYY-MM-DD hh:mm')}～
            {format(new Date(task.end_time), 'YYYY-MM-DD hh:mm')}
          </div>
        </div>
        <div className="border border-b-0 border-slate-200"></div>
        <div className="mt-8 font-bold text-2xl text-slate-700">Task</div>
        <div className="mt-4 font-medium raw-html text-slate-500">
          <div
            dangerouslySetInnerHTML={{ __html: task.task || '<p></p>' }}
          ></div>
        </div>
        <div className="">
          <div className="mt-4">
            <Proof
              interaction={interaction}
              task={task}
            ></Proof>
          </div>
        </div>
        <div className="mt-8 font-bold text-2xl pt-8 border-t text-slate-700 border-slate-200">
          Guide
        </div>
        <div className="mt-8 font-medium raw-html text-slate-500">
          <div
            dangerouslySetInnerHTML={{ __html: task.description || '<p></p>' }}
          ></div>
        </div>
      </div>
      <div className="col-span-2 pl-12">
        <div className="text-3xl text-slate-700 mt-8 font-semibold">Reward</div>
        <div className="rounded-lg border border-slate-200 overflow-hidden mt-4 shadow-lg">
          <div className="border-b border-slate-200">
            <div className="flex h-12 justify-center items-center font-semibold text-slate-700">
              <CalendarOutlined className="mr-2" />
              {new Date(task.end_time).getTime() < Date.now() ? (
                <span className="mr-2 text-slate-600">Campaign Ended</span>
              ) : (
                <>
                  <span className="mr-2 text-slate-600">Campaign Ends In</span>
                  <EndTime endTime={task.end_time} />
                </>
              )}
            </div>
            <div className="text-center pb-4">
              (UTC+8) {format(new Date(task.start_time), 'YYYY-MM-DD hh:mm')} ～{' '}
              {format(new Date(task.end_time), 'MM-DD hh:mm')}
            </div>
          </div>
          <div className="p-6 font-bold ">
            <div className="text-xl text-slate-700">Lucky Draw</div>
            <div className="mt-4 rounded-md p-4 border border-slate-200">
              <div className="flex">
                <div className="text-slate-500">Token</div>
                <div className="ml-auto inline-flex items-baseline text-slate-700">
                  <span className="text-3xl">
                    {Number((task.reward * task.token_price_usd).toFixed(2))}
                  </span>
                  <span className="ml-1 text-3xl">USDT</span>
                  <span className="text-sm">/Winner</span>
                </div>
              </div>
              <div className="mt-2 text-right text-slate-700">
                {task.reward_count} Winners
              </div>
            </div>
          </div>
        </div>
        <div className="text-3xl text-slate-700 mt-8 font-semibold">
          Participants Info
        </div>
        <div className="flex mt-4">
          <div className="text-xl font-bold text-slate-500"> Participants</div>
          <div className="ml-auto text-slate-900 font-bold">{joinCount}</div>
        </div>
        <div className="flex mt-4 font-bold text-xl text-slate-500">
          Latest Verified
        </div>
        <div className="flex gap-2 mt-4">
          {topWinners.map((item) => (
            <CdnImage
              key={String(item._id)}
              src={item.user.avatar}
              width={40}
              height={40}
              alt={item.user.name}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
