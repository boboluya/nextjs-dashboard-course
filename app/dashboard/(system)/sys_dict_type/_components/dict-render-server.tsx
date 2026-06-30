// import { fetchDictItemsByType } from "../_lib/actions";

// interface DictRenderServerProps {
//   dictType: string;
//   dictValue?: string | null;
//   className?: string;
// }

// export default async function DictRenderServer({
//   dictType,
//   dictValue,
//   className,
// }: DictRenderServerProps) {
//   if (!dictValue) {
//     return <span className={className}>-</span>;
//   }

//   let label = dictValue;

//   try {
//     const items = await fetchDictItemsByType(dictType);
//     const matched = items.find((item) => item.dictValue === dictValue);
//     if (matched?.dictLabel) {
//       label = matched.dictLabel;
//     }
//   } catch (error) {
//     console.error("Failed to fetch dict items:", error);
//   }

//   return <span className={className}>{label}</span>;
// }
