import Title from "@/components/title";

export default function () {
  return (
    <div className="grid grid-cols-5">
      <div className="col-span-3 pr-12 border-r" >
        <div className="text-3xl font-bold">TaskOn x Infinity Ground x Solana Name Service team up for a $500 USDC Giveaway!
        </div>
        <div className="flex mt-4 mb-8">
          <div className="text-green-500 bg-gray-500 px-4 py-1 rounded-md mr-2">Ongoing</div>
          <div className="text-white bg-gray-500 px-4 py-1 rounded-md mr-2">(UTC+8) 2024-06-24 20:00 ～ 06-30 18:00
          </div>
        </div>
        <div className="border border-b-0"></div>
        <Title title="Task"></Title>
        <Title title="Mandatory Task"></Title>
        <div className="mt-8">
          <p>
            We are excited to host a special giveaway with the Infinity Ground and SNS team.
          </p>
          <p>
            The event will give away a total of $500 USDC to 25 lucky winners.

          </p>
          <p>Don’t miss it! To be eligible for the  reward, follow the rules below.</p>
          <p> 📣Event Period: Jun 24 th, 2024 - Jun 30 th, 2024</p>
          <p>🏆Prize Pool:</p>
          <p>🔸$500 USDC</p>
          <p>🔸Each eligible participant will get 20USDT.</p>
        </div>
      </div>
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
                  <span>USDC</span>
                  <span>/winner</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 font-bold text-black">
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
          </div>
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