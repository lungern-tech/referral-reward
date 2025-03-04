import type { SIWECreateMessageArgs, SIWEVerifyMessageArgs } from '@web3modal/siwe'
import { createSIWEConfig, formatMessage } from '@web3modal/siwe'
import { Session } from 'next-auth'
import { getCsrfToken, getSession, signIn, signOut } from 'next-auth/react'
import { WagmiConstantsUtil } from '../utils/WagmiConstants'

export const siweConfig = createSIWEConfig({
  signOutOnAccountChange: true,
  signOutOnNetworkChange: true,
  // We don't require any async action to populate params but other apps might
  // eslint-disable-next-line @typescript-eslint/require-await
  getMessageParams: async () => ({
    domain: window.location.host,
    uri: window.location.origin,
    chains: WagmiConstantsUtil.chains.map(chain => chain.id),
    statement: 'Please sign with your account',
    iat: new Date().toISOString()
  }),
  createMessage: ({ address, ...args }: SIWECreateMessageArgs) => formatMessage(args, address),
  getNonce: async () => {
    const nonce = await getCsrfToken()
    if (!nonce) {
      throw new Error('Failed to get nonce!')
    }

    return nonce
  },
  getSession: async () => {
    const session = await getSession()
    if (!session) {
      throw new Error('Failed to get session!')
    }

    const { address, chainId, userInfo } = session as Session

    return { address, chainId, userInfo }
  },
  verifyMessage: async ({ message, signature, cacao }: SIWEVerifyMessageArgs) => {
    try {
      /*
       * Signed Cacao (CAIP-74) will be available for further validations if the wallet supports caip-222 signing
       * When personal_sign fallback is used, cacao will be undefined
       */
      if (cacao) {
        // Do something
      }
      const success = await signIn('credentials', {
        message,
        redirect: false,
        signature,
        callbackUrl: '/protected'
      })

      return Boolean(success?.ok)
    } catch (error) {
      return false
    }
  },
  signOut: async () => {
    try {
      await signOut({
        redirect: false
      })

      return true
    } catch (error) {
      return false
    }
  }
})
