import { Badge } from "@/components/ui/badge";
import { CheckCircle, Package, Truck, Clock } from "lucide-react";

interface StatusBadgeProps {
  status: "pending" | "picked" | "in-laundry" | "ready" | "delivered";
  size?: "sm" | "default" | "lg";
}

const statusConfig = {
  pending: {
    label: "Pending Pickup",
    icon: Clock,
    className: "bg-warning text-warning-foreground",
  },
  picked: {
    label: "Picked Up",
    icon: Truck,
    className: "bg-info text-info-foreground",
  },
  "in-laundry": {
    label: "In Laundry",
    icon: Package,
    className: "bg-primary text-primary-foreground",
  },
  ready: {
    label: "Ready",
    icon: CheckCircle,
    className: "bg-accent text-accent-foreground",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    className: "bg-success text-white",
  },
};

export default function StatusBadge({ status, size = "default" }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge 
      variant="secondary" 
      className={`${config.className} transition-smooth ${
        size === "sm" ? "text-xs px-2 py-1" : 
        size === "lg" ? "text-base px-4 py-2" : "text-sm px-3 py-1"
      }`}
    >
      <Icon className={`${size === "lg" ? "w-5 h-5" : "w-4 h-4"} mr-1`} />
      {config.label}
    </Badge>
  );
}