import { cn } from "@/lib/utils";
type Status = "HEALTHY" | "WARNING" | "DOWN" | "UNKNOWN";
export function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = { HEALTHY: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", WARNING: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300", DOWN: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300", UNKNOWN: "bg-muted text-muted-foreground" };
  const labels: Record<Status, string> = { HEALTHY: "正常", WARNING: "警告", DOWN: "异常", UNKNOWN: "待检测" };
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", styles[status])}><span className="size-1.5 rounded-full bg-current" />{labels[status]}</span>;
}
