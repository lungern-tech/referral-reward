'use client'
import { abi } from '@/abi/Reward.sol/Reward.json'
import CdnImage from '@/components/cdn-image'
import UserContext from '@/context/UserContext'
import type Interaction from '@/models/Interaction'
import type Task from '@/models/Task'
import type User from '@/models/User'
import ChainMap from '@/utils/ChainMap'
import { CheckCircleFilled, CloseCircleFilled, LoadingOutlined } from '@ant-design/icons'
import { Button, Card, notification } from 'antd'
import { useContext, useEffect, useState } from 'react'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

type IJoinItem = Interaction & { user: User }

export default function ReferralCard({ item, task, onRefresh }: { item: IJoinItem, task: Task, onRefresh: () => void }) {
  const { user } = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const { data: hash, writeContract } = useWriteContract()
  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
    pollingInterval: 3_000
  })

  useEffect(() => {
    if (isSuccess) {
      handleSuccess()
    }
  }, [isSuccess])

  const sendReward = () => {
    const realChain = ChainMap[task.chain].chain
    const address = item.user.wallet
    setLoading(true)
    writeContract({
      abi,
      address: task.contract_address as `0x${string}`,
      functionName: 'sendReward',
      args: [address],
      chain: realChain,
      account: user.wallet as `0x${string}`,
      chainId: realChain.id
    }, {
      onSuccess: async (data) => {
        console.log('transition hash: ', data)
        notification.success({
          message: 'Success',
          description: (
            <div>
              Reward is sending. Check <a target='_blank'
                href={`${realChain.blockExplorers.default.url}/tx/${data}`}
                rel="noreferrer">{data}</a> for more information
            </div>
          )
        })
      },
      onError(error, variables, context) {
        const errorName = (error.cause as { data: { errorName: string } }).data.errorName
        setLoading(false)
        handleError(errorName)
      }
    })
  }

  const handleSuccess = () => {
    const realChain = ChainMap[task.chain].chain
    setLoading(false)
    fetch('/api/interact', {
      method: 'PUT',
      body: JSON.stringify({
        id: item._id,
        task_id: item.task_id,
        transition_hash: hash
      })
    }).then(() => {
      onRefresh()
      notification.success({
        message: 'Success',
        description: (
          <div>
            Reward has been sent. Check <a target='_blank'
              href={`${realChain.blockExplorers.default.url}/tx/${hash}`}
              rel="noreferrer">{hash}</a> for more information
          </div>
        )
      })
    })
  }

  const handleError = (errorName: string) => {
    if (errorName === 'WalletHasReceivedReward') {
      notification.error({
        message: 'Error',
        description: 'This wallet has already received the reward'
      })
    }
  }

  const rejectReward = () => {
    fetch('/api/interact/reject', {
      method: 'PUT',
      body: JSON.stringify({
        id: item._id,
        task_id: item.task_id,
      })
    }).then(() => {
      onRefresh()
      notification.success({
        message: 'Success',
        description: (
          <div>
            Rejected Successfully
          </div>
        )
      })
    })
  }



  return (
    <div className='w-1/3  p-4' >
      <Card className='relative'
        actions={
          [
            <Button key={1}
              onClick={sendReward}
              className='text-green-400'
            >{
                loading ? <LoadingOutlined /> :
                  <CheckCircleFilled />
              }
              Send
            </Button>,
            <Button onClick={rejectReward} className='text-red-600'>
              <CloseCircleFilled />
              Reject
            </Button>
          ]
        }
      >
        <div className='absolute -left-0 -top-0 px-2 py-1 rounded-tl-md rounded-br-md bg-green-500 text-white'>
          {item.status}
        </div>
        <CdnImage
          src={item.proof.image_link}
          width={300}
          height={100}
          alt='proof'
        />
      </Card>
    </div>
  )
}
