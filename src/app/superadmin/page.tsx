import { connectDB } from "../../../lib/db";
import { PendingCompany } from "../../../models/PendingCompany";

interface PendingCompanyType {
  _id: string;
  companyName: string;
  adminEmail: string;
  status: string;
  createdAt?: Date;
}

export default async function SuperAdminPage() {
  await connectDB();

  const pendingCompanies = await PendingCompany.find({ status: "PENDING" }).sort({ createdAt: -1 }).lean<PendingCompanyType[]>();
  const activeCompanies = await PendingCompany.find({ status: "APPROVED" }).sort({ createdAt: -1 }).lean<PendingCompanyType[]>();

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <header className="max-w-6xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">SuperAdmin <span className="text-indigo-600">Console</span></h1>
            <p className="text-slate-500 mt-1 font-medium">System-wide governance and company orchestrations</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Pending</p>
              <p className="text-xl font-black text-amber-500">{pendingCompanies.length}</p>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Active</p>
              <p className="text-xl font-black text-emerald-500">{activeCompanies.length}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-12">
        
        <section>
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
            <h2 className="text-xl font-bold text-slate-800">Pending Requests</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingCompanies.map((c) => (
              <div key={c._id.toString()} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group">
                <div className="mb-4">
                  <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">New Application</p>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{c.companyName}</h3>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span>📧</span> {c.adminEmail}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Requested on {new Date().toLocaleDateString()}</div>
                </div>

                <form action={`/api/companies/approve`} method="POST">
                  <input type="hidden" name="id" value={c._id.toString()} />
                  <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 active:scale-95">
                    Approve Access
                  </button>
                </form>
              </div>
            ))}
            {pendingCompanies.length === 0 && (
              <div className="col-span-full py-12 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium italic">No pending applications at the moment.</p>
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            <h2 className="text-xl font-bold text-slate-800">Verified Partners</h2>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Company Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Admin</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeCompanies.map((c) => (
                  <tr key={c._id.toString()} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{c.companyName}</p>
                      <p className="text-xs text-slate-400 font-mono italic">ID: {c._id.toString().slice(-6)}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                      {c.adminEmail}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black tracking-widest uppercase border border-emerald-100">
                          Verified
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
                {activeCompanies.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-slate-400 italic">
                      No active companies in the registry yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}