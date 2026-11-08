import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppNavigation } from "@/components/layout/app-navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return <div className="min-h-screen lg:pl-64">
    <AppNavigation organizationName={session.user.organizationName ?? "尚未加入企业"} userName={session.user.name ?? session.user.email ?? "用户"} />
    <main className="mx-auto w-full max-w-[1480px] p-4 sm:p-6 lg:p-8">{children}</main>
  </div>;
}
