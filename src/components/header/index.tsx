import Login from "@/components/login";
import Image from "next/image";
import Link from "next/link";
import "./index.scss";

const Header = () => {


  return (
    <div className="sticky top-0 z-[2] bg-black">
      <div className="flex flex-row gap-3 filter backdrop-blur-sm items-center border-b border-gray-dark-500 px-6 py-3 pl-5">
        <Link href={'/'}>
          <Image src={'/images/logo.png'} alt="logo" width={50} height={50} />
        </Link>
        <Login />
      </div>
    </div>
  )
}

export default Header;