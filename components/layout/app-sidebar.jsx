"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Boxes, ShoppingCart, Brain, Truck, LogOut, Settings, Package, Warehouse, RefreshCw, MapPin, Users } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const getNavItems = (role) => {
  const baseItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ]

  if (role === 'superadmin') {
    return [
      ...baseItems,
      { name: "Users", href: "/dashboard/users", icon: Users },
      { name: "Warehouses", href: "/dashboard/warehouses", icon: Warehouse },
      { name: "Products", href: "/dashboard/products", icon: Package },
      { name: "Inventory", href: "/dashboard/inventory", icon: Boxes },
      { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
      { name: "ML Insights", href: "/dashboard/ml", icon: Brain },
      { name: "Reorder", href: "/dashboard/reorder", icon: RefreshCw },
    ]
  }

  if (role === 'manager') {
    return [
      ...baseItems,
      { name: "Inventory", href: "/dashboard/inventory", icon: Boxes },
      { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
      { name: "ML Insights", href: "/dashboard/ml", icon: Brain },
      { name: "Reorder", href: "/dashboard/reorder", icon: RefreshCw },
    ]
  }

  if (role === 'delivery') {
    return [
      ...baseItems,
      { name: "Deliveries", href: "/dashboard/deliveries", icon: Truck },
    ]
  }

  return baseItems
}

export function AppSidebar({ ...props }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  
  const navItems = getNavItems(user?.role)

  const getInitials = (email) => {
      const userEmail = user?.email || user?.sub || email || "US";
      return userEmail.substring(0, 2).toUpperCase();
  }

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'superadmin': return 'Super Admin'
      case 'manager': return 'Manager'
      case 'delivery': return 'Delivery Agent'
      default: return 'User'
    }
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Truck className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Smart Logistics</span>
                <span className="truncate text-xs">Enterprise</span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.href}
                  tooltip={item.name}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.name}</span>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/avatar.png" alt={user?.sub || "User"} />
                    <AvatarFallback className="rounded-lg bg-slate-200">
                        {getInitials(user?.sub)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                        {user?.email || user?.sub || "user@logistics.com"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                        {getRoleDisplayName(user?.role)}
                    </span>
                  </div>
                  <Settings className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}