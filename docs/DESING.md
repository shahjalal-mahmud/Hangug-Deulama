# Hangug Deulama — Web Design System & Screen Specification

**For: Google Stitch AI UI Generation**
**Platform: Web (Desktop-first, responsive down to tablet)**
**Reference mood: Netflix, Apple TV+, HBO Max — premium streaming/discovery UI, NOT a literal clone**

---

## 1. Design Philosophy

Hangug Deulama is a cinematic, editorial discovery platform — not a form-heavy SaaS dashboard. Every screen should feel like walking into a premium streaming lobby: dark, glossy, poster-driven, with generous negative space and confident typography.

Core principles:

- **Content is the hero.** Posters, banners, and stills carry the visual weight — UI chrome stays quiet and gets out of the way.
- **Dark-first.** The entire experience lives on a near-black canvas so poster art and color pop.
- **Editorial confidence.** Big type, tight hierarchy, no clutter, no unnecessary borders/boxes.
- **Motion implies quality.** Subtle hover elevation, cross-fades, and parallax — nothing bouncy or "consumer app" cheap.
- **Korean-cinema accent.** A single confident accent color (not red — avoid literal Netflix mimicry) drawn from Korean drama poster palettes: deep crimson-plum, warm gold, or jade — pick ONE as the signature accent (recommendation: a warm garnet/crimson, `#E14B57`-ish, distinct from Netflix red `#E50914` by leaning more rose/plum).

---

## 2. Color System

| Token                    | Hex                                                                              | Usage                                          |
| ------------------------ | -------------------------------------------------------------------------------- | ---------------------------------------------- |
| `--bg-base`              | `#0A0A0C`                                                                        | App background, deepest layer                  |
| `--bg-elevated`          | `#141417`                                                                        | Cards, modals, nav bar on scroll               |
| `--bg-elevated-2`        | `#1C1C21`                                                                        | Hover states, input fields                     |
| `--border-subtle`        | `#2A2A30`                                                                        | Hairline dividers, card outlines               |
| `--text-primary`         | `#F5F5F7`                                                                        | Headlines, primary content                     |
| `--text-secondary`       | `#A0A0A8`                                                                        | Body copy, metadata                            |
| `--text-tertiary`        | `#6B6B72`                                                                        | Disabled, placeholder                          |
| `--accent-primary`       | `#D6455A`                                                                        | CTA buttons, active states, like/heart, badges |
| `--accent-primary-hover` | `#E8586C`                                                                        | Hover on accent elements                       |
| `--accent-gold`          | `#E8B75E`                                                                        | Ratings, match-score, premium badges           |
| `--success`              | `#4ADE80`                                                                        | Watched/confirmation states                    |
| `--danger`               | `#F45B69`                                                                        | Dislike, remove, destructive                   |
| `--overlay-gradient`     | `linear-gradient(180deg, transparent 0%, rgba(10,10,12,0.85) 70%, #0A0A0C 100%)` | Poster/banner bottom fade for text legibility  |

**Rule:** Never use pure black `#000` or pure white `#FFF` — always the near-black/near-white tokens above for a softer, premium feel.

---

## 3. Typography

- **Display / Headings:** `Sora` (600–700 weight) — used for hero titles, page titles, section headers.
- **Body / UI:** `Inter` (400–500 weight) — used for paragraphs, labels, buttons, metadata.
- **Icons:** Material Symbols (rounded style), 24px default.

| Style               | Font  | Size    | Weight | Letter-spacing                  |
| ------------------- | ----- | ------- | ------ | ------------------------------- |
| Hero Title          | Sora  | 56–72px | 700    | -0.02em                         |
| Page Title (H1)     | Sora  | 32–40px | 600    | -0.01em                         |
| Section Header (H2) | Sora  | 24px    | 600    | 0                               |
| Card Title          | Sora  | 16–18px | 600    | 0                               |
| Body                | Inter | 15–16px | 400    | 0                               |
| Metadata/Caption    | Inter | 12–13px | 500    | 0.02em (uppercase for eyebrows) |
| Button Label        | Inter | 14px    | 600    | 0.01em                          |

Hangul accents (e.g. "한국 드라마") should appear as small eyebrow text above English headings in select hero/branding moments, in `--accent-gold`, letter-spaced, all using a font that supports Hangul cleanly (fallback to system Korean-capable font stack).

---

## 4. Layout & Grid

- **Max content width:** 1440px, centered, with 64–96px horizontal gutters on large screens (≥1440px), 32px on laptop (1024–1439px), 20px on tablet (768–1023px).
- **Poster card grid:** CSS grid, `auto-fill` with `minmax(180px, 1fr)`, gap 16–20px.
- **Section rails (horizontal scroll):** Netflix-style horizontal carousels for Trending, Continue Watching, Spotlight, Recommendations — peek the next card at ~15% visible to hint scrollability. Arrow-hover navigation on desktop, drag/scroll on trackpad.
- **Vertical rhythm:** 96–120px between major homepage sections; 24px between a section header and its content row.

---

## 5. Core Components

### 5.1 Navbar

