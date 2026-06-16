"use client";

import SideNav from "@/app/ui/dashboard/sidenav";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="bg-gray-50">
        <SideNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex-1 px-6 py-3">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
