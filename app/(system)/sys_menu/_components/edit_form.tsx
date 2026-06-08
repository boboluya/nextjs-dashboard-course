"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { useActionState, useState } from "react";
import { EditState, updateSysMenu } from "../_lib/actions";
import { Button } from "@/components/ui/button";
import {
  FolderIcon,
  TagIcon,
  MapIcon,
  KeyIcon,
  QueueListIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { SysMenu } from "@/app/lib/definitions";

const typeDicts = [
  { dictValue: "D", dictLabel: "Directory" },
  { dictValue: "M", dictLabel: "Menu" },
  { dictValue: "B", dictLabel: "Button" },
  { dictValue: "F", dictLabel: "File" },
]

const statusDicts = [
  { dictValue: "0", dictLabel: "Active" },
  { dictValue: "1", dictLabel: "Disabled" },
]

const hidingDicts = [
  { dictValue: "0", dictLabel: "Show" },
  { dictValue: "1", dictLabel: "Hide" },
]

export function EditForm({ menu }: { menu: SysMenu }) {
  const [typeValue, setTypeValue] = useState(menu.type ?? "");
  const [statusValue, setStatusValue] = useState(String(menu.status ?? "0"));
  const [hidingValue, setHidingValue] = useState(String(menu.hiding ?? "0"));
  const initialState: EditState = { errors: {}, message: null }
  const updateSysMenuWithId = updateSysMenu.bind(null, menu.id!)
  const [state, formAction, isPending] = useActionState(updateSysMenuWithId, initialState)
  return (
    <div className="m-6 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-blue-500 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <FolderIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Edit Menu</h2>
            <p className="text-blue-100 text-sm">Update the menu information below</p>
          </div>
        </div>
      </div>
      <form className="p-6 space-y-6" action={formAction}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label htmlFor="name-field" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FolderIcon className="h-4 w-4 text-gray-500" />
              Name
            </label>
            <div className="relative">
              <Input
                id="name-field"
                name="name"
                placeholder="Enter menu name"
                defaultValue={menu.name ?? ""}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
              <FolderIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
            <div id="name-error" aria-live="polite" aria-atomic="true">
              {state.errors?.name &&
                state.errors.name.map((error: string) => (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1" key={error}>
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Label Field */}
          <div className="space-y-2">
            <label htmlFor="label-field" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <TagIcon className="h-4 w-4 text-gray-500" />
              Label
            </label>
            <div className="relative">
              <Input
                id="label-field"
                name="label"
                placeholder="Enter display label"
                defaultValue={menu.label ?? ""}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
              <TagIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
            <div id="label-error" aria-live="polite" aria-atomic="true">
              {state.errors?.label &&
                state.errors.label.map((error: string) => (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1" key={error}>
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Path Field */}
          <div className="space-y-2">
            <label htmlFor="path-field" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <MapIcon className="h-4 w-4 text-gray-500" />
              Path
            </label>
            <div className="relative">
              <Input
                id="path-field"
                name="path"
                placeholder="e.g. /dashboard/users"
                defaultValue={menu.path ?? ""}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
              <MapIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
            <div id="path-error" aria-live="polite" aria-atomic="true">
              {state.errors?.path &&
                state.errors.path.map((error: string) => (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1" key={error}>
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Type Field */}
          <div className="space-y-2">
            <label htmlFor="type-field" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FolderIcon className="h-4 w-4 text-gray-500" />
              Type
            </label>
            <Select value={typeValue} onValueChange={setTypeValue}>
              <input type="hidden" name="type" value={typeValue} />
              <SelectTrigger id="type-field" className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4} className="bg-white shadow-lg border-gray-200">
                <SelectGroup>
                  {typeDicts.map((dict) => {
                    return (<SelectItem value={dict.dictValue} key={dict.dictValue} className="focus:bg-blue-50 focus:text-blue-700">
                      {dict.dictLabel}
                    </SelectItem>)
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div id="type-error" aria-live="polite" aria-atomic="true">
              {state.errors?.type &&
                state.errors.type.map((error: string) => (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1" key={error}>
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Parent ID Field */}
          <div className="space-y-2">
            <label htmlFor="parentId-field" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <QueueListIcon className="h-4 w-4 text-gray-500" />
              Parent ID
            </label>
            <div className="relative">
              <Input
                id="parentId-field"
                name="parentId"
                type="number"
                placeholder="Leave empty for root"
                defaultValue={menu.parentId ?? ""}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
              <QueueListIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Sorting Field */}
          <div className="space-y-2">
            <label htmlFor="sorting-field" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <QueueListIcon className="h-4 w-4 text-gray-500" />
              Sorting
            </label>
            <div className="relative">
              <Input
                id="sorting-field"
                name="sorting"
                type="number"
                defaultValue={menu.sorting ?? 0}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
              <QueueListIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
            <div id="sorting-error" aria-live="polite" aria-atomic="true">
              {state.errors?.sorting &&
                state.errors.sorting.map((error: string) => (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1" key={error}>
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Perms Field */}
          <div className="space-y-2">
            <label htmlFor="perms-field" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <KeyIcon className="h-4 w-4 text-gray-500" />
              Permission
            </label>
            <div className="relative">
              <Input
                id="perms-field"
                name="perms"
                placeholder="e.g. system:user:list"
                defaultValue={menu.perms ?? ""}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
              <KeyIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Status Field */}
          <div className="space-y-2">
            <label htmlFor="status-field" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <CheckCircleIcon className="h-4 w-4 text-gray-500" />
              Status
            </label>
            <Select value={statusValue} onValueChange={setStatusValue}>
              <input type="hidden" name="status" value={statusValue} />
              <SelectTrigger id="status-field" className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4} className="bg-white shadow-lg border-gray-200">
                <SelectGroup>
                  {statusDicts.map((dict) => {
                    return (<SelectItem value={dict.dictValue} key={dict.dictValue} className="focus:bg-blue-50 focus:text-blue-700">
                      {dict.dictLabel}
                    </SelectItem>)
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Hiding Field */}
          <div className="space-y-2">
            <label htmlFor="hiding-field" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <EyeSlashIcon className="h-4 w-4 text-gray-500" />
              Hiding
            </label>
            <Select value={hidingValue} onValueChange={setHidingValue}>
              <input type="hidden" name="hiding" value={hidingValue} />
              <SelectTrigger id="hiding-field" className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200">
                <SelectValue placeholder="Select hiding" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4} className="bg-white shadow-lg border-gray-200">
                <SelectGroup>
                  {hidingDicts.map((dict) => {
                    return (<SelectItem value={dict.dictValue} key={dict.dictValue} className="focus:bg-blue-50 focus:text-blue-700">
                      {dict.dictLabel}
                    </SelectItem>)
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Fields marked with * are required
            </p>
            <div className="flex gap-3">
              <Button asChild
                type="button"
                variant="outline"
                className="px-6 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
              >
                <Link href="/sys_menu">
                  Cancel
                </Link>
              </Button>
              <Button
                type="submit"
                className="px-8 bg-linear-to-r from-blue-500 to-blue-500 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4" />
                    Update Menu
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
