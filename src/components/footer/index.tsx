import { DiscordOutlined, GithubOutlined, MediumOutlined, XOutlined } from "@ant-design/icons";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="py-16 grid grid-cols-5 border-t border-gray-dark-500 text-white w-[1280px] mx-auto">
      <div className="col-span-2">
        <div className="flex items-center ">
          <Image src={"/images/logo.png"} width={50} height={60} alt="logo"></Image>
          <div className="font-bold text-2xl ml-4">RTE</div>
        </div>
        <div className="mt-6">Referral To Earn Your Deserve</div>
        <div className="mt-6 inline-flex text-dark-gray-400">
          copyright 2024
        </div>
        <div className="flex mt-6 gap-4 text-dark-gray-400">
          <GithubOutlined className="text-2xl" />
          <XOutlined className="text-2xl" />
          <DiscordOutlined className="text-2xl" />
          <MediumOutlined className="text-2xl" />
        </div>
      </div>
      <div>
        <div className="text-white font-semibold text-base">
          Features
        </div>
      </div>
      <div>
        <div className="text-white font-semibold text-base mb-6">Resources</div>
        <div className="text-dark-gray-600">
          <div className="mt-4">Blog</div>
          <div className="mt-4">Quick Start</div>
          <div className="mt-4">Feedback</div>
        </div>
      </div>
      <div >
        <div className="text-white font-semibold text-base">Company</div>
      </div>
    </footer>
  );
};

export default Footer;