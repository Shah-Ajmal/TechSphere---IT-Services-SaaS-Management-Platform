import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const ViewServiceDialog = ({ open, onOpenChange, service }) => {
  if (!service) return null;

  const IconComponent = service.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <IconComponent className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{service.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Badge
                  variant={
                    service.status === "Active" ? "default" : "secondary"
                  }
                >
                  {service.status}
                </Badge>
                <span>•</span>
                <span>{service.category}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Price */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Price</p>
                  <p className="text-3xl font-bold text-primary mt-1">
                    ${service.price}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Billed Monthly
                  </p>
                  <p className="text-lg font-semibold mt-1">
                    ${service.price * 12}/year
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{service.description}</p>
          </div>

          <Separator />

          {/* Features */}
          {service.features && service.features.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Features</h3>
              <div className="grid gap-2">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <svg
                      className="h-5 w-5 text-primary mt-0.5 shrink-0"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium mt-1">{service.category}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge
                variant={service.status === "Active" ? "default" : "secondary"}
                className="mt-1"
              >
                {service.status}
              </Badge>
            </div>
            {service.createdAt && (
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium mt-1">
                  {new Date(service.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
            {service.updatedAt && (
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium mt-1">
                  {new Date(service.updatedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewServiceDialog;
