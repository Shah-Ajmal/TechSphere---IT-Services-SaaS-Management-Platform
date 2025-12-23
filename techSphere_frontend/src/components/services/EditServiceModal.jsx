import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateService } from "@/services/serviceService";

const EditServiceModal = ({ open, onOpenChange, service, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Other",
    activeStatus: true,
    features: "",
    icon: "server",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Populate form when service changes
  useEffect(() => {
    if (service) {
      // Get the icon name from the service (handle both string and object cases)
      let iconName = "server";
      if (typeof service.icon === "string") {
        iconName = service.icon;
      } else if (service.icon && service.icon.name) {
        iconName = service.icon.name.toLowerCase();
      }

      setFormData({
        name: service.name || "",
        description: service.description || "",
        price: service.price?.toString() || "",
        category: service.category || "Other",
        activeStatus:
          service.activeStatus !== undefined ? service.activeStatus : true,
        features: service.features ? service.features.join(", ") : "",
        icon: iconName,
      });
    }
  }, [service]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Convert features from comma-separated string to array
      const featuresArray = formData.features
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const serviceData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price), // Ensure it's a number
        category: formData.category,
        activeStatus: formData.activeStatus,
        features: featuresArray,
        icon: formData.icon, // Send as string
      };

      console.log("Updating service with data:", serviceData); // Debug log

      const response = await updateService(service._id, serviceData);

      if (response.success) {
        onOpenChange(false);
        onSuccess();
      }
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "Failed to update service");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
          <DialogDescription>
            Update service details and settings
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Service Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-name">Service Name *</Label>
            <Input
              id="edit-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description *</Label>
            <textarea
              id="edit-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={loading}
              className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-price">Monthly Price ($) *</Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Category *</Label>
              <select
                id="edit-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Cloud Hosting">Cloud Hosting</option>
                <option value="Security">Security</option>
                <option value="Monitoring">Monitoring</option>
                <option value="Database">Database</option>
                <option value="Analytics">Analytics</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label htmlFor="edit-features">Features (comma-separated)</Label>
            <Input
              id="edit-features"
              name="features"
              value={formData.features}
              onChange={handleChange}
              disabled={loading}
              placeholder="99.9% Uptime, 24/7 Support, Auto Scaling"
            />
          </div>

          {/* Icon */}
          <div className="space-y-2">
            <Label htmlFor="edit-icon">Icon</Label>
            <select
              id="edit-icon"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              disabled={loading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="server">Server</option>
              <option value="cloud">Cloud</option>
              <option value="shield">Shield</option>
              <option value="database">Database</option>
              <option value="lock">Lock</option>
              <option value="zap">Zap</option>
              <option value="activity">Activity</option>
              <option value="chart">Chart</option>
            </select>
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="edit-activeStatus"
              name="activeStatus"
              checked={formData.activeStatus}
              onChange={handleChange}
              disabled={loading}
              className="rounded border-gray-300"
            />
            <Label htmlFor="edit-activeStatus" className="cursor-pointer">
              Service is active and available
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditServiceModal;
