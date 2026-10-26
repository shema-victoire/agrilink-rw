ALTER TABLE public.market_listings
  ADD CONSTRAINT market_listings_crop_valid CHECK (crop IN ('Banana for beer','Dessert banana','Cooking banana','Cassava')),
  ADD CONSTRAINT market_listings_district_valid CHECK (district IN ('Bugesera','Burera','Gakenke','Gasabo','Gatsibo','Gicumbi','Gisagara','Huye','Kamonyi','Karongi','Kayonza','Kicukiro','Kirehe','Muhanga','Musanze','Ngoma','Ngororero','Nyabihu','Nyagatare','Nyamagabe','Nyamasheke','Nyanza','Nyarugenge','Nyaruguru','Rubavu','Ruhango','Rulindo','Rusizi','Rutsiro','Rwamagana')),
  ADD CONSTRAINT market_listings_quantity_range CHECK (quantity_kg BETWEEN 1 AND 1000000),
  ADD CONSTRAINT market_listings_price_range CHECK (price_expected >= 1 AND price_expected <= 100000),
  ADD CONSTRAINT market_listings_notes_length CHECK (value_notes IS NULL OR char_length(value_notes) <= 300);