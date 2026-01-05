export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="max-w-3xl text-center">
        <span className="px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-full">v1.0 is live</span>
        <h1 className="mt-6 text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
          Employee SaaS <span className="text-indigo-600">Platform</span>
        </h1>
        <p className="mt-6 text-lg text-slate-600 leading-relaxed">
          A high-performance multi-tenant onboarding & task management solution. 
          Built with secure isolated company databases and SuperAdmin governance.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a href="/register" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">
            Register Company
          </a>
          <a href="/login" className="px-8 py-3 bg-white text-slate-700 font-bold border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
            Admin/Staff Login
          </a>
        </div>
      </div>
    </main>
  );
}