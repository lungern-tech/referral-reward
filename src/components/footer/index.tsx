import {
  DiscordOutlined,
  GithubOutlined,
  MediumOutlined,
  XOutlined,
} from '@ant-design/icons'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 px-6 text-white ">
      <div className="max-w-[1280px] py-16 grid grid-cols-5 mx-auto">
        <div className="col-span-2">
          <div className="flex items-center ">
            <Image
              src={'/images/logo.png'}
              width={50}
              height={60}
              alt="logo"
            ></Image>
            <div className="font-bold text-2xl text-slate-700 ml-4">RTE</div>
          </div>
          <div className="mt-6">Referral To Earn Your Deserve</div>
          <div className="mt-6 inline-flex font-semibold text-slate-500">
            Copyright 2024
          </div>
          <div className="flex mt-6 gap-4 text-slate-500">
            <GithubOutlined className="text-2xl" />
            <XOutlined className="text-2xl" />
            <DiscordOutlined className="text-2xl" />
            <MediumOutlined className="text-2xl" />
          </div>
        </div>
        <div>
          <div className="text-slate-700 font-semibold text-base">Features</div>
          <div className="text-slate-500">
            <div className="mt-4">Simple and Equity</div>
            <div className="mt-4"></div>
            <div className="mt-4"></div>
          </div>
        </div>
        <div>
          <div className="text-slate-700 font-semibold text-base mb-6">
            Resources
          </div>
          <div className="text-slate-500">
            <div className="mt-4">
              <Link
                className="cursor-pointer underline"
                target="_blank"
                href="https://docs.referralreward.xyz/"
              >
                Docs
              </Link>
            </div>
            <div className="mt-4">
              Blog
              {/* <span className="absolute text-xs rounded-tl-md rounded-br-md bg-gradient-to-r to-pink-500 from-purple-500  text-white px-1">
                Soon
              </span> */}
            </div>
            <div className="mt-4">
              Quick Start
              {/* <span className="absolute text-xs rounded-tl-md rounded-br-md bg-gradient-to-r to-pink-500 from-purple-500  text-white px-1">
                Soon
              </span> */}
            </div>
            <div className="mt-4 relative">
              <Link
                href="https://forms.gle/Hq1L8j4G1swbQBUd7"
                target="_blank"
                className="cursor-pointer underline"
              >
                Feedback
                <span className="absolute text-xs rounded-tl-md rounded-br-md bg-gradient-to-r to-pink-500 from-purple-500  text-white px-1">
                  New
                </span>
              </Link>
            </div>
          </div>
        </div>
        <div>
          <div className="text-white font-semibold text-base">Company</div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
