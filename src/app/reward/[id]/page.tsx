import { auth } from "@/app/auth";
import Proof from "@/components/proof";
import Title from "@/components/title";
import client from "@/lib/mongodb";
import Interaction from "@/models/Interaction";
import Task from "@/models/Task";
import { ObjectId } from "mongodb";
import Image from "next/image";

export default async function ({ params }: { params: { id: string } }) {


  const task = await client.collection<Task>("task").findOne({ _id: new ObjectId(params.id) })
  const session = await auth()
  const joinStatus = await client.collection<Interaction>("interaction").findOne({ task_id: new ObjectId(params.id), user_id: new ObjectId(session.id) })

  return (
    <div className="grid grid-cols-5 mt-8">
      <div className="col-span-3 pr-12 pb-8 border-r border-gray-dark-500" >
        <Image className="rounded-md border-gray-dark-500 border" width={1000} height={700} alt="cover_image" src={`/uploads/${task.cover_image}`}></Image>
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
        <div className="mt-4">Register with This Referral Code: `f4Ajk6`</div>
        <div className="">
          <div className="mt-4" >
            <Proof status={joinStatus} taskId={String(task._id)}></Proof>
          </div >
        </div>
        <div className="mt-8 font-bold text-2xl">Guide</div>
        <div className="mt-8">
          <div dangerouslySetInnerHTML={{ __html: task.description || "<p></p>" }}></div>
        </div>
      </div >
      <div className="col-span-2 pl-12">
        <Title title="Reward"></Title>
        <div className="rounded-lg bg-gray-300 overflow-hidden text-white mt-4">
          <div className="bg-slate-950">
            <div className="flex h-12 justify-center items-center">Campaign Ends In 5 Days</div>
            <div className="text-center pb-4">(UTC+8) 2024-06-24 20:00 ～ 06-30 18:00</div>
          </div>
          <div className="p-6 font-bold text-black">
            <div className="text-xl ">Lucky Draw</div>
            <div className="mt-4 shadow rounded-md bg-green-50 p-4">
              <div className="flex">
                <div>Token</div>
                <div className="ml-auto inline-flex">
                  <span>20</span>
                  <span>USDT</span>
                  <span>/First-come</span>
                </div>
              </div>
              <div>1000 Winners</div>
            </div>
          </div>
          {/* <div className="p-6 font-bold text-black">
            <div className="text-xl ">Bonus</div>
            <div className="mt-4 shadow rounded-md bg-green-50 p-4">
              <div className="flex">
                <div>Token</div>
                <div className="ml-auto inline-flex">
                  <span>20</span>
                  <span>USDC</span>
                  <span>/winner</span>
                </div>
              </div>
            </div>
          </div> */}
        </div>
        <Title title="Participants Info"></Title>
        <div className="flex mt-4">
          <div className="text-xl font-bold"> Participants</div>
          <div className="ml-auto">10</div>
        </div>
        <div className="flex mt-4 font-bold text-xl">
          Winners
        </div>
      </div>
    </div >
  )
}