import { lusitana } from "@/app/ui/fonts";

export default async function SearchParamTest({
  searchParams,
}: {
  searchParams: Promise<{ p: string }>;
}) {
  const params = await searchParams;
  const p = params?.p || "-";
  return (
    <div
      className={`flex flex-col shadow-lg
    border-r-blue-400 items-center justify-center focus-visible:outline2 text-white hover:bg-blue-600
    w-20 h-10 text-lg mb-12 rounded-lg bg-blue-300 ${lusitana.className}`}
    >
      {p}
    </div>
  );
}
