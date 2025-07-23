import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MapPin, Clock, IndianRupee } from 'lucide-react';

interface LaundryHub {
  id: string;
  name: string;
  address: string;
  phone: string;
  operating_hours: string;
  services: string[];
}

interface CreateOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderCreated: () => void;
}

const serviceTypes = {
  wash_fold: { name: 'Wash & Fold', price: 50, time: '24 hours' },
  dry_cleaning: { name: 'Dry Cleaning', price: 120, time: '48 hours' },
  ironing: { name: 'Ironing Only', price: 30, time: '12 hours' }
};

export default function CreateOrderDialog({ open, onOpenChange, onOrderCreated }: CreateOrderDialogProps) {
  const { profile } = useAuth();
  const [hubs, setHubs] = useState<LaundryHub[]>([]);
  const [selectedHub, setSelectedHub] = useState<string>('');
  const [serviceType, setServiceType] = useState<string>('');
  const [garmentCount, setGarmentCount] = useState<number>(1);
  const [pickupAddress, setPickupAddress] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchHubs();
    }
  }, [open]);

  const fetchHubs = async () => {
    try {
      const { data, error } = await supabase
        .from('laundry_hubs')
        .select('*')
        .order('name');

      if (error) throw error;
      setHubs(data || []);
    } catch (error) {
      console.error('Error fetching hubs:', error);
      toast.error('Failed to load laundry hubs');
    }
  };

  const calculateTotal = () => {
    if (!serviceType) return 0;
    const basePrice = serviceTypes[serviceType as keyof typeof serviceTypes]?.price || 0;
    return basePrice * garmentCount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;

    setLoading(true);
    try {
      const estimatedDelivery = new Date();
      estimatedDelivery.setHours(estimatedDelivery.getHours() + 24); // Default 24 hours

      const { error } = await supabase
        .from('orders')
        .insert({
          customer_id: profile.id,
          hub_id: selectedHub,
          service_type: serviceType,
          garment_count: garmentCount,
          pickup_address: pickupAddress,
          special_instructions: specialInstructions,
          total_amount: calculateTotal(),
          estimated_delivery: estimatedDelivery.toISOString(),
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Order created successfully!');
      onOrderCreated();
      onOpenChange(false);
      
      // Reset form
      setSelectedHub('');
      setServiceType('');
      setGarmentCount(1);
      setPickupAddress('');
      setSpecialInstructions('');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const selectedHubData = hubs.find(hub => hub.id === selectedHub);
  const selectedService = serviceType ? serviceTypes[serviceType as keyof typeof serviceTypes] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>
            Schedule your laundry pickup in just a few steps
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hub Selection */}
          <div className="space-y-3">
            <Label>Select Laundry Hub</Label>
            <div className="grid gap-3">
              {hubs.map((hub) => (
                <Card 
                  key={hub.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedHub === hub.id ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedHub(hub.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{hub.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{hub.address}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{hub.operating_hours}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {hub.services.map((service) => (
                          <span 
                            key={service}
                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                          >
                            {serviceTypes[service as keyof typeof serviceTypes]?.name || service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Service Type */}
          <div className="space-y-2">
            <Label htmlFor="service-type">Service Type</Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                {selectedHubData?.services.map((service) => {
                  const serviceInfo = serviceTypes[service as keyof typeof serviceTypes];
                  return (
                    <SelectItem key={service} value={service}>
                      <div className="flex justify-between items-center w-full">
                        <span>{serviceInfo?.name}</span>
                        <span className="ml-4 text-muted-foreground">
                          ₹{serviceInfo?.price} • {serviceInfo?.time}
                        </span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Garment Count */}
          <div className="space-y-2">
            <Label htmlFor="garment-count">Number of Garments</Label>
            <Input
              id="garment-count"
              type="number"
              min="1"
              value={garmentCount}
              onChange={(e) => setGarmentCount(parseInt(e.target.value) || 1)}
              required
            />
          </div>

          {/* Pickup Address */}
          <div className="space-y-2">
            <Label htmlFor="pickup-address">Pickup Address</Label>
            <Textarea
              id="pickup-address"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              placeholder="Enter your complete pickup address..."
              required
            />
          </div>

          {/* Special Instructions */}
          <div className="space-y-2">
            <Label htmlFor="special-instructions">Special Instructions (Optional)</Label>
            <Textarea
              id="special-instructions"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any special care instructions or notes..."
            />
          </div>

          {/* Order Summary */}
          {selectedService && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span>{selectedService.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Garments:</span>
                  <span>{garmentCount} items</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per item:</span>
                  <span>₹{selectedService.price}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span className="flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    {calculateTotal()}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !selectedHub || !serviceType || !pickupAddress}
              className="flex-1"
            >
              {loading ? 'Creating Order...' : 'Create Order'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}