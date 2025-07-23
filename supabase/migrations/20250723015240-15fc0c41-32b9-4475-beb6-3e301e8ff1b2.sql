-- Create user profiles table with roles
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('customer', 'driver', 'admin')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create laundry hubs table
CREATE TABLE public.laundry_hubs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  phone TEXT,
  operating_hours TEXT DEFAULT '6:00 AM - 10:00 PM',
  services TEXT[] DEFAULT ARRAY['wash_fold', 'dry_cleaning', 'ironing'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.profiles(id),
  driver_id UUID REFERENCES public.profiles(id),
  hub_id UUID NOT NULL REFERENCES public.laundry_hubs(id),
  service_type TEXT NOT NULL CHECK (service_type IN ('wash_fold', 'dry_cleaning', 'ironing')),
  garment_count INTEGER NOT NULL DEFAULT 1,
  pickup_address TEXT NOT NULL,
  delivery_address TEXT,
  special_instructions TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'assigned', 'picked', 'in_laundry', 'ready', 'out_for_delivery', 'delivered', 'cancelled')),
  total_amount DECIMAL(10,2),
  pickup_time TIMESTAMP WITH TIME ZONE,
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  admin_approved_at TIMESTAMP WITH TIME ZONE,
  admin_approved_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order tracking table for real-time location updates
CREATE TABLE public.order_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES public.profiles(id),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  status_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laundry_hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for laundry_hubs (public read access)
CREATE POLICY "Anyone can view laundry hubs" ON public.laundry_hubs FOR SELECT USING (true);
CREATE POLICY "Only admins can modify hubs" ON public.laundry_hubs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for orders
CREATE POLICY "Customers can view their own orders" ON public.orders FOR SELECT USING (
  customer_id = auth.uid() OR 
  driver_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Customers can create orders" ON public.orders FOR INSERT WITH CHECK (
  customer_id = auth.uid() AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'customer')
);

CREATE POLICY "Drivers and admins can update orders" ON public.orders FOR UPDATE USING (
  driver_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'driver'))
);

-- RLS Policies for order_tracking
CREATE POLICY "Users can view tracking for their orders" ON public.order_tracking FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders o 
    WHERE o.id = order_id AND (
      o.customer_id = auth.uid() OR 
      o.driver_id = auth.uid() OR 
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    )
  )
);

CREATE POLICY "Drivers can insert tracking updates" ON public.order_tracking FOR INSERT WITH CHECK (
  driver_id = auth.uid() AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'driver')
);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample laundry hubs
INSERT INTO public.laundry_hubs (name, address, latitude, longitude, phone) VALUES
('Dhobi Dash Central', '123 Main Street, Downtown', 40.7128, -74.0060, '+1-555-0101'),
('Dhobi Dash North', '456 North Avenue, Uptown', 40.7589, -73.9851, '+1-555-0102'),
('Dhobi Dash South', '789 South Boulevard, Midtown', 40.6892, -74.0445, '+1-555-0103'),
('Dhobi Dash East', '321 East Side Drive, East Village', 40.7282, -73.9942, '+1-555-0104'),
('Dhobi Dash West', '654 West End Road, West Side', 40.7549, -73.9840, '+1-555-0105');

-- Enable realtime for tables
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.order_tracking REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;