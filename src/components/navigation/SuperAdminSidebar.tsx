
import { Link, useLocation } from "react-router-dom";
import { 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  GraduationCap, 
  UserCheck, 
  CreditCard,
  Building2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

const SuperAdminSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarItems = [
    { name: "Dashboard", path: "/admin", icon: BarChart3 },
    { name: "Students", path: "/admin/students", icon: Users },
    { name: "Coaches", path: "/admin/coaches", icon: UserCheck },
    { name: "Classes", path: "/admin/classes", icon: Calendar },
    { name: "Branches", path: "/admin/branches", icon: Building2 },
    { name: "LMS", path: "/admin/lms", icon: GraduationCap },
    { name: "Payments", path: "/admin/payments", icon: CreditCard },
    { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
    { name: "Attendance", path: "/admin/attendance", icon: UserCheck },
    { name: "Approvals", path: "/admin/approvals", icon: UserCheck },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className={`bg-bjj-navy text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} h-full flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-bjj-gold/20 flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-xl font-bold text-bjj-gold">ADJJA Admin</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded hover:bg-bjj-gold/20 text-bjj-gold"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-bjj-gold text-bjj-navy' 
                  : 'text-white hover:bg-bjj-gold/20 hover:text-bjj-gold'
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon size={20} />
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-bjj-gold/20">
        {!isCollapsed && (
          <p className="text-sm text-bjj-gold/70 text-center">
            Ahmed Darwish Jiu-Jitsu Academy
          </p>
        )}
      </div>
    </div>
  );
};

export default SuperAdminSidebar;
