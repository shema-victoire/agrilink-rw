import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Plus, Store, X } from "lucide-react";
import { AppHeader } from "../components/app-header";
import { labelClass, PrototypeNotice, selectClass, SellerBadge } from "../components/market-ui";
import { CROPS, formatPrice } from "../data/price-insights";
import { ALL_DISTRICTS, fetchListings, sellerBadge, whatsappLink, type Listing } from "../lib/market";

export const Route = createFileRoute("/market")({
  head: () => ({
    meta: [
      { title: "Market Feed — AgriLink" },
      { name: "description", content: "Browse public crop listings from Rwandan farmers and agents and contact sellers on WhatsApp." },
      { property: "og:title", content: "Market Feed — AgriLink" },
      { property: "og:description", content: "Public crop listings from farmers and agents across Rwanda." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarketPage,
});

function MarketPage() {
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [error, setError] = useState(false);
  const [crop, setCrop] = useState("");
  const [district, setDistrict] = useState("");
  const [open, setOpen] = useState<Listing | null>(null);

  useEffect(() => {
    fetchListings().then(setListings).catch(() => setError(true));
  }, []);

  const filtered = useMemo(
    () => (listings ?? []).filter((l) => (!crop || l.crop === crop) && (!district || l.district === district)),
    [listings, crop, district],
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6">
        <section className="hero-band flex flex-wrap items-end justify-between gap-6 overflow-hidden rounded-lg p-5 sm:p-7">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2 text-primary">
              <Store className="size-5" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-[0.14em]">Market feed</p>
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] text-foreground sm:text-5xl">Buy and sell directly</h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">Open listings from farmers and agents. Contact sellers directly on WhatsApp.</p>
          </div>
          <Link to="/market/post" className="landing-cta inline-flex min-h-12 items-center gap-2 rounded-lg bg-primary px-5 font-bold text-primary-foreground">
            <Plus className="size-5" aria-hidden="true" /> Post a listing
          </Link>
        </section>

        <section aria-label="Filter listings" className="mt-6 grid gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-2 sm:p-5">
          <label className={labelClass}>
            Crop
            <select value={crop} onChange={(e) => setCrop(e.target.value)} className={selectClass}>
              <option value="">All crops</option>
              {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className={labelClass}>
            District
            <select value={district} onChange={(e) => setDistrict(e.target.value)} className={selectClass}>
              <option value="">All districts</option>
              {ALL_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
        </section>

        <section className="pt-6">
          {error && <p className="rounded-lg border border-border bg-card p-5 text-muted-foreground">Listings could not be loaded. Please try again.</p>}
          {!error && listings === null && <p className="text-muted-foreground">Loading listings…</p>}
          {listings && filtered.length === 0 && (
            <p className="rounded-lg border border-border bg-card p-5 text-muted-foreground">No listings match these filters yet.</p>
          )}
          <ul className="grid gap-3 md:grid-cols-2">
            {filtered.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => setOpen(l)}
                  className="grid w-full gap-3 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-primary/60 hover:bg-accent sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-lg font-bold text-card-foreground">{l.crop}</p>
                      <p className="text-sm font-medium text-muted-foreground">{l.district} · {l.quantity_kg.toLocaleString()} kg</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-2xl font-extrabold text-foreground">RwF {formatPrice(Number(l.price_expected))}</p>
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">per kg</p>
                    </div>
                  </div>
                  <SellerBadge type={l.seller_type} label={sellerBadge(l)} />
                </button>
              </li>
            ))}
          </ul>
          <PrototypeNotice />
        </section>
      </main>

      {open && <ListingDetail listing={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function ListingDetail({ listing: l, onClose }: { listing: Listing; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={`${l.crop} listing`} onClick={onClose}>
      <div className="w-full max-w-lg rounded-t-xl border border-border bg-card p-5 sm:rounded-xl sm:p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{l.district}</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-foreground">{l.crop}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-10 place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Stat label="Quantity" value={`${l.quantity_kg.toLocaleString()} kg`} />
          <Stat label="Price expected" value={`RwF ${formatPrice(Number(l.price_expected))}/kg`} />
        </div>
        <div className="mt-4"><SellerBadge type={l.seller_type} label={sellerBadge(l)} /></div>
        {l.service_tags.length > 0 && (
          <div className="mt-4">
            <p className={labelClass}>Services</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {l.service_tags.map((t) => <li key={t} className="rounded-full border border-gap/40 bg-gap-soft px-3 py-1 text-xs font-bold text-gap">{t}</li>)}
            </ul>
          </div>
        )}
        {l.value_notes && (
          <div className="mt-4">
            <p className={labelClass}>Seller notes</p>
            <p className="mt-2 leading-relaxed text-foreground">{l.value_notes}</p>
          </div>
        )}
        <a href={whatsappLink(l)} target="_blank" rel="noopener noreferrer" className="landing-cta mt-6 flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary font-bold text-primary-foreground">
          <MessageCircle className="size-5" aria-hidden="true" /> Contact via WhatsApp
        </a>
        <PrototypeNotice />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-lg font-extrabold text-foreground">{value}</p>
    </div>
  );
}
