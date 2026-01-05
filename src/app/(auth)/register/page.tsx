"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await fetch("/api/companies/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: formData.get("companyName"),
        companySize: Number(formData.get("companySize")),
        adminEmail: formData.get("adminEmail"),
        adminPassword: formData.get("adminPassword"),
        contactEmail: formData.get("contactEmail"),
        requirements: [formData.get("requirement")],
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Application Successful! Our team will review and approve your company shortly.");
      form.reset();
    } else {
      setMessage(data.message || "Registration failed");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900">Partner with Us</h1>
          <p className="text-slate-500 mt-2 font-medium">Fill in your company details for approval</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-1">Company Name</label>
            <input name="companyName" required className="w-full border border-slate-300 bg-white text-slate-900 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Company Size</label>
            <input name="companySize" type="number" required className="w-full border border-slate-300 bg-white text-slate-900 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Industry Need</label>
            <select name="requirement" className="w-full border border-slate-300 bg-white text-slate-900 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
              <option value="TASK_ASSIGNMENT">Task Assignment</option>
              <option value="WORKFLOW">Workflow Automation</option>
            </select>
          </div>
          <div className="md:col-span-2 border-t border-slate-100 pt-5 mt-2">
            <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-4">Admin Credentials</h3>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Admin Email</label>
            <input name="adminEmail" type="email" required className="w-full border border-slate-300 bg-white text-slate-900 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Admin Password</label>
            <input name="adminPassword" type="password" required className="w-full border border-slate-300 bg-white text-slate-900 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-1">Contact Email</label>
            <input name="contactEmail" type="email" required className="w-full border border-slate-300 bg-white text-slate-900 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
          </div>

          <button disabled={loading} className="md:col-span-2 mt-4 bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50 active:scale-[0.98]">
            {loading ? "Processing..." : "Submit Registration Request"}
          </button>
        </form>

        {message && (
          <div className={`mt-8 p-4 rounded-xl text-center text-sm font-semibold border ${message.includes('Successful') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
            {message}
          </div>
        )}
      </div>
    </main>
  );
}