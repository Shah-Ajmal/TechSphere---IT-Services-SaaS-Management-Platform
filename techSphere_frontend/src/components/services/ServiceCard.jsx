import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, ShoppingCart } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";

const ServiceCard = ({ service, onEdit, onDelete, onView, onPurchase }) => {
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === "admin";
  const Icon = service.icon;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon className="h-6 w-6 text-primary" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg">{service.name}</h3>
              <Badge variant="secondary" className="mt-1">
                {service.category}
              </Badge>
            </div>
          </div>
          <Badge
            variant={service.status === "Active" ? "default" : "secondary"}
          >
            {service.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {service.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold">${service.price}</span>
          <span className="text-sm text-muted-foreground">/month</span>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onView(service)}
        >
          <Eye className="mr-1 h-4 w-4" />
          View
        </Button>

        {isAdmin ? (
          // Admin actions
          <>
            <Button variant="outline" size="sm" onClick={() => onEdit(service)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(service)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        ) : (
          // User/Client action - Buy button
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onPurchase(service)}
          >
            <ShoppingCart className="mr-1 h-4 w-4" />
            Buy Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
