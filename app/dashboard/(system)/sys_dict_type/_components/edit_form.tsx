"use client";

import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import { EditState, updateSysDictType } from "../_lib/actions";
import { Button } from "@/components/ui/button";
import {
  DocumentTextIcon,
  TagIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { SysDictType } from "@/app/lib/definitions";

export function EditForm({ dictType }: { dictType: SysDictType }) {
  const initialState: EditState = { errors: {}, message: null };
  const updateDictTypeWithId = updateSysDictType.bind(null, dictType.id!);
  const [state, formAction, isPending] = useActionState(updateDictTypeWithId, initialState);

  return (
    <div className="m-6 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-blue-500 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <DocumentTextIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Edit Dictionary Type</h2>
            <p className="text-blue-100 text-sm">Update the dictionary type information below</p>
          </div>
        </div>
      </div>
      <form className="p-6 space-y-6" action={formAction}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dict Name Field */}
          <div className="space-y-2">
            <label htmlFor="dictName-field" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <DocumentTextIcon className="h-4 w-4 text-gray-500" />
              Dict Name
            </label>
            <div className="relative">
              <Input
                id="dictName-field"
                name="dictName"
                placeholder="Enter dictionary name"
                defaultValue={dictType.dictName ?? ""}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
              <DocumentTextIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
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

          {/* Dict Type Field */}
          <div className="space-y-2">
            <label htmlFor="dictType-field" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <TagIcon className="h-4 w-4 text-gray-500" />
              Dict Type
            </label>
            <div className="relative">
              <Input
                id="dictType-field"
                name="dictType"
                placeholder="Enter dictionary type"
                defaultValue={dictType.dictType ?? ""}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
              <TagIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
            <div id="dictType-error" aria-live="polite" aria-atomic="true">
              {state.errors?.dictType &&
                state.errors.dictType.map((error: string) => (
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
                <Link href="/dashboard/sys_dict_type">
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
                    Update Dict Type
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
