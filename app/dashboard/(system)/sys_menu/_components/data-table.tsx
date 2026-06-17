"use client";
"use no memo";
import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
  ExpandedState,
} from "@tanstack/react-table";
import { SysMenuTree } from "@/app/lib/definitions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getColumns } from "./column-defs";
import { FolderIcon } from "@heroicons/react/24/outline";

// ---- component ----

export function DataTable({ data }: { data: SysMenuTree[] }) {
  // Initialize expanded with all root-level IDs
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const table = useReactTable({
    data: data,
    columns: getColumns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.children,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  // Empty state
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
      <div className="rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-gray-100 bg-gray-50/80 hover:bg-gray-50/80"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="border-b border-gray-50 transition-colors hover:bg-gray-50/50"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
