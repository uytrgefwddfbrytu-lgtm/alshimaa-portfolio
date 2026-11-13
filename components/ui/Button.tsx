import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-mustard/50 disabled:opacity-50";

  const variants = {
    primary: "bg-mustard text-charcoal hover:bg-mustard/90 shadow-lg",
    outline:
      "border border-charcoal/20 text-charcoal hover:bg-charcoal/5",
    ghost: "text-charcoal hover:bg-charcoal/5",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}