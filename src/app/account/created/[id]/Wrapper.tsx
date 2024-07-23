'use client'
import type Interaction from '@/models/Interaction'
import { InteractStatus } from '@/models/Interaction'
import type Task from '@/models/Task'
import type User from '@/models/User'
import ChainMap, { IChainConfig } from '@/utils/ChainMap'
import { Empty, Pagination, Skeleton } from 'antd'
import { useEffect, useState } from 'react'
import Card from './Card'

export const metadata = {
  title: 'Campaign Detail',
}

type IJoinItem = Interaction & { user: User }

export default function Page({ id }: { id: string }) {
  const [task, setTask] = useState<Task>(null)

  const pageSize = 9
  const [pageNumber, setPageNumber] = useState(1)
  const [joinedList, setJoinedList] = useState<IJoinItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState(InteractStatus.Pending)

  const filterList = [
    {
      type: 'ALL',
      label: 'ALL',
    },
    {
      type: InteractStatus.Pending,
      label: 'Pending',
    },
    {
      type: InteractStatus.Success,
      label: 'Success',
    },
    {
      type: InteractStatus.Rejected,
      label: 'Rejected',
    },
  ]

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
    formData.append('status', filter)
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
  }, [task, filter, pageNumber])

  const filterChange = (type: string) => {
    setFilter(type as InteractStatus)
    setPageNumber(1)
  }

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
      ) : (
        <Skeleton />
      )}
      <div className="flex gap-2 my-4">
        {filterList.map((e) => {
          return (
            <div
              onClick={() => filterChange(e.type)}
              className={`rounded-md bg-slate-400 text-white/80 px-2 py-1 cursor-pointer transition ${
                filter === e.type ? '!bg-slate-500 !text-white' : ''
              }`}
              key={e.type}
            >
              {e.label}
            </div>
          )
        })}
      </div>
      <div className="mt-8">
        {loading ? (
          <></>
        ) : (
          <>
            {joinedList.length > 0 ? (
              <>
                <div className="flex flex-wrap mb-4">
                  {joinedList.map((item) => (
                    <Card
                      onRefresh={() => fetchList()}
                      key={String(item._id + item.status)}
                      item={item}
                      task={task}
                    />
                  ))}
                </div>
                <Pagination
                  defaultCurrent={1}
                  total={totalCount}
                  current={pageNumber}
                  defaultPageSize={pageSize}
                  onChange={(page) => setPageNumber(page)}
                />
              </>
            ) : (
              <Empty />
            )}
          </>
        )}
      </div>
    </>
  )
}
