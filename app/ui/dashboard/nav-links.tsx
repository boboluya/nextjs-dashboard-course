import {
  Home,
  FileText,
  Users,
  UserCog,
  Folder,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const links = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Invoices", href: "/dashboard/invoices", icon: FileText },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
];

const systemLinks = [
  { name: "Users", href: "/dashboard/sys_user", icon: UserCog },
  { name: "Menus", href: "/dashboard/sys_menu", icon: Folder },
  { name: "Roles", href: "/dashboard/sys_role", icon: ShieldCheck },
];

type NavLink = (typeof links)[number];

function NavGroup({
  label,
  links,
  pathname,
}: {
  label: string;
  links: NavLink[];
  pathname: string;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {links.map((link) => (
          <SidebarMenuItem key={link.name}>
            <SidebarMenuButton asChild isActive={pathname === link.href}>
              <Link href={link.href}>
                <link.icon className="size-4" />
                <span>{link.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      <NavGroup label="Dashboard" links={links} pathname={pathname} />
      <NavGroup label="System" links={systemLinks} pathname={pathname} />
    </>
  );
}
