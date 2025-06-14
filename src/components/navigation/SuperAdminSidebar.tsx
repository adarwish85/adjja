
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
import { useSettings } from "@/hooks/useSettings";
import { useEffect, useState, useCallback } from "react";

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
  const { loadGeneralSettings } = useSettings();
  const [academyInfo, setAcademyInfo] = useState({
    academyName: "ADJJA",
    academyCode: "ADJJA",
    academyLogo: ""
  });

  const updateAcademyInfo = useCallback(() => {
    const settings = loadGeneralSettings();
    setAcademyInfo({
      academyName: settings.academyName,
      academyCode: settings.academyCode,
      academyLogo: settings.academyLogo
    });
  }, [loadGeneralSettings]);

  useEffect(() => {
    updateAcademyInfo();
  }, [updateAcademyInfo]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.includes('academy')) {
        updateAcademyInfo();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [updateAcademyInfo]);

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {academyInfo.academyLogo ? (
            <img 
              src={academyInfo.academyLogo} 
              alt="Academy Logo" 
              className="h-10 w-10 object-contain"
            />
          ) : (
            <div className="h-10 w-10 bg-bjj-gold rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-bjj-navy">{academyInfo.academyName}</h2>
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
