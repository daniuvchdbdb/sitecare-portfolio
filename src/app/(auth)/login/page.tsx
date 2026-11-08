import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ registered?: string }> }) {
  const query = await searchParams;
  return <AuthShell title="欢迎回来" description="登录后查看企业项目和当前运行状态" notice={query.registered}><AuthForm mode="login" /></AuthShell>;
}
