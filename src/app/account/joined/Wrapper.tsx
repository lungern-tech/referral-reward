'use client'
import Reward from '@/components/card/Reward'
import Interaction, { InteractStatus } from '@/models/Interaction'
import Task from '@/models/Task'
import User from '@/models/User'
import { Empty, Pagination } from 'antd'
import { useEffect, useState } from 'react'

export type IUserInteractItem = Interaction & { task: Task; creator: User }

export default function () {
  const [list, setList] = useState<Array<IUserInteractItem>>([])
  const page_size = 9
  const [page_number, setPageNumber] = useState(1)
  const [filter, setFilter] = useState('ALL')
  const [totalCount, setTotalCount] = useState(0)

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

  const fetchInteractList = () => {
    const body = {
      page_size,
      page_number,
      status: filter,
    }
    fetch('/api/interact/joiner', {
      method: 'POST',
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((res: { list: Array<IUserInteractItem>; count: number }) => {
        setList(res.list)
        setTotalCount(res.count)
      })
  }

  const filterChange = (type: string) => {
    setFilter(type)
    setPageNumber(1)
  }

  useEffect(() => {
    fetchInteractList()
  }, [page_number, filter])

  return (
    <>
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
      {list.length > 0 ? (
        <>
          <div className="flex flex-wrap justify-around">
            {list.map((e) => (
              <div
                className="w-1/3 pr-2 pb-2"
                key={String(e._id)}
              >
                <Reward
                  task={e.task}
                  user={e.creator}
                  status={e.status}
                ></Reward>
              </div>
            ))}
            <div className="w-1/3"></div>
            <div className="w-1/3"></div>
          </div>
          <Pagination
            defaultCurrent={1}
            total={totalCount}
            current={page_number}
            defaultPageSize={page_size}
            onChange={(page) => setPageNumber(page)}
          />
        </>
      ) : (
        <Empty className="mt-16" />
      )}
    </>
  )
}
