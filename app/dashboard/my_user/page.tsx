import { getTenUsers } from "@/app/dashboard/my_user/_lib/my_data";
import clsx from "clsx";
import Link from "next/link";
import Table from "@/app/dashboard/my_user/_component/table";
import Search from "@/app/ui/search";
import { CreateMyUser } from "@/app/dashboard/my_user/_component/buttons";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import Pagination from "@/app/dashboard/my_user/_component/pagination";
import { selectTotalPages } from "@/app/dashboard/my_user/_lib/actions";


export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: number;
    pageSize?: number;
  }>;
}) {
  const theParams = await props.searchParams;
  const { query = "", page = 1, pageSize = 10 } = theParams ?? {};
  const totalPages = await selectTotalPages(pageSize,query);
  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[{ label: "My User", href: "/dashboard/my_user" }]}
      />
      <div className="flex gap-4">
        <Search placeholder="Search Name" />
        <CreateMyUser />
      </div>
      <Table query={query} currentPage={page} pageSize={pageSize} />
      <Pagination totalPages={totalPages} />
    </div>
  );
}
