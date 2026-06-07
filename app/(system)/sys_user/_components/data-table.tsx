"use client";

import { SysUser } from "@/app/lib/definitions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditUserButton, DeleteUserButton } from "./action-buttons";
import { ResetPasswordButton } from "./reset-password-button";
import { Tag, StatusTag } from "@/components/custome_ui/tag";
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

export function DataTable({ data }: { data: SysUser[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
        <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No users</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new user.
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
                  User
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Account
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Email
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Phone
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Gender
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
                  key={row.userId}
                  className="border-b border-gray-50 transition-colors hover:bg-gray-50/50"
                >
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
                        {row.nickName?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {row.nickName}
                        </p>
                        <p className="text-xs text-gray-500">ID: {row.userId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {row.userName}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{row.email || "—"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <PhoneIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{row.phoneNumber || "—"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {row.sex === "1" ? (
                      <Tag text="Male" color="blue" />
                    ) : row.sex === "2" ? (
                      <Tag text="Female" color="pink" />
                    ) : (
                      <Tag text="Other" color="gray" />
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusTag
                      text={row.status === "0" ? "Active" : "Disabled"}
                      color={row.status === "0" ? "green" : "red"}
                    />
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex justify-end gap-2">
                      <EditUserButton id={row.userId!} />
                      <ResetPasswordButton userId={row.userId!} />
                      <DeleteUserButton id={row.userId!} />
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
              key={row.userId}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
                    {row.nickName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{row.nickName}</p>
                    <p className="text-sm text-gray-500">@{row.userName}</p>
                  </div>
                </div>
                {row.sex === "1" ? (
                  <Tag text="Male" color="blue" />
                ) : row.sex === "2" ? (
                  <Tag text="Female" color="pink" />
                ) : (
                  <Tag text="Other" color="gray" />
                )}
              </div>

              <div className="mt-4 space-y-2 border-t border-gray-100 pt-3">
                {row.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                    {row.email}
                  </div>
                )}
                {row.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <PhoneIcon className="h-4 w-4 text-gray-400" />
                    {row.phoneNumber}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <StatusTag
                    text={row.status === "0" ? "Active" : "Disabled"}
                    color={row.status === "0" ? "green" : "red"}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-3">
                <EditUserButton id={row.userId!} />
                <ResetPasswordButton userId={row.userId!} />
                <DeleteUserButton id={row.userId!} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
