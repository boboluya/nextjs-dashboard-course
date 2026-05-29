"use client";
import Link from "next/link";
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import { updateMyUser } from "@/app/dashboard/my_user/_lib/actions";
import { User } from "@/app/dashboard/my_user/_lib/my_data";

export default function EditForm(props: { user: User }) {
  const user = props.user;
  const handleSubmit = updateMyUser.bind(null, String(user.userId));
  return (
    <form action={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* User Id */}
        <div className="mb-4">
          <label htmlFor="userId" className="mb-2 block text-sm font-medium">
            User Id
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="userId"
                name="userId"
                type="text"
                placeholder="Enter UserId"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={String(user.userId)}
                readOnly
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* User Name */}
        <div className="mb-4">
          <label htmlFor="userName" className="mb-2 block text-sm font-medium">
            User Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="userName"
                name="userName"
                type="text"
                placeholder="Enter User Name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={user.userName}
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Nick Name */}
        <div className="mb-4">
          <label htmlFor="nickName" className="mb-2 block text-sm font-medium">
            Nick Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="nickName"
                name="nickName"
                type="text"
                placeholder="Enter Nick Name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={user.nickName}
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/my_user"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Update User</Button>
      </div>
    </form>
  );
}
