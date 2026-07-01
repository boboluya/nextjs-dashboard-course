"use client";

import SideNav from "@/app/ui/dashboard/sidenav";
import { PermissionProvider } from "@/components/permission-provider";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";

export function DashboardShell({
  roles,
  permissions,
  children,
}: {
  roles: string[];
  permissions: string[];
  children: React.ReactNode;
}) {
  return (
    <PermissionProvider roles={roles} permissions={permissions}>
      <SidebarProvider>
        <Sidebar collapsible="icon" className="bg-gray-50">
          <SideNav />
        </Sidebar>
        <SidebarInset>
          <div className="flex-1 px-6 py-3">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </PermissionProvider>
  );
}
