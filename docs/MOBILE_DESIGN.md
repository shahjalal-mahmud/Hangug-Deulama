# Hangug Deulama — Mobile App Design System & Screen Specification

**For: Google Stitch AI UI Generation**
**Platform: Mobile App (iOS/Android, portrait-first native app shell)**
**Reference mood: Netflix mobile app + Tinder/Hinge swipe mechanics — premium streaming app that happens to be swipe-native**

---

## 1. Design Philosophy

If the web is "walk into a cinema lobby," the mobile app is "the app is your pocket K-drama concierge." It should feel like opening the Netflix app — instant content, dark canvas, thumb-friendly navigation — but the flagship interaction (swiping) should feel as tactile and satisfying as a dating app.

Core principles:

- **Thumb-zone first.** Primary actions (swipe deck, bottom nav) live in the bottom half of the screen.
- **Full-bleed content.** Posters and banners run edge-to-edge; UI floats on top with blur/scrim, not boxed cards with margins everywhere.
- **One flagship gesture.** The swipe deck is the app's signature — it should feel the most polished, most "designed" screen in the app.
- **App-shell familiarity.** Bottom tab bar, native-feeling headers, system-standard gestures (swipe-back, pull-to-refresh) so it feels like a "real" installed app, not a web page in a wrapper.

---

## 2. Color System (shared DNA with web, mobile-tuned)

| Token                | Hex                                                                             | Usage                        |
| -------------------- | ------------------------------------------------------------------------------- | ---------------------------- |
| `--bg-base`          | `#0A0A0C`                                                                       | App background               |
| `--bg-elevated`      | `#16161A`                                                                       | Cards, sheets, tab bar       |
| `--bg-elevated-2`    | `#202024`                                                                       | Inputs, pressed states       |
| `--border-subtle`    | `#2A2A30`                                                                       | Hairlines                    |
| `--text-primary`     | `#F5F5F7`                                                                       | Headlines                    |
| `--text-secondary`   | `#9E9EA6`                                                                       | Body/meta                    |
| `--text-tertiary`    | `#65656C`                                                                       | Placeholder/disabled         |
| `--accent-primary`   | `#D6455A`                                                                       | Like heart, CTAs, active tab |
| `--accent-gold`      | `#E8B75E`                                                                       | Ratings, match score         |
| `--success`          | `#4ADE80`                                                                       | Watched, confirmations       |
| `--danger`           | `#F45B69`                                                                       | Dislike, destructive         |
| `--overlay-gradient` | `linear-gradient(180deg, transparent 0%, rgba(10,10,12,0.9) 75%, #0A0A0C 100%)` | Text-over-image legibility   |

Status bar: translucent dark, content set to light (white icons/text).

---

## 3. Typography

- **Headings:** Sora, 600–700 weight.
- **Body/UI:** Inter, 400–500 weight.
- Minimum tap target: 44×44pt (iOS) / 48×48dp (Android).

| Style          | Size    | Weight |
| -------------- | ------- | ------ |
| Screen Title   | 28px    | 700    |
| Section Header | 20px    | 600    |
| Card Title     | 16px    | 600    |
| Body           | 14–15px | 400    |
| Caption/Meta   | 12px    | 500    |
| Tab Bar Label  | 11px    | 500    |

---

## 4. App Shell & Navigation

### 4.1 Bottom Tab Bar (persistent, 5 tabs)

Fixed at bottom, `--bg-elevated` with slight blur/translucency, icons from Material Symbols (rounded), active tab shown in `--accent-primary` with filled icon variant + label, inactive tabs in `--text-tertiary` outline icons, no label or dimmed label.

Tabs: **Home** (house) · **Discover** (swipe/cards icon — visually emphasized, could be a slightly raised circular button like a camera-tab pattern) · **Recommendations** (star/target icon) · **Activity** (clock/pulse icon) · **Profile** (avatar thumbnail if logged in, else generic person icon).

### 4.2 Top Header Pattern

- Home: large "Hi, [Name] 👋" or logo lockup, small notification bell + search icon top-right, transparent over hero content, solidifies on scroll.
- Sub-pages (Details, Profile edit, etc.): standard native header — back chevron left, centered or left-aligned title, optional right action icon. Height ~56pt.

### 4.3 Anonymous Mode Banner

- Slim dismissible banner pinned just above tab bar or below header on Home/Discover for logged-out users: "Browsing as guest — Sign up to save your matches" + small "Sign Up" pill button.

---

## 5. Core Components

### 5.1 Swipe Card (the flagship component)

