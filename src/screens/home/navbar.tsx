import Image from "next/image";

export function Navbar() {
  return (
    <div className="w-full h-16 bg-gradient-to-r from-slate-900 to-slate-700 z-50 py-3 ">
      <Image width={100} height={50} src='/images/logo.png' alt='logo' priority />
    </div>
  )
}