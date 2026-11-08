"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireOrganizationAdmin } from "@/lib/auth/tenant";
import { projectSchema } from "@/lib/validations/project";

export async function createProjectAction(formData: FormData) {
  const tenant = await requireOrganizationAdmin();
  const parsed = projectSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect(`/projects/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "请检查表单")}`);
  const project = await prisma.$transaction(async (tx) => {
    const created = await tx.project.create({ data: { ...parsed.data, organizationId: tenant.organizationId } });
    await tx.auditLog.create({ data: { organizationId: tenant.organizationId, actorId: tenant.userId, action: "PROJECT_CREATED", entityType: "Project", entityId: created.id, metadata: { name: created.name } } });
    return created;
  });
  revalidatePath("/dashboard"); revalidatePath("/projects");
  redirect(`/projects?created=${encodeURIComponent(project.name)}`);
}
