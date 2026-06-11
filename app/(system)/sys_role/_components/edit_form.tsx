"use client";

/**
 * 编辑角色表单组件
 * 使用 useActionState 管理表单状态和验证
 * 预填充角色现有数据
 */
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
import { EditState, updateSysRole } from "../_lib/actions";
import { Button } from "@/components/ui/button";
import {
  ShieldCheckIcon,
  KeyIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { SysRole } from "@/app/lib/definitions";

/** 数据权限范围字典 */
const dataScopeDicts = [
  { dictValue: "1", dictLabel: "All data permissions" },
  { dictValue: "2", dictLabel: "Custom data permissions" },
  { dictValue: "3", dictLabel: "Data permissions for this department" },
  { dictValue: "4", dictLabel: "Data permissions for this dept & below" },
  { dictValue: "5", dictLabel: "Data permissions for myself only" },
  { dictValue: "6", dictLabel: "This dept & below or self" },
];

/** 状态字典 */
const statusDicts = [
  { dictValue: "1", dictLabel: "Active" },
  { dictValue: "2", dictLabel: "Disabled" },
];

/**
 * 编辑角色表单
 * @param role 当前角色数据，用于表单默认值
 */
export function EditForm({ role }: { role: SysRole }) {
  const [dataScopeValue, setDataScopeValue] = useState(String(role.dataScope ?? "1"));
  const [statusValue, setStatusValue] = useState(String(role.status ?? "1"));
  const initialState: EditState = { errors: {}, message: null };
  // 使用 bind 预绑定角色 ID
  const updateSysRoleWithId = updateSysRole.bind(null, role.id!);
  const [state, formAction, isPending] = useActionState(updateSysRoleWithId, initialState);

  return (
    <div className="m-6 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* 表单头部 */}
      <div className="bg-blue-500 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <ShieldCheckIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Edit Role</h2>
            <p className="text-blue-100 text-sm">Update the role information below</p>
          </div>
        </div>
      </div>

      {/* 表单内容 */}
      <form className="p-6 space-y-6" action={formAction}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name 字段 */}
          <div className="space-y-2">
            <label htmlFor="name-field" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <ShieldCheckIcon className="h-4 w-4 text-gray-500" />
              Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="name-field"
                name="name"
                placeholder="Enter role name"
                defaultValue={role.name ?? ""}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
              <ShieldCheckIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
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

          {/* Key 字段 */}
          <div className="space-y-2">
            <label htmlFor="key-field" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <KeyIcon className="h-4 w-4 text-gray-500" />
              Key <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="key-field"
                name="key"
                placeholder="e.g. admin, user"
                defaultValue={role.key ?? ""}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
              <KeyIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
            <div id="key-error" aria-live="polite" aria-atomic="true">
              {state.errors?.key &&
                state.errors.key.map((error: string) => (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1" key={error}>
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Data Scope 字段 */}
          <div className="space-y-2">
            <label htmlFor="dataScope-field" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <GlobeAltIcon className="h-4 w-4 text-gray-500" />
              Data Scope <span className="text-red-500">*</span>
            </label>
            <Select value={dataScopeValue} onValueChange={setDataScopeValue}>
              <input type="hidden" name="dataScope" value={dataScopeValue} />
              <SelectTrigger id="dataScope-field" className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200">
                <SelectValue placeholder="Select data scope" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4} className="bg-white shadow-lg border-gray-200">
                <SelectGroup>
                  {dataScopeDicts.map((dict) => (
                    <SelectItem value={dict.dictValue} key={dict.dictValue} className="focus:bg-blue-50 focus:text-blue-700">
                      {dict.dictLabel}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div id="dataScope-error" aria-live="polite" aria-atomic="true">
              {state.errors?.dataScope &&
                state.errors.dataScope.map((error: string) => (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1" key={error}>
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Status 字段 */}
          <div className="space-y-2">
            <label htmlFor="status-field" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <CheckCircleIcon className="h-4 w-4 text-gray-500" />
              Status <span className="text-red-500">*</span>
            </label>
            <Select value={statusValue} onValueChange={setStatusValue}>
              <input type="hidden" name="status" value={statusValue} />
              <SelectTrigger id="status-field" className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4} className="bg-white shadow-lg border-gray-200">
                <SelectGroup>
                  {statusDicts.map((dict) => (
                    <SelectItem value={dict.dictValue} key={dict.dictValue} className="focus:bg-blue-50 focus:text-blue-700">
                      {dict.dictLabel}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 底部按钮区域 */}
        <div className="pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Fields marked with <span className="text-red-500">*</span> are required
            </p>
            <div className="flex gap-3">
              <Button
                asChild
                type="button"
                variant="outline"
                className="px-6 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
              >
                <Link href="/sys_role">Cancel</Link>
              </Button>
              <Button
                type="submit"
                className="px-8 bg-linear-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
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
                    Update Role
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
