"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "../../../../components/provider/SessionProvider";
import Image from "next/image";
import BrandLogo from "../../../../components/logo";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useSession();
  const pathname = usePathname();

  const handleLogout = () => {
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: "📊" },
    { label: "Employees", href: "/dashboard/employees", icon: "👥", adminOnly: true },
    { label: "Team Tasks", href: "/dashboard/tasks", icon: "📁" },
    { label: "Professional Network (Networx)", href: "https://networx-a-social-media-networking-p.vercel.app", icon: "🌐" },
  ];

  return (
    <section className="min-h-screen flex bg-slate-50 text-slate-900">
      <aside className="w-72 bg-slate-900 text-white hidden lg:flex flex-col sticky top-0 h-screen shadow-2xl">
        <div className="p-8 border-b border-slate-800 flex items-center gap-3">
         <BrandLogo size={36} />
          <h2 className="font-black text-xl tracking-tighter">SynTask</h2>
        </div>

        <nav className="flex-1 p-6 space-y-1.5">
          {navItems.map((item) => {
            if (item.adminOnly && user?.role !== "COMPANY_ADMIN") return null;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="bg-slate-800/50 p-4 rounded-2xl mb-4">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Operator</p>
            <p className="text-sm font-medium truncate italic">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all">
             Logout System
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 sticky top-0 z-10 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-lg">
            {navItems.find(i => i.href === pathname)?.label || "SynTask Console"}
          </h2>
          <div className="flex items-center gap-4">
             <span className="text-xs bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-500">SynTask Cloud v1.0</span>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </section>
  );
}