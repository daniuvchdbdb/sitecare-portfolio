import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
export default function RegisterPage() { return <AuthShell title="创建企业账户" description="注册后将自动创建独立的企业工作空间"><AuthForm mode="register" /></AuthShell>; }
