import BrandLogo from "../../../components/logo";
import { connectDB } from "../../../lib/db";
import { PendingCompany } from "../../../models/PendingCompany";
import ApproveButton from "./ApproveButton";

interface PendingCompanyType {
  _id: string;
  companyName: string;
  adminEmail: string;
  status: string;
  createdAt?: Date;
}

export default async function SuperAdminPage() {
  await connectDB();

  // Data fetching logic
  const pendingCompanies = await PendingCompany.find({ status: "PENDING" }).sort({ createdAt: -1 }).lean<PendingCompanyType[]>();
  const activeCompanies = await PendingCompany.find({ status: "APPROVED" }).sort({ createdAt: -1 }).lean<PendingCompanyType[]>();

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12 text-slate-900">
      {/* Branding Header Section */}
      <header className="max-w-6xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Integrated the reusable BrandLogo component */}
            <BrandLogo size={56} className="shadow-md border-2 border-white" />
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                SynTask <span className="text-indigo-600">HQ</span>
              </h1>
              <p className="text-slate-500 mt-1 font-medium">Global Network Management</p>
            </div>
          </div>

          {/* Statistics Bar */}
          <div className="flex gap-4">
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Requests</p>
              <p className="text-xl font-black text-amber-500">{pendingCompanies.length}</p>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Instances</p>
              <p className="text-xl font-black text-emerald-500">{activeCompanies.length}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-12">
        {/* Pending Requests Section */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse"></span>
            Awaiting Approval
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingCompanies.map((c) => (
              <div key={c._id.toString()} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-slate-900 mb-1">{c.companyName}</h3>
                <p className="text-sm text-slate-500 mb-6 font-medium">{c.adminEmail}</p>
                
                  <ApproveButton id={c._id.toString()} />

              </div>
            ))}
            {pendingCompanies.length === 0 && (
              <div className="col-span-full py-10 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium italic">No pending nodes to synchronize.</p>
              </div>
            )}
          </div>
        </section>

        {/* Active Nodes Section */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
            Active SynTask Nodes
          </h2>
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Tenant Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Primary Admin</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeCompanies.map((c) => (
                  <tr key={c._id.toString()} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{c.companyName}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{c.adminEmail}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-tighter border border-emerald-100">
                        Live
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}