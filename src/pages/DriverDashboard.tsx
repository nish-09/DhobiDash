import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MapPin, Package, Phone, Navigation } from 'lucide-react';

interface Order {
  id: string;
  service_type: string;
  garment_count: number;
  pickup_address: string;
  status: string;
  total_amount: number;
  created_at: string;
  customer_id: string;
  hub_id: string;
  special_instructions?: string;
  profiles: {
    full_name: string;
    phone: string;
  };
  laundry_hubs: {
    name: string;
    address: string;
    phone: string;
  };
}

export default function DriverDashboard() {
  const { profile, signOut } = useAuth();
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    
    // Set up real-time subscription for orders
    const subscription = supabase
      .channel('driver-orders')
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
  }, [profile?.id]);

  const fetchOrders = async () => {
    if (!profile?.id) return;
    
    try {
      // Fetch available orders (approved but not assigned)
      const { data: available, error: availableError } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!orders_customer_id_fkey (
            full_name,
            phone
          ),
          laundry_hubs (
            name,
            address,
            phone
          )
        `)
        .eq('status', 'approved')
        .is('driver_id', null);

      if (availableError) throw availableError;

      // Fetch my assigned orders
      const { data: assigned, error: assignedError } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!orders_customer_id_fkey (
            full_name,
            phone
          ),
          laundry_hubs (
            name,
            address,
            phone
          )
        `)
        .eq('driver_id', profile.id)
        .neq('status', 'delivered');

      if (assignedError) throw assignedError;

      setAvailableOrders(available || []);
      setMyOrders(assigned || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const acceptOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          driver_id: profile?.id,
          status: 'assigned'
        })
        .eq('id', orderId);

      if (error) throw error;
      
      toast.success('Order accepted successfully!');
      fetchOrders();
    } catch (error) {
      console.error('Error accepting order:', error);
      toast.error('Failed to accept order');
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      // Insert tracking update
      if (newStatus === 'picked') {
        await supabase
          .from('order_tracking')
          .insert({
            order_id: orderId,
            driver_id: profile?.id,
            latitude: 40.7128 + (Math.random() - 0.5) * 0.01,
            longitude: -74.0060 + (Math.random() - 0.5) * 0.01,
            status_message: 'Order picked up from customer'
          });
      }
      
      toast.success(`Order status updated to ${newStatus.replace('_', ' ')}`);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'assigned':
        return 'picked';
      case 'picked':
        return 'in_laundry';
      case 'in_laundry':
        return 'ready';
      case 'ready':
        return 'out_for_delivery';
      case 'out_for_delivery':
        return 'delivered';
      default:
        return currentStatus;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'bg-blue-500';
      case 'picked':
        return 'bg-purple-500';
      case 'in_laundry':
        return 'bg-orange-500';
      case 'ready':
        return 'bg-green-500';
      case 'out_for_delivery':
        return 'bg-yellow-500';
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

  return (
    <div className="min-h-screen bg-gradient-clean">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Driver Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {profile?.full_name}</p>
          </div>
          <Button variant="outline" onClick={signOut}>
            Sign Out
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Available Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableOrders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">My Active Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myOrders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{myOrders.filter(o => o.status === 'delivered').reduce((sum, order) => sum + (order.total_amount * 0.15), 0).toFixed(0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Available Orders */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Available Orders</h2>
            <div className="space-y-4">
              {availableOrders.map((order) => (
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
                        Ready to Accept
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
                    <div className="flex items-center gap-2 text-sm">
                      <Navigation className="w-4 h-4" />
                      <span>Drop at: {order.laundry_hubs.name}</span>
                    </div>
                    {order.special_instructions && (
                      <div className="text-sm bg-muted p-2 rounded">
                        <strong>Special instructions:</strong> {order.special_instructions}
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-semibold">₹{order.total_amount} (15% commission: ₹{(order.total_amount * 0.15).toFixed(0)})</span>
                      <Button onClick={() => acceptOrder(order.id)}>
                        Accept Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {availableOrders.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No available orders</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* My Orders */}
          <div>
            <h2 className="text-xl font-semibold mb-4">My Orders</h2>
            <div className="space-y-4">
              {myOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {formatStatus(order.service_type)}
                        </CardTitle>
                        <CardDescription>
                          {order.profiles.full_name}
                        </CardDescription>
                      </div>
                      <Badge className={`text-white ${getStatusColor(order.status)}`}>
                        {formatStatus(order.status)}
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
                    {order.profiles.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4" />
                        <span>{order.profiles.phone}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-semibold">₹{order.total_amount}</span>
                      {order.status !== 'delivered' && (
                        <Button 
                          onClick={() => updateOrderStatus(order.id, getNextStatus(order.status))}
                          size="sm"
                        >
                          Mark as {formatStatus(getNextStatus(order.status))}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {myOrders.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No assigned orders</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}