# Jostin Guzman Portfolio

Premium 3D interactive portfolio for architect Jostin Guzman, featuring WebGL parallax effects, liquid glass POI interactions, and a dramatic loading screen with volumetric lighting.

## Commands

- `pnpm dev` — Start development server (http://localhost:3000)
- `pnpm build` — Production build
- `pnpm start` — Start production server
- `pnpm lint` — Run ESLint
- `pnpm type-check` — Run TypeScript compiler

## Tech Stack

Next.js 15 + React 19 + TypeScript + Three.js (WebGL shaders) + GSAP animations + Tailwind CSS v4 + Vercel deployment

## Architecture

### Directory Structure
- `src/app/` — Next.js 15 app router pages (loading, menu, projects)
- `src/components/` — React components (LoadingScreen, Menu, ProjectRoom, POI, etc.)
- `src/lib/` — Three.js setup, shader loaders, POI manager, animation utilities
- `src/hooks/` — Custom hooks (useMouselight, useParallax, useScrollAnimation, useThreeScene)
- `src/data/` — JSON project data, TypeScript schemas
- `public/images/` — Project renders (3 parallax layers per project) + Jostin portrait
- `public/shaders/` — GLSL vertex & fragment shaders (volumetric light, parallax depth, POI glow)

### Key Patterns
1. **Server Components by default** — Fetch project data in layout, pass to client components
2. **Three.js Canvas Wrapper** — Encapsulated in React component with lifecycle management
3. **Shader as Assets** — GLSL files in `public/shaders/`, loaded via `/lib/shaders.ts`
4. **POI Raycasting** — Mouse tracking → detect hover via distance calculation (no physical raycasting)
5. **GSAP ScrollTrigger** — Animations tied to scroll position for narrative flow

### Data Flow
1. **Loading Screen** → Auto-redirect to `/menu` when animation completes
2. **Menu** → Server fetches all projects from `/api/projects`, renders cards
3. **Project Page** → URL slug triggers fetch of `/api/projects/[slug]`, all POI data loaded
4. **POI Interaction** → Client-side state (hovered POI) → render highlight + drawer content
5. **Navigation** → Next/Prev project links, Back to Menu button

## Code Organization Rules

1. **One component per file.** Max 300 lines. Extract sub-components if exceeding.
2. **Path alias:** Use `@/` to import from `src/` (configured in tsconfig.json).
3. **No barrel exports.** Import directly from file: `import { foo } from '@/lib/foo'` not `import { foo } from '@/lib'`.
4. **Server Components by default.** Only add "use client" when component needs React state, hooks, or interactivity.
5. **Colocate assets.** Keep component-specific assets (images, shaders) in same folder or `public/` mirroring structure.
6. **Naming:** Components PascalCase, utilities camelCase, constants UPPER_SNAKE_CASE.

## Design System

### Colors (Dark Luxury)
- Background: `#0a0a0a`
- Surface: `#1a1a1a`
- Accent (Gold): `#d4af37`
- Text Primary: `#f5f5f5`
- Text Secondary: `#a8a8a8`
- POI Glow (Blue): `#60a5fa`

### Typography
- Headings: Inter 700 (56px H1, 40px H2, 28px H3)
- Body: Inter 400 (18px large, 16px normal, 14px small)
- Code: JetBrains Mono 400 (14px)

### Style
- Border radius: 8px (default), 12px (cards), 50% (droplets)
- Shadows: Subtle `0 4px 16px rgba(0,0,0,0.4)`, elevated `0 12px 32px rgba(0,0,0,0.6)`
- Spacing base: 4px scale (4, 8, 12, 16, 24, 32, 48, 64, 96)
- Aesthetic: Minimal dark, sharp edges, smooth animations, glassmorphism (backdrop blur + transparency)

### Liquid Glass POI Droplet
```css
.poi-droplet {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: radial-gradient(135deg, rgba(96, 165, 250, 0.5) 0%, rgba(96, 165, 250, 0.2) 100%);
  border: 1px solid rgba(96, 165, 250, 0.6);
  backdrop-filter: blur(12px);
  box-shadow: 0 0 20px rgba(96, 165, 250, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1);
  cursor: pointer;
}
.poi-droplet:hover {
  box-shadow: 0 0 40px rgba(96, 165, 250, 0.8), inset 0 0 30px rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SITE_URL` | Production domain for og:url | No (MVP) |

## Reglas No Negociables

1. **No `any` types.** TypeScript strict mode — all types must be explicit.
2. **60fps animations.** Use GPU acceleration (transform, opacity, will-change), never animate height/width.
3. **Three.js cleanup.** Dispose geometries, textures, materials on component unmount (memory leak prevention).
4. **Shader compilation errors must throw.** Never silently fail shader loading.
5. **Mobile first responsive.** Test at 375px, 768px, 1280px widths. All interactions work on touch.
6. **No blocking main thread.** Parallax/animation calculations in requestAnimationFrame, not blocking scrolls.
7. **Image optimization.** Use Next.js `<Image>`, lazy loading, responsive sizes. No unoptimized PNGs.
8. **Environment variables never hardcoded.** Always use `.env.local` template.
9. **One commit per feature.** Descriptive messages, link issues if applicable.
10. **Vercel deployments must pass ESLint.** No build succeeds with lint errors.
