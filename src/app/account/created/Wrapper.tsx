'use client'
import Task, { TaskStatus } from '@/models/Task'
import { Empty, Pagination } from 'antd'
import { useEffect, useState } from 'react'
import Card from './Card'

export default function created() {
  const [type, setType] = useState('')

  const [list, setList] = useState<Array<Task>>([])

  const [count, setCount] = useState(0)

  const pageSize = 9

  const [pageNumber, setPageNumber] = useState(1)

  const filterList = [
    {
      type: '',
      label: 'ALL',
    },
    {
      type: TaskStatus.Pending,
      label: 'Pending',
    },
    {
      type: TaskStatus.Ongoing,
      label: 'Ongoing',
    },
    {
      type: TaskStatus.Upcoming,
      label: 'Upcoming',
    },
    {
      type: TaskStatus.Finished,
      label: 'Finished',
    },
    {
      type: TaskStatus.Expired,
      label: 'Expired',
    },
  ]

  const fetchTaskList = () => {
    fetch('/api/task/search', {
      method: 'POST',
      body: JSON.stringify({
        status: type,
        pageSize,
        pageNumber,
      }),
    })
      .then((res) => res.json())
      .then((res: { list: Array<Task>; count: number }) => {
        setList(res.list)
        setCount(res.count)
      })
  }

  useEffect(() => {
    fetchTaskList()
  }, [type, pageNumber])

  return (
    <>
      <div className="flex gap-2 my-4">
        {filterList.map((e) => {
          return (
            <div
              onClick={() => setType(e.type)}
              className={`rounded-md bg-slate-400 text-white/80 px-2 py-1 cursor-pointer transition ${
                type === e.type ? '!bg-slate-500 !text-white' : ''
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
          <div className="flex flex-wrap justify-around w-full">
            {list.map((e) => (
              <div
                className="w-1/3 py-2 pr-2 pt-0 overflow-hidden"
                key={String(e._id)}
              >
                <Card task={e}></Card>
              </div>
            ))}
            <div className="w-1/3"></div>
            <div className="w-1/3"></div>
          </div>
          <Pagination
            defaultCurrent={1}
            current={pageNumber}
            defaultPageSize={9}
            total={count}
          />
        </>
      ) : (
        <Empty className="mt-16" />
      )}
    </>
  )
}
