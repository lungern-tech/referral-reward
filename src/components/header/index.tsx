import Login from "@/components/login";
import Link from "next/link";
const Header = () => {
  return (
    <div className="sticky top-0 backdrop-blur-xl z-10">
      <header className="flex h-20 px-8 items-center">
        <Link href={'/'}>
          <div className="font-bold text-2xl">Reward</div>
        </Link>
        <div className="ml-auto mr-0">
          <Login />
        </div>
      </header>
    </div>
  )
}

export default Header;