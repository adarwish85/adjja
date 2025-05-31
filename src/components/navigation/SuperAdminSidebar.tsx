
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
import { 
  BarChart3, 
  Users, 
  GraduationCap, 
  Calendar, 
  Building, 
  BookOpen, 
  CreditCard,
  Settings,
  Shield
} from "lucide-react";
import { useLocation } from "react-router-dom";

const menuItems = [
  { title: "Dashboard", icon: BarChart3, url: "/admin/dashboard" },
  { title: "Coaches", icon: Users, url: "/admin/coaches" },
  { title: "Students", icon: GraduationCap, url: "/admin/students" },
  { title: "Classes", icon: Calendar, url: "/admin/classes" },
  { title: "Branches", icon: Building, url: "/admin/branches" },
  { title: "LMS", icon: BookOpen, url: "/admin/lms" },
  { title: "Payments", icon: CreditCard, url: "/admin/payments" },
  { title: "Analytics", icon: BarChart3, url: "/admin/analytics" },
  { title: "Settings", icon: Settings, url: "/admin/settings" },
];

export const SuperAdminSidebar = () => {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-bjj-gold rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-bjj-navy">ADJJA</h2>
            <p className="text-sm text-bjj-gray">Super Admin</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-bjj-gray font-medium px-3 py-2">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    className="w-full justify-start px-3 py-2 text-bjj-gray hover:bg-bjj-gold/10 hover:text-bjj-gold-dark data-[active=true]:bg-bjj-gold/20 data-[active=true]:text-bjj-gold-dark"
                  >
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
