import { getTenUsers } from "@/app/lib/my_data";

export default async function Page() {
  const users = await getTenUsers();
  return (
    <div>
      <ul>
        {users.map((user) => (
          <li key={user.userId} className="flex items-center gap-2">
            {user.userName}: {user.nickName}
            <span className="text-muted">Created by: {user.createBy}</span>
            <span className="text-muted">Updated by: {user.updateBy}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
