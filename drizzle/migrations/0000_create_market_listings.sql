CREATE TABLE public.market_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_type text NOT NULL CHECK (seller_type IN ('farmer','agent')),
  crop text NOT NULL,
  district text NOT NULL,
  quantity_kg integer NOT NULL CHECK (quantity_kg > 0),
  price_expected numeric NOT NULL CHECK (price_expected > 0),
  phone text NOT NULL,
  value_notes text,
  service_tags text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'active',
  posted_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.market_listings TO anon;
GRANT SELECT, INSERT ON public.market_listings TO authenticated;
GRANT ALL ON public.market_listings TO service_role;

ALTER TABLE public.market_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active listings"
ON public.market_listings FOR SELECT
TO anon, authenticated
USING (status = 'active');

CREATE POLICY "Anyone can post a listing"
ON public.market_listings FOR INSERT
TO anon, authenticated
WITH CHECK (status = 'active');

CREATE INDEX market_listings_posted_at_idx ON public.market_listings (posted_at DESC);

INSERT INTO public.market_listings (seller_type, crop, district, quantity_kg, price_expected, phone, value_notes, service_tags) VALUES
('farmer','Cooking banana','Bugesera',450,180,'+250788123001','Freshly harvested, available for pickup any day.','{}'),
('agent','Cassava','Kamonyi',2000,145,'+250788123002','We consolidate from 12 farmer groups weekly.','{"Delivery included","Can aggregate from multiple farmers"}'),
('farmer','Dessert banana','Rwamagana',300,220,'+250788123003','Ripe and ready this week, pickup from the farm.','{}'),
('agent','Banana for beer','Ngoma',1500,130,'+250788123004','Crates supplied, payment on delivery available.','{"Packaging included","Flexible payment terms"}'),
('farmer','Cassava','Nyagatare',800,160,'+250788123005','Dry season harvest, sold by the sack.','{}'),
('agent','Cooking banana','Musanze',1200,195,'+250788123006','Cold chain transport to Kigali twice a week.','{"Delivery included","Packaging included"}'),
('farmer','Banana for beer','Huye',600,125,'+250788123007','Family plot, buyer arranges transport.','{}'),
('agent','Dessert banana','Gicumbi',900,235,'+250788123008','Graded and packed for retail buyers.','{"Packaging included","Can aggregate from multiple farmers","Flexible payment terms"}'),
('farmer','Cooking banana','Kayonza',250,175,'+250788123009','Small harvest, negotiable for full purchase.','{}'),
('farmer','Cassava','Ruhango',700,150,'+250788123010','Available for pickup weekday mornings.','{}');