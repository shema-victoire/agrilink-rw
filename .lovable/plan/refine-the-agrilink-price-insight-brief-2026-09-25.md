# Refine the AgriLink Price Insight brief

## Goal
Turn the uploaded notes into one concise, handoff-ready specification for a hackathon prototype. This task is **brief refinement, not app implementation**.

## Refined scope
- **Audience:** Rwandan smallholder farmers and agri-agents using mid-range Android phones.
- **Home / National Overview:** Show the 10 crop–district records with the largest price gaps, ranked by `gapPct`. Each entry shows crop, district, and a prominent percentage; tapping it opens that record's detail view. Include the NISR source citation.
- **Crop + District Detail:** Provide the four named crop choices and a district selector limited to districts with records for the chosen crop. Show farm-gate and market prices side by side or as two same-scale horizontal bars, with RwF/kg labels and the gap percentage. Generate a plain-language insight from the selected record. Show “Based on a limited sample — treat as directional” only when `reliable` is false. Include the NISR source citation.
- **Navigation:** Make the overview the first screen; allow a direct return from detail to overview. A ranked entry opens detail with its crop and district already selected. Changing crop updates the district choices and selects a valid district rather than leaving a stale comparison.
- **Visual direction:** Agriculture-appropriate green with restrained earth tones; reserve one warm accent for gap percentages. Use readable, large type, high contrast, generous touch targets, and a simple phone-first layout. No generic purple/blue dashboard styling.
- **Defer:** The optional all-districts-by-crop screen and unrelated account, mapping, or prediction features.

## Data and accuracy
Use the promised 116-record JSON dataset as the sole source of prices, ranks, districts, reliability, and insight values. Expect `crop`, `district`, `farmGatePrice`, `marketPrice`, `gapPct`, `reliable`, `farmGateSamples`, and `marketSamples`; confirm the actual structure when the file arrives. Do not fabricate records, values, or unsupported causal claims. Keep the source text exactly: “Source: NISR Seasonal Agricultural Survey 2025”.

## Handoff deliverable
Produce a cleaned brief with screen-by-screen requirements, data rules, visual guidance, and a short acceptance checklist covering overview ranking, card-to-detail selection, crop-dependent districts, price comparison, insight wording, unreliable-record notice, mobile legibility, and citation on both screens. The JSON file was not among the uploads checked so far; the refined brief can be drafted now, but record-level examples and validation wait for that upload.
