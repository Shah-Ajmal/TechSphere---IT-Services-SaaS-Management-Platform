import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileMenu from "./MobileMenu";
import FloatingChatWidget from "@/components/chat/FloatingChatWidget";

const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Mobile Menu */}
      <MobileMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Navbar */}
        <Navbar onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
      <FloatingChatWidget />
    </div>
  );
};

export default DashboardLayout;
