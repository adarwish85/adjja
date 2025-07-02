
import { SidebarProvider } from "@/components/ui/sidebar";
import StudentSidebar from "@/components/navigation/StudentSidebar";
import { StudentBottomNav } from "@/components/navigation/StudentBottomNav";
import { TopBar } from "@/components/navigation/TopBar";
import { useEffect, useState } from "react";

interface StudentLayoutProps {
  children: React.ReactNode;
}

export const StudentLayout = ({ children }: StudentLayoutProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <TopBar />
        <main className="flex-1 pb-20 overflow-auto">
          {children}
        </main>
        <StudentBottomNav />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <StudentSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
