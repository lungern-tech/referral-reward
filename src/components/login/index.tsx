"use client";

import { Avatar, Button, Dropdown } from "antd";
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
              <Dropdown menu={{ items: menus }}>
                <Avatar src={'https://www.loliapi.com/bg/'} />
              </Dropdown>
            </>
          ) : null
      }
      <Button onClick={openModal} ></Button>
      <w3m-button label="Login" />
    </>
  )
}

export default UserCenter