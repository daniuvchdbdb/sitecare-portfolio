"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  useEffect(() => {
    const stored = localStorage.getItem("sitecare-theme");
    const useDark = stored === "dark" || (!stored && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", useDark);
  }, []);
  function toggle() { const next = !document.documentElement.classList.contains("dark"); document.documentElement.classList.toggle("dark", next); localStorage.setItem("sitecare-theme", next ? "dark" : "light"); }
  return <Button type="button" variant="ghost" size="icon" aria-label="切换主题" onClick={toggle}><Moon className="size-4 dark:hidden" /><Sun className="hidden size-4 dark:block" /></Button>;
}
