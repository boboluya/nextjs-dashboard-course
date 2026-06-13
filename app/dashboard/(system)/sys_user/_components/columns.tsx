"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SysUser } from "@/app/lib/definitions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<SysUser>[] = [
  {
    accessorKey: "userId",
    header: "Id",
  },
  {
    accessorKey: "userName",
    header: "Account",
  },
  {
    accessorKey: "nickName",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "sex",
    header: "sex",
    cell: ({ row }) => {
      const sex = row.getValue("sex");
      let sex_lable = "";
      if (sex == "1") sex_lable = "Male";
      else if (sex == "2") sex_lable = "Female";
      else sex_lable = "other";
      return sex_lable;
    },
  },
  {
    id: "actions",
    header: "actions",
  },
];
