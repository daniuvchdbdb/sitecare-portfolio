import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createProjectAction } from "@/app/(dashboard)/projects/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = { title: "新建项目" };
const inputClass = "flex min-h-10 w-full rounded-md border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

export default async function NewProjectPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const query = await searchParams;
  return <div className="mx-auto max-w-4xl space-y-6"><div><Button asChild variant="ghost" size="sm" className="-ml-3 mb-3"><Link href="/projects"><ArrowLeft className="size-4" />返回项目列表</Link></Button><h1 className="text-2xl font-semibold tracking-tight">新建项目</h1><p className="mt-1 text-sm text-muted-foreground">录入企业线上业务的基础档案，后续可为项目添加监控目标。</p></div>
    {query.error && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{query.error}</p>}
    <form action={createProjectAction}><Card><CardHeader><CardTitle>基础信息</CardTitle></CardHeader><CardContent className="grid gap-5 sm:grid-cols-2">
      <Field label="项目名称" required><Input name="name" placeholder="例如：华远机械企业官网" required maxLength={100} /></Field>
      <Field label="项目类型" required><select name="type" className={inputClass} defaultValue="CORPORATE_WEBSITE" required><option value="CORPORATE_WEBSITE">企业官网</option><option value="ECOMMERCE">电商网站</option><option value="FOREIGN_TRADE">外贸网站</option><option value="WECHAT_MINI_PROGRAM">微信小程序</option><option value="WEB_ADMIN">Web 管理后台</option><option value="API_SERVICE">API 服务</option><option value="OTHER">其他</option></select></Field>
      <Field label="网站地址"><Input name="websiteUrl" type="url" placeholder="https://example.com" /></Field>
      <Field label="上线日期"><Input name="launchDate" type="date" /></Field>
      <Field label="负责人"><Input name="ownerName" placeholder="项目负责人姓名" maxLength={50} /></Field>
      <Field label="联系方式"><Input name="contactInfo" placeholder="手机、邮箱或微信" maxLength={100} /></Field>
      <Field label="技术栈" className="sm:col-span-2"><Input name="techStack" placeholder="例如：Next.js、WordPress、微信小程序" maxLength={200} /></Field>
      <Field label="服务器备注" className="sm:col-span-2"><textarea name="serverNotes" className={inputClass} rows={3} placeholder="云服务商、区域、服务器用途等（请勿填写密码）" maxLength={500} /></Field>
      <Field label="其他备注" className="sm:col-span-2"><textarea name="notes" className={inputClass} rows={3} placeholder="项目背景、维护注意事项等" maxLength={1000} /></Field>
      <div className="flex justify-end gap-3 border-t pt-5 sm:col-span-2"><Button asChild type="button" variant="outline"><Link href="/projects">取消</Link></Button><Button type="submit">创建项目</Button></div>
    </CardContent></Card></form>
  </div>;
}

function Field({ label, required, className, children }: { label: string; required?: boolean; className?: string; children: React.ReactNode }) { return <div className={`space-y-2 ${className ?? ""}`}><Label>{label}{required && <span className="ml-1 text-red-500">*</span>}</Label>{children}</div>; }
