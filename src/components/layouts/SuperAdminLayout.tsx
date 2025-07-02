
import { SidebarProvider } from "@/components/ui/sidebar";
import SuperAdminSidebar from "@/components/navigation/SuperAdminSidebar";
import { TopBar } from "@/components/navigation/TopBar";

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

export const SuperAdminLayout = ({ children }: SuperAdminLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <SuperAdminSidebar />
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
