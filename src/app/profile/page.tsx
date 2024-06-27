"use client"

import User from "@/models/User"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Title from "@/components/title"
import { Button, Input, notification } from "antd"

const getUserProfile = async () => {
  const userInfo = await fetch("http://localhost:3000/api/profile")
  return userInfo.json()
}

const updateUserProfile = async (userInfo: Partial<User>) => {
  await fetch("http://localhost:3000/api/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  })
}

export default function () {
  const [nickname, setNickname] = useState<string>("")
  const [userId, setUserId] = useState("")
  const session = useSession()
  useEffect(() => {
    updateUserInfo()
  }, [session])

  const updateUserInfo = () => {
    getUserProfile().then((res: User) => {
      const { nickname, _id } = res
      setNickname(nickname)
      setUserId(String(_id))
    })
  }

  const updateUserName = () => {
    updateUserProfile({ nickname, _id: userId }).then(() => {
      notification.success({
        message: "Update successfully",
      })
      updateUserInfo()
    }).catch((err) => {
      notification.error({
        message: "Update failed",
        description: err.message,
      })
    })
  }

  return (
    <div className="px-16 py-8">
      <div>
        <Title title="Username"></Title>
        <Input value={nickname} onChange={(e) => setNickname(e.target.value)} className="mt-4 px-4 py-2" />
        <Button onClick={updateUserName} className="px-8 py-5 mt-4 font-bold" type="primary">Save</Button>
      </div>
      <div>
        <Title title="Social Media Accounts"></Title>
        <div>

        </div>

      </div>
    </div>
  )
}