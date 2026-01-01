"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../layout";

export default function EmployeesPage() {
  const [companyDb, setCompanyDb] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    const form = e.currentTarget;

    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const position = (form.elements.namedItem(
      "position"
    ) as HTMLSelectElement).value;

    const res = await fetch("/api/employees/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, position, companyDb }),
    });

    const data = await res.json();

    if (res.ok) setMessage("Employee added");
    else setMessage(data.message);
  }

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) window.location.href = "/login";

    const user = JSON.parse(stored);
    setCompanyDb(user.company?.dbName || "");
  }, []);

  if (!companyDb) return null;

  return (
      <main>
      <h1 className="text-2xl font-bold mb-4">Employees</h1>

      <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
        <input
          name="name"
          placeholder="Employee Name"
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Employee Email"
          className="w-full border rounded px-3 py-2"
          required
        />

        <select
        name="position"
  className="w-full border rounded px-3 py-2"
  required
>
  <option value="HEAD">HEAD</option>
  <option value="EMPLOYEE">EMPLOYEE</option>
  <option value="COHEAD">COHEAD</option>
  <option value="HR">HR</option>
  <option value="MANAGER">MANAGER</option>
</select>
        

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Employee
        </button>
      </form>

      {message && (
        <p className="mt-4 text-green-600 font-medium">{message}</p>
      )}
    </main>
    
  );
}
