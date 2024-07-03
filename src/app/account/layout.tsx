import Link from "next/link";
import React from "react";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <section className="grid grid-cols-5">
      <div className="col-span-1">
        <nav className="border-r-2 p-8 pl-0">
          <div>
            <Link className="w-full block bg-gray-100 px-4 py-2 rounded-sm text-center" href={'/account'}>Account Setting</Link>
          </div>
          <div >
            <Link className="w-full block bg-gray-100 px-4 py-2 rounded-sm text-center mt-2" href={'/account/created'}>Created Campaign</Link>
          </div>
          <div>
            <Link className="w-full block bg-gray-100 px-4 py-2 rounded-sm text-center mt-2" href={'/account/joined'}>Joined Campaign</Link>
          </div>
        </nav>
      </div>
      <div className="col-span-4 p-8">
        {children}
      </div>
    </section>
  )
}