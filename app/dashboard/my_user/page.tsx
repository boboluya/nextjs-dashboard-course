import { getTenUsers } from "@/app/lib/my_data";
import clsx from "clsx";

export default async function Page() {
  const users = await getTenUsers();
  return (
    <div>
      <ul>
        <li className="flex flex-row items-center justify-between py-4 bg-slate-300">
          <p>No.</p>
          <p>Name</p>
          <p>Nickname</p>
          <p>Created by</p>
        </li>
        {users.map((user, i) => (
          <li
            key={user.userId}
            className={clsx("flex flex-row items-center justify-between py-4", {
              "border-t": 1 == 1,
            })}
          >
            <span className="text-muted">{i + 1}</span>
            <p className="flex items-center">{user.userName}</p>
            <p className="flex items-center">{user.nickName}</p>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold md:text-base">
                Created by: {user.createBy}
              </p>
              <p className="hidden text-sm text-gray-500 sm:block">
                Updated by: {user.updateBy}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
