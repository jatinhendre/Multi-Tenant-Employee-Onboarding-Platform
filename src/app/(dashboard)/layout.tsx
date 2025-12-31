import Link from "next/link";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
})
 {
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) window.location.href = "/login";
  }, []);
  return (
    <section className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-black hidden md:flex flex-col">
        <div className="p-4 ">
          <h2 className="font-bold text-xl">Employee SaaS</h2>
        </div>

        <nav className="p-4 space-y-2">
          <Link href="/" className="block px-3 py-2 rounded hover:bg-red-100">
            Dashboard
          </Link>
          <Link
            href="/employees"
            className="block px-3 py-2 rounded hover:bg-gray-100"
          >
            Employees
          </Link>
          <Link
            href="/tasks"
            className="block px-3 py-2 rounded hover:bg-gray-100"
          >
            Tasks
          </Link>
          <Link
            href="/settings"
            className="block px-3 py-2 rounded hover:bg-gray-100"
          >
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="bg-black border-b p-4 flex justify-between">
          <span className="font-medium">Welcome 👋</span>
          <button
  onClick={() => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  }}
  className="text-red-600 font-medium"
>
  Logout
</button>

        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </section>
  );
}
