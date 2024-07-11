'use client'

import UserContext from "@/context/UserContext";
import User from '@/models/User';
import { useSession } from "next-auth/react";
import { useEffect, useState, type ReactNode } from 'react';


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
