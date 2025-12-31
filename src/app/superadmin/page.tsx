import { connectDB } from "../../../lib/db";
import { PendingCompany } from "../../../models/PendingCompany";

interface PendingCompanyType {
  _id: string;
  companyName: string;
  adminEmail: string;
  status: string;
}

export default async function SuperAdminPage() {
  await connectDB();

  const companies = await PendingCompany.find({ status: "PENDING" }).lean<PendingCompanyType[]>();

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">
        Pending Company Approvals
      </h1>

      <div className="space-y-3">
        {companies.map((c) => (
          <div
            key={c._id}
            className="border p-4 rounded bg-black shadow"
          >
            <p>
              <strong>Company:</strong> {c.companyName}
            </p>
            <p>
              <strong>Admin Email:</strong> {c.adminEmail}
            </p>

            <form action={`/api/companies/approve`} method="POST">
              <input type="hidden" name="id" value={c._id.toString()} />
              <button className="mt-2 bg-green-600 text-white px-4 py-1 rounded">
                Approve
              </button>
            </form>
          </div>
        ))}
      </div>
    </main>
  );
}
