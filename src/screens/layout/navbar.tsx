import Image from "next/image";

export function Navbar() {
  return (
    <div className="w-full h-16 bg-gradient-to-r from-slate-900 to-slate-700 z-50 pt-5 pb-3 ">
      <div className="flex justify-between items-center w-full">
        <Image width={100} height={50} src='/images/logo.png' alt='logo' priority />
        <span className="text-xs text-slate-300">Your lovely bill splitter!</span>
      </div>
    </div>
  )
}