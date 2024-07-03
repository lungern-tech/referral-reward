import Task from "@/models/Task";
import Image from "next/image";
import Link from "next/link";

export default function ({ task, className }: { task: Task, className?: string }) {
  return (
    <Link className={className} href={`/reward/${task._id}`}>
      <div className="p-2 border rounded-lg relative">
        <Image className="rounded-lg" src={`/uploads/${task.cover_image}`} width={500} height={1} alt="cover_image"></Image>
        <div className="absolute bg-black rounded-full w-1/6 p-1 right-4 top-1/2">
          <img className="rounded-full" src="https://img.taskon.xyz/files/image/avatar/3e4f7ae36f1c548a5e512894bff1979c.png?imageMogr2/thumbnail/!80x80r" alt="" />
        </div>
        <div className="p-2">
          <div className="text-gray-400 font-bold">
            Promodex
          </div>
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