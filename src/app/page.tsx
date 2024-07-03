import Reward from "@/components/card/Reward";
import HorizontalScroll from "@/components/horizontal-scroll";
import Title from "@/components/title";
import client from "@/lib/mongodb";

export default async function Home() {

  const list = await client.collection("task").find({}).limit(10).toArray()

  return (
    <div>
      <Title title="奖励"></Title>
      <HorizontalScroll>
        {
          list.map((e, index) => {
            return (
              <Reward task={e} key={index} ></Reward>
            )
          })
        }
      </HorizontalScroll>
    </div>
  );
}
