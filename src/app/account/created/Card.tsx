import Task from "@/models/Task";
import Image from "next/image";
import Link from "next/link";

export default function ({ task, className }: { task: Task, className?: string }) {
  return (
    <Link className={className} href={`/account/created/${task._id}`}>
      <div className="p-2 border rounded-lg relative">
        <Image className="rounded-lg" src={`/uploads/${task.cover_image}`} width={500} height={1} alt="cover_image"></Image>
        <div className="p-2">
          <div className="name font-extrabold text-ellipsis overflow-hidden whitespace-nowrap mb-2">
            {task.title}
          </div>
          <div className="label">
            <div className="rounded-md bg-yellow-300 inline-block px-2 py-1 font-semibold">1000 USDT</div>
          </div>
        </div>
      </div>
    </Link>
  )
}