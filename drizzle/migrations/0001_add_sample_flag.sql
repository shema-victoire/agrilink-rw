ALTER TABLE public.market_listings ADD COLUMN is_sample boolean NOT NULL DEFAULT false;
UPDATE public.market_listings SET is_sample = true WHERE phone LIKE '+250788123%';