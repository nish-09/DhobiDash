import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shirt, Sparkles, Zap, Clock, MapPin } from "lucide-react";

interface Service {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  price: number;
  time: string;
  description: string;
}

const services: Service[] = [
  {
    id: "wash-fold",
    name: "Wash & Fold",
    icon: Shirt,
    price: 2.50,
    time: "24 hrs",
    description: "Professional wash, dry, and fold service"
  },
  {
    id: "dry-clean",
    name: "Dry Cleaning",
    icon: Sparkles,
    price: 8.00,
    time: "48 hrs",
    description: "Premium dry cleaning for delicate items"
  },
  {
    id: "ironing",
    name: "Ironing",
    icon: Zap,
    price: 3.50,
    time: "24 hrs",
    description: "Professional pressing and ironing"
  }
];

interface ServiceSelectionProps {
  onNext: (data: any) => void;
}

export default function ServiceSelection({ onNext }: ServiceSelectionProps) {
  const [selectedService, setSelectedService] = useState<string>("");
  const [garmentCount, setGarmentCount] = useState<number>(5);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [pickupTime, setPickupTime] = useState("now");

  const selectedServiceData = services.find(s => s.id === selectedService);
  const estimatedTotal = selectedServiceData ? selectedServiceData.price * garmentCount : 0;

  const handleSubmit = () => {
    if (!selectedService || !address) return;
    
    const orderData = {
      service: selectedServiceData,
      garmentCount,
      address,
      notes,
      pickupTime,
      total: estimatedTotal,
      orderId: `LD${Date.now()}`,
      status: "pending"
    };
    
    onNext(orderData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary">Select Your Service</h1>
        <p className="text-muted-foreground">Professional laundry in just 20 minutes pickup time</p>
      </div>

      {/* Service Selection */}
      <div className="grid md:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card
            key={service.id}
            className={`p-6 cursor-pointer transition-all hover:shadow-elegant ${
              selectedService === service.id 
                ? "border-primary bg-gradient-clean ring-2 ring-primary/20" 
                : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedService(service.id)}
          >
            <div className="text-center space-y-4">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                selectedService === service.id ? "bg-primary text-white" : "bg-secondary"
              }`}>
                <service.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-semibold">{service.name}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">${service.price}</span>
                <Badge variant="secondary" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {service.time}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedService && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Details */}
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-lg">Order Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="garments">Estimated Garments</Label>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setGarmentCount(Math.max(1, garmentCount - 1))}
                >
                  -
                </Button>
                <Input
                  id="garments"
                  type="number"
                  value={garmentCount}
                  onChange={(e) => setGarmentCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center"
                  min="1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setGarmentCount(garmentCount + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Pickup Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="address"
                  placeholder="Enter your pickup address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Special Instructions (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any special handling instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </Card>

          {/* Order Summary */}
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-lg">Order Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Service</span>
                <span>{selectedServiceData?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Garments</span>
                <span>{garmentCount} items</span>
              </div>
              <div className="flex justify-between">
                <span>Price per item</span>
                <span>${selectedServiceData?.price}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Estimated Total</span>
                  <span>${estimatedTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">20-minute pickup guarantee</span>
              </div>
              
              <Button
                variant="speed"
                size="lg"
                className="w-full"
                onClick={handleSubmit}
                disabled={!selectedService || !address}
              >
                Schedule Pickup Now
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}