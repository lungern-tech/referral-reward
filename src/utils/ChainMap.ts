import { Chain, opBNBTestnet } from "viem/chains";


export type IChainConfig = {
  chain: Chain,
  rpc: string,
  factory_address: `0x${string}`,
  explorer?: string
}

const ChainMap: Record<number, IChainConfig> = {
  [opBNBTestnet.id]: {
    chain: opBNBTestnet,
    rpc: 'https://lb.drpc.org/ogrpc?network=opbnb-testnet&dkey=AuCeIn2xKEO-v9eOwVCIe7RCb_ZqRA0R76tgUgWAgP__',
    factory_address: "0x69346A1fe9DAb88252c11021a8BB5C640221594C",
    explorer: "https://opbnb-testnet.bscscan.com/"
  }
}


export default ChainMap