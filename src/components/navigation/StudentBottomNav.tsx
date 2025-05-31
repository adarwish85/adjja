
import { BarChart3, BookOpen, Calendar, GraduationCap, Home, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", href: "/student/dashboard" },
  { icon: BarChart3, label: "Attendance", href: "/student/attendance" },
  { icon: BookOpen, label: "LMS", href: "/student/lms" },
  { icon: GraduationCap, label: "Progress", href: "/student/progress" },
  { icon: User, label: "Profile", href: "/student/profile" },
];

export const StudentBottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className={cn(
              "flex flex-col items-center p-2 text-bjj-gray hover:text-bjj-gold transition-colors",
              "text-xs",
              location.pathname === item.href && "text-bjj-gold"
            )}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
