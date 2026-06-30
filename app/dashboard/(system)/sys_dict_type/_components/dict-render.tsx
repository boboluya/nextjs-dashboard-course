// "use client";

// import { useEffect, useState } from "react";
// import { fetchDictItemsByType } from "../_lib/actions";

// interface DictRenderProps {
//   dictType: string;
//   dictValue?: string | null;
//   className?: string;
// }

// export default function DictRender({ dictType, dictValue, className }: DictRenderProps) {
//   const [label, setLabel] = useState<string>(dictValue || "");
//   const [loading, setLoading] = useState(() => !!dictValue);

//   useEffect(() => {
//     if (!dictValue) return;

//     let cancelled = false;

//     const loadDict = async () => {
//       try {
//         const items = await fetchDictItemsByType(dictType);
//         const matched = items.find((item) => item.dictValue === dictValue);
//         if (!cancelled) {
//           setLabel(matched?.dictLabel || dictValue);
//         }
//       } catch (error) {
//         console.error("Failed to fetch dict items:", error);
//         if (!cancelled) {
//           setLabel(dictValue);
//         }
//       } finally {
//         if (!cancelled) {
//           setLoading(false);
//         }
//       }
//     };

//     loadDict();

//     return () => {
//       cancelled = true;
//     };
//   }, [dictType, dictValue]);

//   if (loading) {
//     return <span className={className}>...</span>;
//   }

//   return <span className={className}>{label}</span>;
// }
