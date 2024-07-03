import { Chain, mainnet, opBNB, opBNBTestnet, sepolia } from "viem/chains";

const ChainMap: Record<number, Chain> = {
  [opBNB.id]: opBNB,
  [opBNBTestnet.id]: opBNBTestnet,
  [mainnet.id]: mainnet,
  [sepolia.id]: sepolia
}


export default ChainMap