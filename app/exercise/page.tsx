import SearchParamTest from "./searchParamTest/searchParamTest";
import UseTest1 from "./useTest1/useTest1";

export default async function Page(props: { searchParams: Promise<{p: string}> }) {
  const searchParams = await props.searchParams;
  return (
    <div>
      <UseTest1></UseTest1>
      <SearchParamTest searchParams={Promise.resolve(searchParams)}></SearchParamTest>
    </div>
  );
}
