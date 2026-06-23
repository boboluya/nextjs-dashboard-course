"use client";

import { PencilIcon, PlusIcon, TrashIcon,Cog6ToothIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState, useTransition } from "react";
import { deleteDictType } from "../_lib/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export function CreateDictTypeButton() {
  return (
    <Link
      href="/dashboard/sys_dict_type/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Dict Type</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function ConfigDictItemButton({ id }: { id: number }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.set("pageNum", "1");
    params.set("dictTypeId", String(id));
    replace(`/dashboard/sys_dict_item?${params.toString()}`);
  };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="rounded-md border p-2 hover:bg-gray-100 hover:cursor-pointer"
          onClick={handleSearch}
        >
          <Cog6ToothIcon className="w-5" />
        </button>
      </TooltipTrigger>
      <TooltipContent>Options</TooltipContent>
    </Tooltip>
  );
}

export function EditDictTypeButton({ id }: { id: number }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={`/dashboard/sys_dict_type/${id}/edit`}
          className="rounded-md border p-2 hover:bg-gray-100"
        >
          <PencilIcon className="w-5" />
        </Link>
      </TooltipTrigger>
      <TooltipContent>Edit</TooltipContent>
    </Tooltip>
  );
}

export function DeleteDictTypeButton({ id }: { id: number }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteDictType(id);
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="rounded-md border p-2 hover:bg-gray-100"
            onClick={() => setOpen(true)}
          >
            <span className="sr-only">Delete</span>
            <TrashIcon className="w-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent>Delete</TooltipContent>
      </Tooltip>
      <DialogContent showCloseButton={false} className="bg-white p-6">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this dictionary type? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="outline"
            className="border-red-500 text-red-500"
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
