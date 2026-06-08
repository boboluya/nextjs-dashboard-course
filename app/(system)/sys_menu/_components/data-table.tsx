"use client";

import { SysMenu } from "@/app/lib/definitions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditMenuButton, DeleteMenuButton } from "./action-buttons";
import { Tag, StatusTag } from "@/components/custome_ui/tag";
import {
  FolderIcon,
  DocumentIcon,
  CursorArrowRaysIcon,
  CommandLineIcon,
} from "@heroicons/react/24/outline";

const typeMap: Record<string, { label: string; color: "blue" | "green" | "orange" | "gray"; icon: typeof FolderIcon }> = {
  D: { label: "Directory", color: "blue", icon: FolderIcon },
  M: { label: "Menu", color: "green", icon: DocumentIcon },
  B: { label: "Button", color: "orange", icon: CursorArrowRaysIcon },
  F: { label: "File", color: "gray", icon: CommandLineIcon },
};

export function DataTable({ data }: { data: SysMenu[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
        <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No menus</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new menu.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="rounded-lg border border-gray-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100 bg-gray-50/80 hover:bg-gray-50/80">
                <TableHead className="pl-6 font-semibold text-gray-700">
                  Name
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Label
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Type
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Path
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Permission
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Sorting
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Status
                </TableHead>
                <TableHead className="pr-6 text-right font-semibold text-gray-700">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => {
                const typeInfo = typeMap[row.type || "M"] || typeMap["M"];
                const TypeIcon = typeInfo.icon;
                return (
                  <TableRow
                    key={row.id}
                    className="border-b border-gray-50 transition-colors hover:bg-gray-50/50"
                  >
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
                          <TypeIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {row.name}
                          </p>
                          <p className="text-xs text-gray-500">ID: {row.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {row.label}
                    </TableCell>
                    <TableCell>
                      <Tag text={typeInfo.label} color={typeInfo.color} />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600 font-mono">
                        {row.path || "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600 font-mono">
                        {row.perms || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {row.sorting}
                    </TableCell>
                    <TableCell>
                      <StatusTag
                        text={row.status === 0 ? "Active" : "Disabled"}
                        color={row.status === 0 ? "green" : "red"}
                      />
                    </TableCell>
                    <TableCell className="pr-6">
                      <div className="flex justify-end gap-2">
                        <EditMenuButton id={row.id!} />
                        <DeleteMenuButton id={row.id!} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        <div className="space-y-3">
          {data.map((row) => {
            const typeInfo = typeMap[row.type || "M"] || typeMap["M"];
            const TypeIcon = typeInfo.icon;
            return (
              <div
                key={row.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{row.name}</p>
                      <p className="text-sm text-gray-500">{row.label}</p>
                    </div>
                  </div>
                  <Tag text={typeInfo.label} color={typeInfo.color} />
                </div>

                <div className="mt-4 space-y-2 border-t border-gray-100 pt-3">
                  {row.path && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-medium">Path:</span>
                      <span className="font-mono">{row.path}</span>
                    </div>
                  )}
                  {row.perms && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-medium">Perms:</span>
                      <span className="font-mono">{row.perms}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <StatusTag
                      text={row.status === 0 ? "Active" : "Disabled"}
                      color={row.status === 0 ? "green" : "red"}
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-3">
                  <EditMenuButton id={row.id!} />
                  <DeleteMenuButton id={row.id!} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
