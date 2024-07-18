import React from 'react'
import Nav from './nav'
import Summary from './summary'

export default async function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="hidden lg:block lg:w-[360px] border-r border-slate-200 h-auto  p-8 pl-0">
        <Summary />
        <Nav />
      </div>
      <div className="p-8 flex-1 w-1">{children}</div>
    </>
  )
}
