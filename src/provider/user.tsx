'use client'

import UserContext from "@/context/UserContext";
import User from '@/models/User';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from 'react';
import { useAccount } from "wagmi";


function ContextProvider({
  children,
  initialUser,
}: {
  children: ReactNode
  initialUser: User
}) {
  const [user, setUser] = useState(initialUser)
  const getUserInfo = () => {
    update()
  }

  const { update, data } = useSession()

  const { address } = useAccount()

  const router = useRouter()

  const [localAddress, setLocalAddress] = useState<string>()

  useEffect(() => {
    console.log(address, localAddress)
    if (localAddress !== address && !!localAddress) {
      router.push("/")
    }
    setLocalAddress(address)

  }, [address])

  useEffect(() => {
    setUser(data?.userInfo)
  }, [data])

  return (
    <UserContext.Provider value={{ user, updateUser: getUserInfo }}>
      {children}
    </UserContext.Provider>
  )
}

export default ContextProvider
