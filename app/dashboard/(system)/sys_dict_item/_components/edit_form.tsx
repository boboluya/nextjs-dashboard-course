"use client";

import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import { EditState, updateSysDictItem } from "../_lib/actions";
import { Button } from "@/components/ui/button";
import {
  ListBulletIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { SysDictItem, SysDictType } from "@/app/lib/definitions";
import { Tag } from "@/components/custome_ui/tag";
import { dictItemColors } from "../_lib/colors";

export function EditForm({
  dictItem,
  dictTypes,
  dictTypeId,
}: {
  dictItem: SysDictItem;
  dictTypes: SysDictType[];
  dictTypeId?: number;
}) {
  const initialState: EditState = { errors: {}, message: null };
  const updateDictItemWithId = updateSysDictItem.bind(null, dictItem.id!);
  const [state, formAction, isPending] = useActionState(updateDictItemWithId, initialState);

  return (
    <div className="m-6 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-blue-500 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <ListBulletIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Edit Dictionary Item</h2>
            <p className="text-blue-100 text-sm">Update the dictionary item information below</p>
          </div>
        </div>
      </div>
      <form className="p-6 space-y-6" action={formAction}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dict Type Field */}
          <div className="space-y-2">
            <label htmlFor="dictTypeId-field" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <TagIcon className="h-4 w-4 text-gray-500" />
              Dict Type
            </label>
            <div className="relative">
              <select
                id="dictTypeId-field"
                name="dictTypeId"
                defaultValue={dictItem.dictTypeId ?? ""}
                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm pl-10 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              >
                <option value="">Select a dict type</option>
                {dictTypes.map((dt) => (
                  <option key={dt.id} value={dt.id}>
                    {dt.dictName} ({dt.dictType})
                  </option>
                ))}
              </select>
              <TagIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div id="dictTypeId-error" aria-live="polite" aria-atomic="true">
              {state.errors?.dictTypeId &&
                state.errors.dictTypeId.map((error: string) => (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1" key={error}>
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Dict Label Field */}
          <div className="space-y-2">
            <label htmlFor="dictLabel-field" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <ListBulletIcon className="h-4 w-4 text-gray-500" />
              Dict Label
            </label>
            <div className="relative">
              <Input
                id="dictLabel-field"
                name="dictLabel"
                placeholder="Enter dictionary label"
                defaultValue={dictItem.dictLabel ?? ""}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
              <ListBulletIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
            <div id="dictLabel-error" aria-live="polite" aria-atomic="true">
              {state.errors?.dictLabel &&
                state.errors.dictLabel.map((error: string) => (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1" key={error}>
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Dict Value Field */}
          <div className="space-y-2">
            <label htmlFor="dictValue-field" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <TagIcon className="h-4 w-4 text-gray-500" />
              Dict Value
            </label>
            <div className="relative">
              <Input
                id="dictValue-field"
                name="dictValue"
                placeholder="Enter dictionary value"
                defaultValue={dictItem.dictValue ?? ""}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
              <TagIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
            <div id="dictValue-error" aria-live="polite" aria-atomic="true">
              {state.errors?.dictValue &&
                state.errors.dictValue.map((error: string) => (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1" key={error}>
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Dict Name Field */}
          <div className="space-y-2">
            <label htmlFor="dictName-field" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <ListBulletIcon className="h-4 w-4 text-gray-500" />
              Dict Name
            </label>
            <div className="relative">
              <Input
                id="dictName-field"
                name="dictName"
                placeholder="Enter dictionary name"
                defaultValue={dictItem.dictName ?? ""}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
              <ListBulletIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
            <div id="dictName-error" aria-live="polite" aria-atomic="true">
              {state.errors?.dictName &&
                state.errors.dictName.map((error: string) => (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1" key={error}>
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Color Field */}
          <div className="space-y-2">
            <label htmlFor="color-field" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <TagIcon className="h-4 w-4 text-gray-500" />
              Color
            </label>
            <div className="relative">
              <select
                id="color-field"
                name="color"
                defaultValue={dictItem.color ?? "gray"}
                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm pl-10 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              >
                {dictItemColors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
              <TagIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {dictItemColors.map((color) => (
                <Tag key={color} text={color} color={color} />
              ))}
            </div>
            <div id="color-error" aria-live="polite" aria-atomic="true">
              {state.errors?.color &&
                state.errors.color.map((error: string) => (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1" key={error}>
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Sorting Field */}
          <div className="space-y-2">
            <label htmlFor="sorting-field" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <ListBulletIcon className="h-4 w-4 text-gray-500" />
              Sorting
            </label>
            <div className="relative">
              <Input
                id="sorting-field"
                name="sorting"
                type="number"
                placeholder="Enter sorting order"
                defaultValue={dictItem.sorting ?? 0}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
              <ListBulletIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
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
        </div>

        <div className="pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Fields marked with * are required
            </p>
            <div className="flex gap-3">
              <Button
                asChild
                type="button"
                variant="outline"
                className="px-6 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
              >
                <Link href={dictTypeId ? `/dashboard/sys_dict_item?dictTypeId=${dictTypeId}` : "/dashboard/sys_dict_item"}>
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
                    Update Dict Item
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
