'use client'
import type Interaction from '@/models/Interaction'
import type Task from '@/models/Task'
import type User from '@/models/User'
import ChainMap, { IChainConfig } from '@/utils/ChainMap'
import { Empty } from 'antd'
import { useEffect, useState } from 'react'
import Card from './Card'

type IJoinItem = Interaction & { user: User }

export default function Page({ params: { id } }: { params: { id: string } }) {
  const [task, setTask] = useState<Task>(null)

  const pageSize = 10
  const [pageNumber, setPageNumber] = useState(1)
  const [joinedList, setJoinedList] = useState<IJoinItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/task?id=${id}`)
      .then(async (res) => await res.json())
      .then((data) => {
        setTask(data)
      })
  }, [])

  const fetchList = () => {
    if (!task) return
    if (joinedList.length === 0) {
      setLoading(true)
    }
    const formData = new FormData()
    formData.append('task_id', String(task._id))
    formData.append('page_number', pageNumber.toString())
    formData.append('page_size', pageSize.toString())
    fetch('/api/interact/list', {
      method: 'POST',
      body: formData,
    })
      .then(async (res) => await res.json())
      .then(
        (data: [{ results: IJoinItem[]; totalCount: [{ total: number }] }]) => {
          setJoinedList(data[0].results || [])
          if (!data[0].totalCount.length) {
            setTotalCount(0)
          } else {
            setTotalCount(data[0].totalCount[0].total)
          }
          setLoading(false)
        }
      )
  }

  const [chainConfig, setChainConfig] = useState<IChainConfig>(null)

  useEffect(() => {
    if (task) {
      fetchList()
      console.log(ChainMap, task.chain, ChainMap[task.chain])
      setChainConfig(ChainMap[task.chain])
    }
  }, [task])

  return (
    <>
      {task && chainConfig ? (
        <div className="border border-slate-200 px-8 py-4 rounded-md shadow-lg">
          <div className="text-2xl font-semibold text-slate-700">
            Contract Info
          </div>
          <div className="flex mt-2 items-center">
            <div className="text-xl font-semibold text-slate-500 mr-4">
              Chain:
            </div>
            <div className="text-xl font-semibold text-slate-700">
              {task.chain}
            </div>
          </div>
          <div className="flex items-center mt-2">
            <div className="text-xl font-semibold text-slate-500 mr-4">
              Address:
            </div>
            <a
              className="box-border border-b border-cyan-400 hover:border-b-2"
              target="_blank"
              href={`${chainConfig.chain.blockExplorers.default.url}/address/${task.contract_address}`}
            >
              {task.contract_address.slice(0, 6)}...
              {task.contract_address.slice(-5)}
            </a>
          </div>
          <div className="flex items-center mt-2">
            <div className="text-xl font-semibold text-slate-500 mr-4">
              Deploy Hash:
            </div>
            <a
              className="border-b border-cyan-400 hover:border-b-2"
              target="_blank"
              href={`${chainConfig.chain.blockExplorers.default.url}/tx/${task.deploy_hash}`}
            >
              {task.deploy_hash.slice(0, 6)}...{task.deploy_hash.slice(-5)}
            </a>
          </div>
        </div>
      ) : null}
      <div className="mt-8">
        {loading ? (
          <></>
        ) : (
          <>
            {joinedList.length > 0 ? (
              <>
                <div className="flex flex-wrap">
                  {joinedList.map((item) => (
                    <Card
                      onRefresh={() => fetchList}
                      key={String(item._id + item.status)}
                      item={item}
                      task={task}
                    />
                  ))}
                </div>
              </>
            ) : (
              <Empty description={'No More User'} />
            )}
          </>
        )}
      </div>
    </>
  )
}
