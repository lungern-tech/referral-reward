"use client";

import UserContext from "@/context/UserContext";
import { Avatar } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useContext } from "react";

const UserCenter = () => {

  const { user } = useContext(UserContext)
  const session = useSession();
  return (
    <>
      {
        session.status === 'authenticated' && user ?
          (
            <>
              <Link href={'/create'} className="ml-auto inline-flex
                items-center justify-center whitespace-nowrap text-sm
                font-medium rounded-sm px-3 bg-primary h-8 text-black"><span>Create New Campaign</span></Link>
              <Link href={'/account'}>
                <Avatar src={`${user.avatar}`} className="cursor-pointer" />
              </Link>
            </>
          ) : null
      }
      <w3m-button label="Login" />
    </>
  )
}

export default UserCenter