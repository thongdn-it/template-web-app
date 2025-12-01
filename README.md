# Template Web App

A modern Next.js starter template (App Router) using TypeScript, preconfigured with common tools and patterns for building scalable web applications.

Core stack: Next.js 16 · React 19 · TypeScript

Live demo: [https://template-web-app.vercel.app/](https://template-web-app.vercel.app/)

## Features

- Next.js 16 (App Router) with Turbopack for fast local development
- TypeScript (strict mode)
- Tailwind CSS and `shadcn/ui` (Radix) for reusable UI components
- Dark mode with `next-themes`
- Firebase Authentication (email/password + Google)
- Internationalization with `react-i18next` (English and Vietnamese)
- TanStack Query + Axios for data fetching and caching
- React Hook Form + Zod for forms and validation
- Storybook for component development
- ESLint and Prettier configured


## Quick Start

Requirements: Node.js >= 20, `pnpm` (recommended) or `npm`.

```bash
# clone
git clone https://github.com/thongdn-it/template-web-app.git -b nextJS
cd template-web-app

# install dependencies
pnpm install

# run dev server
pnpm dev
```

Open http://localhost:3000


## Useful Scripts

```bash
pnpm dev              # Start development server (Turbopack)
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm storybook        # Run Storybook (port 6006)
pnpm build-storybook  # Build Storybook
pnpm clear            # Clean .next, node_modules, lockfile
```


## Environment Variables

Add a `.env.local` with the values you need. Example:

```env
NEXT_PUBLIC_API_URL=https://api.sampleapis.com/
NEXT_PUBLIC_SITE_URL=https://example.com
NEXT_PUBLIC_REPO_URL=https://github.com/thongdn-it/template-web-app
NEXT_PUBLIC_LICENSE=MIT

# Firebase (if used)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```


## Project Structure

```
template-web-app/
├── .storybook/              # Storybook configuration
├── assets/                  # Static assets and locales
├── public/                  # Public static files
├── src/
│   ├── app/                 # App Router (layout, pages)
│   ├── components/          # UI components and shared widgets
│   ├── constants/           # App constants
│   ├── data/                # API clients and queries
│   ├── hooks/               # Custom hooks
│   ├── screens/             # Feature screens (controller-page pattern)
│   ├── services/            # External services (Firebase, analytics)
│   └── utils/               # Utility helpers
└── ...
```


## Architecture Patterns

 - Controller-Page: separate UI (`page.tsx`) and business logic (`controller.ts`) per screen.
 - API client extension: extend the central API client using declaration merging and wrap calls in TanStack Query hooks.
 - Path aliases: use `@components`, `@hooks`, `@constants`, etc. defined in `tsconfig.json`.

## Example: Controller-Page

```ts
// screens/home/controller.ts
export const useHomePageController = () => {
  const { data, isLoading } = useGetDataQuery();
  const handleClick = () => { /* ... */ };
  return { data, isLoading, handleClick };
};

// screens/home/page.tsx
export default function HomePage() {
  const { data, isLoading, handleClick } = useHomePageController();
  return <div>{/* UI */}</div>;
}
```


## Internationalization (i18n)

- Translations live in `assets/locales/{en,vi}`. Default namespace is `translation`.
- Use the `useI18n()` hook to access `t()` and `changeLanguage()`.

```tsx
const { t } = useI18n();
return <h1>{t('welcome')}</h1>;
```


## Authentication (Firebase)

- Firebase helpers are in `src/services/firebase`.
- `useAuth()` exposes common actions: sign in/up, sign out, link/unlink providers.
- The project includes an email-first login dialog with provider detection and explicit linking flow: `src/components/shared/login-dialog`.


## Provider Nesting

Keep the provider order in `src/components/providers/index.tsx`:

```tsx
<FirebaseProvider>
  <ThemeProvider>
    <LanguageProvider>
      <QueryProvider>{children}</QueryProvider>
    </LanguageProvider>
  </ThemeProvider>
</FirebaseProvider>
```


## Adding UI Components (shadcn/ui)

Install a component via shadcn:

```bash
pnpm dlx shadcn@latest add button
```

Components live in `src/components/ui/` and are re-exported via `src/components/index.ts`.


## Code Quality

- ESLint + Prettier
- TypeScript strict checks


## Deployment

Recommended: Vercel (supports App Router well).

```bash
pnpm add -g vercel
vercel
```


## License

This project defaults to the MIT license. Update the `LICENSE` file if you prefer a different license.


## 👤 Author

**Thong Dang**
 
- Email: thongdn.it@gmail.com
- GitHub: [@thongdn-it](https://github.com/thongdn-it)
- Website: [https://github.com/thongdn-it](https://github.com/thongdn-it)

 
<p align="center">
  <a href="https://www.buymeacoffee.com/thongdn.it">
    <img src="https://media.giphy.com/media/hXMGQqJFlIQMOjpsKC/giphy.gif" alt="Buy me a coffee" width="200" />
  </a>
</p>
 
<p align="center">
  If you find this template helpful, please consider giving it a ⭐️
</p>
