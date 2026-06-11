"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { SysRole } from "@/app/lib/definitions";
import { cn } from "@/lib/utils";

interface RoleMultiSelectProps {
  roles: SysRole[];
  selectedRoleIds: number[];
  onChange: (roleIds: number[]) => void;
  error?: string[];
}

export function RoleMultiSelect({
  roles,
  selectedRoleIds,
  onChange,
  error,
}: RoleMultiSelectProps) {
  const [open, setOpen] = useState(false);

  const toggleRole = (roleId: number) => {
    if (selectedRoleIds.includes(roleId)) {
      onChange(selectedRoleIds.filter((id) => id !== roleId));
    } else {
      onChange([...selectedRoleIds, roleId]);
    }
  };

  const selectedNames = roles
    .filter((r) => r.id !== undefined && selectedRoleIds.includes(r.id))
    .map((r) => r.name)
    .join(", ");

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className={selectedNames ? "text-gray-900" : "text-gray-500"}>
              {selectedNames || "Select roles..."}
            </span>
            <ChevronDownIcon className="h-4 w-4 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <div className="max-h-60 overflow-auto p-1">
            {roles.length === 0 ? (
              <p className="px-2 py-1.5 text-sm text-gray-500">No roles available</p>
            ) : (
              roles.map((role) => {
                const isSelected =
                  role.id !== undefined && selectedRoleIds.includes(role.id);
                return (
                  <div
                    key={role.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100",
                      isSelected && "bg-blue-50"
                    )}
                    onClick={() => role.id !== undefined && toggleRole(role.id)}
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-gray-300",
                        isSelected && "border-blue-500 bg-blue-500"
                      )}
                    >
                      {isSelected && (
                        <CheckIcon className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span className="flex-1">{role.name}</span>
                    {role.key && (
                      <span className="text-xs text-gray-400">{role.key}</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
      {/* Hidden inputs for form submission */}
      {selectedRoleIds.map((roleId) => (
        <input key={roleId} type="hidden" name="roleIds" value={roleId} />
      ))}
      {error &&
        error.map((e) => (
          <p className="text-sm text-red-500 flex items-center gap-1" key={e}>
            <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
            {e}
          </p>
        ))}
    </div>
  );
}
