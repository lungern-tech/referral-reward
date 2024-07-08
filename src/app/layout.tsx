import Footer from "@/components/footer"
import Header from "@/components/header"
import { config } from '@/config'
import client from "@/lib/mongodb"
import User from "@/models/User"
import QueryClientProvider from "@/provider/QueryClient"
import UserProvider from "@/provider/user"
import ContextProvider, { wagmiConfig } from '@/provider/wallet'
import "dotenv/config"
import { ObjectId } from "mongodb"
import { SessionProvider } from "next-auth/react"
import { headers } from 'next/headers'
import { WagmiProvider, cookieToInitialState } from 'wagmi'
import "../../styles/custom.scss"
import "../../styles/global.css"
import { auth } from "./auth"
export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}




export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const initialState = cookieToInitialState(config, headers().get('cookie'))

  const session = await auth()
  const user = await client.collection<User>("user").findOne({
    _id: new ObjectId(session.id)
  })

  return (
    <html lang="en" className="h-full">
      <body className="bg-black text-white dark custom-scrollbar h-full">
        <UserProvider initialUser={user}>
          <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider>
              <ContextProvider initialState={initialState}>
                <SessionProvider>
                  <div className="flex min-h-full flex-col">
                    <Header />
                    <div className="flex min-h-full flex-1 flex-col justify-stretch dark">
                      <div className="flex max-w-[1280px] mx-auto">
                        {children}
                      </div>
                    </div>
                    <Footer />
                  </div>
                </SessionProvider>
              </ContextProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </UserProvider>
      </body>
    </html>
  )
}