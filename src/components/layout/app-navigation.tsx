"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Activity, Bell, Building2, ChartNoAxesCombined, CircleHelp, FileText, FolderKanban, Gauge, LogOut, Menu, ReceiptText, Server, Settings, ShieldCheck, TicketCheck, Wrench, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const groups = [
  { label: "工作台", items: [
    { label: "运行概览", href: "/dashboard", icon: Gauge },
    { label: "项目管理", href: "/projects", icon: FolderKanban },
    { label: "监控中心", href: "#", icon: Activity, disabled: true },
    { label: "故障中心", href: "#", icon: ShieldCheck, disabled: true },
  ] },
  { label: "服务", items: [
    { label: "服务工单", href: "#", icon: TicketCheck, disabled: true },
    { label: "维护记录", href: "#", icon: Wrench, disabled: true },
    { label: "月度报告", href: "#", icon: FileText, disabled: true },
    { label: "服务额度", href: "#", icon: ChartNoAxesCombined, disabled: true },
  ] },
  { label: "企业", items: [
    { label: "团队成员", href: "#", icon: Building2, disabled: true },
    { label: "订阅套餐", href: "#", icon: ReceiptText, disabled: true },
    { label: "通知设置", href: "#", icon: Bell, disabled: true },
  ] },
];

function NavigationContent({ close }: { close?: () => void }) {
  const pathname = usePathname();
  return <div className="flex min-h-0 flex-1 flex-col">
    <div className="border-b px-5 py-4">
      <Link href="/dashboard" className="flex items-center gap-3" onClick={close}>
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Server className="size-5" /></span>
        <span><span className="block text-sm font-semibold tracking-tight">守站云</span><span className="block text-[11px] text-muted-foreground">SiteCare Console</span></span>
      </Link>
    </div>
    <nav className="flex-1 overflow-y-auto px-3 py-4">
      {groups.map((group) => <div key={group.label} className="mb-5">
        <p className="mb-1.5 px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{group.label}</p>
        <div className="space-y-0.5">{group.items.map((item) => {
          const active = item.href !== "#" && (pathname === item.href || pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;
          return <Link key={item.label} href={item.disabled ? "#" : item.href} aria-disabled={item.disabled} onClick={(event) => { if (item.disabled) event.preventDefault(); else close?.(); }} className={cn("flex h-9 items-center gap-3 rounded-md px-3 text-sm transition-colors", active ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground", item.disabled && "cursor-default opacity-55")}>
            <Icon className="size-4" /><span>{item.label}</span>{item.disabled && <span className="ml-auto text-[10px]">规划中</span>}
          </Link>;
        })}</div>
      </div>)}
    </nav>
    <div className="border-t p-3">
      <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => signOut({ callbackUrl: "/login" })}><LogOut className="size-4" />退出登录</button>
    </div>
  </div>;
}

export function AppNavigation({ organizationName, userName }: { organizationName: string; userName: string }) {
  const [open, setOpen] = useState(false);
  return <>
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-card lg:flex"><NavigationContent /></aside>
    {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}
    <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-card shadow-xl transition-transform lg:hidden", open ? "translate-x-0" : "-translate-x-full")}>
      <button className="absolute right-3 top-3 z-10 rounded-md p-2 text-muted-foreground hover:bg-muted" onClick={() => setOpen(false)} aria-label="关闭菜单"><X className="size-5" /></button>
      <NavigationContent close={() => setOpen(false)} />
    </aside>
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-card/95 px-4 backdrop-blur lg:px-7">
      <div className="flex min-w-0 items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="打开菜单"><Menu className="size-5" /></Button>
        <div className="min-w-0"><p className="truncate text-sm font-medium">{organizationName}</p><p className="truncate text-xs text-muted-foreground">企业控制台</p></div>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="帮助中心"><CircleHelp className="size-4" /></Button>
        <ThemeToggle />
        <div className="ml-2 hidden items-center gap-2 border-l pl-3 sm:flex"><span className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">{userName.slice(0, 1).toUpperCase()}</span><span className="max-w-28 truncate text-sm">{userName}</span><Settings className="size-3.5 text-muted-foreground" /></div>
      </div>
    </header>
  </>;
}
