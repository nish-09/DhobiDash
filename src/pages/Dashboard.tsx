import { useState } from "react";
import { Button } from "@/components/ui/button";
import ServiceSelection from "@/components/ServiceSelection";
import OrderTracking from "@/components/OrderTracking";

interface Order {
  orderId: string;
  service: any;
  status: "pending" | "picked" | "in-laundry" | "ready" | "delivered";
  garmentCount: number;
  total: number;
  address: string;
}

export default function Dashboard() {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [view, setView] = useState<'selection' | 'tracking'>('selection');

  const handleOrderCreated = (orderData: any) => {
    setCurrentOrder(orderData);
    setView('tracking');
  };

  const handleBackToSelection = () => {
    setCurrentOrder(null);
    setView('selection');
  };

  return (
    <div className="min-h-screen bg-gradient-clean">
      {view === 'selection' && (
        <ServiceSelection onNext={handleOrderCreated} />
      )}
      {view === 'tracking' && currentOrder && (
        <OrderTracking order={currentOrder} onBack={handleBackToSelection} />
      )}
    </div>
  );
}