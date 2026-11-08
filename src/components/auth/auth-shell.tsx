import { Server, ShieldCheck } from "lucide-react";
export function AuthShell({ title, description, children, notice }: { title: string; description: string; children: React.ReactNode; notice?: string }) {
  return <main className="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
    <section className="hidden bg-[#111722] p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-lg bg-blue-500"><Server className="size-5" /></span><span><strong className="block">守站云</strong><span className="text-xs text-slate-400">SiteCare</span></span></div>
      <div className="max-w-xl"><p className="mb-5 text-sm font-medium text-blue-300">企业网站长期维护平台</p><h1 className="text-4xl font-semibold leading-tight tracking-tight">让每个线上业务，都有人持续守护。</h1><p className="mt-5 max-w-lg leading-7 text-slate-400">统一管理企业网站、小程序和 API 服务的运行状态、维护项目与技术服务记录。</p></div>
      <div className="flex items-center gap-2 text-sm text-slate-400"><ShieldCheck className="size-4 text-emerald-400" />企业级权限与多租户数据隔离</div>
    </section>
    <section className="flex items-center justify-center p-5 sm:p-10"><div className="w-full max-w-[410px]"><div className="mb-8 lg:hidden"><span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Server className="size-5" /></span><span className="ml-3 font-semibold">守站云 SiteCare</span></div><h2 className="text-2xl font-semibold tracking-tight">{title}</h2><p className="mb-7 mt-2 text-sm text-muted-foreground">{description}</p>{notice && <p className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{notice}</p>}{children}</div></section>
  </main>;
}
