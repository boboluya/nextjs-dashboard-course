"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SysMenuTree } from "@/app/lib/definitions";
import { EditMenuButton, DeleteMenuButton } from "./action-buttons";
import { Tag, StatusTag } from "@/components/custome_ui/tag";
import {
  FolderIcon,
  DocumentIcon,
  CursorArrowRaysIcon,
  CommandLineIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

// ---- helpers ----

const typeMap: Record<
  string,
  {
    label: string;
    color: "blue" | "green" | "orange" | "gray";
    icon: typeof FolderIcon;
  }
> = {
  D: { label: "Directory", color: "blue", icon: FolderIcon },
  M: { label: "Menu", color: "green", icon: DocumentIcon },
  B: { label: "Button", color: "orange", icon: CursorArrowRaysIcon },
  F: { label: "File", color: "gray", icon: CommandLineIcon },
};

// ---- columns factory ----
export const getColumns: ColumnDef<SysMenuTree>[] = [
  {
    id: "name",
    header: () => (
      <span className="pl-6 font-semibold text-gray-700">Name</span>
    ),
    accessorKey: "name",
    cell: ({ row }) => {
      const hasChildren = row.getCanExpand();
      const isExpanded = row.getIsExpanded();
      const typeInfo = typeMap[row.original.type || "M"] || typeMap["M"];
      const TypeIcon = typeInfo.icon;

      return (
        <div
          className="flex items-center gap-3"
          style={{ paddingLeft: `${row.depth * 24 + 6}px` }}
        >
          {/* Expand / collapse toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={row.getToggleExpandedHandler}
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded transition-colors hover:bg-gray-200 ${
              hasChildren ? "cursor-pointer" : "invisible"
            }`}
          >
            <ChevronRightIcon
              className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          </Button>

          {/* Icon + name */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
            <TypeIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-gray-900">
              {row.original.name}
            </p>
            <p className="text-xs text-gray-500">ID: {row.original.id}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "label",
    header: () => <span className="font-semibold text-gray-700">Label</span>,
    cell: ({ row }) => (
      <span className="text-gray-600">{row.original.label}</span>
    ),
  },
  {
    accessorKey: "type",
    header: () => <span className="font-semibold text-gray-700">Type</span>,
    cell: ({ row }) => {
      const typeInfo = typeMap[row.original.type || "M"] || typeMap["M"];
      return <Tag text={typeInfo.label} color={typeInfo.color} />;
    },
  },
  {
    accessorKey: "path",
    header: () => <span className="font-semibold text-gray-700">Path</span>,
    cell: ({ row }) => (
      <span className="font-mono text-sm text-gray-600">
        {row.original.path || "—"}
      </span>
    ),
  },
  {
    accessorKey: "perms",
    header: () => (
      <span className="font-semibold text-gray-700">Permission</span>
    ),
    cell: ({ row }) => (
      <span className="font-mono text-sm text-gray-600">
        {row.original.perms || "—"}
      </span>
    ),
  },
  {
    accessorKey: "sorting",
    header: () => <span className="font-semibold text-gray-700">Sorting</span>,
    cell: ({ row }) => (
      <span className="text-gray-600">{row.original.sorting}</span>
    ),
  },
  {
    accessorKey: "status",
    header: () => <span className="font-semibold text-gray-700">Status</span>,
    cell: ({ row }) => (
      <StatusTag
        text={row.original.status === 0 ? "Active" : "Disabled"}
        color={row.original.status === 0 ? "green" : "red"}
      />
    ),
  },
  {
    id: "actions",
    header: () => (
      <span className="pr-6 text-right font-semibold text-gray-700">
        Actions
      </span>
    ),
    cell: ({ row }) => (
      <div className="flex justify-end gap-2 pr-6">
        <EditMenuButton id={row.original.id!} />
        <DeleteMenuButton id={row.original.id!} />
      </div>
    ),
  },
];
