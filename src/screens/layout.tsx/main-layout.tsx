import { Navbar } from "../home/navbar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container max-w-lg h-screen mx-auto  bg-gradient-to-r from-slate-900 to-slate-700 text-slate-100relative px-5 text-slate-100">
      <Navbar />
      {children}
    </div>
  )
}
