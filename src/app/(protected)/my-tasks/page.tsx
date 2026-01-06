"use client";

import { useSession } from "../../../../components/provider/SessionProvider";
import { useEffect, useState, useCallback } from "react";

interface TaskPayload {
  _id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED"; 
  dueDate: string;
}

export default function MyTasksPage() {
  const { user, company } = useSession();
  const [tasks, setTasks] = useState<TaskPayload[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMyTasks = useCallback(async () => {
    if (!company?.dbName || !user?.email) return;

    try {
      const res = await fetch(`/api/tasks/list?db=${company.dbName}`);
      if (!res.ok) throw new Error("Failed to fetch");
      
      const data = await res.json();
      const filtered = (data.tasks || []).filter((t: TaskPayload) => t.assignedTo === user.email);
      setTasks(filtered);
    } catch (error) {
      console.error("Sync Error:", error);
    } finally {
      setLoading(false);
    }
  }, [company?.dbName, user?.email]);

  useEffect(() => {
    if (company && user) {
      loadMyTasks();
    }
  }, [company, user, loadMyTasks]);

  async function updateStatus(id: string, newStatus: TaskPayload["status"]) {
    setTasks(prev => prev.map(t => 
      t._id === id ? { ...t, status: newStatus } : t
    ));

    try {
      await fetch("/api/tasks/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus, companyDb: company?.dbName }),
      });
    } catch (error) {
      loadMyTasks(); 
    }
  }

  if (!user || !company) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse">Initializing SynTask Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">My <span className="text-indigo-600">Tasks</span></h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Manage your individual contributions and deadlines</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Focus</span>
          <span className="text-2xl font-black text-indigo-600">{tasks.filter(t => t.status !== 'COMPLETED').length}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {tasks.map((t) => (
          <div key={t._id} className="group bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all duration-300">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase border ${
                    t.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                    t.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                    'bg-slate-50 text-slate-500 border-slate-100'
                  }`}>
                    {t.status.replace("_", " ")}
                  </span>
                  {t.dueDate && (
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Due: {new Date(t.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{t.title}</h2>
                <p className="text-slate-500 leading-relaxed text-sm md:text-base max-w-2xl">{t.description}</p>
              </div>

              <div className="flex flex-row lg:flex-col gap-3">
                {t.status === "PENDING" && (
                  <button 
                    onClick={() => updateStatus(t._id, "IN_PROGRESS")} 
                    className="flex-1 lg:w-48 bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-indigo-600 transition-all shadow-lg active:scale-95 text-sm"
                  >
                    Start Execution
                  </button>
                )}
                {t.status === "IN_PROGRESS" && (
                  <button 
                    onClick={() => updateStatus(t._id, "COMPLETED")} 
                    className="flex-1 lg:w-48 bg-emerald-500 text-white font-bold py-4 rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 active:scale-95 text-sm"
                  >
                    Complete Task
                  </button>
                )}
                {t.status === "COMPLETED" && (
                  <div className="flex-1 lg:w-48 flex items-center justify-center gap-2 py-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 font-black text-sm uppercase tracking-tighter">
                    Verified Done 🏆
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {!loading && tasks.length === 0 && (
          <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-200">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-slate-800">Operational Excellence</h3>
            <p className="text-slate-400 font-medium">Your queue is currently empty. Enjoy the productivity!</p>
          </div>
        )}
      </div>
    </div>
  );
}