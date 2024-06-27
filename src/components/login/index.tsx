"use client";

import { Avatar, Dropdown } from "antd";
import { useSession } from "next-auth/react"
import Link from "next/link";

const UserCenter = () => {

  const menus = [
    {
      key: '1',
      label: (<Link href={'/profile'}>Profile</Link>)
    }
  ]

  const session = useSession();
  return (
    <>
      {
        session.status === 'authenticated' ?
          (<Dropdown menu={{ items: menus }}>
            <Avatar />
          </Dropdown>) : <w3m-button label="Login" />
      }
    </>
  )
}

export default UserCenter