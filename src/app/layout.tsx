import QueryClientProvider from "@/components/QueryClient"
import Footer from "@/components/footer"
import Header from "@/components/header"
import { config } from '@/config'
import ContextProvider, { wagmiConfig } from '@/context/wallet'
import "dotenv/config"
import { SessionProvider } from "next-auth/react"
import { headers } from 'next/headers'
import { WagmiProvider, cookieToInitialState } from 'wagmi'
import "../../styles/custom.scss"
import "../../styles/global.css"
export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const initialState = cookieToInitialState(config, headers().get('cookie'))
  return (
    <html lang="en" className="h-full">
      <body className="bg-black text-white dark custom-scrollbar h-full">
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
      </body>
    </html>
  )
}
