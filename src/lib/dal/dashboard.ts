import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/auth/tenant";

export async function getDashboardData() {
  const tenant = await requireTenant();
  const organizationId = tenant.organizationId;
  const monthStart = new Date();
  monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
  const [projects, pendingTickets, monthlyIncidents, average, lastCheck] = await Promise.all([
    prisma.project.findMany({ where: { organizationId }, orderBy: { updatedAt: "desc" }, take: 6 }),
    prisma.ticket.count({ where: { organizationId, status: { in: ["PENDING", "IN_PROGRESS", "WAITING_CUSTOMER"] } } }),
    prisma.incident.count({ where: { organizationId, firstDetectedAt: { gte: monthStart } } }),
    prisma.monitorCheck.aggregate({ where: { monitor: { organizationId } }, _avg: { responseTimeMs: true } }),
    prisma.monitorCheck.findFirst({ where: { monitor: { organizationId } }, orderBy: { checkedAt: "desc" }, select: { checkedAt: true } }),
  ]);
  return {
    tenant,
    projects,
    metrics: {
      total: projects.length,
      healthy: projects.filter((item) => item.healthStatus === "HEALTHY").length,
      unhealthy: projects.filter((item) => item.healthStatus === "DOWN").length,
      warning: projects.filter((item) => item.healthStatus === "WARNING").length,
      pendingTickets,
      monthlyIncidents,
      averageResponseTime: Math.round(average._avg.responseTimeMs ?? 0),
      lastCheckAt: lastCheck?.checkedAt ?? null,
    },
  };
}
