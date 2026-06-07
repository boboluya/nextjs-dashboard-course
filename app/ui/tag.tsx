import { cva, type VariantProps } from "class-variance-authority";

const tagVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      color: {
        blue: "border-blue-200 bg-blue-50 text-blue-700",
        green: "border-green-200 bg-green-50 text-green-700",
        red: "border-red-200 bg-red-50 text-red-700",
        yellow: "border-yellow-200 bg-yellow-50 text-yellow-700",
        pink: "border-pink-200 bg-pink-50 text-pink-700",
        purple: "border-purple-200 bg-purple-50 text-purple-700",
        gray: "border-gray-200 bg-gray-50 text-gray-600",
        orange: "border-orange-200 bg-orange-50 text-orange-700",
        indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
        teal: "border-teal-200 bg-teal-50 text-teal-700",
      },
    },
    defaultVariants: {
      color: "gray",
    },
  }
);

interface TagProps extends VariantProps<typeof tagVariants> {
  text: string;
  className?: string;
}

export function Tag({ text, color, className }: TagProps) {
  return (
    <span className={tagVariants({ color, className })}>
      {text}
    </span>
  );
}

// Status tag with a dot indicator
const statusDotVariants = cva("h-2 w-2 rounded-full", {
  variants: {
    color: {
      blue: "bg-blue-500",
      green: "bg-green-500",
      red: "bg-red-400",
      yellow: "bg-yellow-400",
      pink: "bg-pink-400",
      purple: "bg-purple-400",
      gray: "bg-gray-400",
      orange: "bg-orange-400",
      indigo: "bg-indigo-400",
      teal: "bg-teal-400",
    },
  },
  defaultVariants: {
    color: "gray",
  },
});

const statusTextVariants = cva("text-sm font-medium", {
  variants: {
    color: {
      blue: "text-blue-700",
      green: "text-green-700",
      red: "text-red-600",
      yellow: "text-yellow-700",
      pink: "text-pink-700",
      purple: "text-purple-700",
      gray: "text-gray-600",
      orange: "text-orange-700",
      indigo: "text-indigo-700",
      teal: "text-teal-700",
    },
  },
  defaultVariants: {
    color: "gray",
  },
});

interface StatusTagProps extends VariantProps<typeof statusDotVariants> {
  text: string;
  className?: string;
}

export function StatusTag({ text, color, className }: StatusTagProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className || ""}`}>
      <span className={statusDotVariants({ color })} />
      <span className={statusTextVariants({ color })}>{text}</span>
    </span>
  );
}
