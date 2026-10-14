export const selectClass =
  "mt-2 min-h-13 w-full rounded-md border border-input bg-surface px-4 text-base font-semibold normal-case tracking-normal text-foreground outline-none focus:border-primary focus:ring-3 focus:ring-ring/20";

export const labelClass = "block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground";

export function PrototypeNotice() {
  return (
    <p className="mt-6 text-center text-xs text-muted-foreground">
      Prototype notice: phone numbers are not verified in this demo. Production version will add SMS verification.
    </p>
  );
}

export function SellerBadge({ type, label }: { type: "farmer" | "agent"; label: string }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
        type === "farmer" ? "border-primary/40 bg-primary-soft text-primary" : "border-gap/40 bg-gap-soft text-gap"
      }`}
    >
      {label}
    </span>
  );
}
