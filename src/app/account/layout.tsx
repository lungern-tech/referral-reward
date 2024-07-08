
import React from "react";
import Nav from "./nav";
import Summary from "./summary";

export default async function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {


  return (
    <section className="grid grid-cols-5">
      <div className="col-span-1 border-r h-full border-gray-dark-500 p-8 pl-0">
        <Summary />
        <Nav />
      </div>
      <div className="col-span-4 p-8">
        {children}
      </div>
    </section>
  )
}