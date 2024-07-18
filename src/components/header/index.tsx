import Login from '@/components/login'
import Image from 'next/image'
import Link from 'next/link'
import DevTip from './dev-tip'
import './index.scss'

const Header = () => {
  return (
    <div className="sticky top-0 z-[2] ">
      <div className="flex flex-row gap-3 filter text-slate-900 backdrop-blur-lg items-center border-b border-slate-100  px-6 py-3 pl-5">
        <DevTip />
        <Link
          className="mr-auto flex items-center cursor-pointer"
          href={'/'}
        >
          <Image
            src={'/images/logo.png'}
            alt="logo"
            width={50}
            height={50}
          />
          <span className="ml-2 font-semibold text-xl text-slate-700">
            Referral to Earn
          </span>
        </Link>
        <Login />
      </div>
    </div>
  )
}

export default Header
