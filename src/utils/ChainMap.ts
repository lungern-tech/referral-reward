import { Chain, sepolia } from "viem/chains";

const ChainMap: Record<number, { chain: Chain, rpc: string }> = {
  [sepolia.id]: {
    chain: sepolia,
    rpc: "https://eth-sepolia.g.alchemy.com/v2/9Qty87XLyHf_HKHPmSPpwWepafImsug6"
  }
}


export default ChainMap