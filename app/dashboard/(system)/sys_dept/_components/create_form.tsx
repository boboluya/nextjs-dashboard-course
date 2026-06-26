"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useActionState, useState } from "react";
import { State } from "../_lib/actions";
import { createSysDept } from "../_lib/actions";
import { Button } from "@/components/ui/button";
import {
  BuildingOfficeIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { DeptTreeSelect, TreeNode } from "./dept-tree-select";

const statusDicts = [
  { dictValue: "0", dictLabel: "Active" },
  { dictValue: "1", dictLabel: "Disabled" },
];

export function CreateForm({ treeData }: { treeData: TreeNode[] }) {
  const [statusValue, setStatusValue] = useState("0");
  const [parentId, setParentId] = useState<number | null>(null);
  const initialState: State = { errors: {}, message: null };
  const [state, formAction, isPending] = useActionState(
    createSysDept,
    initialState,
  );

  return (
    <div className="m-6 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Form header */}
      <div className="bg-blue-500 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <BuildingOfficeIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Create Department
            </h2>
            <p className="text-blue-100 text-sm">
              Fill in the form below to create a new department
            </p>
          </div>
        </div>
      </div>

      {/* Form content */}
      <form className="p-6 space-y-6" action={formAction}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Parent Department field */}
          <div className="md:col-span-2 space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <BuildingOfficeIcon className="h-4 w-4 text-gray-500" />
              Parent Department
            </label>
            <DeptTreeSelect
              treeData={treeData}
              value={parentId}
              onValueChange={setParentId}
              placeholder="Select parent (root if empty)"
            />
          </div>

          {/* Department Name field */}
          <div className="space-y-2">
            <label
              htmlFor="deptName-field"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700"
            >
              <BuildingOfficeIcon className="h-4 w-4 text-gray-500" />
              Department Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="deptName-field"
                name="deptName"
                placeholder="Enter department name"
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
              <BuildingOfficeIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
            <div id="deptName-error" aria-live="polite" aria-atomic="true">
              {state.errors?.deptName &&
                state.errors.deptName.map((error: string) => (
                  <p
                    className="mt-1 text-sm text-red-500 flex items-center gap-1"
                    key={error}
                  >
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Order Num field */}
          <div className="space-y-2">
            <label
              htmlFor="orderNum-field"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700"
            >
              Order Num
            </label>
            <div className="relative">
              <Input
                id="orderNum-field"
                name="orderNum"
                type="number"
                defaultValue={0}
                placeholder="Enter order number"
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>
          </div>

          {/* Leader field */}
          <div className="space-y-2">
            <label
              htmlFor="leader-field"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700"
            >
              Leader
            </label>
            <div className="relative">
              <Input
                id="leader-field"
                name="leader"
                placeholder="Enter leader name"
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>
          </div>

          {/* Phone field */}
          <div className="space-y-2">
            <label
              htmlFor="phone-field"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700"
            >
              Phone
            </label>
            <div className="relative">
              <Input
                id="phone-field"
                name="phone"
                placeholder="Enter phone number"
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>
          </div>

          {/* Email field */}
          <div className="space-y-2">
            <label
              htmlFor="email-field"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700"
            >
              Email
            </label>
            <div className="relative">
              <Input
                id="email-field"
                name="email"
                type="email"
                placeholder="Enter email address"
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>
          </div>

          {/* Status field */}
          <div className="space-y-2">
            <label
              htmlFor="status-field"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700"
            >
              <CheckCircleIcon className="h-4 w-4 text-gray-500" />
              Status <span className="text-red-500">*</span>
            </label>
            <Select value={statusValue} onValueChange={setStatusValue}>
              <input type="hidden" name="status" value={statusValue} />
              <SelectTrigger
                id="status-field"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                sideOffset={4}
                className="bg-white shadow-lg border-gray-200"
              >
                <SelectGroup>
                  {statusDicts.map((dict) => (
                    <SelectItem
                      value={dict.dictValue}
                      key={dict.dictValue}
                      className="focus:bg-blue-50 focus:text-blue-700"
                    >
                      {dict.dictLabel}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bottom button area */}
        <div className="pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Fields marked with <span className="text-red-500">*</span> are
              required
            </p>
            <div className="flex gap-3">
              <Button
                asChild
                type="button"
                variant="outline"
                className="px-6 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
              >
                <Link href="/dashboard/sys_dept">Cancel</Link>
              </Button>
              <Button
                type="submit"
                className="px-8 bg-linear-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4" />
                    Create Department
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
