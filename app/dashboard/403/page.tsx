import Link from "next/link";
import { FaceFrownIcon } from "@heroicons/react/24/outline";

export default function ForbiddenPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <FaceFrownIcon className="h-16 w-16 text-gray-400" />
      <h1 className="text-4xl font-bold text-gray-800">403</h1>
      <p className="text-lg text-gray-500">
        Sorry, you don&apos;t have permission to access this page.
      </p>
      <Link
        href="/dashboard"
        className="rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white hover:bg-blue-400"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
