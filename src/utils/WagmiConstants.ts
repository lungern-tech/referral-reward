import { injected } from '@wagmi/core'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { http } from 'viem'
import {
  type Chain
} from 'wagmi/chains'
import ChainMap from './ChainMap'
import { ConstantsUtil } from './ConstantsUtil'

export const WagmiConstantsUtil = {
  chains: Object.values(ChainMap).map(e => e.chain) as [Chain, ...Chain[]]
}

export function getWagmiConfig(type: 'default' | 'email') {
  const config = {
    chains: WagmiConstantsUtil.chains,
    projectId: ConstantsUtil.ProjectId,
    metadata: ConstantsUtil.Metadata,
    connectors: [injected()],
    ssr: true,
    transports: {
      ...Object.values(ChainMap).reduce((pre, curr) => {
        return {
          ...pre,
          [curr.chain.id]: http(curr.rpc, {
            batch: true
          })
        }
      }, {})
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
