import { Chain, opBNBTestnet, sepolia } from "viem/chains";

const ChainMap: Record<number, { chain: Chain, rpc: string, factory_address: `0x${string}` }> = {
  [sepolia.id]: {
    chain: sepolia,
    rpc: "https://eth-sepolia.g.alchemy.com/v2/9Qty87XLyHf_HKHPmSPpwWepafImsug6",
    factory_address: "0x2d8A13C3378051Ed5c4d387D94940F4eA99272bB"
  },
  [opBNBTestnet.id]: {
    chain: opBNBTestnet,
    rpc: 'https://lb.drpc.org/ogrpc?network=opbnb-testnet&dkey=AuCeIn2xKEO-v9eOwVCIe7RCb_ZqRA0R76tgUgWAgP__',
    factory_address: "0x0Cd62c67167e4Af422e2Af06b54C10d3e1580edB"
  }
}


export default ChainMap