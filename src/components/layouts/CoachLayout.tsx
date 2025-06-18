
import { SidebarProvider } from "@/components/ui/sidebar";
import CoachSidebar from "@/components/navigation/CoachSidebar";
import { TopBar } from "@/components/navigation/TopBar";

interface CoachLayoutProps {
  children: React.ReactNode;
}

export const CoachLayout = ({ children }: CoachLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <CoachSidebar />
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
