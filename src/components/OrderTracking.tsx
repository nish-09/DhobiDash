import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import StatusBadge from "./StatusBadge";
import Timer from "./Timer";
import { ArrowLeft, Phone, MessageSquare, MapPin } from "lucide-react";

interface Order {
  orderId: string;
  service: any;
  status: "pending" | "picked" | "in-laundry" | "ready" | "delivered";
  garmentCount: number;
  total: number;
  address: string;
  estimatedDelivery?: string;
}

interface OrderTrackingProps {
  order: Order;
  onBack: () => void;
}

const statusSteps = [
  { key: "pending", label: "Pickup Scheduled" },
  { key: "picked", label: "Items Picked Up" },
  { key: "in-laundry", label: "Processing" },
  { key: "ready", label: "Ready for Delivery" },
  { key: "delivered", label: "Delivered" },
];

export default function OrderTracking({ order, onBack }: OrderTrackingProps) {
  const [currentOrder, setCurrentOrder] = useState(order);

  useEffect(() => {
    const statusProgression = ["pending", "picked", "in-laundry", "ready", "delivered"];
    const currentIndex = statusProgression.indexOf(currentOrder.status);
    
    if (currentIndex < statusProgression.length - 1) {
      const timer = setTimeout(() => {
        setCurrentOrder(prev => ({
          ...prev,
          status: statusProgression[currentIndex + 1] as any
        }));
      }, currentOrder.status === "pending" ? 5000 : 15000);
      
      return () => clearTimeout(timer);
    }
  }, [currentOrder.status]);

  const currentStepIndex = statusSteps.findIndex(step => step.key === currentOrder.status);
  const progressPercentage = ((currentStepIndex + 1) / statusSteps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Order #{currentOrder.orderId}</h1>
          <p className="text-muted-foreground">Track your laundry order</p>
        </div>
      </div>

      {/* Timer - only show when pending */}
      {currentOrder.status === "pending" && (
        <Timer 
          targetMinutes={20} 
          onComplete={() => setCurrentOrder(prev => ({ ...prev, status: "picked" }))}
        />
      )}

      {/* Status Progress */}
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Order Status</h2>
            <StatusBadge status={currentOrder.status} size="lg" />
          </div>

          <Progress value={progressPercentage} className="h-3" />

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {statusSteps.map((step, index) => (
              <div 
                key={step.key}
                className={`text-center space-y-2 ${
                  index <= currentStepIndex ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div 
                  className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-sm font-bold ${
                    index <= currentStepIndex 
                      ? "bg-primary text-white" 
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </div>
                <p className="text-xs font-medium">{step.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Order Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Order Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service</span>
              <span>{currentOrder.service?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Items</span>
              <span>{currentOrder.garmentCount} garments</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="font-semibold">${currentOrder.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Address</span>
              <span className="text-right text-sm flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {currentOrder.address}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Need Help?</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Phone className="w-4 h-4 mr-3" />
              Call Driver
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="w-4 h-4 mr-3" />
              Chat Support
            </Button>
            <div className="text-sm text-muted-foreground mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="font-medium mb-1">Estimated Delivery</p>
              <p>{currentOrder.service?.time} from pickup</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}