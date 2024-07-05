import { injected } from '@wagmi/core'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { http } from 'viem'
import {
  mainnet,
  opBNB,
  opBNBTestnet,
  sepolia,
  type Chain
} from 'wagmi/chains'
import { ConstantsUtil } from './ConstantsUtil'

export const WagmiConstantsUtil = {
  chains: [
    mainnet,
    sepolia,
    opBNB,
    opBNBTestnet
  ] as [Chain, ...Chain[]]
}

export function getWagmiConfig(type: 'default' | 'email') {
  const config = {
    chains: WagmiConstantsUtil.chains,
    projectId: ConstantsUtil.ProjectId,
    metadata: ConstantsUtil.Metadata,
    connectors: [injected()],
    ssr: true,
    transports: {
      [sepolia.id]: http("https://eth-sepolia.g.alchemy.com/v2/9Qty87XLyHf_HKHPmSPpwWepafImsug6", {
        batch: true
      })
    }
  }

  const emailConfig = {
    ...config,
    auth: {
      socials: ['google', 'x', 'discord', 'apple', 'github']
    }
  }

  const wagmiConfig = defaultWagmiConfig(type === 'email' ? emailConfig : config)

  return wagmiConfig
}
