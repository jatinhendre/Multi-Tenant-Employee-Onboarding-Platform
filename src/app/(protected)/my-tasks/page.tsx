"use client";

import { useSession } from "../../../../components/provider/SessionProvider";
import { useEffect, useState, useCallback } from "react";

interface TaskPayload {
  _id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: string;
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
      const data = await res.json();
      const filtered = (data.tasks || []).filter((t: TaskPayload) => t.assignedTo === user.email);
      setTasks(filtered);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [company?.dbName, user?.email]);

  useEffect(() => {
    loadMyTasks();
  }, [loadMyTasks]);

  async function updateStatus(id: string, status: string) {
    setTasks(prev => prev.map(t => t._id === id ? { ...t, status: status as string } : t));
    await fetch("/api/tasks/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, companyDb: company?.dbName }),
    });
    loadMyTasks();
  }

  if (loading) return <div className="p-8 animate-pulse text-slate-400">Syncing tasks...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Personal Tasks</h1>
          <p className="text-slate-500 mt-1">Focus on your individual goals and updates</p>
        </div>
        <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-indigo-200 text-white font-bold">
           {tasks.length}
        </div>
      </div>

      <div className="grid gap-6">
        {tasks.map((t) => (
          <div key={t._id} className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-3">
                <span className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${t.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
                  {t.status}
                </span>
                <h2 className="text-2xl font-bold text-slate-900">{t.title}</h2>
                <p className="text-slate-600 leading-relaxed max-w-xl">{t.description}</p>
                {t.dueDate && <p className="text-xs font-bold text-slate-400 uppercase tracking-tight italic">Deadline: {new Date(t.dueDate).toLocaleDateString()}</p>}
              </div>

              <div className="flex flex-col gap-3 min-w-[180px]">
                {t.status !== "IN_PROGRESS" && t.status !== "COMPLETED" && (
                  <button onClick={() => updateStatus(t._id, "IN_PROGRESS")} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all text-sm shadow-md">
                    Start Working
                  </button>
                )}
                {t.status !== "COMPLETED" && (
                  <button onClick={() => updateStatus(t._id, "COMPLETED")} className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition-all text-sm shadow-md shadow-emerald-100">
                    Mark Finished
                  </button>
                )}
                {t.status === "COMPLETED" && (
                  <div className="text-center p-3 border-2 border-dashed border-emerald-100 rounded-xl text-emerald-600 font-bold text-sm">
                    Well Done! 🏆
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold text-lg">Hooray! No pending tasks.</p>
          </div>
        )}
      </div>
    </div>
  );
}