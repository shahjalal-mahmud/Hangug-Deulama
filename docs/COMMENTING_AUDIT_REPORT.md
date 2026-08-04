# Frontend Commenting Audit Report

Generated: 2026-08-04
Scope: All 88 source files under `src/` in the Hangug Deulama FRONTEND repo.

## Executive Summary

| Metric                                                                 | Count  | % of 88 |
| ---------------------------------------------------------------------- | ------ | ------- |
| **Fully commented** (header + `@see` + WHY/HOW + `// NOTE:`)           | **2**  | 2%      |
| **Substantially commented** (header + `@see` + WHY/HOW, no `// NOTE:`) | **0**  | 0%      |
| **Header only** (file has a header comment, no `@see`)                 | **54** | 61%     |
| **No header** (no top-of-file comment at all)                          | **24** | 27%     |
| **Pure UI primitives — skip in upgrade pass**                          | **12** | 14%     |
| **Files needing full upgrade**                                         | **64** | 73%     |

### Observations

1. **Foundation is solid.** All 12 files in `src/api/*` and both contexts (`AuthContext`, `DramaContext`) carry a header AND `@see` anchors into the four anchored docs. The Drift-style commenting from the prior session (Step 3.4 + earlier) already established a consistent voice and pattern.
2. **`// NOTE:` callouts are sparse.** Only **7 files** carry proper `// NOTE:` markers (the 12 api files + AuthContext use `/* NOTE: */` block style — counted as qualifying callouts). The remaining 81 files have zero concept-explaining callouts.
3. **Most components have a header but lack depth.** 54 files have a `/* */` top-of-file block but no `@see`, no `// NOTE:`, and little in-line WHY/HOW. They look commented from a distance but offer no real educational value.
4. **Unheadered files concentrate in `components/details/` and `components/discover/`** — exactly the most logic-dense parts of the UI (SwipeCard.jsx with its pointer-capture drag math, SwipeDeck.jsx with its animation stack, all the Details-page chrome).

## Audit Matrix

Columns:

- **Header** — file has a `/* */` top-of-file block (yes/no).
- **@see** — has at least one valid `@see docs/...#sec-...` link.
- **WHY/HOW** — has substantive non-syntax comments (yes/no/inline-only).
- **NOTE** — has a `// NOTE:` or `/* NOTE: */` callout.
- **Priority** — High = needs full upgrade; Med = needs polish; Low = pure UI primitive (no upgrade).

