import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CreditCard,
  Ticket,
  BarChart3,
  Settings,
  Sparkles,
} from "lucide-react";
import Logo from "@/components/common/Logo";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";

// Admin navigation
const adminNavigation = [
  { name: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { name: "Clients", to: "/dashboard/clients", icon: Users },
  { name: "Services", to: "/dashboard/services", icon: Briefcase },
  { name: "Tickets", to: "/dashboard/tickets", icon: Ticket },
  { name: "Analytics", to: "/dashboard/analytics", icon: BarChart3 },
  { name: "AI Assistant", to: "/dashboard/ai-assistant", icon: Sparkles },
  { name: "Settings", to: "/dashboard/settings", icon: Settings },
];

// Client/User navigation (limited access)
const clientNavigation = [
  { name: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { name: "Services", to: "/dashboard/services", icon: Briefcase },
  { name: "Subscriptions", to: "/dashboard/subscriptions", icon: CreditCard },
  { name: "My Tickets", to: "/dashboard/tickets", icon: Ticket },
  { name: "AI Assistant", to: "/dashboard/ai-assistant", icon: Sparkles },
  { name: "Settings", to: "/dashboard/settings", icon: Settings },
];

const Sidebar = () => {
  const user = useAppSelector((state) => state.auth.user);

  // Choose navigation based on user role
  const navigation =
    user?.role === "admin" ? adminNavigation : clientNavigation;

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-card border-r">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            end={item.to === "/dashboard"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User Role Badge */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-muted-foreground">
            ROLE
          </span>
          <span
            className={cn(
              "px-2 py-1 text-xs font-bold rounded",
              user?.role === "admin"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            )}
          >
            {user?.role?.toUpperCase() || "USER"}
          </span>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          © 2025 TechSphere
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
