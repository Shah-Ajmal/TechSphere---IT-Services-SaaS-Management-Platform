import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  DollarSign,
  Calendar,
} from "lucide-react";
import { purchaseService } from "@/services/purchaseService";

const PurchaseServiceModal = ({ service, open, onOpenChange, onSuccess }) => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handlePurchase = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await purchaseService(service._id, billingCycle);

      if (response.success) {
        setMessage({
          type: "success",
          text: "Service purchased successfully!",
        });

        setTimeout(() => {
          onSuccess();
          onOpenChange(false);
          setMessage({ type: "", text: "" });
        }, 1500);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to purchase service",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!service) return null;

  const monthlyPrice = service.price;
  const yearlyPrice = (service.price * 12 * 0.8).toFixed(2); // 20% discount for yearly

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase Service</DialogTitle>
          <DialogDescription>Subscribe to {service.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {message.text && (
            <Alert
              variant={message.type === "error" ? "destructive" : "default"}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {/* Service Details */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <h3 className="font-semibold text-lg">{service.name}</h3>
            <p className="text-sm text-muted-foreground">
              {service.description}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-md">
                {service.category}
              </span>
            </div>
          </div>

          {/* Billing Cycle Selection */}
          <div className="space-y-3">
            <Label>Select Billing Cycle</Label>

            {/* Monthly Option */}
            <button
              onClick={() => setBillingCycle("monthly")}
              disabled={loading}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                billingCycle === "monthly"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">Monthly</div>
                  <div className="text-sm text-muted-foreground">
                    Billed every month
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">${monthlyPrice}</div>
                  <div className="text-xs text-muted-foreground">per month</div>
                </div>
              </div>
            </button>

            {/* Yearly Option */}
            <button
              onClick={() => setBillingCycle("yearly")}
              disabled={loading}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                billingCycle === "yearly"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Yearly</span>
                    <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded">
                      Save 20%
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Billed annually
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">${yearlyPrice}</div>
                  <div className="text-xs text-muted-foreground">per year</div>
                </div>
              </div>
            </button>
          </div>

          {/* Summary */}
          <div className="p-3 bg-muted rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service:</span>
              <span className="font-medium">{service.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Billing:</span>
              <span className="font-medium capitalize">{billingCycle}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-semibold">Total:</span>
              <span className="text-lg font-bold">
                ${billingCycle === "monthly" ? monthlyPrice : yearlyPrice}
                <span className="text-sm text-muted-foreground font-normal">
                  /{billingCycle === "monthly" ? "mo" : "yr"}
                </span>
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handlePurchase} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Purchase Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseServiceModal;
