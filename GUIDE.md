# Klaussner Storefront — Guide (Sanity)

Hydrogen + React Router 7. CMS = **Sanity**, Studio embedded at **`/studio`**.

## 1. Setup (ek baar)
```bash
npm install
npx sanity login            # (optional, CLI use ke liye)
npx sanity init --env --bare   # ya manage.sanity.io pe project banao
```
Project ID chahiye: **manage.sanity.io → project → Project ID**. Dataset default `production`.

```bash
cp .env.example .env
```
`.env` mein paste karo:
```
PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
PUBLIC_SANITY_DATASET=production
# optional draft preview
SANITY_API_READ_TOKEN=      # manage.sanity.io → API → Tokens → Viewer
SANITY_PREVIEW_SECRET=      # koi bhi random string
```

**CORS (zaroori):** manage.sanity.io → project → **API → CORS origins** → add
`http://localhost:3000` aur apna live domain, **"Allow credentials" ON**. Warna `/studio` login nahi chalega.

```bash
npm run dev     # site: http://localhost:3000   studio: http://localhost:3000/studio
```
Deploy: wahi 4 env vars Oxygen/hosting mein daalo (`SANITY_API_READ_TOKEN` secret rakhna).

## 2. Content kaise manage karein (`/studio`)
| Type | Use |
|---|---|
| **Page** | Koi bhi URL (`/`, `/room-inspiration`, `/offers`…). `url` = path. Entry nahi → 404. `/` bana diya to poora home Sanity se chalega. |
| **Reusable section** | Slot-based blocks, coded page ke hero/content badalne ke liye. |

Slots: `home-hero`, `home-editorial`, `{collection-handle}-hero`, `{collection-handle}-content` (e.g. `living-room-hero`, `sofas-content`). Slot nahi bhara → coded fallback dikhta hai.

**Navbar/footer:** Page mein *Show in navbar/footer* tick karo → `navLabel`, `navOrder`, `navPlacement` (header/footer/both), `navStyle` (link/pill).

**Draft preview:** `https://site/page?preview=<SANITY_PREVIEW_SECRET>` (unpublished content dikhega).

## 3. Blocks (Page/Section ke `sections` mein add karo)
Hero · ImageBanner · ImageTextSection · FeatureGrid · ThreeColumnSection · SplitMediaSection · MediaGallery · VideoSection · Testimonials · Stats · FAQ · RichText · Banner · Spacer · DesignYourRoomCTA · Newsletter · CollectionShelf · ProductShelf.
Har media block mein image **ya** video (video jeeta). Zyada tar blocks mein optional `buttons` (kisi bhi page/collection/product/external link par).

## 4. API — `/api/cms` (read-only)
```
GET /api/cms?model=page&path=/room-inspiration
GET /api/cms?model=section&slot=living-room-hero
GET /api/cms?model=section&limit=20[&slot=…]
```
Response `{model, entry}` / `{model, entries}`. Project ID set nahi → 503.

## 5. Naya block / field jodna
1. Component: `app/components/sections/X.jsx`
2. Studio fields: `app/studio/schema/blocks.js` → `SPEC` mein `X: [fields…]`
3. Render map: `app/components/cms/registry.jsx` → `cmsComponents` mein `X`
Field names = component props. Image/video/poster automatically URL ban jaate hain (`image`, `videoUrl`, `poster`).

## 6. Structure
```
app/lib/sanity/        client.js (GROQ fetch), models.js
app/components/cms/    CmsContent, registry, CommerceContext
app/studio/            Studio.client.jsx, schema/ (page, section, blocks)
app/routes/studio/     /studio route (browser-only, no site header/footer)
app/routes/api/cms.jsx /api/cms
app/styles/tokens.css  brand colours (light-green palette yahin se badlo)
```

## 7. Troubleshooting
- `/studio` blank / CORS error → CORS origin + credentials (step 1).
- Content nahi dikh raha → Studio mein **Publish** dabaya? `PUBLIC_SANITY_PROJECT_ID` sahi? Dataset naam match?
- Images block → CSP `cdn.sanity.io` allowed hai (`app/entry.server.jsx`).
