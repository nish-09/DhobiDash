import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Plus, MapPin, Clock, Package } from 'lucide-react';
import CreateOrderDialog from '@/components/CreateOrderDialog';
import OrderTrackingMap from '@/components/OrderTrackingMap';

interface Order {
  id: string;
  service_type: string;
  garment_count: number;
  pickup_address: string;
  status: string;
  total_amount: number;
  created_at: string;
  estimated_delivery: string;
  hub_id: string;
  laundry_hubs: {
    name: string;
    address: string;
  };
}

export default function CustomerDashboard() {
  const { profile, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateOrder, setShowCreateOrder] = useState(false);

  useEffect(() => {
    fetchOrders();
    
    // Set up real-time subscription for orders
    const subscription = supabase
      .channel('customer-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `customer_id=eq.${profile?.id}`
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
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          laundry_hubs (
            name,
            address
          ),
          driver_profile:profiles!driver_id (
            full_name
          )
        `)
        .eq('customer_id', profile.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'approved':
        return 'bg-blue-500';
      case 'picked':
        return 'bg-purple-500';
      case 'in_laundry':
        return 'bg-orange-500';
      case 'ready':
        return 'bg-green-500';
      case 'delivered':
        return 'bg-gray-500';
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
    <div className="min-h-screen">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Welcome, {profile?.full_name}</h1>
            <p className="text-muted-foreground">Manage your laundry orders</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => setShowCreateOrder(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              New Order
            </Button>
          </div>
        </div>

        {/* Active Orders */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold mb-4">Active Orders</h2>
            <div className="space-y-4">
              {orders.filter(order => order.status !== 'delivered').map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {formatStatus(order.service_type)}
                        </CardTitle>
                        <CardDescription>
                          {order.laundry_hubs.name}
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
                    {order.estimated_delivery && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>Est. delivery: {new Date(order.estimated_delivery).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t flex flex-col gap-1">
                      <span className="font-semibold">₹{order.total_amount}</span>
                      {order.driver_profile?.full_name && (
                        <span className="text-xs text-muted-foreground">Driver: {order.driver_profile.full_name}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {orders.filter(order => order.status !== 'delivered').length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No active orders</p>
                    <Button 
                      onClick={() => setShowCreateOrder(true)} 
                      className="mt-4 gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create Your First Order
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Order Tracking Map */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Live Tracking</h2>
            <Card>
              <CardContent className="p-0">
                <OrderTrackingMap orders={orders.filter(order => ['picked', 'in_laundry', 'ready', 'out_for_delivery'].includes(order.status))} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Order History */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Order History</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {orders.filter(order => order.status === 'delivered').map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {formatStatus(order.service_type)}
                  </CardTitle>
                  <CardDescription>
                    {new Date(order.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span>{order.garment_count} items</span>
                    <span className="font-semibold">₹{order.total_amount}</span>
                  </div>
                  <Badge className="mt-2 bg-green-500 text-white">
                    Delivered
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <CreateOrderDialog 
        open={showCreateOrder}
        onOpenChange={setShowCreateOrder}
        onOrderCreated={fetchOrders}
      />
    </div>
  );
}