
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
import { BarChart3, BookOpen, Calendar, GraduationCap, Home, FileText, User, Shield } from "lucide-react";

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
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
