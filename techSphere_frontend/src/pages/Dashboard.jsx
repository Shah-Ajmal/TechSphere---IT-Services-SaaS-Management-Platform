import { useAppSelector } from "@/redux/hooks";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import ClientDashboard from "@/components/dashboard/ClientDashboard";

const Dashboard = () => {
  const user = useAppSelector((state) => state.auth.user);

  // Render different dashboard based on user role
  if (user?.role === "admin") {
    return <AdminDashboard />;
  }

  // Client or regular user dashboard
  return <ClientDashboard />;
};

export default Dashboard;
