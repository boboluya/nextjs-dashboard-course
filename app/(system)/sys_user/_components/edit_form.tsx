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
import { EditState, updateSysUser } from "../_lib/actions";
import { Button } from "@/components/ui/button";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { SysUser, SysRole } from "@/app/lib/definitions";
import { RoleMultiSelect } from "./role-select";

export function EditForm({ user, roles, selectedRoleIds: initialRoleIds }: { user: SysUser; roles: SysRole[]; selectedRoleIds: number[] }) {
  const sexDicts = [
    { dictValue: "1", dictLabel: "Male" },
    { dictValue: "2", dictLabel: "Female" },
  ]
  const [sexValue, setSexValue] = useState(user.sex ?? "");
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>(initialRoleIds);
  const initialState: EditState = { errors: {}, message: null }
  const updateSysUserWithId = updateSysUser.bind(null, user.userId!)
  const [state, formAction, isPending] = useActionState(updateSysUserWithId, initialState)
  return (
    <div className="m-6 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-blue-500 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <UserGroupIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Edit User</h2>
            <p className="text-blue-100 text-sm">Update the user information below</p>
          </div>
        </div>
      </div>
      <form className="p-6 space-y-6" action={formAction}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Field */}
          <div className="space-y-2">
            <label htmlFor="userName-field" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <UserIcon className="h-4 w-4 text-gray-500" />
              Account
            </label>
            <div className="relative">
              <Input
                id="userName-field"
                name="userName"
                placeholder="Enter account name"
                defaultValue={user.userName ?? ""}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
              <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
            <div id="userName-error" aria-live="polite" aria-atomic="true">
              {state.errors?.userName &&
                state.errors.userName.map((error: string) => (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1" key={error}>
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <label htmlFor="Name-field" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <UserIcon className="h-4 w-4 text-gray-500" />
              Name
            </label>
            <div className="relative">
              <Input
                id="nickName-field"
                name="nickName"
                placeholder="Enter user name"
                defaultValue={user.nickName ?? ""}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
              <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
            <div id="nickName-error" aria-live="polite" aria-atomic="true">
              {state.errors?.nickName &&
                state.errors.nickName.map((error: string) => (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1" key={error}>
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email-field" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <EnvelopeIcon className="h-4 w-4 text-gray-500" />
              Email
            </label>
            <div className="relative">
              <Input
                id="email-field"
                name="email"
                type="email"
                placeholder="Enter email address"
                defaultValue={user.email ?? ""}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
              <EnvelopeIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
            <div id="email-error" aria-live="polite" aria-atomic="true">
              {state.errors?.email &&
                state.errors.email.map((error: string) => (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1" key={error}>
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <label htmlFor="phonenumber-field" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <PhoneIcon className="h-4 w-4 text-gray-500" />
              Phone
            </label>
            <div className="relative">
              <Input
                id="phonenumber-field"
                name="phonenumber"
                type="number"
                placeholder="Enter phone number"
                defaultValue={user.phoneNumber ?? ""}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
              <PhoneIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Sex Field */}
          <div className="space-y-2">
            <label htmlFor="sex-field" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <UserGroupIcon className="h-4 w-4 text-gray-500" />
              Gender
            </label>
            <Select value={sexValue} onValueChange={setSexValue}>
              <input type="hidden" name="sex" value={sexValue} />
              <SelectTrigger id="sex-field" className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4} className="bg-white shadow-lg border-gray-200">
                <SelectGroup>
                  {sexDicts.map((dict) => {
                    return (<SelectItem value={dict.dictValue} key={dict.dictValue} className="focus:bg-blue-50 focus:text-blue-700">
                      {dict.dictLabel}
                    </SelectItem>)
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div id="sex-error" aria-live="polite" aria-atomic="true">
              {state.errors?.sex &&
                state.errors.sex.map((error: string) => (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1" key={error}>
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Roles Field */}
          <div className="space-y-2">
            <label htmlFor="roles-field" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <UserGroupIcon className="h-4 w-4 text-gray-500" />
              Roles
            </label>
            <RoleMultiSelect
              roles={roles}
              selectedRoleIds={selectedRoleIds}
              onChange={setSelectedRoleIds}
            />
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
                <Link href="/sys_user">
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
                    Update User
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
