import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { cookieStorage, createStorage } from 'wagmi'
import { mainnet, sepolia, opBNB, opBNBTestnet } from 'wagmi/chains'

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const config = defaultWagmiConfig({
  projectId,
  chains: [mainnet, sepolia, opBNB, opBNBTestnet],
  metadata: {
    name: 'My App',
    description: 'My app description',
    url: 'http://localhost:3000',
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
