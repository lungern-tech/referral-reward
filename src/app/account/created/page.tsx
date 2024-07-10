import { auth } from "@/app/auth"
import client from "@/lib/mongodb"
import Task from "@/models/Task"
import { ObjectId } from "mongodb"
import Card from "./Card"

export default async function created() {

  const session = await auth()
  const list = await client.collection<Task>("task").find({
    creator: new ObjectId(session.id)
  }).toArray()
  return (
    <div className="flex flex-wrap justify-around w-full">
      {
        list.map((e) => (
          <div className="w-1/3 p-2 pt-0" key={String(e._id)} >
            <Card task={e} ></Card>
          </div>
        ))
      }
      <div className="w-1/3"></div>
      <div className="w-1/3"></div>
    </div>
  )
}