import { HealthStatus, MemberRole, PrismaClient, ProjectType } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const companies = Array.from({ length: 10 }, (_, index) => ({
  name: `Demo Organization ${index + 1}`,
  slug: `demo-org-${index + 1}`,
  contactName: `Demo Contact ${index + 1}`,
  phone: "Not provided (synthetic demo)",
}));
const projectTemplates = [
  ["企业品牌官网", ProjectType.CORPORATE_WEBSITE, "Next.js / PostgreSQL"],
  ["产品展示中心", ProjectType.CORPORATE_WEBSITE, "WordPress / MySQL"],
  ["在线商城", ProjectType.ECOMMERCE, "Shopify / Liquid"],
  ["海外独立站", ProjectType.FOREIGN_TRADE, "Next.js / Strapi"],
  ["客户服务小程序", ProjectType.WECHAT_MINI_PROGRAM, "微信小程序 / Node.js"],
  ["业务管理后台", ProjectType.WEB_ADMIN, "Vue 3 / Java"],
  ["经销商订货系统", ProjectType.WEB_ADMIN, "React / NestJS"],
  ["开放平台 API", ProjectType.API_SERVICE, "NestJS / PostgreSQL"],
] as const;

async function upsertProject(organizationId: string, companyIndex: number, projectIndex: number) {
  const template = projectTemplates[(companyIndex * 2 + projectIndex) % projectTemplates.length];
  const [suffix, type, techStack] = template;
  const company = companies[companyIndex];
  const name = `${company.name.replace("有限公司", "")}${suffix}`;
  const healthCycle = [HealthStatus.HEALTHY, HealthStatus.HEALTHY, HealthStatus.HEALTHY, HealthStatus.WARNING, HealthStatus.DOWN];
  const data = {
    organizationId,
    name,
    type,
    websiteUrl: `https://${projectIndex ? "service" : "www"}.${company.slug}.example`,
    ownerName: company.contactName,
    contactInfo: company.phone,
    techStack,
    launchDate: new Date(2023 + (companyIndex % 3), (companyIndex * 2 + projectIndex) % 12, 5 + companyIndex),
    healthStatus: healthCycle[(companyIndex + projectIndex) % healthCycle.length],
    notes: "演示环境项目，用于展示企业资产与运行状态。",
  };
  const existing = await prisma.project.findFirst({ where: { organizationId, name }, select: { id: true } });
  return existing ? prisma.project.update({ where: { id: existing.id }, data }) : prisma.project.create({ data });
}

async function main() {
  const passwordHash = await hash("SiteCare@2026", 12);
  const plans = [
    { name: "监控版", slug: "monitor", monthlyPriceCents: 9900, projectLimit: 3, monitorLimit: 3, serviceMinutesPerMonth: 0, features: ["HTTP 监控", "SSL 监控", "域名提醒", "月报"] },
    { name: "基础维护", slug: "basic-care", monthlyPriceCents: 29900, projectLimit: 5, monitorLimit: 10, serviceMinutesPerMonth: 60, features: ["基础问题处理", "服务工单", "维护月报"] },
    { name: "商业维护", slug: "business-care", monthlyPriceCents: 69900, projectLimit: 10, monitorLimit: 25, serviceMinutesPerMonth: 180, features: ["API 监控", "优先工单", "备份记录"] },
    { name: "企业托管", slug: "enterprise-care", monthlyPriceCents: 129900, projectLimit: null, monitorLimit: null, serviceMinutesPerMonth: null, features: ["企业技术托管", "服务器维护", "优先技术支持"] },
  ];
  for (const plan of plans) await prisma.plan.upsert({ where: { slug: plan.slug }, update: plan, create: plan });

  const demo = await prisma.user.upsert({
    where: { email: "demo@sitecare.example" },
    update: { name: "Demo Admin", passwordHash },
    create: { email: "demo@sitecare.example", name: "Demo Admin", passwordHash },
  });
  const platform = await prisma.user.upsert({
    where: { email: "admin@sitecare.example" },
    update: { name: "平台管理员", passwordHash },
    create: { email: "admin@sitecare.example", name: "平台管理员", passwordHash },
  });

  for (let index = 0; index < companies.length; index += 1) {
    const company = companies[index];
    const organization = await prisma.organization.upsert({
      where: { slug: company.slug },
      update: { name: company.name, contactName: company.contactName, contactPhone: company.phone },
      create: { name: company.name, slug: company.slug, contactName: company.contactName, contactPhone: company.phone },
    });
    await upsertProject(organization.id, index, 0);
    await upsertProject(organization.id, index, 1);
    if (index === 0) {
      await prisma.organizationMember.upsert({ where: { organizationId_userId: { organizationId: organization.id, userId: demo.id } }, update: { role: MemberRole.ORG_ADMIN }, create: { organizationId: organization.id, userId: demo.id, role: MemberRole.ORG_ADMIN } });
      await prisma.organizationMember.upsert({ where: { organizationId_userId: { organizationId: organization.id, userId: platform.id } }, update: { role: MemberRole.PLATFORM_ADMIN }, create: { organizationId: organization.id, userId: platform.id, role: MemberRole.PLATFORM_ADMIN } });
      const basic = await prisma.plan.findUniqueOrThrow({ where: { slug: "business-care" } });
      const subscription = await prisma.subscription.findFirst({ where: { organizationId: organization.id, status: "ACTIVE" } });
      if (!subscription) await prisma.subscription.create({ data: { organizationId: organization.id, planId: basic.id, startsAt: new Date(), expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) } });
    }
  }
  console.info("Seed 完成：2 个演示账号、10 家企业、20 个项目、4 个套餐。");
}

main().catch((error) => { console.error("Seed 执行失败", error); process.exitCode = 1; }).finally(async () => prisma.$disconnect());

