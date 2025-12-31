"use client";

import { useEffect, useState } from "react";

export default function DashboardHome() {
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (!stored) {
      window.location.href = "/login";
      return;
    }

    const user = JSON.parse(stored);

    setRole(user.role);
    setEmail(user.email);
    setCompany(user.company || null);
  }, []);

  if (!role) return null;

  return (
    <main className="p-6">
      {role === "COMPANY_ADMIN" && (
        <>
          <h1 className="text-3xl font-bold mb-2">
            Company Admin Dashboard
          </h1>

          <div className="mt-4 border rounded p-4 bg-white shadow">
            <p>
              <strong>Logged in as:</strong> {email}
            </p>

            {company && (
              <>
                <p>
                  <strong>Company:</strong> {company.name}
                </p>
                <p>
                  <strong>DB Name:</strong> {company.dbName}
                </p>
                <p>
                  <strong>Status:</strong> {company.status}
                </p>
              </>
            )}
          </div>
        </>
      )}

      {role === "SUPERADMIN" && (
        <>
          <h1 className="text-3xl font-bold mb-2">
            Welcome SuperAdmin
          </h1>
          <p className="text-gray-700">Go to /superadmin</p>
        </>
      )}
    </main>
  );
}
