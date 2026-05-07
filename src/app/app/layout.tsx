import { Sidebar } from "@/components/app/Sidebar";
import { AuthGate } from "@/components/AuthGate";

export const metadata = {
  title: "Poolix — App",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate>
      <div className="grid min-h-screen grid-cols-[18rem_minmax(0,1fr)] bg-cream">
        <Sidebar />
        <main className="flex min-h-screen flex-col">{children}</main>
      </div>
    </AuthGate>
  );
}
