import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Calendar,
  DollarSign,
  Loader2,
  XCircle,
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { getUserPurchases, cancelPurchase } from "@/services/purchaseService";
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

const Subscriptions = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // Redirect admin users
  useEffect(() => {
    if (isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) {
      fetchPurchases();
    }
  }, [isAdmin]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await getUserPurchases();
      if (response.success) {
        setPurchases(response.data.purchases);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load subscriptions");
      console.error("Error fetching purchases:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (purchase) => {
    setSelectedPurchase(purchase);
    setCancelDialogOpen(true);
  };

  const confirmCancel = async () => {
    if (!selectedPurchase) return;

    try {
      setCancelling(true);
      const response = await cancelPurchase(selectedPurchase._id);

      if (response.success) {
        fetchPurchases(); // Refresh the list
        setCancelDialogOpen(false);
        setSelectedPurchase(null);
      }
    } catch (err) {
      console.error("Error cancelling subscription:", err);
      alert(err.response?.data?.message || "Failed to cancel subscription");
    } finally {
      setCancelling(false);
    }
  };

  // Don't render for admin
  if (isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  const activeSubscriptions = purchases.filter((p) => p.status === "Active");
  const totalMonthlySpend = activeSubscriptions.reduce(
    (sum, p) => sum + (p.billingCycle === "monthly" ? p.price : p.price / 12),
    0
  );

  const nextRenewal =
    activeSubscriptions.length > 0
      ? new Date(
          Math.min(
            ...activeSubscriptions.map((p) => new Date(p.nextBillingDate))
          )
        ).toLocaleDateString()
      : "N/A";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            My Subscriptions
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your service subscriptions
          </p>
        </div>
        <Button onClick={() => navigate("/dashboard/services")}>
          Browse Services
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscriptions
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeSubscriptions.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Your active services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalMonthlySpend.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Total monthly spend</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Renewal</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nextRenewal.split("/")[1]}/{nextRenewal.split("/")[0]}
            </div>
            <p className="text-xs text-muted-foreground">Upcoming billing</p>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Subscriptions</h2>

        {purchases.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground">
                You don't have any subscriptions yet.
              </p>
              <Button
                className="mt-4"
                onClick={() => navigate("/dashboard/services")}
              >
                Browse Services
              </Button>
            </CardContent>
          </Card>
        ) : (
          purchases.map((purchase) => (
            <Card key={purchase._id}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">
                        {purchase.serviceId?.name || "Service"}
                      </h3>
                      <Badge variant="secondary" className="capitalize">
                        {purchase.billingCycle}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {purchase.serviceId?.category || "General"}
                    </p>
                  </div>

                  <div className="flex flex-col md:items-end gap-2">
                    <div className="text-lg font-bold">
                      ${purchase.price}
                      <span className="text-sm text-muted-foreground font-normal">
                        /{purchase.billingCycle === "monthly" ? "mo" : "yr"}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Next billing:{" "}
                      {new Date(purchase.nextBillingDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        purchase.status === "Active"
                          ? "default"
                          : purchase.status === "Cancelled"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {purchase.status}
                    </Badge>
                    {purchase.status === "Active" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelClick(purchase)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your subscription to{" "}
              <strong>{selectedPurchase?.serviceId?.name}</strong>? You will
              lose access at the end of your current billing period.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancel}
              disabled={cancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelling ? "Cancelling..." : "Confirm Cancellation"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Subscriptions;
