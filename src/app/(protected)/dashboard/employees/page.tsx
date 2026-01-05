"use client";

import { useState } from "react";
import { useSession } from "../../../../../components/provider/SessionProvider";

export default function EmployeesPage() {
  const { company } = useSession(); // Access company data directly from context
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!company?.dbName) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await fetch("/api/employees/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        name: formData.get("name"),
        email: formData.get("email"),
        position: formData.get("position"),
        companyDb: company.dbName // Passed from context
      }),
    });

    if (res.ok) {
      setMessage("Employee added 🎉");
      form.reset();
    }
  }

  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">Employees for {company?.name}</h1>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
        <input name="name" placeholder="Name" className="w-full border p-2" required />
        <input name="email" type="email" placeholder="Email" className="w-full border p-2" required />
        <input name="position" placeholder="Position" className="w-full border p-2" required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Employee</button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </main>
  );
}