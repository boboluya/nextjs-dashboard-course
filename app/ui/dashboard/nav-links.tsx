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
import { useState, useEffect } from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import type { SysMenuTree } from "@/app/lib/definitions";
import { fetchAllMenusTree } from "@/app/dashboard/(system)/sys_menu/_lib/actions";
import * as LucideIcons from 'lucide-react';
const getIconComponent = (iconName: string) => {
  if (!iconName) return null;

  // Convert kebab-case to PascalCase (e.g., "arrow-left" -> "ArrowLeft")
  const pascalCase = iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  // Lucide exports components exactly as PascalCase (no "Icon" suffix)
  const IconComponent = (LucideIcons as any)[pascalCase];

  return IconComponent || null;
};

/**
 * Strip Next.js route groups from path.
 * e.g., "(system)/sys_menu/page" -> "/dashboard/sys_menu"
 *       "(auth)/login/page" -> "/dashboard/login"
 */
function cleanMenuPath(path: string | null | undefined): string {
  if (!path) return "/dashboard";
  // Remove route groups like (system), (auth), etc.
  const cleaned = path.replace(/\([^)]+\)\//g, "");
  // Ensure it starts with /dashboard
  const withDashboard = cleaned.startsWith("/dashboard") ? cleaned : `/dashboard/${cleaned}`;
  // Remove trailing /page if present
  return withDashboard.replace(/\/page$/, "");
}

const systemLinks = [
  { name: "Users", href: "/dashboard/sys_user", icon: UserCog },
  { name: "Menus", href: "/dashboard/sys_menu", icon: Folder },
  { name: "Roles", href: "/dashboard/sys_role", icon: ShieldCheck },
];
const links = [{ name: "Home", href: "/dashboard", icon: Home }];
type NavLink = (typeof links)[number];
// type NavLink2 = (typeof systemLinks)[number];

async function buildLinks(): Promise<SysMenuTree[]> {
  const SysMenuTree = await fetchAllMenusTree();
  const dashbaordLinkGroup: SysMenuTree = {
    id: 0,
    name: "Dashboard",
    label: "Dashboard",
    icon: "Home",
    children: [
      {
        id: -1,
        name: "Home",
        path: "/dashboard",
        label: "Home",
        sorting: 0,
        icon: "Home",
      },
    ],
  };
  const a = [dashbaordLinkGroup, ...SysMenuTree];
  console.log("a", a);
  return a;
}

function NavGroup({
  label,
  links,
  pathname,
}: {
  label: string;
  links: SysMenuTree[] | undefined;
  pathname: string;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {links?.map((link) => {
          const href = cleanMenuPath(link.path);
          return (
            <SidebarMenuItem key={link.name}>
              <SidebarMenuButton asChild isActive={pathname === href}>
                <Link href={href}>
                {(() => {
                    const IconComponent = getIconComponent(link.icon??"");
                    return IconComponent ? <IconComponent className="size-4 mr-2" /> : null;
                  })()}
                <span>{link.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export default function NavLinks() {
  const pathname = usePathname();
  const [groups, setGroups] = useState<SysMenuTree[]>([]);

  useEffect(() => {
    buildLinks().then(setGroups);
  }, []);

  return (
    <>
      {groups.map((group) => (
        <NavGroup
          key={group.label}
          label={group.label ?? ""}
          links={group.children}
          pathname={pathname}
        />
      ))}
      {/*<NavGroup label="System" links={systemLinks} pathname={pathname} />*/}
    </>
  );
}
