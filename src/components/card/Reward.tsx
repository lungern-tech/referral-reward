import Task from "@/models/Task";
import User from "@/models/User";
import Link from "next/link";
import CdnImage from "../cdn-image";

export default function ({ task, className, user }: { task: Task, user: User, className?: string }) {
  return (
    <Link className={className} href={`/reward/${task._id}`}>
      <div className="p-2 border border-gray-dark-500 rounded-lg relative">
        <CdnImage className="rounded-lg object-cover h-40" src={`${task.cover_image}`} width={900} height={500} alt="cover_image" />
        <div className="absolute bg-black rounded-full w-1/6 p-1 right-4 top-1/2">
          <CdnImage className="rounded-full" src={`${user.avatar}`} width={500} height={1} alt="avatar" />
        </div>
        <div className="p-2">
          <div className="text-gray-400 font-bold">
            {user.nickname}
          </div>
          <div className="name font-extrabold text-ellipsis overflow-hidden whitespace-nowrap mb-2">
            {task.title}
          </div>
          <div className="label">
            <div className="rounded-md border-gray-dark-500 border inline-block px-2 py-1 font-semibold"> <span className="text-green-500">{Math.ceil(task.reward * task.reward_count)} </span>USDT</div>
          </div>
        </div>
      </div>
    </Link>
  )
}