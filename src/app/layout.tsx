import Header from "@/components/header"
import Footer from "@/components/footer"
import { cookieToInitialState } from 'wagmi'
import { headers } from 'next/headers'
import { config } from '@/config'
import ContextProvider from '@/context/wallet'
import "dotenv/config";
import "../../styles/global.css";
import { SessionProvider } from "next-auth/react"
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
    <html lang="en" className="min-h-full relative pb-16">
      <body className="min-h-full">
        <ContextProvider initialState={initialState}>
          <SessionProvider>
            <Header />
            <div className="px-8">
              {children}
            </div>
            <Footer />
          </SessionProvider>
        </ContextProvider>
      </body>
    </html>
  )
}
