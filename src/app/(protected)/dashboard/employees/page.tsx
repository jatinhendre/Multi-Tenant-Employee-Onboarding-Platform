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
        email: formData.get("email"), // This is their Login ID
        contactEmail: formData.get("contact_email"), // This is where we send the mail
        position: formData.get("position"),
        companyDb: company.dbName
      }),
    });

    if (res.ok) {
      setMessage("Success! New teammate has been onboarded and notified.");
      form.reset();
    }
    setLoading(false);
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Team Directory</h1>
        <p className="text-slate-500 font-medium">Add and manage access for your company employees</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-2xl">
        <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
          <span className="bg-indigo-100 p-2 rounded-lg text-indigo-600">👤</span>
          Add New Employee
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
            <input name="name" placeholder="John Doe" className="w-full border border-slate-200 bg-slate-50 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Assign a Login Email)</label>
            <input name="email" type="email" placeholder="john@company.com" className="w-full border border-slate-200 bg-slate-50 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required />
          </div>

          <div>
            <label className="block text-xs font-black text-indigo-500 uppercase tracking-widest mb-2 ml-1">Contact Email Of Employee to send mail</label>
            <input name="contact_email" type="email" placeholder="personal.email@gmail.com" className="w-full border border-indigo-100 bg-indigo-50/30 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Job Position</label>
            <input name="position" placeholder="Software Engineer" className="w-full border border-slate-200 bg-slate-50 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required />
          </div>

          <button disabled={loading} className="md:col-span-2 bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] disabled:opacity-50 mt-4 uppercase tracking-widest text-sm">
            {loading ? "Processing..." : "Grant Access & Send Credentials"}
          </button>
        </form>

        {message && (
          <div className="mt-8 p-5 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 font-bold flex items-center gap-3 animate-bounce">
            <span className="text-xl">✅</span> {message}
          </div>
        )}
      </div>
    </div>
  );
}