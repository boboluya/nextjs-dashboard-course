"use client";

import SideNav from "@/app/ui/dashboard/sidenav";
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="bg-gray-50">
        <SideNav />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center bg-white px-4">
          <SidebarTrigger />
        </header>
        <div className="flex-1 px-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
