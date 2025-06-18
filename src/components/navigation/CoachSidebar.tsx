import { Home, Users, Calendar, ClipboardList, BookOpen, User, Settings, Smartphone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const CoachSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { href: "/coach/dashboard", icon: Home, label: "Dashboard" },
    { href: "/coach/students", icon: Users, label: "My Students" },
    { href: "/coach/attendance", icon: Calendar, label: "Attendance" },
    { href: "/coach/attendance-tracker", icon: Smartphone, label: "Mobile Tracker" },
    { href: "/coach/schedule", icon: ClipboardList, label: "Schedule" },
    { href: "/coach/lms", icon: BookOpen, label: "LMS" },
    { href: "/coach/notes", icon: ClipboardList, label: "Notes" },
    { href: "/coach/progress", icon: Calendar, label: "Progress" },
    { href: "/coach/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="w-64 bg-bjj-navy text-white min-h-screen p-4">
      <div className="mb-8">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">Ahmed Darwish Academy</span>
        </Link>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-bjj-gold text-bjj-navy font-medium"
                  : "text-white hover:bg-bjj-navy-light"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default CoachSidebar;
