

import {
  getAddressFromMessage,
  getChainIdFromMessage,
  verifySignature,
  type SIWESession
} from '@web3modal/siwe'
import NextAuth from 'next-auth'
import credentialsProvider from 'next-auth/providers/credentials'

import client from "@/lib/mongodb"
import User from '@/models/User'

declare module 'next-auth' {
  interface Session extends SIWESession {
    address: `0x${string}`
    chainId: number
    id: string
  }
}

const nextAuthSecret = process.env.NEXTAUTH_SECRET
if (!nextAuthSecret) {
  throw new Error('NEXTAUTH_SECRET is not set')
}

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID
if (!projectId) {
  throw new Error('NEXT_PUBLIC_PROJECT_ID is not set')
}

const providers = [
  credentialsProvider({
    name: 'Ethereum',
    credentials: {
      message: {
        label: 'Message',
        type: 'text',
        placeholder: '0x0'
      },
      signature: {
        label: 'Signature',
        type: 'text',
        placeholder: '0x0'
      }
    },
    async authorize(credentials) {
      try {
        if (!credentials?.message) {
          throw new Error('SiweMessage is undefined')
        }
        const { message: temp, signature } = credentials
        const message = temp as string
        const address = getAddressFromMessage(message)
        const chainId = getChainIdFromMessage(message)

        const isValid = await verifySignature({ address, message, signature: signature as string, chainId, projectId })

        if (isValid) {
          return {
            id: `${chainId}:${address}`
          }
        }

        return null
      } catch (e) {
        return null
      }
    }
  })
]

export const { auth, handlers, signIn, signOut } = NextAuth({
  // https://next-auth.js.org/configuration/providers/oauth
  secret: nextAuthSecret,
  providers,
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    // async jwt({ token, user, account }) {
    //   if (user) {
    //     token.sub = user.id
    //   }
    //   return token
    // },
    async session({ session, token }) {
      if (!token.sub) {
        return session
      }
      const [, chainId, address] = token.sub.split(':')
      let user = await client.collection<User>("user").findOne({
        wallet: address
      })
      if (!user) {
        await client.collection<User>('user').insertOne({
          wallet: address,
          create_time: new Date()
        })
        user = await client.collection<User>("user").findOne({
          wallet: address
        })
      }
      session.id = user._id as string
      if (chainId && address) {
        session.address = address as `0x${string}`
        session.chainId = parseInt(chainId, 10)
      }
      return session
    }
  }
})
