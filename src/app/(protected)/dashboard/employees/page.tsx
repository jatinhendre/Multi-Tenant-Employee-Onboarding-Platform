"use client";

import { useState } from "react";
import { useSession } from "../../../../../components/provider/SessionProvider";

export default function EmployeesPage() {
  const { company } = useSession();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!company?.dbName) return;
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await fetch("/api/employees/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        name: formData.get("name"),
        email: formData.get("email"),
        position: formData.get("position"),
        companyDb: company.dbName
      }),
    });

    if (res.ok) {
      setMessage("Success! New teammate has been onboarded.");
      form.reset();
    }
    setLoading(false);
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Team Directory</h1>
        <p className="text-slate-500">Add and manage access for your company employees</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl">
        <h2 className="text-lg font-bold text-slate-800 mb-6 italic">Add New Employee</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-600 mb-1.5">Full Name</label>
            <input name="name" placeholder="John Doe" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1.5">Professional Email</label>
            <input name="email" type="email" placeholder="john@company.com" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1.5">Job Position</label>
            <input name="position" placeholder="Software Engineer" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none" required />
          </div>
          <button disabled={loading} className="md:col-span-2 bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50">
            {loading ? "Adding..." : "Confirm & Send Invite"}
          </button>
        </form>
        {message && (
          <div className="mt-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 font-medium flex items-center gap-2">
            <span>🎉</span> {message}
          </div>
        )}
      </div>
    </div>
  );
}