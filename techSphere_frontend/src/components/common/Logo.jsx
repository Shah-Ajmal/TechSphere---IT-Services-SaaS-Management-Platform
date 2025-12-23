import { Cloud } from "lucide-react";

const Logo = ({ className = "", showText = true }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="bg-primary text-primary-foreground p-2 rounded-lg">
        <Cloud className="w-6 h-6" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-bold text-foreground">TechSphere</span>
          <span className="text-xs text-muted-foreground">
            Empowering Digital Operations
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
