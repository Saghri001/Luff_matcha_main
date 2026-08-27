# LUFF — Engineering & Design Rules

Authoritative ruleset for anyone (human or AI) modifying this project. Supersedes any
prior Next.js-oriented guidance — **this is not a Next.js app.**

---

## 1. Stack (the ground truth)

- **Vite 6** + **React 19** — a client-side SPA. No Next.js, no App Router, no React Server
  Components, no `next/image`, no `.module.css` convention. Ignore any rule that assumes them.
- **Tailwind CSS v4** — configured in CSS (`src/index.css`), **no `tailwind.config.js`**.
  Design tokens live in the `@theme` block in `src/index.css` (single source of truth).
- **Framer Motion** via `motion/react` for animation.
- **Three.js** is installed but currently unused (legacy 3D hero experiments were removed).
  Do not reintroduce it without a clear reason.
- Language: **TypeScript, strict**. `any` is prohibited. Prefer `import type` for types.

Entry: `src/main.tsx` → `src/App.tsx`. `App.tsx` is the composition root + view router; it
owns cross-cutting UI (cart/checkout modals, toasts) and delegates sections to components.

---

## 2. Directory layout

```
src/
├── App.tsx                     # composition root + view router
├── index.css                   # Tailwind import + @theme design tokens + base layer
├── components/
│   ├── <domain>/               # section components grouped by domain
│   │   ├── hero/  ritual/  reviews/  contact/  store/  nav/  legal/  admin/
│   └── *.tsx                   # shared/top-level (Navbar, CartDrawer, Toast, ...)
└── lib/store/                  # state, types, product data
    ├── useStore.ts  types.ts  products.data.ts
```

- **One meaningful component per section**; one reusable component per repeated item (cards).
- Do not fragment plain text/buttons/icons into single-use files.
- Keep dead code out. If a component is no longer imported anywhere, delete it.

---

## 3. Design system (enforce strictly)

The site has **one** identity: warm editorial DTC — **cream + brand red + deep ink + sage**.
There is no blue/slate/lime theme. Do not introduce off-palette colors.

**Use the `@theme` tokens in `src/index.css`.** They are available as Tailwind utilities:

| Token utility | Value | Role |
|---|---|---|
| `cream` / `cream-card` | `#FAF7F2` / `#F4EFE6` | page bg / raised tint |
| `ink` / `ink-muted` | `#15191E` / `#5C6470` | text |
| `brand` / `brand-dark` | `#E53935` / `#C62828` | primary action + hover |
| `sage` / `sage-light` | `#4A7C59` / `#EBF3EE` | organic / success |
| `powder` / `coral` | `#D8E8F5` / `#FDECEB` | matcha / coffee SKU accents |
| `line` | `#EAE3D8` | hairline borders |

- Prefer semantic utilities (`bg-cream`, `text-ink`, `border-line`, `text-brand`).
  Arbitrary hex (`bg-[#FAF7F2]`) is tolerated in existing markup but **new code must use tokens**,
  and never a hex outside the table above.
- Fonts: `font-sans`/`font-display` = Plus Jakarta Sans (headings, black weights, uppercase),
  `font-editorial-serif` = Playfair Display (italic accents), `font-mono` = system mono (labels).
- Radii: `rounded-2xl`/`rounded-3xl` for cards & controls; `rounded-full` for pills.

### Layout rhythm (keep consistent)
- Standard section: `py-24`, inner container `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- Section dividers: `border-t border-line`.
- **Hero is a single-viewport stage**: `min-h-[calc(100svh-104px)]` (104px ≈ announcement +
  navbar), vertically centered. A section should read on one screen, not be split across scrolls.
- The hero showcase frame (`#hero-stage`) is the mount point for the scroll-scrubbed animation.

---

## 4. Interaction & motion (HMI)

- Respect user control. **No full-page scroll-jacking.** The animated experience is
  hero-anchored; the rest of the page scrolls normally with light reveal-on-scroll.
- Honor `prefers-reduced-motion` for any scroll/scrub/parallax effect (provide a static fallback).
- All interactive controls need an accessible label and a visible focus/active state.
- Keep INP < 200ms: debounce scroll handlers, preload animation frames, avoid layout thrash.

---

## 5. Performance

- Images: plain `<img>` with explicit sizing where possible, `object-contain`/`object-cover`
  as appropriate, and `loading="lazy"` for anything below the fold (hero image excepted).
- Frame-sequence animations: preload and cache decoded frames; draw to a single `<canvas>`.
- Avoid base64 image blobs in JSX/state. Keep bundle lean; no unused deps.
- Targets: LCP < 2.5s, CLS < 0.1, INP < 200ms.

---

## 6. Data & types

- Static content is typed and centralized in `src/lib/store/` (`types.ts`, `products.data.ts`).
  Never hardcode raw data objects inside render logic.
- Mark static config `readonly` / `as const`. No `any`.

---

## 7. Checklist before delivering a change

1. [ ] `npx tsc --noEmit` passes (zero errors, zero `any`).
2. [ ] No off-palette colors introduced; new styling uses `@theme` tokens.
3. [ ] Section rhythm consistent (`py-24`, `max-w-7xl`) unless intentionally the hero/footer.
4. [ ] Interactive elements have labels + focus states; motion respects reduced-motion.
5. [ ] No newly-orphaned components left in the tree.
