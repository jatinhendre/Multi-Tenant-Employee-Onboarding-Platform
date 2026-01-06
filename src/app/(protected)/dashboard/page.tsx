"use client";

import { useEffect, useState } from "react";
import { useSession } from "../../../../components/provider/SessionProvider";

interface RealStats {
  activeEmployees: number;
  tasksPending: number;
  projectsDone: number;
}

export default function DashboardHome() {
  const { user, company } = useSession();
  const [realStats, setRealStats] = useState<RealStats | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!company?.dbName) return;
      try {
        const res = await fetch(`/api/dashboardStats?db=${company.dbName}`);
        const data = await res.json();
        setRealStats(data);
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setFetching(false);
      }
    }
    fetchStats();
  }, [company?.dbName]);

  if (!user || fetching) return (
    <div className="flex items-center justify-center h-full py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  const stats = [
    { label: "Active Team", value: realStats?.activeEmployees || 0, icon: "👥", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Tasks Pending", value: realStats?.tasksPending || 0, icon: "⏳", color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Tasks Completed", value: realStats?.projectsDone || 0, icon: "✅", color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1 font-medium">Real-time metrics for <span className="text-indigo-600">@{company?.name}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} p-3 rounded-2xl text-2xl group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-50 text-slate-400 uppercase tracking-widest">Live Sync</span>
            </div>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-tighter mb-1">{stat.label}</p>
            <p className={`text-4xl font-black text-slate-900`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 text-9-xl font-black pointer-events-none uppercase">
          {company?.name}
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
           <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></span>
           Workspace Intelligence
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 relative z-10">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Entity Name</p>
              <p className="text-xl font-bold text-slate-800">{company?.name || "Initializing..."}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Tenant Partition</p>
              <p className="text-sm font-mono bg-indigo-50/50 px-3 py-1.5 rounded-lg text-indigo-600 inline-block border border-indigo-100">{company?.dbName}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Security Clearance</p>
              <p className="text-xl font-bold text-slate-800 uppercase tracking-tight">{user.role.replace("_", " ")}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Environment Status</p>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest">
                Production Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}