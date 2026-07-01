"use client";

import { SysDictType } from "@/app/lib/definitions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  EditDictTypeButton,
  DeleteDictTypeButton,
  ConfigDictItemButton,
} from "./action-buttons";
import { Tag } from "@/components/custome_ui/tag";
import { DocumentTextIcon, TagIcon } from "@heroicons/react/24/outline";
import { HasPermi } from "@/components/has-permi";

export function DataTable({ data }: { data: SysDictType[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          No dictionary types
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new dictionary type.
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
                  ID
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Dict Name
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Dict Type
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
              {data.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-gray-50 transition-colors hover:bg-gray-50/50"
                >
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
                        <DocumentTextIcon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{row.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {row.dictName}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <TagIcon className="h-4 w-4 text-gray-400" />
                      <Tag text={row.dictType || "—"} color="indigo" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Tag text="Active" color="green" />
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex justify-end gap-2">
                      <HasPermi permission="system:sys_dict_item:list">
                        <ConfigDictItemButton id={row.id!} />
                      </HasPermi>
                      <HasPermi permission="system:sys_dict_type:edit">
                        <EditDictTypeButton id={row.id!} />
                      </HasPermi>
                      <HasPermi permission="system:sys_dict_type:delete">
                        <DeleteDictTypeButton id={row.id!} />
                      </HasPermi>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        <div className="space-y-3">
          {data.map((row) => (
            <div
              key={row.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
                    <DocumentTextIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {row.dictName}
                    </p>
                    <p className="text-sm text-gray-500">ID: {row.id}</p>
                  </div>
                </div>
                <Tag text="Active" color="green" />
              </div>

              <div className="mt-4 space-y-2 border-t border-gray-100 pt-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TagIcon className="h-4 w-4 text-gray-400" />
                  <Tag text={row.dictType || "—"} color="indigo" />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-3">
                <HasPermi permission="system:sys_dict_type:edit">
                  <EditDictTypeButton id={row.id!} />
                </HasPermi>
                <HasPermi permission="system:sys_dict_type:delete">
                  <DeleteDictTypeButton id={row.id!} />
                </HasPermi>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
