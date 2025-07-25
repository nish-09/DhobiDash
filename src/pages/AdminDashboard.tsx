import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Check, X, Package, MapPin, User, Truck } from 'lucide-react';

interface Order {
  id: string;
  service_type: string;
  garment_count: number;
  pickup_address: string;
  status: string;
  total_amount: number;
  created_at: string;
  customer_id: string;
  driver_id: string | null;
  special_instructions?: string;
  profiles: {
    full_name: string;
    phone: string;
  };
  laundry_hubs: {
    name: string;
    address: string;
  };
  driver_profile?: {
    full_name: string;
    phone: string;
  };
}

interface Driver {
  id: string;
  full_name: string;
  phone: string;
  email: string;
}

export default function AdminDashboard() {
  const { profile, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    inProgress: 0,
    delivered: 0,
    revenue: 0
  });

  useEffect(() => {
    fetchOrders();
    fetchDrivers();
    
    // Set up real-time subscription for orders
    const subscription = supabase
      .channel('admin-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!orders_customer_id_fkey (
            full_name,
            phone
          ),
          laundry_hubs (
            name,
            address
          ),
          driver_profile:profiles!orders_driver_id_fkey (
            full_name,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setOrders(data || []);
      
      // Calculate stats
      const total = data?.length || 0;
      const pending = data?.filter(o => o.status === 'pending').length || 0;
      const approved = data?.filter(o => o.status === 'approved').length || 0;
      const inProgress = data?.filter(o => ['assigned', 'picked', 'in_laundry', 'ready', 'out_for_delivery'].includes(o.status)).length || 0;
      const delivered = data?.filter(o => o.status === 'delivered').length || 0;
      const revenue = data?.filter(o => o.status === 'delivered').reduce((sum, order) => sum + order.total_amount, 0) || 0;
      
      setStats({ total, pending, approved, inProgress, delivered, revenue });
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, phone, email')
        .eq('role', 'driver');

      if (error) throw error;
      setDrivers(data || []);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const approveOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'approved',
          admin_approved_at: new Date().toISOString(),
          admin_approved_by: profile?.id
        })
        .eq('id', orderId);

      if (error) throw error;
      
      toast.success('Order approved successfully!');
      fetchOrders();
    } catch (error) {
      console.error('Error approving order:', error);
      toast.error('Failed to approve order');
    }
  };

  const rejectOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);

      if (error) throw error;
      
      toast.success('Order rejected');
      fetchOrders();
    } catch (error) {
      console.error('Error rejecting order:', error);
      toast.error('Failed to reject order');
    }
  };

  const assignDriver = async (orderId: string, driverId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          driver_id: driverId,
          status: 'assigned'
        })
        .eq('id', orderId);

      if (error) throw error;
      
      toast.success('Driver assigned successfully!');
      fetchOrders();
    } catch (error) {
      console.error('Error assigning driver:', error);
      toast.error('Failed to assign driver');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'approved':
        return 'bg-blue-500';
      case 'assigned':
        return 'bg-purple-500';
      case 'picked':
        return 'bg-indigo-500';
      case 'in_laundry':
        return 'bg-orange-500';
      case 'ready':
        return 'bg-green-500';
      case 'out_for_delivery':
        return 'bg-teal-500';
      case 'delivered':
        return 'bg-gray-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-clean flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const approvedOrders = orders.filter(o => o.status === 'approved');
  const activeOrders = orders.filter(o => ['assigned', 'picked', 'in_laundry', 'ready', 'out_for_delivery'].includes(o.status));

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {profile?.full_name}</p>
          </div>
          {/* Remove any sign out button or sign out logic from this file. */}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.delivered}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.revenue}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different order statuses */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">Pending Approval ({pendingOrders.length})</TabsTrigger>
            <TabsTrigger value="approved">Ready for Assignment ({approvedOrders.length})</TabsTrigger>
            <TabsTrigger value="active">Active Orders ({activeOrders.length})</TabsTrigger>
            <TabsTrigger value="all">All Orders ({orders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="grid gap-4">
              {pendingOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {formatStatus(order.service_type)}
                        </CardTitle>
                        <CardDescription>
                          Customer: {order.profiles.full_name}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => rejectOrder(order.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => approveOrder(order.id)}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4" />
                      <span>{order.garment_count} items</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{order.pickup_address}</span>
                    </div>
                    {order.special_instructions && (
                      <div className="text-sm bg-muted p-2 rounded">
                        <strong>Special instructions:</strong> {order.special_instructions}
                      </div>
                    )}
                    <div className="pt-2 border-t">
                      <span className="font-semibold">₹{order.total_amount}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {pendingOrders.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No pending orders</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="approved">
            <div className="grid gap-4">
              {approvedOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {formatStatus(order.service_type)}
                        </CardTitle>
                        <CardDescription>
                          Customer: {order.profiles.full_name}
                        </CardDescription>
                      </div>
                      <Badge className="bg-blue-500 text-white">
                        Approved
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4" />
                      <span>{order.garment_count} items</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{order.pickup_address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      <Select onValueChange={(driverId) => assignDriver(order.id, driverId)}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Assign Driver" />
                        </SelectTrigger>
                        <SelectContent>
                          {drivers.map((driver) => (
                            <SelectItem key={driver.id} value={driver.id}>
                              {driver.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="pt-2 border-t">
                      <span className="font-semibold">₹{order.total_amount}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {approvedOrders.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No approved orders waiting for assignment</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="active">
            <div className="grid gap-4">
              {activeOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {formatStatus(order.service_type)}
                        </CardTitle>
                        <CardDescription>
                          Customer: {order.profiles.full_name}
                        </CardDescription>
                      </div>
                      <Badge className={`text-white ${getStatusColor(order.status)}`}>
                        {formatStatus(order.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4" />
                      <span>{order.garment_count} items</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{order.pickup_address}</span>
                    </div>
                    {order.driver_profile && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4" />
                        <span>Driver: {order.driver_profile.full_name}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t">
                      <span className="font-semibold">₹{order.total_amount}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {activeOrders.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No active orders</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="all">
            <div className="grid gap-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {formatStatus(order.service_type)}
                        </CardTitle>
                        <CardDescription>
                          Customer: {order.profiles.full_name} • {new Date(order.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge className={`text-white ${getStatusColor(order.status)}`}>
                        {formatStatus(order.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4" />
                      <span>{order.garment_count} items</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{order.pickup_address}</span>
                    </div>
                    {order.driver_profile && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4" />
                        <span>Driver: {order.driver_profile.full_name}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t">
                      <span className="font-semibold">₹{order.total_amount}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}