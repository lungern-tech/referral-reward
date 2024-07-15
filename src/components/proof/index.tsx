"use client"

import UserContext from "@/context/UserContext"
import Interaction, { InteractStatus } from "@/models/Interaction"
import Task from "@/models/Task"
import ChainMap from "@/utils/ChainMap"
import { Button, notification } from "antd"
import { useRouter } from "next/navigation"
import { useContext, useState } from "react"
import CdnImage from "../cdn-image"
import Upload from "../upload"

export default function ({ task, interaction }: { task: Task, interaction?: Interaction }) {

  const [file, setFile] = useState("")

  const router = useRouter()

  const { user } = useContext(UserContext)

  const join = async () => {
    if (!file) {
      notification.error({
        message: "Error",
        description: "Please upload proof first"
      })
      return
    }
    let formData = new FormData()
    formData.append('taskId', String(task._id))
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
    }).catch((e) => {
      console.log(e)
    })
  }

  const fileChange = (file: string) => {
    setFile(file)
  }
  return (
    <>
      {
        user ? (
          interaction &&
            interaction.status === InteractStatus.Joined ? (
            <div className="w-full text-center px-4 py-2 border rounded-md mt-4">Have Joined This Campaign</div>
          ) :
            interaction && interaction.status === InteractStatus.RewardSent ? (
              <div className="w-full text-center">
                You have received the reward. <a href={`${ChainMap[task.chain].blockExplorers.default.url}/tx/${interaction.transition_hash}`} target="_blank">Check</a> for more details
              </div>
            ) :
              (
                <>
                  {
                    file ? (
                      <CdnImage className="rounded-md" src={`${file}`} width={1000} height={500} alt="proof" />
                    ) : (
                      <Upload proofChange={fileChange}></Upload>
                    )
                  }
                  <Button className="mt-4 w-full" size="large" onClick={join}>Complete</Button>
                </>
              ))
          :
          (
            <div className="w-full text-center px-4 py-2 border rounded-md mt-4">Login To Join</div>
          )
      }
    </>
  )
}