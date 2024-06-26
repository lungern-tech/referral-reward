'use client'

import { config, projectId } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createWeb3Modal, } from '@web3modal/wagmi/react'
import React, { type ReactNode } from 'react'
import { type State, WagmiProvider } from 'wagmi'
import { siweConfig } from '@/config/siwe'
import { getWagmiConfig } from '@/utils/WagmiConstants'
import { ConstantsUtil } from '@/utils/ConstantsUtil'


const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

const wagmiConfig = getWagmiConfig('default')




const web3Modal = createWeb3Modal({
  wagmiConfig,
  projectId,
  metadata: ConstantsUtil.Metadata,
  enableAnalytics: true,
  siweConfig,
  customWallets: ConstantsUtil.CustomWallets
})

console.log('web3Modal: ', web3Modal)

function ContextProvider({
  children,
  initialState
}: {
  children: ReactNode
  initialState: State | undefined
}) {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider
