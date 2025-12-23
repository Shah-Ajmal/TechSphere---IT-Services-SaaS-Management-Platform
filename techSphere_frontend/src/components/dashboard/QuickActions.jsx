import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, UserPlus, Settings } from "lucide-react";

const QuickActions = () => {
  const actions = [
    { label: "Add Service", icon: Plus, variant: "default" },
    { label: "View Reports", icon: FileText, variant: "outline" },
    { label: "Add Client", icon: UserPlus, variant: "outline" },
    { label: "Settings", icon: Settings, variant: "outline" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              className="h-20 flex flex-col items-center justify-center gap-2"
            >
              <action.icon className="h-5 w-5" />
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
