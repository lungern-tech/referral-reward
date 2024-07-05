import Login from "@/components/login";
import Link from "next/link";
import "./index.scss";

const Header = () => {
  return (
    <div className="sticky top-0 z-[2] bg-black">
      <div className="flex flex-row gap-3 items-center border-b border-b-gray-dark-500 px-6 py-3 pl-5">
        <Link href={'/'}>
          <div className="font-bold text-2xl">Reward</div>
        </Link>
        <Login />
      </div>
    </div>
  )
}

export default Header;