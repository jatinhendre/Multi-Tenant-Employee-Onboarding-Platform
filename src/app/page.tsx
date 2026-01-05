export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-4xl font-bold mb-4">
        Employee SaaS Platform
      </h1>

      <p className="text-gray-600 max-w-xl mb-6">
        A multi-tenant employee onboarding & task
        management platform with SuperAdmin approvals
        & secure company databases.
      </p>

      <div className="flex gap-4">
        <a
          href="/register"
          className="bg-green-600 text-white px-5 py-2 rounded"
        >
          Register Company
        </a>

        <a
          href="/login"
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          Login
        </a>
      </div>
    </main>
  );
}
