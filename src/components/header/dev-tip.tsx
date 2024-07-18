'use client'

import { CloseOutlined } from '@ant-design/icons'
import { useState } from 'react'

export default function DevTip() {
  const [open, setOpen] = useState(true)

  return open ? (
    <div className="px-2 rounded-b-md  py-1 fixed top-0 left-1/2 flex justify-center items-center -translate-x-1/2 z-[100] text-white  bg-rose-400">
      This app is in dev version. Be careful and save your money.
      <CloseOutlined
        onClick={() => setOpen(false)}
        className="ml-4 cursor-pointer "
      />
    </div>
  ) : null
}
