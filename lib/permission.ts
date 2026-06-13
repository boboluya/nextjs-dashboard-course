import { auth } from "@/auth";
import { redirect } from "next/navigation";

export class NoPermissionError extends Error {
  constructor(message = "No permission") {
    super(message);
    this.name = "NoPermissionError";
  }
}

/**
 * Check if the current user has a specific permission.
 * Redirects to "/" if not authenticated or lacking the permission.
 *
 * Usage in server component:
 *   import { hasPermission } from "@/lib/permission";
 *   await hasPermission("system:system_role:list");
 */
export async function hasPermission(permission: string): Promise<void> {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // admin role bypasses all permission checks
  const roles = (session.user as any).roles as string[] ?? [];
  if (roles.includes("admin")) return;

  const permissions = (session.user as any).permissions as string[] ?? [];
  if (!permissions.includes(permission)) {
    redirect("/dashboard/403");
  }
}

/**
 * Check permission in Server Actions.
 * Throws NoPermissionError if not authenticated or lacking the permission.
 *
 * Usage in server action:
 *   import { hasApiPermission } from "@/lib/permission";
 *   await hasApiPermission("system:system_role:add");
 */
export async function hasApiPermission(permission: string): Promise<void> {
  const session = await auth();

  if (!session?.user) {
    throw new NoPermissionError("Not authenticated");
  }

  // admin role bypasses all permission checks
  const roles = (session.user as any).roles as string[] ?? [];
  if (roles.includes("admin")) return;

  const permissions = (session.user as any).permissions as string[] ?? [];
  if (!permissions.includes(permission)) {
    throw new NoPermissionError(`Missing permission: ${permission}`);
  }
}
