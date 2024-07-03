"use client"
import Interaction, { InteractStatus } from "@/models/Interaction";
import Task from "@/models/Task";
import User from "@/models/User";
import { Button, Image, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";

type IJoinItem = Interaction & { user: [User] }

export default function ({ params: { id } }: { params: { id: string } }) {

  const [task, setTask] = useState<Task>(null)

  const pageSize = 10
  const [page_number, setPageNumber] = useState(1)
  const [joinedList, setJoinedList] = useState<IJoinItem[]>([])
  const [totalCount, setTotalCount] = useState(0)

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
          return <Image src={`/uploads/proof/${record.proof.image_link}`} width={100} />
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
      render: (value, record, index) => {
        if (record.status === InteractStatus.Joined) {
          return (
            <>
              <Button>Approve</Button>
              <Button>Reject</Button>
            </>
          )
        }
      }
    }
  ]
  return (
    <div>
      {task?.chain}
      <Table rowKey={"_id"} columns={columns} dataSource={joinedList}></Table>
    </div>
  )
}