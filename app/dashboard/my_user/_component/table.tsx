import { formatDateToLocal, formatCurrency } from "@/app/lib/utils";
import { getTenUsers } from "@/app/dashboard/my_user/_lib/my_data";
import {
  UpdateMyUser,
  DeleteMyUser,
} from "@/app/dashboard/my_user/_component/buttons";

export default async function InvoicesTable({
  query,
  currentPage,
  pageSize,
}: {
  query: string;
  currentPage: number;
  pageSize: number;
}) {
  // const invoices = await fetchFilteredInvoices(query, currentPage);
  const users = await getTenUsers(query, currentPage, pageSize);
  console.log('users: ', users)

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  UserId
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  UserName
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  NickName
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  CreatedBy
                </th>
                {/*<th scope="col" className="px-3 py-5 font-medium">
                  CreateTime
                </th>*/}
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {users?.map((invoice,index) => (
                <tr
                  key={index}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{invoice.userId}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.userName}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.nickName}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.createBy}
                  </td>
                  {/*<td className="whitespace-nowrap px-3 py-3">
                    {invoice.createTime}
                  </td>*/}
                  <td className="whitespace-nowrap px-3  py-3">
                    <div className="flex justify-end gap-4">
                      <UpdateMyUser id={String(invoice.userId)} />
                      <DeleteMyUser id={String(invoice.userId)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
