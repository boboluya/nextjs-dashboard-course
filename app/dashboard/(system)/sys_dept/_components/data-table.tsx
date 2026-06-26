"use client";

import { SysDept } from "@/app/lib/definitions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditDeptButton, DeleteDeptButton } from "./action-buttons";
import { StatusTag } from "@/components/custome_ui/tag";
import {
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { HasPermi } from "@/components/has-permi";

export function DataTable({
  session,
  data,
}: {
  session: any;
  data: SysDept[];
}) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
        <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          No departments
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new department.
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
                  Department
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Leader
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Phone
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Email
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Order
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
                        {row.deptName?.charAt(0)?.toUpperCase() || "D"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {row.deptName}
                        </p>
                        <p className="text-xs text-gray-500">ID: {row.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <UserIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{row.leader || "—"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <PhoneIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{row.phone || "—"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{row.email || "—"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {row.orderNum}
                  </TableCell>
                  <TableCell>
                    <StatusTag
                      text={row.status === "0" ? "Active" : "Disabled"}
                      color={row.status === "0" ? "green" : "red"}
                    />
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex justify-end gap-2">
                      <HasPermi
                        session={session}
                        permission="system:sys_dept:edit"
                      >
                        <EditDeptButton id={row.id!} />
                      </HasPermi>
                      <HasPermi
                        session={session}
                        permission="system:sys_dept:delete"
                      >
                        <DeleteDeptButton id={row.id!} />
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
                    {row.deptName?.charAt(0)?.toUpperCase() || "D"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {row.deptName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Order: {row.orderNum}
                    </p>
                  </div>
                </div>
                <StatusTag
                  text={row.status === "0" ? "Active" : "Disabled"}
                  color={row.status === "0" ? "green" : "red"}
                />
              </div>

              <div className="mt-4 space-y-2 border-t border-gray-100 pt-3">
                {row.leader && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    {row.leader}
                  </div>
                )}
                {row.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <PhoneIcon className="h-4 w-4 text-gray-400" />
                    {row.phone}
                  </div>
                )}
                {row.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                    {row.email}
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-3">
                <HasPermi session={session} permission="system:sys_dept:edit">
                  <EditDeptButton id={row.id!} />
                </HasPermi>
                <HasPermi
                  session={session}
                  permission="system:sys_dept:delete"
                >
                  <DeleteDeptButton id={row.id!} />
                </HasPermi>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
