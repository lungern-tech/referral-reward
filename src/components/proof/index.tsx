'use client'

import UserContext from '@/context/UserContext'
import Interaction, { InteractStatus } from '@/models/Interaction'
import Task from '@/models/Task'
import ChainMap from '@/utils/ChainMap'
import { DeleteOutlined } from '@ant-design/icons'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { Button, notification } from 'antd'
import { useRouter } from 'next/navigation'
import { useContext, useState } from 'react'
import CdnImage from '../cdn-image'
import Upload from '../upload'

export default function ({
  task,
  interaction,
}: {
  task: Task
  interaction?: Interaction
}) {
  const [file, setFile] = useState('')

  const router = useRouter()

  const { user } = useContext(UserContext)

  const { open } = useWeb3Modal()

  const join = async () => {
    if (!file) {
      notification.error({
        message: 'Error',
        description: 'Please upload proof first',
      })
      return
    }
    let formData = new FormData()
    formData.append('taskId', String(task._id))
    formData.append('proof', file)
    await fetch('/api/task/join', {
      method: 'POST',
      body: formData,
    })
      .then(() => {
        notification.success({
          message: 'Success',
          description: 'Join success',
        })
        router.refresh()
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const fileChange = (file: string) => {
    setFile(file)
  }

  const login = () => {
    open()
  }

  return (
    <>
      {user ? (
        interaction && interaction.status === InteractStatus.Joined ? (
          <div className="w-full text-center px-4 py-2 border text-slate-700 font-semibold shadow-md rounded-md mt-4">
            Join Campaign Successfully
          </div>
        ) : interaction && interaction.status === InteractStatus.RewardSent ? (
          <div className="w-full text-center">
            You have received the reward.{' '}
            <a
              href={`${
                ChainMap[task.chain].chain.blockExplorers.default.url
              }/tx/${interaction.transition_hash}`}
              target="_blank"
            >
              Check
            </a>{' '}
            for more details
          </div>
        ) : (
          <>
            {file ? (
              <div className="relative">
                <CdnImage
                  className="rounded-md"
                  src={`${file}`}
                  width={1000}
                  height={500}
                  alt="proof"
                />
                <div className="absolute z-10 left-0 top-0 w-full h-full transition opacity-0 hover:opacity-100 bg-slate-400/50 flex items-center justify-center">
                  <DeleteOutlined
                    onClick={() => fileChange('')}
                    className="text-red-500 text-2xl cursor-pointer mix-blend-multiply"
                  />
                </div>
              </div>
            ) : (
              <Upload proofChange={fileChange}></Upload>
            )}
            <Button
              className="mt-4 w-full"
              size="large"
              onClick={join}
              disabled={!file}
            >
              Complete
            </Button>
          </>
        )
      ) : (
        <div
          onClick={login}
          className="cursor-pointer bg-slate-50 font-semibold
          text-slate-700 w-full text-center px-4 py-2 border rounded-md mt-4
          hover:bg-slate-200
          hover:text-slate-700
          transition
          "
        >
          Join
        </div>
      )}
    </>
  )
}
