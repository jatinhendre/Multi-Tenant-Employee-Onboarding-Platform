import { connectDB } from "../../../lib/db";

export default async function DashboardHome() {
  await connectDB();
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
    </main>
  );
}
