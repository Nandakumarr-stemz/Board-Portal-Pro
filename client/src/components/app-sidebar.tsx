import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  CheckSquare,
  Settings,
} from "lucide-react";
import stemzLogo from "@assets/logo_1770274677960.jpg";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Meetings", url: "/meetings", icon: Calendar },
  { title: "Documents", url: "/documents", icon: FileText },
  { title: "Board Members", url: "/members", icon: Users },
  { title: "Action Items", url: "/action-items", icon: CheckSquare },
];

const settingsNavItems = [
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = (url: string) => {
    navigate(url);
  };

  return (
    <Sidebar>
      {/* ✅ Header */}
      <SidebarHeader className="p-4">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => handleNav("/")}
          data-testid="link-home"
        >
          <img
            src={stemzLogo}
            alt="Stemz Logo"
            className="h-16 w-auto object-contain"
          />
          <div className="flex flex-col">
            <span className="text-base font-semibold text-sidebar-foreground">
              BoardSync
            </span>
            <span className="text-xs text-sidebar-foreground/70">
              Board Portal
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* ✅ Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => handleNav(item.url)}
                    isActive={location.pathname === item.url}
                    data-testid={`nav-${item.title
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ✅ Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => handleNav(item.url)}
                    isActive={location.pathname === item.url}
                    data-testid={`nav-${item.title.toLowerCase()}`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ✅ Footer */}
      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground">
          Stemz BoardSync v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
