import Task from '@/models/Task'
import User from '@/models/User'
import { round } from 'mathjs'
import Link from 'next/link'
import CdnImage from '../cdn-image'

export default function ({
  task,
  className,
  user,
  status,
}: {
  task: Task
  user: User
  status?: string
  className?: string
}) {
  return (
    <Link
      className={className}
      href={`/reward/${task._id}`}
    >
      <div className="p-2 border border-slate-200 shadow-lg rounded-lg relative">
        {status && (
          <div className="absolute -left-0 -top-0 px-2 rounded-br-md text-sm bg-green-500 text-white">
            {status}
          </div>
        )}
        <CdnImage
          className="rounded-lg object-cover h-40"
          src={`${task.cover_image}`}
          width={900}
          height={450}
          alt="cover_image"
        />
        <div className="absolute rounded-full w-1/6 p-1 right-4 top-1/2">
          <CdnImage
            className="rounded-full"
            src={`${user.avatar}`}
            width={500}
            height={500}
            alt="avatar"
          />
        </div>
        <div className="p-2">
          <div className="text-slate-500 font-bold">{user.nickname}</div>
          <div className="name font-extrabold text-slate-700 text-ellipsis overflow-hidden whitespace-nowrap mb-2">
            {task.title}
          </div>
          <div className="label">
            <div className="rounded-md border-slate-200 border inline-block px-2 py-1 font-semibold">
              <span className="text-green-500 mr-1">
                {round(
                  task.reward * task.reward_count * task.token_price_usd,
                  2
                )}
              </span>
              USDT
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
