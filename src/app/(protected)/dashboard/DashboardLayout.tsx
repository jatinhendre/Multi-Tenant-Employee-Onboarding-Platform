"use client"

import Link from "next/link";
import { useSession } from "../../../../components/provider/SessionProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, company } = useSession();

  const handleLogout = () => {
    // Clear the cookies (usually by calling an API or removing them)
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
  };

  return (
    <section className="min-h-screen flex bg-gray-100 text-gray-900">
      <aside className="w-64 bg-gray-900 text-white hidden md:flex flex-col shadow-xl">
        <div className="p-6 border-b border-gray-700">
          <h2 className="font-extrabold text-2xl tracking-wide">Employee SaaS</h2>
        </div>

        <nav className="p-4 space-y-2 text-sm font-medium">
          <Link href="/dashboard" className="block px-4 py-2 rounded-lg hover:bg-gray-800">Dashboard</Link>
          {user?.role === "COMPANY_ADMIN" && (
             <Link href="/dashboard/employees" className="block px-4 py-2 rounded-lg hover:bg-gray-800">Employees</Link>
          )}
          <Link href="/dashboard/tasks" className="block px-4 py-2 rounded-lg hover:bg-gray-800">Tasks</Link>
          {/* Now you can easily link to the sibling page */}
          <Link href="/my-tasks" className="block px-4 py-2 rounded-lg hover:bg-gray-800 text-blue-400">Personal Tasks</Link>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
          <span className="font-semibold text-lg">Welcome 👋 {user?.email}</span>
          <div className="flex items-center gap-6">
            <button onClick={handleLogout} className="text-red-600 font-semibold hover:underline">
              Logout
            </button>
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </section>
  );
}