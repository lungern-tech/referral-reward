"use client"

import { CloseOutlined } from "@ant-design/icons"
import { useState } from "react"

export default function DevTip() {

  const [open, setOpen] = useState(true)

  return (
    open ? (
      <div className="px-2 rounded-b-md  py-1 fixed top-0 left-1/2 -translate-x-1/2 z-[100] bg-white text-red-600">
        This app is in dev version.  Be careful and save your money.
        <CloseOutlined onClick={() => setOpen(false)} className="ml-4 cursor-pointer " />
      </div>
    ) : null
  )
}