
import { redirect } from "next/navigation";
import { getSessionData } from "../../../lib/session";
import SessionProvider from "../../../components/provider/SessionProvider";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Fetch User & Company Data on the Server
  const { user, company } = await getSessionData();

  // 2. Security Check: If no user, kick them out
  // (Middleware handles this too, but this is a double-check for data integrity)
  if (!user) {
    redirect("/login"); 
  }

  // 3. Wrap everything in the Provider
  // Now BOTH 'dashboard' and 'my-tasks' have access to useSession()
  return (
    <SessionProvider user={user} company={company}>
       {/* You can even put a shared Navbar here if both pages need it */}
      {children}
    </SessionProvider>
  );
}