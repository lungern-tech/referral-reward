import CdnImage from "@/components/cdn-image";
import Task, { TaskStatus } from "@/models/Task";
import Link from "next/link";

export default function ({ task, className }: { task: Task, className?: string }) {
  const link = () => {
    if (task.status === TaskStatus.Created) {
      return `/pay/${task._id}`
    }
    return `/account/created/${task._id}`
  }
  return (
    <Link className={className} href={link()}>
      <div className="p-2 border border-gray-dark-500 rounded-lg relative">
        <CdnImage className="rounded-lg" src={`${task.cover_image}`} width={500} height={1} alt="cover_image" />
        <div className="p-2">
          <div className="name font-extrabold text-ellipsis overflow-hidden whitespace-nowrap mb-2">
            {task.title}
          </div>
          <div className="label">
            <div className="border border-gray-dark-500 inline-block px-2 py-1 font-semibold rounded-md"><span className="text-green-500">{task.reward * task.reward_count}</span> USDT</div>
          </div>
        </div>
      </div>
    </Link>
  )
}