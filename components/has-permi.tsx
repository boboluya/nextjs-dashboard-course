"use client";

import { ReactNode } from "react";
import { usePermission } from "./permission-provider";

export function HasPermi({
  permission,
  children,
}: {
  permission: string;
  children: ReactNode;
}) {
  const { hasPermission } = usePermission();

  if (!hasPermission(permission)) return null;
  return <>{children}</>;
}
