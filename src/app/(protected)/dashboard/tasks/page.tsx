"use client";

import { useEffect, useState } from "react";

export default function TasksPage() {
  const [companyDb, setCompanyDb] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [message, setMessage] = useState("");

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

    const form = e.currentTarget;

    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const description = (form.elements.namedItem(
      "description"
    ) as HTMLInputElement).value;
    const assignedTo = (form.elements.namedItem(
      "assignedTo"
    ) as HTMLSelectElement).value;

    const dueDate = (form.elements.namedItem(
      "dueDate"
    ) as HTMLInputElement).value;

    const res = await fetch("/api/tasks/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        assignedTo,
        dueDate,
        companyDb,
      }),
    });

    if (res.ok) {
      setMessage("Task created 🎉");
      loadTasks(companyDb);
      form.reset();
    } else {
      const data = await res.json();
      setMessage(data.message);
    }
  }

  async function updateStatus(id: string, status: string) {
    await fetch("/api/tasks/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, companyDb }),
    });

    loadTasks(companyDb);
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

  if (!companyDb) return null;

  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>

      {/* Create Task */}
      <section className="mb-6">
        <h2 className="font-semibold mb-2">Assign New Task</h2>

        <form onSubmit={handleCreate} className="space-y-3 max-w-md">
          <input
            name="title"
            placeholder="Task Title"
            className="w-full border rounded px-3 py-2"
            required
          />

          <input
            name="description"
            placeholder="Task Description"
            className="w-full border rounded px-3 py-2"
          />

          <select
            name="assignedTo"
            className="w-full border rounded px-3 py-2"
            required
          >
            <option>Select Employee</option>
            {employees.filter(e=> e.name!== "Admin").map((e) => (
              <option key={e._id} value={e.email}>
                {e.name} ({e.email})
              </option>
            ))}
          </select>

          <input type="date" name="dueDate" className="w-full border rounded px-3 py-2" />

          <button className="bg-purple-600 text-white px-4 py-2 rounded">
            Create Task
          </button>
        </form>

        {message && <p className="mt-4 text-green-600">{message}</p>}
      </section>

      {/* List Tasks */}
      <section>
        <h2 className="font-semibold mb-2">All Tasks</h2>

        <div className="space-y-3">
          {tasks.map((t) => (
            <div key={t._id} className="border rounded p-3 bg-white shadow">
              <p>
                <strong>{t.title}</strong>
              </p>
              <p className="text-sm text-gray-600">{t.description}</p>
              <p>
                Assigned to: <strong>{t.assignedTo}</strong>
              </p>
              <p>Status: {t.status}</p>

              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => updateStatus(t._id, "IN_PROGRESS")}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  In Progress
                </button>
                <button
                  onClick={() => updateStatus(t._id, "COMPLETED")}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Completed
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
