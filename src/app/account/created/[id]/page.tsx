"use client"
import { abi } from '@/abi/Reward.sol/Reward.json';
import Interaction, { InteractStatus } from "@/models/Interaction";
import Task from "@/models/Task";
import User from "@/models/User";
import ChainMap from '@/utils/ChainMap';
import { Button, Image, Table, notification } from "antd";
import { ColumnsType } from "antd/es/table";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

type IJoinItem = Interaction & { user: [User] }

export default function ({ params: { id } }: { params: { id: string } }) {

  const [task, setTask] = useState<Task>(null)

  const session = useSession()

  const pageSize = 10
  const [page_number] = useState(1)
  const [joinedList, setJoinedList] = useState<IJoinItem[]>([])
  const [totalCount, setTotalCount] = useState(0)

  const [pending, setPending] = useState(false)
  const [record, setRecord] = useState<Interaction>(null)

  useEffect(() => {
    fetch(`/api/task/search?id=${id}`).then(res => res.json()).then(data => {
      setTask(data)
    })
  }, [])

  useEffect(() => {
    if (!task) return
    console.log(task)
    let formData = new FormData()
    formData.append("task_id", String(task._id))
    formData.append("page_number", page_number.toString())
    formData.append("page_size", pageSize.toString())
    fetch(`/api/interact/list`, {
      method: "POST",
      body: formData
    }).then(res => res.json()).then((data: [{ results: Array<IJoinItem>, totalCount: [{ total: number }] }]) => {
      setJoinedList(data[0].results)
      setTotalCount(data[0].totalCount[0].total)
    })
  }, [task])


  const columns: ColumnsType<IJoinItem> = [
    {
      title: 'Wallet Address',
      dataIndex: 'wallet',
      key: 'wallet',
      render(value, record, index) {
        return (
          record.user[0].wallet
        )
      },
    },
    {
      title: 'Join Time',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'Proof',
      dataIndex: 'proof',
      key: 'proof',
      render(value, record, index) {
        if (record.proof.text) {
          return (
            record.proof.text
          )
        }
        if (record.proof.image_link) {
          return <Image src={`${record.proof.image_link}`} width={100} />
        }
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (value, current, index) => {
        if (current.status === InteractStatus.Joined) {
          return (
            <div className='flex'>
              <Button className='mr-2' type='primary' disabled={pending} loading={current._id === record?._id && pending} onClick={() => sendReward(current)}>Approve</Button>
              <Button >Reject</Button>
            </div>
          )
        }
      }
    }
  ]

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

  const sendReward = (record: Interaction & { user: [User] }) => {
    const realChain = ChainMap[task.chain]
    setPending(true)
    setRecord(record)
    const address = record.user[0].wallet
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

      },
      onError(error, variables, context) {
        const errorName = (error.cause as { data: { errorName: string } }).data.errorName
        handleError(errorName)
      },
    },)
  }

  const handleSuccess = () => {
    fetch(`/api/interact`, {
      method: "PUT",
      body: JSON.stringify({
        id: record._id,
        task_id: record.task_id,
        transition_hash: hash,
        status: InteractStatus.RewardSent
      })
    })
    notification.success({
      message: "Success",
      description: "Reward sent successfully",
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
    <div>
      <Table rowKey={"_id"} columns={columns} dataSource={joinedList}></Table>
    </div>
  )
}