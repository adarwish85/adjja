
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { BarChart3, BookOpen, Calendar, GraduationCap, Home, FileText, User, Shield, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Dashboard",
    url: "/student/dashboard",
    icon: Home,
  },
  {
    title: "Attendance",
    url: "/student/attendance",
    icon: BarChart3,
  },
  {
    title: "LMS",
    url: "/student/lms",
    icon: BookOpen,
  },
  {
    title: "My Progress",
    url: "/student/progress",
    icon: GraduationCap,
  },
  {
    title: "Notes",
    url: "/student/notes",
    icon: FileText,
  },
  {
    title: "Schedule",
    url: "/student/schedule",
    icon: Calendar,
  },
  {
    title: "Profile",
    url: "/student/profile",
    icon: User,
  },
];

export const StudentSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-bjj-gold rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-bjj-navy">ADJJA</h2>
            <p className="text-sm text-bjj-gray">Student Portal</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url} className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Button
                  onClick={signOut}
                  variant="ghost"
                  className="w-full justify-start text-bjj-gray hover:text-bjj-gold"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
