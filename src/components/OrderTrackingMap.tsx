import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Order {
  id: string;
  status: string;
  pickup_address: string;
  laundry_hubs: {
    name: string;
    address: string;
  };
}

interface OrderTrackingMapProps {
  orders: Order[];
}

const driverIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const hubIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function OrderTrackingMap({ orders }: OrderTrackingMapProps) {
  const [driverPosition, setDriverPosition] = useState({ lat: 40.7128, lng: -74.0060 });
  const [hubPosition] = useState({ lat: 40.7589, lng: -73.9851 });

  // Simulate driver movement
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverPosition(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (orders.length === 0) {
    return (
      <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No active orders to track</p>
      </div>
    );
  }

  const route = [
    [driverPosition.lat, driverPosition.lng],
    [hubPosition.lat, hubPosition.lng]
  ];

  return (
    <div className="h-64 rounded-lg overflow-hidden">
      <MapContainer
        center={[driverPosition.lat, driverPosition.lng]}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Driver Position */}
        <Marker position={[driverPosition.lat, driverPosition.lng]} icon={driverIcon}>
          <Popup>
            <div>
              <h3 className="font-semibold">Driver Location</h3>
              <p className="text-sm">Moving towards pickup location</p>
            </div>
          </Popup>
        </Marker>

        {/* Hub Position */}
        <Marker position={[hubPosition.lat, hubPosition.lng]} icon={hubIcon}>
          <Popup>
            <div>
              <h3 className="font-semibold">Laundry Hub</h3>
              <p className="text-sm">Processing your laundry</p>
            </div>
          </Popup>
        </Marker>

        {/* Route Line */}
        <Polyline
          positions={route as [number, number][]}
          color="blue"
          weight={3}
          opacity={0.7}
          dashArray="5, 10"
        />
      </MapContainer>
    </div>
  );
}