"use client";
import Link from "next/link";
import { useActionState } from "react";
import { loginAction, registerAction, type AuthState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const action = mode === "login" ? loginAction : registerAction;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(action, {});
  return <form action={formAction} className="space-y-4">
    {mode === "register" && <><Field label="姓名" name="name" placeholder="王经理" autoComplete="name" /><Field label="企业名称" name="organizationName" placeholder="宁波华远机械有限公司" autoComplete="organization" /></>}
    <Field label="登录邮箱" name="email" type="email" placeholder="name@company.cn" autoComplete="email" defaultValue={mode === "login" ? "demo@sitecare.example" : undefined} />
    <Field label="密码" name="password" type="password" placeholder="至少 8 位" autoComplete={mode === "login" ? "current-password" : "new-password"} defaultValue={mode === "login" ? "SiteCare@2026" : undefined} />
    {state.error && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{state.error}</p>}
    <Button className="w-full" disabled={pending}>{pending ? "请稍候…" : mode === "login" ? "登录控制台" : "创建企业账户"}</Button>
    <p className="text-center text-sm text-muted-foreground">{mode === "login" ? "还没有账户？" : "已有账户？"}<Link className="ml-1 font-medium text-primary hover:underline" href={mode === "login" ? "/register" : "/login"}>{mode === "login" ? "免费注册" : "返回登录"}</Link></p>
  </form>;
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  const { label, name, ...inputProps } = props;
  return <div className="space-y-2"><Label htmlFor={name}>{label}</Label><Input id={name} name={name} required {...inputProps} /></div>;
}

