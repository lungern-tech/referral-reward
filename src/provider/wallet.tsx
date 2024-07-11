'use client'

import { projectId } from '@/config'
import { siweConfig } from '@/config/siwe'
import { ConstantsUtil } from '@/utils/ConstantsUtil'
import { getWagmiConfig } from '@/utils/WagmiConstants'
import { createWeb3Modal, } from '@web3modal/wagmi/react'
import { type ReactNode } from 'react'
import { type State } from 'wagmi'


if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const wagmiConfig = getWagmiConfig('default')

createWeb3Modal({
  wagmiConfig,
  projectId: ConstantsUtil.ProjectId,
  enableAnalytics: true,
  metadata: ConstantsUtil.Metadata,
  siweConfig,
  customWallets: ConstantsUtil.CustomWallets
})

function ContextProvider({
  children
}: {
  children: ReactNode
  initialState: State | undefined
}) {

  return (
    <>
      {children}
    </>
  )
}

export default ContextProvider
