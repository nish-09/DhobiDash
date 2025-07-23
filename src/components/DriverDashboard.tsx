import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "./StatusBadge";
import { Navigation, Phone, CheckCircle, Package, MapPin, Clock } from "lucide-react";

interface DriverOrder {
  orderId: string;
  customerName: string;
  address: string;
  service: string;
  garmentCount: number;
  status: "pending" | "picked" | "in-laundry" | "ready" | "delivered";
  pickupTime: string;
  total: number;
}

const mockOrders: DriverOrder[] = [
  {
    orderId: "LD1234567890",
    customerName: "Sarah Johnson",
    address: "123 Main St, Apt 4B",
    service: "Wash & Fold",
    garmentCount: 8,
    status: "pending",
    pickupTime: "2:30 PM",
    total: 20.00
  },
  {
    orderId: "LD1234567891",
    customerName: "Mike Chen",
    address: "456 Oak Ave",
    service: "Dry Cleaning",
    garmentCount: 3,
    status: "picked",
    pickupTime: "1:45 PM",
    total: 24.00
  },
  {
    orderId: "LD1234567892",
    customerName: "Emma Davis",
    address: "789 Pine St, Unit 12",
    service: "Ironing",
    garmentCount: 5,
    status: "ready",
    pickupTime: "11:30 AM",
    total: 17.50
  }
];

export default function DriverDashboard() {
  const [orders, setOrders] = useState<DriverOrder[]>(mockOrders);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  const updateOrderStatus = (orderId: string, newStatus: DriverOrder['status']) => {
    setOrders(orders.map(order => 
      order.orderId === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getNextStatus = (currentStatus: DriverOrder['status']): DriverOrder['status'] => {
    const statusFlow: Record<DriverOrder['status'], DriverOrder['status']> = {
      'pending': 'picked',
      'picked': 'in-laundry',
      'in-laundry': 'ready',
      'ready': 'delivered',
      'delivered': 'delivered'
    };
    return statusFlow[currentStatus];
  };

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const activeOrders = orders.filter(order => ['picked', 'in-laundry', 'ready'].includes(order.status));
  const completedOrders = orders.filter(order => order.status === 'delivered');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary">Driver Dashboard</h1>
        <p className="text-muted-foreground">Manage pickups and deliveries</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-warning">{pendingOrders.length}</div>
          <div className="text-sm text-muted-foreground">Pending Pickups</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-info">{activeOrders.length}</div>
          <div className="text-sm text-muted-foreground">In Progress</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-success">{completedOrders.length}</div>
          <div className="text-sm text-muted-foreground">Completed Today</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">Today's Revenue</div>
        </Card>
      </div>

      {/* Pending Pickups */}
      {pendingOrders.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-accent" />
            Urgent Pickups
          </h2>
          <div className="grid gap-4">
            {pendingOrders.map((order) => (
              <Card key={order.orderId} className="p-6 border-l-4 border-l-accent">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold">{order.customerName}</h3>
                      <StatusBadge status={order.status} />
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {order.pickupTime}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      {order.address}
                    </div>
                    <div className="text-sm">
                      {order.service} • {order.garmentCount} items • ${order.total.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Navigation className="w-4 h-4 mr-2" />
                      Navigate
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button 
                      variant="speed" 
                      size="sm"
                      onClick={() => updateOrderStatus(order.orderId, getNextStatus(order.status))}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Picked Up
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Active Orders */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Package className="w-5 h-5 mr-2 text-primary" />
          Active Orders
        </h2>
        <div className="grid gap-4">
          {activeOrders.map((order) => (
            <Card key={order.orderId} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold">{order.customerName}</h3>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    {order.address}
                  </div>
                  <div className="text-sm">
                    {order.service} • {order.garmentCount} items • ${order.total.toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  {order.status !== 'delivered' && (
                    <Button 
                      variant="brand" 
                      size="sm"
                      onClick={() => updateOrderStatus(order.orderId, getNextStatus(order.status))}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {order.status === 'picked' && 'At Facility'}
                      {order.status === 'in-laundry' && 'Mark Ready'}
                      {order.status === 'ready' && 'Delivered'}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Completed Orders */}
      {completedOrders.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-success">Today's Completed Orders</h2>
          <div className="grid gap-2">
            {completedOrders.map((order) => (
              <Card key={order.orderId} className="p-4 bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="font-medium">{order.customerName}</span>
                    <span className="text-sm text-muted-foreground">• {order.service}</span>
                  </div>
                  <span className="font-semibold text-success">${order.total.toFixed(2)}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}