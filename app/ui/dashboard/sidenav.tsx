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
} from "@/components/ui/sidebar";

export default function SideNav() {
  return (
    <>
      <SidebarHeader>
        <Link href="/">
          <div className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2">
            <GlobeAltIcon className="h-6 w-6 rotate-[15deg] text-white" />
            <span
              className={`${lusitana.className} text-lg text-white group-data-[collapsible=icon]:hidden`}
            >
              Acme
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavLinks />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <form action={signOut}>
              <SidebarMenuButton asChild>
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
