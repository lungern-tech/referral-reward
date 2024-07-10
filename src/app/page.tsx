import Reward from "@/components/card/Reward";
import HorizontalScroll from "@/components/horizontal-scroll";
import client from "@/lib/mongodb";
import Task from "@/models/Task";
import User from "@/models/User";

export default async function Home() {

  const list = await client.collection<Task>("task").aggregate([
    {
      $match: {
        status: "created"
      }
    },
    {
      $lookup: {
        from: "user",
        localField: "creator",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    }
  ]).toArray() as Array<Task & { user: User }>

  return (
    <div>
      <div className="mt-8 font-bold text-2xl">Referral Campaign</div>
      <HorizontalScroll>
        {
          list.map((e, index) => {
            return (
              <Reward className="mt-4 hover:shadow-sm hover:scale-110 transition" task={e} user={e.user} key={index} ></Reward>
            )
          })
        }
      </HorizontalScroll>
    </div>
  );
}