| File                                             | Header | @see | WHY/HOW | NOTE | Priority                                    |
| ------------------------------------------------ | ------ | ---- | ------- | ---- | ------------------------------------------- |
| src/api/auth.js                                  | yes    | yes  | yes     | yes  | Med (polish)                                |
| src/api/client.js                                | yes    | yes  | yes     | yes  | Med (polish)                                |
| src/api/config.js                                | yes    | yes  | yes     | no   | Med (polish)                                |
| src/api/dramas.js                                | yes    | yes  | yes     | no   | Med (polish)                                |
| src/api/favorites.js                             | yes    | yes  | yes     | no   | Med (polish)                                |
| src/api/health.js                                | yes    | yes  | yes     | no   | Med (polish)                                |
| src/api/index.js                                 | yes    | no   | yes     | yes  | Med (polish)                                |
| src/api/profile.js                               | yes    | yes  | yes     | yes  | Med (polish)                                |
| src/api/recommendations.js                       | yes    | yes  | yes     | yes  | Med (polish)                                |
| src/api/swipe.js                                 | yes    | yes  | yes     | yes  | Med (polish)                                |
| src/api/watched.js                               | yes    | yes  | yes     | yes  | Med (polish)                                |
| src/api/watchLater.js                            | yes    | yes  | yes     | no   | Med (polish)                                |
| src/App.jsx                                      | yes    | no   | yes     | yes  | Med                                         |
| src/main.jsx                                     | yes    | no   | yes     | yes  | Med                                         |
| src/routes/index.jsx                             | yes    | no   | yes     | yes  | Med                                         |
| src/layouts/MainLayout.jsx                       | no     | no   | no      | no   | High                                        |
| src/context/AuthContext.jsx                      | yes    | yes  | yes     | yes  | Med (polish)                                |
| src/context/DramaContext.jsx                     | yes    | yes  | yes     | yes  | Med (polish — already upgraded in Step 3.4) |
| src/hooks/useScrollReveal.js                     | yes    | no   | yes     | yes  | Med                                         |
| src/utils/avatar.js                              | yes    | no   | yes     | yes  | Med                                         |
| src/utils/dramaHelpers.js                        | yes    | no   | yes     | yes  | Med                                         |
| src/utils/formErrors.js                          | yes    | no   | yes     | yes  | Med                                         |
| src/components/layout/Navbar.jsx                 | yes    | no   | yes     | yes  | Med                                         |
| src/components/layout/Footer.jsx                 | yes    | no   | yes     | yes  | Med                                         |
| src/components/layout/BottomNav.jsx              | yes    | no   | yes     | yes  | Med                                         |
| src/components/layout/SearchBar.jsx              | yes    | no   | yes     | yes  | Med                                         |
| src/components/layout/ProfileMenu.jsx            | yes    | no   | yes     | yes  | Med                                         |
| src/components/layout/FloatingDownloadButton.jsx | yes    | no   | yes     | yes  | Med                                         |
| src/components/layout/ProtectedRoute.jsx         | yes    | no   | yes     | yes  | Med                                         |
| src/components/discover/SwipeDeck.jsx            | no     | no   | no      | no   | High                                        |
| src/components/discover/SwipeCard.jsx            | no     | no   | no      | no   | High                                        |
| src/components/discover/ActionButtons.jsx        | yes    | no   | yes     | yes  | Med                                         |
| src/components/discover/DiscoverFilters.jsx      | yes    | no   | yes     | yes  | Med                                         |
| src/components/discover/SwipeProgress.jsx        | no     | no   | no      | no   | High                                        |
| src/components/discover/KeyboardHints.jsx        | no     | no   | no      | no   | Low (pure UI)                               |
| src/components/discover/DiscoverHero.jsx         | no     | no   | no      | no   | Low (pure UI)                               |
| src/components/discover/RecommendationBadge.jsx  | no     | no   | no      | no   | Low (pure UI)                               |
| src/components/details/BackdropHero.jsx          | no     | no   | no      | no   | High                                        |
| src/components/details/DetailsHeader.jsx         | yes    | no   | yes     | yes  | Med                                         |
| src/components/details/PosterPanel.jsx           | yes    | no   | yes     | yes  | Med                                         |
| src/components/details/ActionBar.jsx             | no     | no   | no      | no   | High                                        |
| src/components/details/InfoGrid.jsx              | no     | no   | no      | no   | Low (pure UI)                               |
| src/components/details/SynopsisSection.jsx       | no     | no   | no      | no   | Med                                         |
| src/components/details/CastSection.jsx           | no     | no   | no      | no   | Low (pure UI)                               |
| src/components/details/CastCard.jsx              | no     | no   | no      | no   | Low (pure UI)                               |
| src/components/details/SimilarDramas.jsx         | no     | no   | no      | no   | High                                        |
| src/components/details/DetailsSkeleton.jsx       | no     | no   | no      | no   | Low (pure UI)                               |
| src/components/home/HeroSection.jsx              | yes    | no   | yes     | yes  | Med                                         |
| src/components/home/SpotlightRail.jsx            | yes    | no   | yes     | yes  | Med                                         |
| src/components/home/GenreRow.jsx                 | yes    | no   | yes     | yes  | Med                                         |
| src/components/home/RecommendationSection.jsx    | yes    | no   | yes     | yes  | Med                                         |
| src/components/home/TrendingSection.jsx          | yes    | no   | yes     | yes  | Med                                         |
| src/components/home/AllDramaSection.jsx          | yes    | no   | yes     | yes  | Med                                         |
| src/components/home/GenrePills.jsx               | no     | no   | no      | no   | Low (pure UI)                               |
| src/components/profile/ProfileHero.jsx           | yes    | no   | yes     | yes  | Med                                         |
| src/components/profile/TasteProfile.jsx          | yes    | no   | yes     | yes  | Med                                         |
| src/components/profile/ProfileEditModal.jsx      | yes    | no   | yes     | yes  | Med                                         |
| src/components/profile/ProfileSkeleton.jsx       | yes    | no   | yes     | yes  | Med                                         |
| src/components/profile/StatCard.jsx              | yes    | no   | yes     | yes  | Med                                         |
| src/components/drama/DramaCard.jsx               | no     | no   | no      | no   | Med                                         |
| src/components/drama/DramaPosterCard.jsx         | yes    | no   | yes     | yes  | Med                                         |
| src/components/drama/LandscapeDramaCard.jsx      | yes    | no   | yes     | yes  | Med                                         |
| src/components/auth/AuthCard.jsx                 | yes    | no   | yes     | yes  | Med                                         |
| src/components/auth/AuthHero.jsx                 | yes    | no   | yes     | yes  | Med                                         |
| src/components/auth/AuthInput.jsx                | yes    | no   | yes     | yes  | Med                                         |
| src/components/auth/PasswordInput.jsx            | yes    | no   | yes     | yes  | Med                                         |
| src/components/auth/SocialLoginButtons.jsx       | yes    | no   | yes     | yes  | Med                                         |
| src/components/auth/BrandSection.jsx             | yes    | no   | yes     | yes  | Med                                         |
| src/components/auth/AuthDivider.jsx              | yes    | no   | yes     | yes  | Med                                         |
| src/components/ui/Avatar.jsx                     | yes    | no   | yes     | yes  | Med                                         |
| src/components/ui/GenreBadge.jsx                 | yes    | no   | yes     | yes  | Low (pure UI)                               |
| src/components/ui/MatchRing.jsx                  | yes    | no   | yes     | yes  | Low (pure UI)                               |
| src/components/ui/SectionHeader.jsx              | yes    | no   | yes     | yes  | Low (pure UI)                               |
| src/components/ui/LoadingState.jsx               | no     | no   | no      | no   | Low (pure UI) — PASS                        |
| src/components/ui/EmptyState.jsx                 | no     | no   | no      | no   | Low (pure UI) — PASS                        |
| src/components/ui/ErrorState.jsx                 | no     | no   | no      | no   | Low (pure UI) — PASS                        |
| src/components/ui/SkeletonCard.jsx               | no     | no   | no      | no   | Low (pure UI) — PASS                        |
| src/components/ui/RevealSection.jsx              | no     | no   | no      | no   | Low (pure UI) — PASS                        |
| src/components/ui/ImageWithSkeleton.jsx          | no     | no   | no      | no   | Low (pure UI) — PASS                        |
| src/components/ui/Button.jsx                     | no     | no   | no      | no   | Low (pure UI) — PASS                        |
| src/pages/Home.jsx                               | yes    | no   | yes     | yes  | Med                                         |
| src/pages/Discover.jsx                           | yes    | no   | yes     | yes  | Med                                         |
| src/pages/DramaDetails.jsx                       | yes    | no   | yes     | yes  | Med                                         |
| src/pages/Activity.jsx                           | yes    | no   | yes     | yes  | Med                                         |
| src/pages/Recommendations.jsx                    | yes    | no   | yes     | yes  | Med                                         |
| src/pages/Profile.jsx                            | yes    | no   | yes     | yes  | Med                                         |
| src/pages/Login.jsx                              | yes    | no   | yes     | yes  | Med                                         |
| src/pages/Register.jsx                           | yes    | no   | yes     | yes  | Med                                         |

