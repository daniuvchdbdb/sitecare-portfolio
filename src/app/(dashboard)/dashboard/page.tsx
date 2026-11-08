import type { Metadata } from "next";
import Link from "next/link";
import { Activity, AlertTriangle, CheckCircle2, Clock3, FolderKanban, Gauge, Plus, TicketCheck } from "lucide-react";
import { getDashboardData } from "@/lib/dal/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "运行概览" };

export default async function DashboardPage() {
  const { metrics, projects } = await getDashboardData();
  const cards = [
    { label: "运行项目", value: metrics.total, hint: "当前企业全部项目", icon: FolderKanban, tone: "text-blue-600 bg-blue-50 dark:bg-blue-950" },
    { label: "状态正常", value: metrics.healthy, hint: metrics.total ? `${Math.round(metrics.healthy / metrics.total * 100)}% 项目运行稳定` : "等待添加项目", icon: CheckCircle2, tone: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950" },
    { label: "异常项目", value: metrics.unhealthy, hint: metrics.unhealthy ? "需要立即关注" : "暂无异常", icon: AlertTriangle, tone: "text-red-600 bg-red-50 dark:bg-red-950" },
    { label: "证书提醒", value: metrics.warning, hint: "含即将到期项目", icon: Clock3, tone: "text-amber-600 bg-amber-50 dark:bg-amber-950" },
    { label: "待处理工单", value: metrics.pendingTickets, hint: "待处理及处理中", icon: TicketCheck, tone: "text-violet-600 bg-violet-50 dark:bg-violet-950" },
    { label: "本月故障", value: metrics.monthlyIncidents, hint: "自然月累计事件", icon: Activity, tone: "text-orange-600 bg-orange-50 dark:bg-orange-950" },
    { label: "平均响应", value: metrics.averageResponseTime ? `${metrics.averageResponseTime}ms` : "—", hint: "HTTP 检测平均值", icon: Gauge, tone: "text-cyan-600 bg-cyan-50 dark:bg-cyan-950" },
    { label: "最近检测", value: metrics.lastCheckAt ? formatDate(metrics.lastCheckAt) : "待检测", hint: "监控 Worker 尚未启用", icon: Clock3, tone: "text-slate-600 bg-slate-100 dark:bg-slate-800" },
  ];

  return <div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-1 text-sm text-muted-foreground">企业运行中心</p><h1 className="text-2xl font-semibold tracking-tight">运行概览</h1><p className="mt-1 text-sm text-muted-foreground">实时掌握网站与在线业务的整体健康状况</p></div><Button asChild><Link href="/projects/new"><Plus className="size-4" />添加项目</Link></Button></div>

    <Card className={metrics.unhealthy ? "border-red-200 dark:border-red-900" : "border-emerald-200 dark:border-emerald-900"}>
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3"><span className={`mt-0.5 flex size-9 items-center justify-center rounded-full ${metrics.unhealthy ? "bg-red-50 text-red-600 dark:bg-red-950" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950"}`}>{metrics.unhealthy ? <AlertTriangle className="size-5" /> : <CheckCircle2 className="size-5" />}</span><div><p className="font-semibold">{metrics.unhealthy ? `发现 ${metrics.unhealthy} 个异常项目` : "当前业务运行正常"}</p><p className="mt-1 text-sm text-muted-foreground">{metrics.unhealthy ? "请检查异常项目状态并安排技术人员处理。" : "已接入的项目未发现严重异常，守站云将持续监测。"}</p></div></div><span className="text-xs text-muted-foreground">第一阶段 · 项目状态演示数据</span>
      </CardContent>
    </Card>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, hint, icon: Icon, tone }) => <Card key={label}><CardContent className="p-5"><div className="flex items-start justify-between"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p></div><span className={`flex size-9 items-center justify-center rounded-lg ${tone}`}><Icon className="size-4" /></span></div><p className="mt-3 text-xs text-muted-foreground">{hint}</p></CardContent></Card>)}</div>

    <Card><CardHeader className="flex flex-row items-center justify-between"><div><CardTitle>最近项目</CardTitle><p className="mt-1 text-xs text-muted-foreground">按最近更新时间排列</p></div><Button asChild variant="outline" size="sm"><Link href="/projects">查看全部</Link></Button></CardHeader><CardContent className="overflow-x-auto px-0 pb-0"><table className="w-full min-w-[680px] text-left text-sm"><thead className="border-y bg-muted/50 text-xs text-muted-foreground"><tr><th className="px-5 py-3 font-medium">项目</th><th className="px-5 py-3 font-medium">网址</th><th className="px-5 py-3 font-medium">负责人</th><th className="px-5 py-3 font-medium">状态</th><th className="px-5 py-3 font-medium">上线日期</th></tr></thead><tbody>{projects.slice(0, 6).map((project) => <tr key={project.id} className="border-b last:border-0"><td className="px-5 py-4 font-medium">{project.name}</td><td className="max-w-60 truncate px-5 py-4 text-muted-foreground">{project.websiteUrl ?? "—"}</td><td className="px-5 py-4 text-muted-foreground">{project.ownerName ?? "未指定"}</td><td className="px-5 py-4"><StatusBadge status={project.healthStatus} /></td><td className="px-5 py-4 text-muted-foreground">{formatDate(project.launchDate)}</td></tr>)}{projects.length === 0 && <tr><td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">还没有项目，点击“添加项目”开始管理。</td></tr>}</tbody></table></CardContent></Card>
  </div>;
}
