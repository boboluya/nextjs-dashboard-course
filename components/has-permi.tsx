"use client";

import { ReactNode } from "react";

export function HasPermi({
  session,
  permission,
  children,
}: {
  session: any;
  permission: string;
  children: ReactNode;
  }) {
  if (session?.user?.roles?.includes("admin")) return <>{children}</>;
  if (!session?.user?.permissions?.includes(permission)) return null;
  return <>{children}</>;
}
