import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Plus } from "lucide-react";
import { getTenantProjects } from "@/lib/dal/projects";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "项目管理" };
const typeLabels = { CORPORATE_WEBSITE: "企业官网", ECOMMERCE: "电商网站", FOREIGN_TRADE: "外贸网站", WECHAT_MINI_PROGRAM: "微信小程序", WEB_ADMIN: "Web 管理后台", API_SERVICE: "API 服务", OTHER: "其他" } as const;

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ created?: string }> }) {
  const [projects, query] = await Promise.all([getTenantProjects(), searchParams]);
  return <div className="space-y-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-1 text-sm text-muted-foreground">资产管理</p><h1 className="text-2xl font-semibold tracking-tight">项目管理</h1><p className="mt-1 text-sm text-muted-foreground">集中管理企业网站、小程序、后台与 API 服务</p></div><Button asChild><Link href="/projects/new"><Plus className="size-4" />新建项目</Link></Button></div>
    {query.created && <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">项目“{query.created}”已创建。</p>}
    <Card><CardContent className="overflow-x-auto p-0"><table className="w-full min-w-[850px] text-left text-sm"><thead className="border-b bg-muted/50 text-xs text-muted-foreground"><tr><th className="px-5 py-3 font-medium">项目名称</th><th className="px-5 py-3 font-medium">类型</th><th className="px-5 py-3 font-medium">网址</th><th className="px-5 py-3 font-medium">负责人</th><th className="px-5 py-3 font-medium">状态</th><th className="px-5 py-3 font-medium">上线日期</th></tr></thead><tbody>{projects.map((project) => <tr key={project.id} className="border-b last:border-0 hover:bg-muted/30"><td className="px-5 py-4 font-medium">{project.name}</td><td className="px-5 py-4 text-muted-foreground">{typeLabels[project.type]}</td><td className="px-5 py-4">{project.websiteUrl ? <a href={project.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex max-w-64 items-center gap-1 truncate text-primary hover:underline">{project.websiteUrl}<ExternalLink className="size-3 shrink-0" /></a> : "—"}</td><td className="px-5 py-4 text-muted-foreground">{project.ownerName ?? "未指定"}</td><td className="px-5 py-4"><StatusBadge status={project.healthStatus} /></td><td className="px-5 py-4 text-muted-foreground">{formatDate(project.launchDate)}</td></tr>)}{projects.length === 0 && <tr><td colSpan={6} className="px-5 py-16 text-center text-muted-foreground">暂无项目。新建第一个项目，开始建立企业线上资产台账。</td></tr>}</tbody></table></CardContent></Card>
  </div>;
}
