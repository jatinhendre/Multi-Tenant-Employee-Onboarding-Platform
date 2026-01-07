"use client";

import Image from "next/image";
import { useState } from "react";
import BrandLogo from "../../../../components/logo";

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
    const companyId = (form.elements.namedItem("companyId") as HTMLInputElement).value || undefined;
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password,companyId }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message);
        setLoading(false);
        return;
      }

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
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-block p-1 bg-slate-50 rounded-2xl mb-4">
            <BrandLogo size={60} />
          </div>
          <h1 className="text-3xl font-black text-slate-900">SynTask Access</h1>
          <p className="text-slate-500 font-medium">Authentication required to proceed</p>
        </div>

      <form onSubmit={handleSubmit} className="space-y-4">
  {/* Email Input */}
  <div className="space-y-1">
    <label className="text-xs font-bold text-slate-700 uppercase ml-1">Email</label>
    <input 
      name="email" 
      type="email" 
      placeholder="email@example.com" 
      required 
      className="w-full p-3 border border-slate-300 rounded-xl bg-white text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400" 
    />
  </div>

  {/* Password Input */}
  <div className="space-y-1">
    <label className="text-xs font-bold text-slate-700 uppercase ml-1">Password</label>
    <input 
      name="password" 
      type="password" 
      placeholder="••••••••" 
      required 
      className="w-full p-3 border border-slate-300 rounded-xl bg-white text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400" 
    />
  </div>
  
  {/* Employee Specific Section */}
  <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 shadow-sm mt-4">
    <label className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-2">
      Employee Access Center
    </label>
    <input 
      name="companyId" 
      type="text" 
      placeholder="Organization ID (e.g. 6582c94...)" 
      className="w-full p-3 bg-white border border-indigo-200 rounded-lg text-slate-900 text-sm outline-none focus:border-indigo-500 transition-all placeholder:text-indigo-300 font-mono" 
    />
    <p className="text-[10px] text-indigo-400 mt-2 font-medium italic">
      *Only required for Staff/Employee logins. Admins can leave this blank.
    </p>
  </div>

  <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all mt-2">
    Login
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