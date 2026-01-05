"use client";

import { useState } from "react";

export default function LoginPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message);
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify({
        email: email,
        role: data.role,
        company: data.company || null,
      }));

      if (data.role === "SUPERADMIN") window.location.href = "/superadmin";
      else if (data.role === "COMPANY_ADMIN") window.location.href = "/dashboard";
      else if (data.role === "EMPLOYEE") window.location.href = "/my-tasks";
    } catch (err) {
      setMessage("Connection error. Try again.");
      setLoading(false);
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 mt-2 font-medium">Sign in to your dashboard</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
            <input name="email" type="email" required placeholder="name@company.com" className="w-full border border-slate-300 bg-white text-slate-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
            <input name="password" type="password" required placeholder="••••••••" className="w-full border border-slate-300 bg-white text-slate-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400" />
          </div>

          <button disabled={loading} className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-70">
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>

        {message && (
          <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-semibold text-center">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}