- Full-width minus 16–20px side margins, tall poster-forward card, rounded 20px corners, strong drop shadow for "floating card" feel.
- Bottom third: gradient scrim with title (Sora 20px), year + genre pills (small, horizontal), IMDB rating badge (gold, top-right corner of the card, floating pill with star icon).
- Card stack: current card full size/opacity; next 2 cards behind, progressively scaled down 4–6% and shifted down 8–12px, lower opacity (peek effect).
- Drag physics: card rotates slightly (max ~15°) in the direction of drag, translates with finger 1:1, color stamp overlay appears diagonally ("LIKE" in accent green-ish/gold outlined stamp top-left when dragging right, "NOPE" in danger red outlined stamp top-right when dragging left) with opacity scaling from 0 to 1 as drag distance increases.
- Below the stack, a row of 4 circular floating action buttons (glassmorphic dark translucent circles): ✕ dislike (larger, red outline) — 🔖 watch later (smaller) — ⭐ favorite (smaller, gold outline) — ❤️ like (larger, accent-filled). Dislike and Like are visually bigger/primary; Favorite and Watch Later are secondary/smaller flanking them, matching Tinder's classic 4-5 button row hierarchy.
- Swipe progress indicator: thin dot/line progress at very top of the deck area, not intrusive.

### 5.2 Poster Card (grid/rail item, non-swipe contexts)

- 2:3 ratio, 12px rounded corners, used in Home rails, Recommendations, Search results.
- Tap → navigate to Details with a shared-element style transition (poster grows into the backdrop hero).
- Long-press (optional native affordance): quick action sheet (Favorite / Watch Later / Mark Watched) as a bottom sheet or context menu.

### 5.3 Rails (Horizontal Carousels)

- Edge-to-edge horizontal scroll, first card slightly inset from screen edge (16–20px), snap-scroll per card, peek of next card at right edge.
- Section header above each rail: title (Sora 20px) + optional "See All >" text link, both within standard content padding.

### 5.4 Bottom Sheets

- Used for: Filters (Discover), Quick actions (long-press card), Profile edit, Confirmation dialogs (delete/remove).
- Rounded top corners 24px, drag handle bar centered at top, `--bg-elevated` background, content padded 20px, primary action button full-width at bottom, safe-area aware.

### 5.5 Buttons

- Primary: full-width pill, `--accent-primary` fill, 52px height, Sora/Inter 16px 600 weight text, centered.
- Secondary: outline pill, 1px `--border-subtle`, transparent fill.
- Floating action buttons: circular, 56px diameter, glassmorphic blur background.

### 5.6 Match Score Badge

- Small gold pill or circular ring badge, top-left of poster cards in Recommendations/Home when personalized, e.g. "94%".

### 5.7 Forms & Inputs

- Full-width fields, 16px rounded corners, `--bg-elevated-2` fill, no visible border until focused (then accent-colored 1.5px ring), label floats above on focus/fill, 52px height for comfortable thumb typing.

---

## 6. Screen-by-Screen Specification

### 6.1 Splash / Onboarding (pre-login, first launch only)

- Full-bleed looping/static collage of K-drama poster art with dark gradient scrim, centered logo lockup (English + Hangul eyebrow), tagline ("Swipe your way to your next obsession"), two CTAs: "Get Started" (primary) and "Continue as Guest" (text link, ghost).
- Optional 2–3 swipeable intro slides explaining: Swipe to discover → Save favorites/watch later → Get a personalized Top 10.

### 6.2 Login / Register

- Full-screen form, dark background, logo mark top, large title ("Welcome Back" / "Create Account"), fields (email/password, or name/email/password/confirm), primary CTA pill button, secondary text link to switch modes, subtle poster-art texture faded into the very top of the screen behind the logo for atmosphere (not competing with the form).
- Google/social login area — omit unless already in scope (current scope is JWT only); keep it email/password only per the docs.

### 6.3 Home Tab

1. **Header:** greeting + logo, search + bell icons.
2. **Hero Carousel:** full-width auto-rotating featured banner (16:9-ish crop, tall enough to feel immersive — roughly 60% of viewport height), title + genre pills + rating overlaid bottom, small dot pagination, primary CTA "View Details" floating bottom-right or full-width beneath the pagination dots.
3. **Genre Pills Row:** horizontally scrollable quick-filter chips beneath hero.
4. **Continue Watching Rail** (conditional).
5. **Recommended For You Rail** — with match-score badges, or "Popular Picks" for cold-start.
6. **Trending Now Rail** — numbered overlay style (large translucent rank numbers).
7. **Spotlight Rail** — bigger landscape cards, editorial picks.
8. Pull-to-refresh supported at top of scroll.

### 6.4 Discover Tab (Swipe Screen) — THE hero screen

- Minimal header: small title "Discover" + filter icon (opens bottom sheet with Search bar, Category tabs, Genre filter, Sort options) + maybe a small streak/session counter.
- Card stack dominates the screen (roughly 70% of vertical space), action buttons row directly below it, keyboard-hint equivalent isn't needed on mobile (gesture-only), but a tiny once-shown coach-mark overlay on first use ("Swipe right to like, left to skip") with tap-to-dismiss.
- Empty/end-of-deck state: friendly illustration + message "You've seen everything for now — check back later or adjust your filters" + "Adjust Filters" button.
- Undo affordance: small circular "↺ undo" floating button bottom-left appears briefly after a swipe, in case of accidental swipe.

### 6.5 Drama Details Screen

