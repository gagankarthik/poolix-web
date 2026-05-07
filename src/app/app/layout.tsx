import { Sidebar } from "@/components/app/Sidebar";
import { AuthGate } from "@/components/AuthGate";
import { MapsProvider } from "@/components/maps/MapsProvider";

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
      <MapsProvider>
        <div className="flex min-h-screen flex-col bg-cream lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
          <Sidebar />
          <main className="flex min-h-screen flex-col">{children}</main>
        </div>
      </MapsProvider>
    </AuthGate>
  );
}