- Transparent over hero content at top of page; transitions to solid `--bg-elevated` with subtle blur (backdrop-filter) on scroll.
- Left: logo/wordmark ("Hangug Deulama" in Sora, with small Hangul eyebrow).
- Center-left: nav links — Home, Discover, Recommendations, Activity.
- Right: search icon (expands to inline search bar), notification bell, profile avatar with dropdown (Profile, Genre Stats, Log out).
- Anonymous users see "Log In" / "Get Started" buttons instead of avatar.

### 5.2 Poster Card (Drama Card)

- 2:3 aspect ratio poster.
- On hover (desktop): scale to 1.06, elevate with shadow, reveal a mini-info overlay after ~400ms delay showing title, genre tags, IMDB rating (gold star), and quick-action icons (heart/favorite, watch-later bookmark, watched check) fading in from bottom.
- Rounded corners: 8px.
- Subtle 1px border `--border-subtle`, removed on hover in favor of shadow glow in accent color at low opacity.

### 5.3 Landscape/Backdrop Card

- 16:9 used for "Continue Watching" and hero banners in rails — shows banner_url instead of poster.

### 5.4 Match Score Badge

- Small circular ring (like a percentage ring) or pill badge, gold accent, e.g. "92% Match" — appears top-left corner of a card when recommended.

### 5.5 Buttons

- Primary: filled `--accent-primary`, fully rounded (pill) or 8px radius — pick pill for a modern swipe-app feel; white text.
- Secondary: `--bg-elevated-2` fill, `--text-primary` text, subtle border.
- Icon buttons (heart, bookmark, check): circular, semi-transparent dark background (`rgba(20,20,23,0.6)`) with backdrop blur, fill with accent color when active.

### 5.6 Genre Pills / Tags

- Small rounded-full pills, `--bg-elevated-2` background, uppercase small text, used for genre filters and card metadata.

### 5.7 Forms (Login/Register/Profile edit)

- Dark input fields (`--bg-elevated-2`), floating or top-aligned labels, accent-colored focus ring, generous 16px vertical padding, rounded 10px corners.
- Inline validation messages in `--danger` beneath fields.

---

## 6. Page-by-Page Specification

### 6.1 Home Page

**Goal:** Cinematic entry point, quickly orient returning users and entice new ones.

1. **Hero Section** — Full-bleed (or 70vh) featured drama banner with gradient overlay, title in Sora 64px, short synopsis (2 lines max), genre pills, and two CTAs: "▶ View Details" (primary) and "+ Watch Later" (secondary, ghost style). Optional: rotating hero (3–5 featured titles auto-rotating every 6s with subtle crossfade, small dot indicators).
2. **Genre Pills Row** — horizontally scrollable quick filters (Romance, Thriller, Comedy, Historical, etc.) directly below hero, sticky-ish quick access to Discover filtered views.
3. **Continue Watching Rail** — landscape cards (16:9), progress indication if applicable, only shown if user has watched-in-progress signal (else hidden).
4. **Recommended For You Rail** — poster cards with Match Score badges; header includes small subtitle "Based on your taste" — falls back to "Popular Picks" heading + `fallback:true` styling (no match badges) for cold-start users.
5. **Trending Now Rail** — poster cards, numbered overlay (large translucent 1, 2, 3... at bottom-left of first 5 cards, Netflix Top-10 style).
6. **Spotlight Rail** — editorial-style larger cards (landscape, bigger), 2–3 per view, for curated picks (e.g. "Editor's Picks", "New This Month").
7. **Genre-based rails** (optional, generated dynamically per top genres) — e.g. "Because you liked Romance".
8. Footer: minimal, dark, logo + links (About, Contact, GitHub if desired) + academic project credit line.

### 6.2 Discover Page (Swipe Interface — Web Adaptation)

**Goal:** Bring the swipe-to-like mechanic to web without feeling like a gimmick bolted onto a browser.

- **Layout:** Two-column desktop layout — left 60%: large swipeable card stack (poster + gradient + title/synopsis/genre/rating overlaid at bottom); right 40%: a supporting panel with "Why we picked this," cast preview, and quick stats (your like rate, cards left in queue).
- **Discover Hero:** small header above the stack: "Swipe to build your taste profile" + progress bar showing session swipe count.
- **Search bar + Category tabs + Genre filter + Sort dropdown** sit above the swipe stack in a slim toolbar (search left, filters right).
- **Swipe Card Stack:** 3 cards visible in a stacked/fanned deck (top card full opacity, next 2 slightly scaled down and offset, peeking from behind). Poster fills card; bottom gradient holds title, year, genre pills, IMDB rating.
- **Action Buttons Row** below/over the stack: ✕ (dislike, danger red circle) — ⭐ (favorite, gold) — ❤️ (like, accent) — 🔖 (watch later) — large center-forward like/dislike being the primary two, favorite/watch-later smaller flanking icons.
- **Keyboard hints:** small unobtrusive footer text "← Dislike · → Like · ↑ Favorite · ↓ Watch Later".
- **Swipe Progress:** thin progress bar or dot-stepper indicating position in the current discovery batch.
- Drag interaction: card tilts and translates with cursor drag; color wash (green tint for like direction, red tint for dislike direction) appears as overlay stamp ("LIKE"/"NOPE" style diagonal stamp, understated, not campy) intensifying with drag distance.

