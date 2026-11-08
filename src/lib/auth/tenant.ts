import { MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function requireTenant() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (!session.user.organizationId || !session.user.role) redirect("/register");
  return {
    userId: session.user.id,
    organizationId: session.user.organizationId,
    organizationName: session.user.organizationName ?? "未命名企业",
    role: session.user.role,
  };
}

export async function requireOrganizationAdmin() {
  const tenant = await requireTenant();
  if (tenant.role !== MemberRole.ORG_ADMIN && tenant.role !== MemberRole.PLATFORM_ADMIN) throw new Error("FORBIDDEN");
  return tenant;
}
