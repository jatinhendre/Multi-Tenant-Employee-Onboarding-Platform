"use client";

import { useState } from "react";

export default function LoginPage() {
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setMessage("");

  const form = e.currentTarget;

  const email = (form.elements.namedItem("email") as HTMLInputElement).value;
  const password = (form.elements.namedItem(
    "password"
  ) as HTMLInputElement).value;

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) return setMessage(data.message);

  localStorage.setItem(
    "user",
    JSON.stringify({
      email: email,
      role: data.role,
      company:data.company || null,
    })
  );

  if (data.role === "SUPERADMIN") {
  window.location.href = "/superadmin";
} else if (data.role === "COMPANY_ADMIN") {
  window.location.href = "/dashboard";
} else if (data.role === "EMPLOYEE") {
  window.location.href = "/my-tasks";
}
}


  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="p-6 shadow border rounded w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="email"
            placeholder="Email"
            className="w-full border rounded px-3 py-2"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full border rounded px-3 py-2"
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Login
          </button>
        </form>

        {message && (
          <p className="text-red-600 text-center mt-4">{message}</p>
        )}
      </div>
    </main>
  );
}
