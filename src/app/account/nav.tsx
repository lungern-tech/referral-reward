"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function () {
  const pathName = usePathname();

  useEffect(() => {
    console.log('path name', pathName)
  }, [pathName])

  return (
    <nav>
      <div>
        <Link className={`w-full block text-gray-600 px-4 py-2 rounded-sm mb-2 hover:!text-white hover:bg-gray-600 ${pathName === '/account/' ? '!text-white bg-gray-600' : ''}`} href={'/account'}>Account Setting</Link>
      </div>
      <div >
        <Link className={`w-full block text-gray-600 px-4 py-2 rounded-sm mb-2 hover:!text-white hover:bg-gray-600 ${pathName === '/account/created/' ? '!text-white bg-gray-600' : ''}`} href={'/account/created'}>Created Campaign</Link>
      </div>
      <div>
        <Link className={`w-full block text-gray-600  px-4 py-2 rounded-sm mb-2 hover:!text-white hover:bg-gray-600 ${pathName === '/account/joined/' ? '!text-white bg-gray-600' : ''}`} href={'/account/joined'}>Joined Campaign</Link>
      </div>
    </nav>
  )
}