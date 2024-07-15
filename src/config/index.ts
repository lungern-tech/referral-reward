import ChainMap from '@/utils/ChainMap'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { Chain } from 'viem'
import { cookieStorage, createStorage } from 'wagmi'

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const config = defaultWagmiConfig({
  projectId,
  chains: Object.values(ChainMap).map(e => e.chain) as [Chain, ...Chain[]],
  metadata: {
    name: 'My App',
    description: 'My app description',
    url: process.env.SIGN_URL,
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  },
  enableWalletConnect: true,
  enableEIP6963: true,
  enableCoinbase: true,
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
})
