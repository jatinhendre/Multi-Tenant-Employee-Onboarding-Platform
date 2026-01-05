"use client";

import { useEffect, useState } from "react";


interface TaskPayload {
  _id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: string;
  dueDate: string;
}

interface Employee{
  name: string,
  email:string,
  position: string,
  status:string
}
export default function TasksPage() {
  const [companyDb, setCompanyDb] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tasks, setTasks] = useState<TaskPayload[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadEmployees(db: string) {
    const res = await fetch(`/api/employees/list?db=${db}`);
    const data = await res.json();
    setEmployees(data.employees || []);
  }

  async function loadTasks(db: string) {
    const res = await fetch(`/api/tasks/list?db=${db}`);
    const data = await res.json();
    setTasks(data.tasks || []);
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await fetch("/api/tasks/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
        assignedTo: formData.get("assignedTo"),
        dueDate: formData.get("dueDate"),
        companyDb,
      }),
    });

    if (res.ok) {
      setMessage("Task successfully assigned!");
      loadTasks(companyDb);
      form.reset();
    }
    setLoading(false);
  }

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) window.location.href = "/login";
    const user = JSON.parse(stored);
    const db = user.company?.dbName || "";
    setCompanyDb(db);
    loadEmployees(db);
    loadTasks(db);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Assign New Task</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <input name="title" placeholder="Task Title" className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" required />
            <textarea name="description" placeholder="Short description..." className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none" />
            <select name="assignedTo" className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 bg-white" required>
              <option value="">Choose Employee</option>
              {employees.filter(e => e.name !== "Admin").map((e) => (
                <option key={e._id} value={e.email}>{e.name} ({e.email})</option>
              ))}
            </select>
            <input type="date" name="dueDate" className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" />
            <button disabled={loading} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg">
              {loading ? "Creating..." : "Assign Task"}
            </button>
          </form>
          {message && <p className="mt-4 text-emerald-600 font-bold text-center">{message}</p>}
        </div>
      </div>

      <div className="lg:col-span-7 space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Task Overview</h2>
        <div className="grid gap-4">
          {tasks.map((t) => (
            <div key={t._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-800">{t.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-1 mb-2">{t.description}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400">Assigned To:</span>
                  <span className="text-xs bg-slate-100 px-2 py-0.5 rounded font-medium">{t.assignedTo}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter uppercase ${t.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : t.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                  {t.status}
                </span>
                <p className="text-[10px] text-slate-400 font-bold">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'No deadline'}</p>
              </div>
            </div>
          ))}
          {tasks.length === 0 && <p className="text-center py-20 text-slate-400 font-medium bg-white rounded-3xl border border-dashed">No tasks created yet.</p>}
        </div>
      </div>
    </div>
  );
}