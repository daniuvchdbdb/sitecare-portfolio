"use server";

import { AuthError } from "next-auth";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { signIn } from "@/auth";

export type AuthState = { error?: string };

export async function loginAction(_: AuthState, formData: FormData): Promise<AuthState> {
  try {
    await signIn("credentials", { email: formData.get("email"), password: formData.get("password"), redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) return { error: "邮箱或密码不正确" };
    throw error;
  }
  return {};
}

export async function registerAction(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "请检查输入内容" };
  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email }, select: { id: true } });
  if (exists) return { error: "该邮箱已注册" };
  const passwordHash = await hash(parsed.data.password, 12);
  const slugBase = parsed.data.organizationName.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-").replace(/^-|-$/g, "").slice(0, 36) || "company";
  const slug = `${slugBase}-${crypto.randomUUID().slice(0, 6)}`;
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({ data: { name: parsed.data.name, email: parsed.data.email, passwordHash } });
    const organization = await tx.organization.create({ data: { name: parsed.data.organizationName, slug, contactName: parsed.data.name } });
    await tx.organizationMember.create({ data: { userId: user.id, organizationId: organization.id, role: "ORG_ADMIN" } });
    await tx.auditLog.create({ data: { actorId: user.id, organizationId: organization.id, action: "ORGANIZATION_CREATED", entityType: "Organization", entityId: organization.id } });
  });
  redirect(`/login?registered=${encodeURIComponent("注册成功，请登录")}`);
}
