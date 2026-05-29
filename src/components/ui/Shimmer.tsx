import { cn } from "../../lib/utils";

function Shimmer({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-xl bg-sub-100", className)} {...props} />;
}

export { Shimmer };
