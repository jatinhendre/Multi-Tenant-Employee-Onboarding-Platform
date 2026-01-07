import BrandLogo from "../../components/logo";


export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="max-w-3xl text-center">
        <BrandLogo size={80} className="mx-auto mb-6 shadow-xl border-4 border-white" />
        <span className="px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-full italic font-mono">system_ready_v1.0</span>
        <h1 className="mt-6 text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">
          Syn<span className="text-indigo-600">Task</span>
        </h1>
        <p className="mt-6 text-lg text-slate-600 font-medium max-w-xl mx-auto">
          The high-performance platform for multi-tenant enterprise workflows. 
          Isolate data, automate tasks, and scale faster.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a href="/register" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
            Register Your Company
          </a>
          <a href="/login" className="px-8 py-3 bg-white text-slate-700 font-bold border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
             Login 
          </a>
        </div>
      </div>
    </main>
  );
}