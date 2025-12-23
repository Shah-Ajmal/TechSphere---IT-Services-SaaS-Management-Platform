import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CreditCard,
  Ticket,
  BarChart3,
  Settings,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Logo from "@/components/common/Logo";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";

// Admin navigation
const adminNavigation = [
  { name: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { name: "Clients", to: "/dashboard/clients", icon: Users },
  { name: "Services", to: "/dashboard/services", icon: Briefcase },
  { name: "Subscriptions", to: "/dashboard/subscriptions", icon: CreditCard },
  { name: "Tickets", to: "/dashboard/tickets", icon: Ticket },
  { name: "Analytics", to: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", to: "/dashboard/settings", icon: Settings },
];

// Client/User navigation
const clientNavigation = [
  { name: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { name: "Services", to: "/dashboard/services", icon: Briefcase },
  { name: "My Tickets", to: "/dashboard/tickets", icon: Ticket },
  { name: "Settings", to: "/dashboard/settings", icon: Settings },
];

const MobileMenu = ({ open, onOpenChange }) => {
  const user = useAppSelector((state) => state.auth.user);

  // Choose navigation based on user role
  const navigation =
    user?.role === "admin" ? adminNavigation : clientNavigation;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <nav className="px-4 py-6 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.to === "/dashboard"}
              onClick={() => onOpenChange(false)}
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

        {/* Role Badge */}
        <div className="px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Role:</span>
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
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
