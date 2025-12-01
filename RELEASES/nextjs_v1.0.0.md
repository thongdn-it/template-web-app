# nextjs_v1.0.0 — Next.js 16 baseline

**Tag:** nextjs_v1.0.0  
**Release date:** 2025-12-01

## Summary
Initial Next.js 16 (App Router) baseline with TypeScript, Tailwind, Storybook, TanStack Query, React Hook Form + Zod, and a reusable API client.

## Highlights
- App Router + feature-based screens
- TypeScript + path aliases
- TanStack Query + React Hook Form + Zod

## Breaking changes
- `pages/` router removed — migrate to `app/` routes
- Add `"use client"` in files using hooks or browser APIs

## Quick upgrade steps
1. Checkout tag `nextjs_v1.0.0` and install deps: `pnpm install`
2. Add necessary env vars (e.g. `NEXT_PUBLIC_API_URL`) and update tsconfig paths
3. Run dev: `pnpm dev`; run storybook: `pnpm storybook`
