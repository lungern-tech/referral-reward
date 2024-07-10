"use client"
import UserContext from "@/context/UserContext";
import Image from "next/image";
import { useContext } from "react";

export default function () {
  const { user } = useContext(UserContext)
  return (
    <div className="border-b border-gray-dark-500 pb-5 mb-4 ">
      <Image src={`${user.avatar}`} className="size-[56px] rounded-full" width={56} height={56} alt="avatar"></Image>
      <h2 className="mb-2 break-all text-4xl">{user.nickname}</h2>
      <div className="truncate text-base text-gray-400">{user.wallet}</div>
    </div>
  )
}