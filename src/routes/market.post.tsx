import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Sprout, Truck } from "lucide-react";
import { AppHeader } from "../components/app-header";
import { labelClass, PrototypeNotice, selectClass } from "../components/market-ui";
import { CROPS } from "../data/price-insights";
import { ALL_DISTRICTS, createListing, SERVICE_TAGS } from "../lib/market";

export const Route = createFileRoute("/market/post")({
  head: () => ({
    meta: [
      { title: "Post a Listing — AgriLink Market" },
      { name: "description", content: "Post your crop for sale as a farmer or agent on the AgriLink Market Feed." },
      { property: "og:title", content: "Post a Listing — AgriLink Market" },
      { property: "og:description", content: "List your crop for buyers across Rwanda in under a minute." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PostPage,
});

const inputClass = selectClass;

function PostPage() {
  const [type, setType] = useState<"farmer" | "agent" | null>(null);
  const [crop, setCrop] = useState<string>(CROPS[0]);
  const [district, setDistrict] = useState(ALL_DISTRICTS[0] ?? "");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const q = Number(qty), p = Number(price);
    if (!Number.isInteger(q) || q <= 0) return setError("Enter a whole quantity in kg.");
    if (!(p > 0)) return setError("Enter a price above 0.");
    const normalized = normalizePhone(phone);
    if (!normalized) return setError(PHONE_ERROR);
    setSaving(true);
    try {
      await createListing({
        seller_type: type!, crop, district, quantity_kg: q, price_expected: p,
        phone: normalized, value_notes: notes.trim().slice(0, 500) || null,
        service_tags: type === "agent" ? tags : [],
      });
      setDone(true);
    } catch {
      setError("Could not post the listing. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 pb-12 pt-8 sm:px-6">
        <Link to="/market" className="mb-5 inline-flex min-h-11 items-center gap-2 font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-5" aria-hidden="true" /> Back to market feed
        </Link>
        <section className="hero-band overflow-hidden rounded-lg p-5 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Post a listing</p>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-foreground sm:text-4xl">Sell your crop</h1>
          <p className="mt-3 text-muted-foreground">{type ? "Step 2 of 2 — listing details" : "Step 1 of 2 — who is selling?"}</p>
        </section>

        {done ? (
          <div className="mt-6 rounded-lg border border-primary/40 bg-primary-soft p-6 text-center">
            <CheckCircle2 className="mx-auto size-10 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-display text-2xl font-extrabold text-foreground">Your listing is live</h2>
            <p className="mt-2 text-muted-foreground">Buyers can now find it on the Market Feed.</p>
            <Link to="/market" className="landing-cta mt-5 inline-flex min-h-12 items-center rounded-lg bg-primary px-5 font-bold text-primary-foreground">View Market Feed</Link>
          </div>
        ) : !type ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <TypeCard icon={<Sprout className="size-7" />} title="Farmer" text="I grow and sell my own harvest." onClick={() => setType("farmer")} />
            <TypeCard icon={<Truck className="size-7" />} title="Agent" text="I aggregate, transport or trade crops." onClick={() => setType("agent")} />
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 grid gap-4 rounded-lg border border-border bg-card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">Selling as {type === "farmer" ? "Farmer" : "Agent"}</span>
              <button type="button" onClick={() => setType(null)} className="text-sm font-bold text-primary">Change</button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>Crop
                <select value={crop} onChange={(e) => setCrop(e.target.value)} className={selectClass}>
                  {CROPS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
              <label className={labelClass}>District
                <select value={district} onChange={(e) => setDistrict(e.target.value)} className={selectClass}>
                  {ALL_DISTRICTS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </label>
              <label className={labelClass}>Quantity (kg)
                <input inputMode="numeric" value={qty} onChange={(e) => setQty(e.target.value)} className={inputClass} required />
              </label>
              <label className={labelClass}>Price expected (RwF/kg)
                <input inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} required />
              </label>
            </div>
            <label className={labelClass}>Phone number
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07XXXXXXXX" className={inputClass} required />
              <span className="mt-1 block text-xs font-medium normal-case tracking-normal">Used so buyers can reach you directly</span>
            </label>
            {type === "agent" && (
              <fieldset>
                <legend className={labelClass}>Services you offer</legend>
                <div className="mt-2 grid gap-2">
                  {SERVICE_TAGS.map((t) => (
                    <label key={t} className="flex min-h-11 items-center gap-3 rounded-md border border-border bg-surface px-3 text-foreground">
                      <input type="checkbox" checked={tags.includes(t)} onChange={() => setTags((s) => s.includes(t) ? s.filter((x) => x !== t) : [...s, t])} className="size-4 accent-[var(--primary)]" />
                      {t}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
            <label className={labelClass}>What should a buyer know? (optional)
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} rows={3}
                placeholder="e.g. freshly harvested, available for pickup any day"
                className="mt-2 w-full rounded-md border border-input bg-surface p-4 text-base font-medium normal-case tracking-normal text-foreground outline-none focus:border-primary" />
            </label>
            {error && <p className="text-sm font-bold text-destructive">{error}</p>}
            <button disabled={saving} className="landing-cta min-h-12 rounded-lg bg-primary font-bold text-primary-foreground disabled:opacity-60">
              {saving ? "Posting…" : "Post listing"}
            </button>
          </form>
        )}
        <PrototypeNotice />
      </main>
    </div>
  );
}

function TypeCard({ icon, title, text, onClick }: { icon: React.ReactNode; title: string; text: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="rounded-lg border border-border bg-card p-6 text-left transition-colors hover:border-primary/60 hover:bg-accent">
      <span className="grid size-12 place-items-center rounded-lg border border-primary/40 bg-primary-soft text-primary">{icon}</span>
      <p className="mt-4 font-display text-xl font-extrabold text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </button>
  );
}
