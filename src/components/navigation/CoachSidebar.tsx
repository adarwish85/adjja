
import { Link, useLocation } from "react-router-dom";
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
  Home,
  BarChart3, 
  Users, 
  Calendar, 
  BookOpen, 
  GraduationCap,
  FileText,
  User,
  Shield,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/coach/dashboard" },
  { title: "Attendance", icon: BarChart3, url: "/coach/attendance" },
  { title: "LMS", icon: BookOpen, url: "/coach/lms" },
  { title: "My Progress", icon: GraduationCap, url: "/coach/progress" },
  { title: "Notes", icon: FileText, url: "/coach/notes" },
  { title: "Schedule", icon: Calendar, url: "/coach/schedule" },
  { title: "Profile", icon: User, url: "/coach/profile" },
  { title: "My Students", icon: Users, url: "/coach/students" }, // Coach-only module
];

export const CoachSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-bjj-gold rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-bjj-navy">ADJJA</h2>
            <p className="text-sm text-bjj-gray">Coach Portal</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-bjj-gray font-medium px-3 py-2">
            Navigation
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
