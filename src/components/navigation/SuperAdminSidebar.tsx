
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  GraduationCap, 
  Calendar, 
  MapPin, 
  BookOpen, 
  CreditCard, 
  BarChart3, 
  Settings,
  Clock
} from "lucide-react";

const SuperAdminSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Clock, label: "Pending Approvals", href: "/admin/approvals" },
    { icon: UserCheck, label: "Coaches", href: "/admin/coaches" },
    { icon: Users, label: "Students", href: "/admin/students" },
    { icon: Calendar, label: "Classes", href: "/admin/classes" },
    { icon: MapPin, label: "Branches", href: "/admin/branches" },
    { icon: BookOpen, label: "LMS", href: "/admin/lms" },
    { icon: CreditCard, label: "Payments", href: "/admin/payments" },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ];

  return (
    <div className={cn(
      "bg-bjj-navy text-white transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-bjj-gold">ADJJA Admin</h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-bjj-navy-light"
          >
            <svg
              className={cn("w-4 h-4 transition-transform", isCollapsed && "rotate-180")}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      <nav className="mt-8">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-lg transition-colors",
                    isActive 
                      ? "bg-bjj-gold text-bjj-navy font-semibold" 
                      : "text-gray-300 hover:bg-bjj-navy-light hover:text-white"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="ml-3 truncate">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default SuperAdminSidebar;
