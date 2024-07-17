import { bsc, bscTestnet, mainnet, opBNB, opBNBTestnet, sepolia } from "viem/chains"

const testnetConverter = {
  [sepolia.id]: mainnet.id,
  [bscTestnet.id]: bsc.id,
  [opBNBTestnet.id]: opBNB.id
}



const getPrice = (chainId: number, contractAddress?: string) => {

  const mainnetChainId = testnetConverter[chainId] || chainId

  let queryParams = new URLSearchParams({
    chainId: String(mainnetChainId),
  })
  if (contractAddress) {
    queryParams.append('contractAddress', contractAddress)
  }
  return fetch(`https://www.oklink.com/api/v5/explorer/tokenprice/market-data?${queryParams.toString()}`, {
    headers: {
      'Ok-Access-Key': process.env.NEXT_PUBLIC_OKLINK_ACCESS_KEY
    }
  }).then(res => res.json()) as Promise<ITokenPrice>
}


export type ITokenPrice = {
  code: string,
  msg: string
  data: Array<
    {
      lastPrice: string
      totalSupply: string
      circulatingSupply: string
      volume24h: string
      marketCap: string
      high24h: string
      low24h: string
      priceAbnormal: Array<string>
    }
  >
}

export default getPrice