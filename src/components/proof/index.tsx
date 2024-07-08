"use client"

import { Button, notification } from "antd"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Upload from "../upload"

export default function ({ taskId, status }: { taskId: string, status: boolean }) {

  const [file, setFile] = useState("")

  const router = useRouter()

  const join = async () => {
    if (!file) return
    let formData = new FormData()
    formData.append('taskId', taskId)
    formData.append('proof', file)
    await fetch('/api/task/join', {
      method: "POST",
      body: formData,
    }).then(() => {
      notification.success({
        message: "Success",
        description: "Join success"
      })
      router.refresh()
    })
  }

  const fileChange = (file: string) => {
    setFile(file)
  }
  return (
    <>
      {
        status ? (
          <div className="w-full text-center px-4 py-2 border rounded-md mt-4">You have joined this Campaign</div>
        ) :
          (
            <>
              {
                file ? (
                  <Image className="rounded-md" src={`/uploads/proof/${file}`} width={1000} height={500} alt="proof">
                  </Image>
                ) : (
                  <Upload proofChange={fileChange}></Upload>
                )
              }
              <Button className="mt-4 w-full" size="large" onClick={join}>Complete</Button>
            </>
          )
      }
    </>
  )
}