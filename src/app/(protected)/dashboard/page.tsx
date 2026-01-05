"use client";

import { useSession } from "../../../../components/provider/SessionProvider";

export default function DashboardHome() {
  const { user, company } = useSession();

  if (!user) return null; // Or a loading spinner

  return (
    <main className="p-6">
      {user.role === "COMPANY_ADMIN" && (
        <>
          <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
          <div className="mt-2 border rounded-xl p-6 bg-white shadow-lg space-y-3">
            <p><strong className="font-semibold">Logged in as:</strong> {user.email}</p>
            {company && (
              <div className="space-y-2 text-gray-700">
                <p><strong>Company:</strong> {company.name}</p>
                <p><strong>DB Name:</strong> {company.dbName}</p>
                <p><strong>Status:</strong> {company.status}</p>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}