import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatusBadge from "./StatusBadge";
import { 
  Users, 
  Package, 
  TrendingUp, 
  DollarSign, 
  Search,
  Filter,
  Download,
  RefreshCcw
} from "lucide-react";

interface AdminOrder {
  orderId: string;
  customerName: string;
  service: string;
  status: "pending" | "picked" | "in-laundry" | "ready" | "delivered";
  total: number;
  createdAt: string;
  estimatedCompletion: string;
}

const mockAdminOrders: AdminOrder[] = [
  {
    orderId: "LD1234567890",
    customerName: "Sarah Johnson",
    service: "Wash & Fold",
    status: "in-laundry",
    total: 20.00,
    createdAt: "2024-01-15 14:30",
    estimatedCompletion: "2024-01-16 14:30"
  },
  {
    orderId: "LD1234567891",
    customerName: "Mike Chen",
    service: "Dry Cleaning",
    status: "ready",
    total: 24.00,
    createdAt: "2024-01-15 13:45",
    estimatedCompletion: "2024-01-17 13:45"
  },
  {
    orderId: "LD1234567892",
    customerName: "Emma Davis",
    service: "Ironing",
    status: "delivered",
    total: 17.50,
    createdAt: "2024-01-15 11:30",
    estimatedCompletion: "2024-01-16 11:30"
  },
  {
    orderId: "LD1234567893",
    customerName: "John Smith",
    service: "Wash & Fold",
    status: "pending",
    total: 15.00,
    createdAt: "2024-01-15 16:15",
    estimatedCompletion: "2024-01-16 16:15"
  }
];

export default function AdminPanel() {
  const [orders, setOrders] = useState<AdminOrder[]>(mockAdminOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    activeOrders: orders.filter(o => ['picked', 'in-laundry'].includes(o.status)).length,
    completedOrders: orders.filter(o => o.status === 'delivered').length,
  };

  const updateOrderStatus = (orderId: string, newStatus: AdminOrder['status']) => {
    setOrders(orders.map(order => 
      order.orderId === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage all laundry operations</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="brand" size="sm">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.totalOrders}</div>
          <div className="text-sm text-muted-foreground flex items-center justify-center">
            <Package className="w-4 h-4 mr-1" />
            Total Orders
          </div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-success">${stats.totalRevenue.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground flex items-center justify-center">
            <DollarSign className="w-4 h-4 mr-1" />
            Revenue Today
          </div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-warning">{stats.pendingOrders}</div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-info">{stats.activeOrders}</div>
          <div className="text-sm text-muted-foreground">In Progress</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-success">{stats.completedOrders}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Orders Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders or customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="picked">Picked Up</option>
                  <option value="in-laundry">In Laundry</option>
                  <option value="ready">Ready</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Orders Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Order ID</th>
                    <th className="text-left p-4 font-semibold">Customer</th>
                    <th className="text-left p-4 font-semibold">Service</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Total</th>
                    <th className="text-left p-4 font-semibold">Created</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.orderId} className="border-b hover:bg-muted/20">
                      <td className="p-4 font-mono text-sm">{order.orderId}</td>
                      <td className="p-4 font-medium">{order.customerName}</td>
                      <td className="p-4">{order.service}</td>
                      <td className="p-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="p-4 font-semibold">${order.total.toFixed(2)}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-1">
                          {order.status !== 'delivered' && (
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.orderId, e.target.value as AdminOrder['status'])}
                              className="px-2 py-1 border rounded text-xs"
                            >
                              <option value="pending">Pending</option>
                              <option value="picked">Picked</option>
                              <option value="in-laundry">In Laundry</option>
                              <option value="ready">Ready</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-success" />
                Performance Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Average Completion Time</span>
                  <span className="font-semibold">18 minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Customer Satisfaction</span>
                  <span className="font-semibold">4.8/5.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>On-Time Pickups</span>
                  <span className="font-semibold">96%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Daily Order Volume</span>
                  <span className="font-semibold">127 orders</span>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary" />
                Service Breakdown
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Wash & Fold</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-muted rounded-full">
                      <div className="w-3/5 h-full bg-primary rounded-full"></div>
                    </div>
                    <span className="text-sm">60%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Dry Cleaning</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-muted rounded-full">
                      <div className="w-1/3 h-full bg-info rounded-full"></div>
                    </div>
                    <span className="text-sm">30%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Ironing</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-muted rounded-full">
                      <div className="w-1/12 h-full bg-accent rounded-full"></div>
                    </div>
                    <span className="text-sm">10%</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">System Settings</h3>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pickup Time Promise (minutes)</label>
                  <Input type="number" defaultValue="20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Base Service Fee</label>
                  <Input type="number" step="0.01" defaultValue="2.50" />
                </div>
              </div>
              <Button variant="brand">Save Settings</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}