'use client'

import UserContext from '@/context/UserContext'
import User from '@/models/User'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { useAccount } from 'wagmi'

function ContextProvider({
  children,
  initialUser,
}: {
  children: ReactNode
  initialUser: User
}) {
  const [user, setUser] = useState<User>()
  const getUserInfo = () => {
    update()
  }

  const { update, data } = useSession()

  const { address, isConnected } = useAccount()

  const router = useRouter()

  const [localAddress, setLocalAddress] = useState<string>()

  useEffect(() => {
    if (localAddress !== address && !!localAddress) {
      router.push('/')
    }
    setLocalAddress(address)
  }, [address])

  useEffect(() => {
    console.log('isConnected: ', isConnected)
    if (isConnected) {
      setUser(data?.userInfo)
    }
  }, [data, isConnected])

  return (
    <UserContext.Provider value={{ user, updateUser: getUserInfo }}>
      {children}
    </UserContext.Provider>
  )
}

export default ContextProvider
