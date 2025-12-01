# Copilot Instructions for Polymarket Builders Program

## Project Overview

Next.js 16 app (App Router) using TypeScript, Tailwind, Storybook, i18next, TanStack Query, React Hook Form and Zod. The project uses Turbopack for development (`pnpm dev`).

## Architecture Patterns

### Path Aliases (tsconfig.json)

Use TypeScript path aliases instead of deep relative imports. Current aliases in `tsconfig.json`:

- `@assets/*` -> `./assets/*`
- `@src/*` -> `./src/*`
- `@components` -> `./src/components`
- `@constants` -> `./src/constants`
- `@data` -> `./src/data`
- `@hooks` -> `./src/hooks`
- `@screens` -> `./src/screens`
- `@services` -> `./src/services`
- `@stores` -> `./src/stores`
- `@themes` -> `./src/themes`
- `@utils` -> `./src/utils`

Example: `import { useI18n } from "@hooks";` (avoid `../../` chains).

### Screen / Feature Organization

Follow the controller-page pattern per feature:

- `src/screens/[feature]/page.tsx` — UI implementation (re-exported in `src/app/[route]/page.tsx`).
- `src/screens/[feature]/controller.ts` — Business logic as a hook (prefix `use`).
- `src/screens/[feature]/views/` — Small, reusable view components.

This keeps presentation and logic separated and makes testing and reuse easier.

### API Client & Extension Pattern

- Base HTTP client: `src/utils/client.ts` exports `BaseClient` which wraps Axios and exposes `setToken()` to manage auth headers.
- App-specific client: `src/data/api/client.ts` defines `APIClient` (extends `BaseClient`) and an `apiClient` instance constructed with `NEXT_PUBLIC_API_URL`. Curl logging is enabled in development.
- Add API methods using declaration merging inside `src/data/api/clients/` (see `color-client.ts` for an example). Example pattern:

```ts
declare module "../client" {
  interface APIClient {
    getColorList: () => Promise<BaseResponse<ColorModel[]>>;
  }
}

APIClient.prototype.getColorList = async function () {
  return apiClient.client.get(`${process.env.NEXT_PUBLIC_API_URL}/...`);
};
```

- Wrap these client methods with TanStack Query hooks in `src/data/queries/` to expose typed data-fetching to the UI.

### Provider Nesting

The app provider composition lives at `src/components/providers/index.tsx` and must be kept in this order (outer → inner):

`<FirebaseProvider>`
  `\u0002<ThemeProvider>`
    `\u0002\u0002<LanguageProvider>`
      `\u0002\u0002\u0002<QueryProvider>{children}</QueryProvider>`
    `\u0002\u0002</LanguageProvider>`
  `\u0002</ThemeProvider>`
`</FirebaseProvider>`

The exported component is `AppProvider` — use it to wrap pages or the app root as needed.

### Internationalization

- Translation resources are under `assets/locales/en` and `assets/locales/vi`, split into namespaces (e.g., `buttons`, `errors`, `translation`).
- The i18n bootstrap is in `src/utils/i18n.ts`. It exports `i18n`, `supportedLngs`, `defaultLng`, and `Namespace`/`Locale` types.
- Use the `useI18n()` hook from `src/hooks/useI18n.tsx` for a typed wrapper around `react-i18next`. Example usage:

```ts
const { t, changeLanguage, currentLanguage } = useI18n();
t('key');
t('key', { ns: 'buttons' });
```

### Client-Side Rendering Guard

For components that rely on browser-only APIs or must avoid hydration glitches, use `ClientPage` from `src/components/shared/client-page/index.tsx`:

```tsx
return <ClientPage>{/* client-only UI */}</ClientPage>;
```

## Development Workflow

### Scripts (package.json)

- `pnpm dev` — Start dev server with Turbopack (`next dev --turbopack`).
- `pnpm build` — Production build (`next build`).
- `pnpm start` — Start production server (`next start`).
- `pnpm lint` — Run linter (`eslint .`).
- `pnpm storybook` — Storybook dev (`storybook dev -p 6006`).
- `pnpm build-storybook` — Build Storybook.
- `pnpm clear` — Remove `.next`, `node_modules`, and `pnpm-lock.yaml`.

When running locally use `pnpm install` then `pnpm dev`.

### Adding UI Components

Use shadcn generator when adding components: `pnpm dlx shadcn@latest add [component-name]`. New UI components go into `src/components/ui/` and should be re-exported from `src/components/index.ts`.

### Form Validation

Keep Zod schemas in `src/constants/schema.ts` and use `react-hook-form` with `@hookform/resolvers/zod`:

```ts
const form = useForm<z.infer<typeof formSchema.signin>>({
  resolver: zodResolver(formSchema.signin),
});
```

### Route Constants

All routes are defined in `src/constants/route.ts` via a `Routes` object. Use it to keep routes consistent across the app.

## Configuration Notes

- Environment: `NEXT_PUBLIC_API_URL` is used to configure `APIClient` base URL.
- Axios: `src/utils/client.ts` can enable curl logging during development.
- Console removal: project config strips console logs in production builds except for errors.

## Common Gotchas

- Always include the `"use client"` directive in React files that use hooks or browser APIs.
- Auth uses cookie-based tokens (see `src/utils/cookies.ts`) and `BaseClient.setToken()` to attach `Authorization` header.
- Keep API client extension files in `src/data/api/clients/` and query wrappers in `src/data/queries/`.
- Export screens from `src/screens/index.ts` before importing them into routes to avoid circular imports.
