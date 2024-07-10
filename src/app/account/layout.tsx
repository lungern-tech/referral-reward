
import React from "react";
import Nav from "./nav";
import Summary from "./summary";

export default async function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {


  return (
    <>
      <div className="w-[360px] border-r h-full border-gray-dark-500 p-8 pl-0">
        <Summary />
        <Nav />
      </div>
      <div className="p-8 flex-1 w-0">
        {children}
      </div>
    </>
  )
}