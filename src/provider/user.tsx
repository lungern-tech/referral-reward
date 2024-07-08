'use client'

import UserContext from "@/context/UserContext"
import User from '@/models/User'
import { useState, type ReactNode } from 'react'

function ContextProvider({
  children,
  initialUser,
}: {
  children: ReactNode
  initialUser: User
}) {
  const [user, setUser] = useState(initialUser)
  const getUserInfo = () => {
    const userInfo = fetch("http://localhost:3000/api/profile").then(res => res.json()).then(data => {
      setUser(data)
    })
  }

  return (
    <UserContext.Provider value={{ user, updateUser: getUserInfo }}>
      {children}
    </UserContext.Provider>
  )
}

export default ContextProvider
