"use client";

import { Avatar, Dropdown } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";

const UserCenter = () => {

  const menus = [
    {
      key: '3',
      label: (<Link href={'/account'}>User Center</Link>)
    }
  ]

  const session = useSession();
  return (
    <>
      <w3m-button label="Login" />
      {
        session.status === 'authenticated' ?
          (<Dropdown menu={{ items: menus }}>
            <Avatar />
          </Dropdown>) : null
      }
    </>
  )
}

export default UserCenter