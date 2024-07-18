'use client'
import CdnImage from '@/components/cdn-image'
import UserContext from '@/context/UserContext'
import { useContext } from 'react'

export default function () {
  const { user } = useContext(UserContext)
  return (
    <>
      {user ? (
        <>
          <div className="border-b border-slate-200 pb-5 mb-4 ">
            <CdnImage
              src={`${user.avatar}`}
              className="size-[56px] rounded-full"
              width={56}
              height={56}
              alt="avatar"
            />
            <h2 className="mb-2 break-all text-4xl font-medium text-slate-700">
              {user.nickname}
            </h2>
            <div className="truncate text-base text-slate-400">
              {user.wallet.slice(0, 6)}...{user.wallet.slice(-5)}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  )
}
