import Analysis from '@/components/analysis'
import Footer from '@/components/footer'
import Header from '@/components/header'
import { config } from '@/config'
import client from '@/lib/mongodb'
import User from '@/models/User'
import QueryClientProvider from '@/provider/QueryClient'
import UserProvider from '@/provider/user'
import ContextProvider, { wagmiConfig } from '@/provider/wallet'
import 'dotenv/config'
import { ObjectId } from 'mongodb'
import { SessionProvider } from 'next-auth/react'
import { headers } from 'next/headers'
import { WagmiProvider, cookieToInitialState } from 'wagmi'
import '../../styles/custom.scss'
import '../../styles/global.css'
import { auth } from './auth'
export const metadata = {
  title: 'Referral Reward',
  description: 'Share airdrop, get referral, receive reward',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const initialState = cookieToInitialState(config, headers().get('cookie'))

  const session = await auth()
  let user = null
  if (session) {
    user = await client.collection<User>('user').findOne({
      _id: new ObjectId(session.id),
    })
  }

  return (
    <html
      lang="en"
      className="h-full"
    >
      <head>
        <link
          rel="shortcut icon"
          href="/favicon.ico"
          sizes="any"
        />
      </head>
      <body className="dark custom-scrollbar h-full">
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider>
            <ContextProvider initialState={initialState}>
              <SessionProvider>
                <UserProvider initialUser={user}>
                  <div className="flex min-h-full flex-col">
                    <Header />
                    <div className="flex min-h-full flex-1 flex-col justify-stretch dark">
                      <div className="flex w-full h-full flex-1 justify-stretch xl:w-[1280px] px-6 mx-auto">
                        {children}
                      </div>
                    </div>
                    <Footer />
                  </div>
                </UserProvider>
              </SessionProvider>
            </ContextProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
      <Analysis />
    </html>
  )
}
