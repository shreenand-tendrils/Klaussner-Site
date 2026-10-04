# Klaussner Storefront — V4

## What changed

- Tailwind CSS v4 via the official `@tailwindcss/vite` plugin (custom plugin removed).
- All component styling now lives as Tailwind utilities in the JSX (arbitrary properties/variants). `app/styles/tailwind.css` only holds `@theme`, design-token variables, base element resets and keyframes.
- Centralized UI state store added at `app/state/store.js` for search and mobile navigation.
- Navbar visibility/z-index was hardened and the existing premium ivory / charcoal / brass palette was retained.
- Search overlay field is now an outlined, transparent luxury box instead of a white-filled field.
- Home page is now **local-first + Sanity additive**.

## Sanity homepage behavior

The coded homepage always renders as the baseline.

Sanity can:
1. Override the Hero without replacing the rest of the homepage.
2. Override existing editable areas such as CollectionShelf, ProductShelf, ImageTextSection, DesignYourRoomCTA and Newsletter.
3. Add new blocks such as FeatureGrid, FAQ, Testimonials, Stats, MediaGallery, VideoSection, etc. without deleting the local Hero or other local sections.

Example:
- Local Hero exists.
- Sanity page `/` contains only a `FeatureGrid`.
- Result = Local Hero + existing local homepage + the new Sanity FeatureGrid.
- If Sanity later edits the Hero, only the Hero changes.

## Install

Run:

```bash
npm install
npm run dev
```

Then configure the existing Sanity environment variables as before.