- Full-bleed backdrop hero at top (banner_url), back chevron floating top-left (glass circle), share/more icon top-right.
- Title + meta row (year, rating star, genre pills) overlapping bottom of hero via gradient scrim.
- Action row directly below hero: Like/Dislike, Favorite, Watch Later, Watched — same icon language as swipe deck for consistency, laid out horizontally, evenly spaced, labels beneath icons small caption text.
- Synopsis section, expandable "Read more" if long.
- Info grid (2 columns): Release Year / Rating / Genres / Stars as compact stat tiles.
- Cast rail: horizontal scroll of circular photo + name.
- "Recommended because you liked X" callout card.
- Similar Dramas rail at the very bottom.
- Skeleton shimmer state while loading.

### 6.6 Recommendations Tab

- Header: "Your Top 10" + subtitle (personalized vs cold-start messaging).
- Cold-start banner CTA linking to Discover if no activity yet.
- Layout: vertical list, each row = large poster thumbnail (left) + title/genre/rating/match-score (right) + rank number large and bold to the far left (Netflix Top 10 numeral style, 1–10), tappable to Details.

### 6.7 Activity Tab

- Filter chip row at top (All / Likes / Dislikes / Favorites / Watch Later / Watched), horizontally scrollable.
- Vertical timeline list: each entry = small square poster thumbnail + icon badge indicating action type + description + relative time, grouped by day with date section headers ("Today," "Yesterday," "July 5").
- Empty state illustration + prompt to go swipe.

### 6.8 Profile Tab

- Header: large avatar (tap to edit via bottom sheet — camera/gallery choice), name, email beneath.
- Stat cards row (Liked / Watched / Favorites) — 3 equal cards, big number + label.
- Top Genres: pill row with small icons.
- Genre Statistics: horizontal bar chart, scrollable if many genres, accent gradient bars.
- Settings list below: Edit Profile, Change Password, Notification preferences (if applicable), Log Out (in `--danger` text), App version footer.
- Edit Profile opens as a bottom sheet or dedicated modal screen: avatar upload, name field, password change accordion, Save button pinned to bottom.

---

## 7. Gestures & Motion

- **Swipe deck:** primary gesture-driven interaction — real-time 1:1 finger tracking, rotation proportional to horizontal drag, release threshold ~30% of screen width triggers fling-off animation (250ms) + haptic tap (light impact on like, medium on dislike, success haptic on favorite).
- **Pull-to-refresh:** native platform-standard on Home, Recommendations, Activity.
- **Swipe-back:** standard OS back gesture supported on all detail/sub screens.
- **Tab switch:** instant, no transition animation (native tab bar convention) or a very subtle cross-fade (150ms) — avoid slide transitions between tabs.
- **Bottom sheets:** spring-based slide-up (300ms, ease-out), backdrop dim fades in parallel.
- **Haptics:** light haptic on swipe-release actions and button taps for a premium tactile feel; avoid overusing on scroll.

---

## 8. Platform Nuances

- **iOS:** SF Symbols-style rounded icons acceptable as substitute for Material Symbols if generating iOS-flavored mocks; respect safe areas (notch/home indicator); swipe-back-to-previous-screen gesture from left edge.
- **Android:** Material 3 elevation/shadow conventions for cards; back button (gesture or hardware) dismisses sheets/modals before navigating back a screen.
- Design for a standard **390×844pt** (iPhone-class) canvas as the primary Stitch reference frame, and ensure layouts don't break on smaller **360×800dp** Android reference frames.

---

## 9. Accessibility

- Minimum 44/48pt tap targets on all icon buttons.
- Text over poster/banner images always sits on the gradient scrim, never raw image — maintain AA contrast.
- Swipe deck must have a non-gesture fallback: the visible action buttons row beneath the deck fully replicates every swipe gesture for accessibility/motor-impaired users.
- Dynamic type: body text should scale reasonably with system font size settings without breaking card layouts (truncate/wrap gracefully).

---

## 10. Google Stitch Prompt Building Blocks

Shared prefix for every mobile screen prompt:

> "Design a [SCREEN NAME] mobile app screen for a premium dark-themed Korean drama discovery app called 'Hangug Deulama,' portrait orientation, 390x844 canvas. Netflix-mobile-app aesthetic combined with Tinder-style swipe card mechanics. Near-black background (#0A0A0C), crimson-rose accent (#D6455A), gold rating/match-score accents (#E8B75E), Sora font for headings, Inter for body text, full-bleed poster/banner imagery with dark gradient scrims for text legibility, rounded 16-20px cards, bottom tab bar navigation, glassmorphic floating action buttons. Premium, cinematic, thumb-friendly, not a literal Netflix or Tinder copy."

Then append the specific screen's breakdown from Section 6 above.

---

## 11. Suggested Stitch Generation Order

1. Onboarding/Splash
2. Login / Register
3. Home Tab
4. Discover Tab (swipe deck) — the signature screen, iterate most here
5. Drama Details
6. Recommendations Tab
7. Activity Tab
8. Profile Tab + Edit Profile sheet
