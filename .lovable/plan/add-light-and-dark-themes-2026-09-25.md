# Add light and dark themes

## What will change
- Add a sun/moon icon button at the top right of the shared header and landing screen.
- Keep the current dark appearance as the default.
- Add a light theme with off-white page surfaces, green gradient heading bands, dark readable cards, subtle borders/shadows, and amber gap badges.
- Apply the light treatment consistently to the landing, Overview, and Detail screens without changing their layout or data.

## Behavior
- Switch themes immediately without navigation, so the current page, URL, crop, and district remain unchanged.
- Remember the selected theme for later visits while defaulting first-time visitors to dark.
- Prevent a light-theme flash during page loading.
- Keep the control keyboard-accessible with a clear tooltip and accessible label.

## Verification
- Check landing → Overview → Detail in both themes on desktop and mobile.
- Confirm switching theme on a selected Detail record preserves its crop and district.
- Confirm no overflow, runtime errors, or build errors.

## Technical details
- Use a shared theme toggle component and a document-level `light` class.
- Extend the existing semantic color tokens and add theme-aware band/badge tokens; keep component markup and URL state intact.