### 6.3 Drama Details Page

- **Backdrop Hero:** full-width banner (16:9 or wider cinematic crop) with heavy bottom gradient, title overlaid Sora 40px, meta row (year · genre pills · IMDB rating gold star · runtime if available).
- **Action Bar:** sticky-ish row directly under hero — Like/Dislike icon buttons, Favorite heart, Watch Later bookmark, Mark as Watched check — pill-style with clear active/filled states.
- **Synopsis Section:** storyline text, generous line-height, max-width ~720px for readability.
- **Info Grid:** 2–3 column grid of metadata (Release Year, Genres, Rating, Stars) as labeled stat blocks.
- **Cast Section:** horizontal rail of cast cards (circular/rounded photo placeholder + name).
- **Recommendation Reason:** small callout card, e.g. "Recommended because you liked [X]" with mini poster thumbnail of the referenced title.
- **Similar Dramas Rail:** poster card rail at bottom.
- **Loading State (Skeleton):** shimmer placeholders matching backdrop + info grid shapes.

### 6.4 Recommendations Page

- **Header:** "Your Top 10" with subtitle explaining personalization status.
- **Cold-start banner:** if `fallback:true`, show a soft-styled info banner: "Swipe a few dramas to unlock personalized picks" with CTA to Discover.
- **Grid/List:** Numbered large poster cards (1–10) with Match Score badge, laid out as a prominent vertical list-with-poster-thumbnail (similar to a "Top 10 today" Netflix row but vertical for a dedicated page) OR a large grid — recommend a hybrid: top 3 as large featured cards, 4–10 as a standard grid below.

### 6.5 Activity Page

- **Timeline layout:** vertical timeline with a thin accent line down the left, each event as a compact row: small poster thumbnail, action icon (swiped/favorited/watched/queued), description text, relative timestamp (e.g. "2h ago").
- Filter chips at top: All / Likes / Dislikes / Favorites / Watch Later / Watched.
- Empty state: illustration + "Your activity will show up here once you start swiping."

### 6.6 Profile Page

- **Header card:** large circular avatar (with hover edit overlay), name, email, "Edit Profile" button.
- **Stats row:** 3 stat cards — Liked Count, Watched Count, (optionally Favorites Count) — big numbers in Sora, label beneath.
- **Top Genres:** 3 pill/badge display of favorite_genres with small icons.
- **Genre Statistics Chart:** horizontal bar chart (per-genre score) — bars in accent gradient, genre labels left-aligned, score right-aligned.
- **Activity Summary link/card:** quick preview of recent activity with "View All" → Activity page.
- **Profile Edit Modal:** centered modal, avatar upload dropzone, name field, password change accordion section, Save/Cancel buttons.

### 6.7 Login / Register Pages

- Split-screen layout: left 50% (desktop) full-bleed rotating K-drama poster collage or hero art with dark overlay + brand tagline; right 50% centered form card on `--bg-base`.
- Form: minimal, generous spacing, social-proof-free, single primary CTA button, small link toggling between Login/Register.
- Inline validation, disabled-state button until valid, loading spinner in button on submit.
- Mobile/tablet fallback: form takes full width, art collage becomes a smaller top banner or is dropped entirely.

---

## 7. Motion & Interaction Guidelines

- Hover elevation: `transform: translateY(-4px) scale(1.03)`, `transition: 200ms cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Page transitions: soft cross-fade (250ms), no slide-ins that feel like mobile nav patterns.
- Swipe card drag: real-time transform follow, spring-back on release if under threshold, fling-away animation (300ms ease-out) if over threshold.
- Skeleton loaders: shimmer gradient sweep, `--bg-elevated` to `--bg-elevated-2` and back, 1.5s loop.
- Toasts: top-right slide-in + fade, dark card, colored left border indicating success/error/info.

---

## 8. Accessibility & Responsiveness Notes

- Maintain WCAG AA contrast for text over imagery — always rely on the overlay gradient token, never place text directly on unprocessed image without a scrim.
- All icon-only buttons require `aria-label` equivalents (heart = "Add to favorites", etc.).
- Breakpoints: `≥1440px` desktop-large, `1024–1439px` desktop, `768–1023px` tablet (rails become 2–3 cards visible, nav collapses secondary links into a "More" menu), `<768px` hands off to the mobile app design system (this doc assumes web is used down to tablet only; phone-width web fallback should mimic the mobile design doc's patterns).

---

## 9. Google Stitch Prompt Building Blocks

When generating screens in Stitch, prefix prompts with this shared context:

> "Design a [PAGE NAME] for a premium dark-themed Korean drama discovery streaming web app called 'Hangug Deulama.' Netflix/Apple TV+ inspired aesthetic, near-black background (#0A0A0C), crimson-rose accent (#D6455A), gold rating accents (#E8B75E), Sora font for headings, Inter for body text, poster-driven layout with generous negative space, rounded 8px cards, subtle hover elevation. Not a literal Netflix copy — more editorial and cinematic."

Then append the specific page's section breakdown from Section 6 above.
