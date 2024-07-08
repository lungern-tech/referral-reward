"use client";

import { Avatar } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";

const UserCenter = () => {

  const menus = [
    {
      key: '3',
      label: (<Link href={'/account'}>User Center</Link>)
    }
  ]

  const openModal = () => {

  }

  const session = useSession();
  return (
    <>
      {
        session.status === 'authenticated' ?
          (
            <>
              <Link href={'/create'} className="ml-auto inline-flex
                items-center justify-center whitespace-nowrap text-sm
                font-medium rounded-sm px-3 bg-primary h-8 text-black"><span>Create New Campaign</span></Link>
              <Link href={'/account'}>
                <Avatar src={'https://www.loliapi.com/bg/'} className="cursor-pointer" />
              </Link>
            </>
          ) : null
      }
      <w3m-button label="Login" />
    </>
  )
}

export default UserCenter