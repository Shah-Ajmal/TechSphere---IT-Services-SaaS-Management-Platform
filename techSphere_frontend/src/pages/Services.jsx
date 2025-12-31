import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import ServiceCard from "@/components/services/ServiceCard";
import AddServiceModal from "@/components/services/AddServiceModal";
import EditServiceModal from "@/components/services/EditServiceModal";
import ViewServiceDialog from "@/components/services/ViewServiceDialog";
import PurchaseServiceModal from "@/components/services/PurchaseServiceModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getAllServices, deleteService } from "@/services/serviceService";
import { useAppSelector } from "@/redux/hooks";
import {
  Cloud,
  Shield,
  Database,
  Zap,
  Server,
  Lock,
  Activity,
  BarChart3,
} from "lucide-react";

// Icon mapping
const iconMap = {
  cloud: Cloud,
  shield: Shield,
  database: Database,
  zap: Zap,
  server: Server,
  lock: Lock,
  activity: Activity,
  chart: BarChart3,
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);

  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    // Filter services based on search
    if (search.trim() === "") {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(
        (service) =>
          service.name.toLowerCase().includes(search.toLowerCase()) ||
          service.description.toLowerCase().includes(search.toLowerCase()) ||
          service.category.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  }, [search, services]);

  const handlePurchase = (service) => {
    setSelectedService(service);
    setPurchaseModalOpen(true);
  };

  const handlePurchaseSuccess = () => {
    setPurchaseModalOpen(false);
    setSelectedService(null);
    // Optionally refresh services or show success message
    fetchServices();
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await getAllServices({ limit: 100 });

      if (response.success) {
        // Map services with icons
        const servicesWithIcons = response.data.services.map((service) => ({
          ...service,
          icon: iconMap[service.icon] || Server,
          status: service.activeStatus ? "Active" : "Inactive",
        }));
        setServices(servicesWithIcons);
        setFilteredServices(servicesWithIcons);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load services");
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = () => {
    fetchServices();
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    fetchServices();
    setSelectedService(null);
  };

  const handleDelete = (service) => {
    setSelectedService(service);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedService) return;

    try {
      setDeleting(true);
      const response = await deleteService(selectedService._id);

      if (response.success) {
        fetchServices();
        setDeleteDialogOpen(false);
        setSelectedService(null);
      }
    } catch (err) {
      console.error("Error deleting service:", err);
      alert(err.response?.data?.message || "Failed to delete service");
    } finally {
      setDeleting(false);
    }
  };

  const handleView = (service) => {
    setSelectedService(service);
    setViewDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Services</h1>
            <p className="text-muted-foreground mt-1">Loading services...</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Services</h1>
            <p className="text-destructive mt-1">{error}</p>
          </div>
          <Button onClick={fetchServices}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground mt-1">
            Browse and manage your IT services and SaaS offerings
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search services..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">
            {search
              ? "No services found matching your search"
              : "No services found"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              onPurchase={handlePurchase} // ADD THIS LINE
            />
          ))}
        </div>
      )}

      {/* Add Service Modal */}
      <AddServiceModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSuccess={handleAddSuccess}
      />

      {/* Edit Service Modal */}
      <EditServiceModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        service={selectedService}
        onSuccess={handleEditSuccess}
      />

      {/* View Service Dialog */}
      <ViewServiceDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        service={selectedService}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{selectedService?.name}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Purchase Service Modal - ADD THIS */}
      <PurchaseServiceModal
        open={purchaseModalOpen}
        onOpenChange={setPurchaseModalOpen}
        service={selectedService}
        onSuccess={handlePurchaseSuccess}
      />
    </div>
  );
};

export default Services;
