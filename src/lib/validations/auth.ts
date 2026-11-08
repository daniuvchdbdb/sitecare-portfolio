import { z } from "zod";
export const loginSchema = z.object({
  email: z.email("请输入有效邮箱").trim().toLowerCase(),
  password: z.string().min(8, "密码至少需要 8 位").max(72, "密码不能超过 72 位"),
});
export const registerSchema = loginSchema.extend({
  name: z.string().trim().min(2, "姓名至少需要 2 个字符").max(40),
  organizationName: z.string().trim().min(2, "企业名称至少需要 2 个字符").max(100),
});
