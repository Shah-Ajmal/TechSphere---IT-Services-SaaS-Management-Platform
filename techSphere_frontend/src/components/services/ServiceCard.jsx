import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";

const ServiceCard = ({ service, onEdit, onDelete, onView }) => {
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === "admin";

  // Get the icon component
  const IconComponent = service.icon;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{service.name}</CardTitle>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={service.status === "Active" ? "default" : "secondary"}
            >
              {service.status}
            </Badge>
            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(service)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(service)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(service)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {service.description}
        </p>
        {service.features && service.features.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {service.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
            {service.features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{service.features.length - 3} more
              </Badge>
            )}
          </div>
        )}
        {service.price && (
          <p className="text-2xl font-bold mt-4">${service.price}/mo</p>
        )}
      </CardContent>
      <CardFooter className="gap-2">
        {isAdmin ? (
          <>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onEdit(service)}
            >
              Edit
            </Button>
            <Button className="flex-1" onClick={() => onView(service)}>
              View Details
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onView(service)}
            >
              View Details
            </Button>
            <Button className="flex-1">Subscribe</Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
