import Title from "@/components/title";
import Reward from "@/components/card/Reward"
import HorizontalScroll from "@/components/horizontal-scroll";

export default function Home() {
  return (
    <div>
      <Title title="奖励"></Title>
      <HorizontalScroll>
        <Reward></Reward>
        <Reward></Reward>
        <Reward></Reward>
        <Reward></Reward>
      </HorizontalScroll>
      <Title title="抽奖"></Title>
      <HorizontalScroll>
        <Reward></Reward>
        <Reward></Reward>
        <Reward></Reward>
      </HorizontalScroll>
      <Title title="抽奖"></Title>
      <HorizontalScroll>
        <Reward></Reward>
        <Reward></Reward>
        <Reward></Reward>
      </HorizontalScroll>
      <Title title="抽奖"></Title>
      <HorizontalScroll>
        <Reward></Reward>
        <Reward></Reward>
        <Reward></Reward>
      </HorizontalScroll>
    </div>
  );
}
