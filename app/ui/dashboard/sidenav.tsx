import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { LogOut } from "lucide-react";
import { signOut } from "@/app/lib/signOut";
import { lusitana } from "@/app/ui/fonts";
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function SideNav() {
  return (
    <>
      <SidebarHeader className="flex">
        <Link href="/dashboard">
          <div className="flex items-center gap-2 rounded-md bg-blue-600 px-1 py-2">
            <GlobeAltIcon className="h-6 w-6 shrink-0 rotate-15 text-white" />
            <span
              className={`${lusitana.className} text-lg text-white group-data-[collapsible=icon]:hidden`}
            >
              Acme
            </span>
          </div>
        </Link>
        <SidebarTrigger className="cursor-pointer" />
      </SidebarHeader>
      <SidebarContent>
        <NavLinks />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <form action={signOut}>
              <SidebarMenuButton asChild className="cursor-pointer bg-gray-200">
                <button type="submit" className="w-full">
                  <LogOut className="size-4" />
                  <span>Sign Out</span>
                </button>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </>
  );
}
