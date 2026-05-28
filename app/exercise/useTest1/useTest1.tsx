"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function UseTest1() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const {replace} = useRouter();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const params = new URLSearchParams(searchParams.toString());
    params.set("p", value);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <input type="text" onChange={handleInputChange} />
  );
}
