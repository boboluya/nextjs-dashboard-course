import { auth } from "@/auth";
import { DashboardShell } from "./dashboard-shell";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const roles = session?.user?.roles ?? [];
  const permissions = session?.user?.permissions ?? [];

  return (
    <DashboardShell roles={roles} permissions={permissions}>
      {children}
    </DashboardShell>
  );
}
