import { MemberRole, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/auth/tenant";

export async function getTenantProjects() {
  const tenant = await requireTenant();
  const accessFilter: Prisma.ProjectWhereInput = tenant.role === MemberRole.ORG_MEMBER
    ? { memberAccess: { some: { userId: tenant.userId } } }
    : {};
  return prisma.project.findMany({
    where: { organizationId: tenant.organizationId, ...accessFilter },
    orderBy: { createdAt: "desc" },
  });
}
