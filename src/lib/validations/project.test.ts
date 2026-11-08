import { describe, expect, it } from "vitest";
import { projectSchema } from "./project";

describe("projectSchema", () => {
  it("accepts a valid corporate website", () => {
    const result = projectSchema.safeParse({ name: "华远机械官网", type: "CORPORATE_WEBSITE", websiteUrl: "https://www.huayuan.cn", launchDate: "2026-08-11" });
    expect(result.success).toBe(true);
  });

  it("rejects malformed URLs", () => {
    const result = projectSchema.safeParse({ name: "华远机械官网", type: "CORPORATE_WEBSITE", websiteUrl: "not-a-url" });
    expect(result.success).toBe(false);
  });

  it("normalizes optional blank fields", () => {
    const result = projectSchema.parse({ name: "客户服务小程序", type: "WECHAT_MINI_PROGRAM", websiteUrl: "", ownerName: "" });
    expect(result.websiteUrl).toBeUndefined();
    expect(result.ownerName).toBeUndefined();
  });
});
