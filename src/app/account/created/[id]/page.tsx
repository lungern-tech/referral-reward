"use client"
import { abi } from '@/abi/Reward.sol/Reward.json';
import Interaction from "@/models/Interaction";
import Task from "@/models/Task";
import User from "@/models/User";
import ChainMap from '@/utils/ChainMap';
import { CheckCircleFilled, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Card, Empty, notification } from "antd";
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

type IJoinItem = Interaction & { user: User }

export default function ({ params: { id } }: { params: { id: string } }) {

  const [task, setTask] = useState<Task>(null)

  const session = useSession()

  const pageSize = 10
  const [page_number] = useState(1)
  const [joinedList, setJoinedList] = useState<IJoinItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const [pending, setPending] = useState(false)
  const [record, setRecord] = useState<Interaction>(null)

  useEffect(() => {
    fetch(`/api/task/search?id=${id}`).then(res => res.json()).then(data => {
      setTask(data)
    })
  }, [])

  useEffect(() => {
    if (!task) return
    if (joinedList.length === 0) {
      setLoading(true)
    }
    let formData = new FormData()
    formData.append("task_id", String(task._id))
    formData.append("page_number", page_number.toString())
    formData.append("page_size", pageSize.toString())
    fetch(`/api/interact/list`, {
      method: "POST",
      body: formData
    }).then(res => res.json()).then((data: [{ results: Array<IJoinItem>, totalCount: [{ total: number }] }]) => {
      setJoinedList(data[0].results || [])
      setTotalCount(data[0].totalCount[0].total)
      setLoading(false)
    })
  }, [task])


  const { data: hash, writeContract } = useWriteContract()
  const { isSuccess, isError, } = useWaitForTransactionReceipt({
    hash,
    pollingInterval: 3_000
  })

  useEffect(() => {
    if (isSuccess) {
      handleSuccess()
      setPending(false)
      setRecord(null)
    }
  }, [isSuccess])

  const sendReward = (record: IJoinItem) => {
    const realChain = ChainMap[task.chain]
    setPending(true)
    setRecord(record)
    const address = record.user.wallet
    writeContract({
      abi,
      address: task.contract_address as `0x${string}`,
      functionName: 'sendReward',
      args: [address],
      chain: realChain,
      account: session.data.address,
      chainId: realChain.id,
    }, {
      onSuccess: async (data) => {
        console.log('transition hash: ', data)
        notification.success({
          message: "Success",
          description: (
            <div>
              Reward is sending. Check <a target='_blank' href={`${realChain.blockExplorers.default.url}/tx/${hash}`}>{hash}</a> for more information
            </div>
          )
        })
      },
      onError(error, variables, context) {
        const errorName = (error.cause as { data: { errorName: string } }).data.errorName
        handleError(errorName)
      },
    },)
  }

  const handleSuccess = () => {
    const realChain = ChainMap[task.chain]
    fetch(`/api/interact`, {
      method: "PUT",
      body: JSON.stringify({
        id: record._id,
        task_id: record.task_id,
        transition_hash: hash,
      })
    })
    notification.success({
      message: "Success",
      description: (
        <div>
          Reward has been sent. Check <a target='_blank' href={`${realChain.blockExplorers.default.url}/tx/${hash}`}>{hash}</a> for more information
        </div>
      )
    })
  }

  const handleError = (errorName: string) => {
    if (errorName === "WalletHasReceivedReward") {
      notification.error({
        message: "Error",
        description: "This wallet has already received the reward",
      })
    }
    setPending(false)
    setRecord(null)
  }

  return (
    <>
      {
        task ? (
          <div >
            <div className=''>Contract Info</div>
            <div className='flex'>
              <div className=''>Chain: </div>
              <div className=''>{task.chain}</div>
            </div>
            <div className='flex'>
              <div className=''>Address: </div>
              <a href="">{task.contract_address}</a>
            </div>
            <div className='flex'>
              <div className=''>Deploy Hash: </div>
              <div >{task.deploy_hash}</div>
            </div>
          </div >
        )
          : null
      }
      {
        loading ? (
          <></>
        ) : (
          <>
            {
              joinedList.length > 0 ? (
                <>
                  <div className='flex'>
                    {
                      joinedList.map((item) => (
                        <div className='w-1/3  p-4' key={String(item._id)}>
                          <Card className='relative' actions={[<Button loading={loading} onClick={() => sendReward(item)} className='text-green-400'  ><CheckCircleFilled />Send</Button>, <CloseCircleOutlined />]}>
                            <div className='absolute left-0 top-0'>
                              {item.status}
                            </div>
                            <Image src={item.proof.image_link} width={300} height={100} alt='proof'></Image>
                          </Card>
                        </div>
                      ))
                    }
                  </div>
                </>
              ) : <Empty description={"No More User"} />
            }
          </>
        )
      }
    </>
  )
}