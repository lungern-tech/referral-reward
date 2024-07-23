import Reward from '@/components/card/Reward'
import HorizontalScroll from '@/components/horizontal-scroll'
import client from '@/lib/mongodb'
import Task, { DeployStatus } from '@/models/Task'
import User from '@/models/User'
import { Empty } from 'antd'

export default async function Home() {
  const list = (await client
    .collection<Task>('task')
    .aggregate([
      {
        $match: {
          status: DeployStatus.Deployed,
          start_time: {
            $lt: new Date(),
          },
          end_time: {
            $gt: new Date(),
          },
        },
      },
      {
        $sort: {
          start_time: -1,
        },
      },
      {
        $lookup: {
          from: 'user',
          localField: 'creator',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
    ])
    .toArray()) as Array<Task & { user: User }>
  console.log(`list: `, list)
  return (
    <div className="w-full">
      <div className="mt-8 text-slate-700 font-bold text-2xl">
        Referral Campaign
      </div>
      {list.length > 0 ? (
        <>
          <HorizontalScroll>
            {list.map((e, index) => {
              return (
                <Reward
                  className="mt-4 hover:shadow-sm hover:scale-110 transition"
                  task={e}
                  user={e.user}
                  key={index}
                ></Reward>
              )
            })}
          </HorizontalScroll>
        </>
      ) : (
        <Empty className="mx-auto mt-16 h-40" />
      )}
    </div>
  )
}
