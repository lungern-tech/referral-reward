import { auth } from "@/app/auth";
import Proof from "@/components/proof";
import Title from "@/components/title";
import client from "@/lib/mongodb";
import Interaction, { InteractStatus } from "@/models/Interaction";
import Task from "@/models/Task";
import { format } from "@/utils/DateFormat";
import { CalendarOutlined } from "@ant-design/icons";
import { ObjectId } from "mongodb";
import Image from "next/image";

export default async function ({ params }: { params: { id: string } }) {


  const task = await client.collection<Task>("task").findOne({ _id: new ObjectId(params.id) })
  const session = await auth()
  let joinStatus
  if (session) {
    joinStatus = await client.collection<Interaction>("interaction").findOne({ task_id: new ObjectId(params.id), user_id: new ObjectId(session.id) })
  }
  const joinCount = await client.collection<Interaction>("interaction").countDocuments({
    task_id: new ObjectId(params.id)
  })

  const topWinners = await client.collection<Interaction>("interaction").aggregate([
    {
      $match: {
        task_id: new ObjectId(params.id),
        status: InteractStatus.RewardSent
      }
    },
    {
      $sort: {
        created_at: -1
      }
    },
    {
      $limit: 20
    }
  ]).toArray()
  return (
    <div className="grid grid-cols-5 mt-8">
      <div className="col-span-3 pr-12 pb-8 border-r border-gray-dark-500" >
        <Image className="rounded-md border-gray-dark-500 border" width={1000} height={700} alt="cover_image" src={`${task.cover_image}`}></Image>
        <div className="text-3xl font-bold mt-8">
          {task.title}
        </div>
        <div className="flex mt-4 mb-8">
          <div className="text-green-500 bg-white px-4 py-1 rounded-md mr-2 font-semibold">Ongoing</div>
          <div className="text-black bg-white px-4 py-1 rounded-md mr-2 font-semibold">(UTC+8) {new Date(task.start_time).toLocaleString()} ～
            {
              new Date(task.end_time).toLocaleDateString()
            }
          </div>
        </div>
        <div className="border border-b-0 border-gray-dark-500"></div>
        <div className="mt-8 font-bold text-2xl">Task</div>
        <div className="mt-4 text-xl rendered-html">
          <div dangerouslySetInnerHTML={{ __html: task.task }}></div>
        </div>
        <div className="">
          <div className="mt-4" >
            <Proof status={joinStatus?.status === InteractStatus.Joined} taskId={String(task._id)}></Proof>
          </div >
        </div>
        <div className="mt-8 font-bold text-2xl pt-8 border-t border-gray-dark-500">Guide</div>
        <div className="mt-8 text-xl rendered-html">
          <div dangerouslySetInnerHTML={{ __html: task.description || "<p></p>" }}></div>
        </div>
      </div >
      <div className="col-span-2 pl-12">
        <Title title="Reward"></Title>
        <div className="rounded-lg border border-gray-dark-500 overflow-hidden  mt-4">
          <div className="border-b border-gray-dark-500">
            <div className="flex h-12 justify-center items-center font-semibold">
              <CalendarOutlined className="mr-2" />
              <span className="mr-2">Campaign Ends In</span>
              <span>5 Days</span>
            </div>
            <div className="text-center pb-4">(UTC+8) {format(new Date(task.start_time), "YYYY-MM-DD hh:mm")} ～ {format(new Date(task.end_time), "MM-DD hh:mm")}</div>
          </div>
          <div className="p-6 font-bold ">
            <div className="text-xl ">Lucky Draw</div>
            <div className="mt-4 rounded-md p-4 border border-gray-dark-500">
              <div className="flex">
                <div>Token</div>
                <div className="ml-auto inline-flex items-baseline">
                  <span className="text-3xl">{task.reward}</span>
                  <span className="text-3xl">USDT</span>
                  <span className="text-sm">/Winner</span>
                </div>
              </div>
              <div className="mt-2 text-right">{task.reward_count} Winners</div>
            </div>
          </div>
        </div>
        <Title title="Participants Info"></Title>
        <div className="flex mt-4">
          <div className="text-xl font-bold"> Participants</div>
          <div className="ml-auto">{joinCount}</div>
        </div>
        <div className="flex mt-4 font-bold text-xl">
          Verified
          {topWinners.length}
        </div>
      </div>
    </div >
  )
}