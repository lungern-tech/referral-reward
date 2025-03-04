'use client'

import { simpleCountdown } from '@/utils/DateFormat'
import { useEffect, useState } from 'react'

export default function ({
  className,
  endTime,
}: {
  className?: string
  endTime: Date
}) {
  const [countTime, setCountTime] = useState('')

  useEffect(() => {
    let end_date = new Date(endTime)
    let pointer = -1
    const timer = () => {
      let timeStr = simpleCountdown(end_date.getTime() - Date.now())
      setCountTime(timeStr)
      pointer = window.setTimeout(() => {
        timer()
      }, 1000)
    }
    timer()
    return () => {
      clearTimeout(pointer)
    }
  }, [endTime])

  return <div className={className}>{countTime}</div>
}
