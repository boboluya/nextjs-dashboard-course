"use client";

import { createContext, ReactNode, useContext, useMemo } from "react";

type PermissionContextValue = {
  roles: string[];
  permissions: string[];
  hasPermission: (permission: string) => boolean;
};

const PermissionContext = createContext<PermissionContextValue | null>(null);

export function PermissionProvider({
  roles,
  permissions,
  children,
}: {
  roles: string[];
  permissions: string[];
  children: ReactNode;
}) {
  const value = useMemo<PermissionContextValue>(() => {
    return {
      roles,
      permissions,
      hasPermission: (permission: string) => {
        if (roles.includes("admin")) return true;
        return permissions.includes(permission);
      },
    };
  }, [permissions, roles]);

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermission() {
  const context = useContext(PermissionContext);

  if (!context) {
    throw new Error("usePermission must be used within a PermissionProvider.");
  }

  return context;
}
