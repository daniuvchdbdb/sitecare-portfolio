import { ProjectType } from "@prisma/client";
import { z } from "zod";
const optionalText = (max: number) => z.string().trim().max(max).optional().transform((value) => value || undefined);
export const projectSchema = z.object({
  name: z.string().trim().min(2, "项目名称至少需要 2 个字符").max(100),
  type: z.enum(ProjectType),
  websiteUrl: z.string().trim().optional().transform((value) => value || undefined).pipe(z.url("请输入有效网址").optional()),
  ownerName: optionalText(50),
  contactInfo: optionalText(100),
  serverNotes: optionalText(500),
  techStack: optionalText(200),
  launchDate: z.string().optional().transform((value) => value ? new Date(value) : undefined),
  notes: optionalText(1000),
});
