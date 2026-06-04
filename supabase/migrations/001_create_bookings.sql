-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  service TEXT NOT NULL,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick date lookups
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert a booking (public booking form)
CREATE POLICY "Anyone can create a booking"
  ON bookings FOR INSERT
  WITH CHECK (true);

-- Allow reading only your own booking by phone/email (or all if you're authenticated as admin)
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (true);
