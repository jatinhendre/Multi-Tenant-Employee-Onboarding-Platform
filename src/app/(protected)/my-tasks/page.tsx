"use client";

import { useSession } from "../../../../components/provider/SessionProvider";
import { useEffect, useState, useCallback } from "react";

// FIX: Change _id to string for the client-side interface
interface TaskPayload {
  _id: string; 
  title: string;
  description: string;
  assignedTo: string;
  status: string;
  dueDate: string;
  createdAt: string;
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
      
      const myTasks = (data.tasks || []).filter(
        (t: TaskPayload) => t.assignedTo === user.email
      );
      
      setTasks(myTasks);
    } catch (error) {
      console.error("Failed to load tasks", error);
    } finally {
      setLoading(false);
    }
  }, [company?.dbName, user?.email]);

  useEffect(() => {
    loadMyTasks();
  }, [loadMyTasks]);

  async function updateStatus(id: string, status: string) {
    if (!company?.dbName) return;

    // Optimistic UI update (optional but makes it feel faster)
    setTasks(prev => prev.map(t => t._id === id ? { ...t, status: status as string } : t));

    await fetch("/api/tasks/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, companyDb: company.dbName }),
    });

    loadMyTasks(); 
  }

  const handleLogout = () => {
    // Clear cookies and local storage
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      {/* Header Section */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            My Tasks
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-bold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-white border border-blue-100 p-5 rounded-xl shadow-sm">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Account:</span>
              <span className="font-semibold text-gray-800">{user?.email}</span>
            </div>
            <div className="hidden md:block text-gray-300">|</div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Company:</span>
              <span className="font-semibold text-gray-800">{company?.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tasks Grid/List */}
      <div className="grid gap-4">
        {tasks.map((t) => (
          <div
            key={t._id}
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-200"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {t.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {t.description}
                </p>
                {t.dueDate && (
                  <p className="text-xs text-gray-400 pt-2">
                    Due: {new Date(t.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              <span
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                ${
                  t.status === "COMPLETED"
                    ? "bg-green-100 text-green-700"
                    : t.status === "IN_PROGRESS"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {t.status.replace("_", " ")}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 border-t pt-4 border-gray-50">
              {t.status !== "IN_PROGRESS" && t.status !== "COMPLETED" && (
                <button
                  onClick={() => updateStatus(t._id, "IN_PROGRESS")}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold shadow-sm hover:bg-blue-700 active:transform active:scale-95 transition"
                >
                  Start Task
                </button>
              )}

              {t.status !== "COMPLETED" && (
                <button
                  onClick={() => updateStatus(t._id, "COMPLETED")}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-bold shadow-sm hover:bg-green-700 active:transform active:scale-95 transition"
                >
                  Complete Task
                </button>
              )}
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
            <p className="text-lg font-medium text-gray-500">You are all caught up!</p>
            <p className="text-sm text-gray-400">No tasks currently assigned to you.</p>
          </div>
        )}
      </div>
    </div>
  );
}