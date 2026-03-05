"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"
import {
  LayoutDashboard,
  ArrowLeftRight,
  Calendar,
  BrainCircuit,
  UserCircle,
  Settings,
  Users,
  UserPlus,
  PlaneLanding,
  Star,
  MessageSquare,
  GraduationCap,
  Briefcase
} from "lucide-react"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const mainNav = [
    { href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" />, label: "Dashboard" },
    { href: "/transactions", icon: <ArrowLeftRight className="h-4 w-4" />, label: "Transactions" },
    { href: "/schedule", icon: <Calendar className="h-4 w-4" />, label: "Schedule" },
    { href: "/predictive-insights", icon: <BrainCircuit className="h-4 w-4" />, label: "Insights" },
  ]

  const hrNav = [
    { href: "/hr/dashboard", icon: <Briefcase className="h-4 w-4" />, label: "HR Dashboard" },
    { href: "/hr/employees", icon: <Users className="h-4 w-4" />, label: "Directory" },
    { href: "/hr/induction", icon: <UserPlus className="h-4 w-4" />, label: "Induction" },
    { href: "/hr/leave", icon: <PlaneLanding className="h-4 w-4" />, label: "Leave Requests" },
    { href: "/hr/performance", icon: <Star className="h-4 w-4" />, label: "Performance" },
    { href: "/hr/queries", icon: <MessageSquare className="h-4 w-4" />, label: "Helpdesk" },
    { href: "/hr/training", icon: <GraduationCap className="h-4 w-4" />, label: "Training" },
  ]

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Logo className="text-primary h-6 w-6" />
              <span className="font-headline text-lg font-bold tracking-tight">BizHub</span>
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>General</SidebarGroupLabel>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>HR Management</SidebarGroupLabel>
            <SidebarMenu>
              {hrNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Settings">
                <Link href="#">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Profile">
                <Link href="#">
                  <UserCircle className="h-4 w-4" />
                  <span>Jane Doe</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}