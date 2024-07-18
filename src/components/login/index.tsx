'use client'

import UserContext from '@/context/UserContext'
import { Avatar } from 'antd'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useContext } from 'react'
import { useAccount } from 'wagmi'

const UserCenter = () => {
  const { user } = useContext(UserContext)
  const session = useSession()
  const { isConnected } = useAccount()
  return (
    <>
      {session.status === 'authenticated' && user && isConnected ? (
        <>
          <Link
            href={'/create'}
            className="
                ml-auto whitespace-nowrap 
                inline-flex items-center justify-center
                text-sm cursor-pointer
                font-medium rounded-sm px-3 bg-primary h-8 shadow-lg
                transition
                text-slate-700
                hover:text-slate-900
                hover:bg-slate-50
                hover:shadow-md
                hover:scale-105
                "
          >
            <span>Create New Campaign</span>
          </Link>
          <Link href={'/account'}>
            <Avatar
              src={`${user.avatar}`}
              className="cursor-pointer"
            />
          </Link>
        </>
      ) : null}
      <w3m-button label="Login" />
    </>
  )
}

export default UserCenter
