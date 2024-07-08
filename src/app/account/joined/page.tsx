import { auth } from "@/app/auth"
import Reward from "@/components/card/Reward"
import client from "@/lib/mongodb"
import Interaction from "@/models/Interaction"
import Task from "@/models/Task"
import User from "@/models/User"
import { ObjectId } from "mongodb"

export default async function () {

  const session = await auth()
  const list = await client.collection<Interaction>("interaction").aggregate([
    {
      $match: {
        user_id: new ObjectId(session.id)
      }
    },
    {
      $lookup: {
        from: "task",
        localField: "task_id",
        foreignField: "_id",
        as: "task"
      }
    },
    { $unwind: "$task" },
    {
      $lookup: {
        from: "user",
        localField: "task.creator",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },

  ]).toArray() as Array<Interaction & { task: Array<Task & { user: [User] }> }>


  return (
    <div className="flex flex-wrap justify-around">
      {
        list.filter(e => e.task.length > 0).map((e) => (
          <div className="w-1/3 p-2 pt-0" key={String(e._id)} >
            <Reward task={e.task[0]} ></Reward>
          </div>
        ))
      }
      <div className="w-1/3"></div>
      <div className="w-1/3"></div>
    </div>
  )
}