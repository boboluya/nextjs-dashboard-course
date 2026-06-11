"use client";

import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import { deleteRole } from "../_lib/actions";
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

export function CreateRoleButton() {
  return (
    <Link
      href="/sys_role/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Role</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function EditRoleButton({ id }: { id: number }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={`/sys_role/${id}/edit`}
          className="rounded-md border p-2 hover:bg-gray-100"
        >
          <PencilIcon className="w-5" />
        </Link>
      </TooltipTrigger>
      <TooltipContent>Edit</TooltipContent>
    </Tooltip>
  );
}

export function DeleteRoleButton({ id }: { id: number }) {
  const [open, setOpen] = useState(false);
  const handleDelete = deleteRole.bind(null, id);

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
            Are you sure you want to delete this role? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <form action={handleDelete}>
            <Button variant="outline" type="submit" className="border-red-500 text-red-500">
              Delete
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
