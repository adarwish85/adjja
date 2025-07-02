
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  BookOpen, 
  User, 
  CreditCard,
  FileText,
  TrendingUp,
  Users,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

const StudentSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarItems = [
    { name: "Dashboard", path: "/student", icon: Home },
    { name: "Schedule", path: "/student/schedule", icon: Calendar },
    { name: "LMS", path: "/student/lms", icon: BookOpen },
    { name: "Progress", path: "/student/progress", icon: TrendingUp },
    { name: "Attendance", path: "/student/attendance", icon: Users },
    { name: "Payments", path: "/student/payments", icon: CreditCard },
    { name: "Notes", path: "/student/notes", icon: FileText },
    { name: "Profile", path: "/student/profile", icon: User },
  ];

  return (
    <div className={`bg-bjj-navy text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} h-full flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-bjj-gold/20 flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-xl font-bold text-bjj-gold">ADJJA Student</h2>
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

export default StudentSidebar;