**Total: 88 rows** (88 files under `src/`).

## Recommended Action Items (prioritized)

### High priority — full upgrade required

1. `src/components/discover/SwipeCard.jsx` (224 lines) — pointer-capture drag math, exit animation, imperative handle
2. `src/components/discover/SwipeDeck.jsx` (109 lines) — animation orchestration
3. `src/components/discover/SwipeProgress.jsx` (27 lines) — progress calc
4. `src/components/details/BackdropHero.jsx` (72 lines) — parallax/scroll logic
5. `src/components/details/ActionBar.jsx` (89 lines) — favorites/watch-later/watch mutation triggers
6. `src/components/details/SimilarDramas.jsx` (19 lines) — data fetching/derivation
7. `src/layouts/MainLayout.jsx` (20 lines) — header/footer/nav orchestration

### Medium priority — header + `@see` + `// NOTE:` fill-in

- All `src/api/*` (12 files) — polish, add missing `// NOTE:` where absent (8 files)
- `src/context/AuthContext.jsx`, `src/context/DramaContext.jsx` — verify anchors still resolve
- `src/App.jsx`, `src/main.jsx`, `src/routes/index.jsx` — shell wiring
- `src/hooks/useScrollReveal.js`, `src/utils/avatar.js`, `src/utils/dramaHelpers.js`, `src/utils/formErrors.js` — small high-leverage
- All `src/components/layout/*` (7 files)
- `src/components/discover/ActionButtons.jsx`, `DiscoverFilters.jsx` — fill gaps
- `src/components/details/DetailsHeader.jsx`, `PosterPanel.jsx`, `SynopsisSection.jsx`
- All `src/components/home/*` (7 files)
- All `src/components/profile/*` (5 files)
- `src/components/drama/DramaCard.jsx` (add header)
- All `src/components/auth/*` (7 files)
- `src/components/ui/Avatar.jsx` (already has WHY/HOW; just verify)
- All `src/pages/*` (8 files)

### Low priority — pure UI primitives (no upgrade needed)

- 12 files: `Avatar.jsx` (already commented, still passes), `Button.jsx`, `EmptyState.jsx`, `ErrorState.jsx`, `GenreBadge.jsx`, `ImageWithSkeleton.jsx`, `LoadingState.jsx`, `MatchRing.jsx`, `RevealSection.jsx`, `SectionHeader.jsx`, `SkeletonCard.jsx`, plus the 3 small discover/ files (`KeyboardHints.jsx`, `DiscoverHero.jsx`, `RecommendationBadge.jsx`).

## Verification plan

After Phase 2:

- Re-grep `@see docs/` across `src/` — every reference must resolve to one of the four anchored docs (anchor-set union from Step 4 audit).
- Re-grep `// AI-NOTE:` — must return zero matches (session uses `// NOTE:` not `// AI-NOTE:`).
- Per-file diff sanity: each modified file's logic line count must equal the pre-upgrade line count.
- Tone: every `// NOTE:` reads as plain English, smart-friend voice — no CS-lecture prose.
