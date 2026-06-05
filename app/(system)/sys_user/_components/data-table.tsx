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

export function DataTable({ data }: { data: SysUser[] }) {
  return (
    <div className="flow-root">
      <div className="w-full align-middle">
        <div className="rounded-lg bg-gray-100 p-6">
          <div className="m-3 bg-white rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-b-0 bg-gray-100">
                  {/*<TableHead>Id</TableHead>*/}
                  <TableHead>Name</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Sex</TableHead>
                  <TableHead className="flex justify-end">
                    <span className="">Action</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, index) => {
                  return (
                    <TableRow
                      className="broder-1 border-gray-400 border-b-2 last:border-0"
                      key={row.userId}
                    >
                      {/*<TableCell>{row.userId}</TableCell>*/}
                      <TableCell>{row.nickName}</TableCell>
                      <TableCell>{row.userName}</TableCell>
                      <TableCell>{row.sex}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
