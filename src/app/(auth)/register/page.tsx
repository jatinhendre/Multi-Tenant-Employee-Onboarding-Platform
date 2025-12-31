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

    const companyName = (form.elements.namedItem(
      "companyName"
    ) as HTMLInputElement).value;

    const companySize = Number(
      (form.elements.namedItem("companySize") as HTMLInputElement).value
    );

    const adminEmail = (form.elements.namedItem(
      "adminEmail"
    ) as HTMLInputElement).value;

    const adminPassword = (form.elements.namedItem(
      "adminPassword"
    ) as HTMLInputElement).value;

    const contactEmail = (form.elements.namedItem(
      "contactEmail"
    ) as HTMLInputElement).value;

    const requirements = [
      (form.elements.namedItem("requirement") as HTMLSelectElement).value,
    ];

    const res = await fetch("/api/companies/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName,
        companySize,
        adminEmail,
        adminPassword,
        contactEmail,
        requirements,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Request submitted! Please wait for approval.");
      form.reset();
    } else {
      setMessage(data.message || "Something went wrong");
    }

    setLoading(false);
  }

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="p-6 rounded-lg shadow-md border w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Register Your Company
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="companyName"
            placeholder="Company Name"
            required
            className="w-full border rounded px-3 py-2"
          />

          <input
            name="companySize"
            type="number"
            placeholder="Company Size"
            required
            className="w-full border rounded px-3 py-2"
          />

          <input
            name="adminEmail"
            type="email"
            placeholder="Admin Email"
            required
            className="w-full border rounded px-3 py-2"
          />

          <input
            name="adminPassword"
            type="password"
            placeholder="Admin Password"
            required
            className="w-full border rounded px-3 py-2"
          />

          <input
            name="contactEmail"
            type="email"
            placeholder="Contact Email"
            required
            className="w-full border rounded px-3 py-2"
          />

          <select
            name="requirement"
            className="w-full border rounded px-3 py-2"
          >
            <option value="TASK_ASSIGNMENT">
              Assign Tasks to Employees
            </option>
          </select>

          <button
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit for Approval"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-blue-600 font-medium">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
