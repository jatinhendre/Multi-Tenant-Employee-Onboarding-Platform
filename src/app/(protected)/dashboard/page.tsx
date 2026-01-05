"use client";

import { useSession } from "../../../../components/provider/SessionProvider";

export default function DashboardHome() {
  const { user, company } = useSession();

  if (!user) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  const stats = [
    { label: "Active Employees", value: "12", icon: "👥", trend: "+2 this month", color: "text-blue-600" },
    { label: "Tasks Pending", value: "24", icon: "⏳", trend: "-5 from yesterday", color: "text-amber-600" },
    { label: "Projects Done", value: "158", icon: "✅", trend: "Top 10%", color: "text-emerald-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Manage your company workspace and team productivity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full bg-slate-50 ${stat.color}`}>{stat.trend}</span>
            </div>
            <p className="text-slate-500 font-medium text-sm">{stat.label}</p>
            <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
           Workspace Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Company Name</p>
              <p className="text-lg font-bold text-slate-800">{company?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Database Instance</p>
              <p className="text-sm font-mono bg-slate-50 p-2 rounded-lg text-indigo-600 inline-block">{company?.dbName || "primary_db"}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Current Admin</p>
              <p className="text-lg font-bold text-slate-800">{user.email}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Account Tier</p>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">PREMIUM ENTERPRISE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}