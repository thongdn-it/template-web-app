# Template Web App

A modern, production-ready Next.js starter template with TypeScript, featuring a complete development stack for building scalable web applications.

## ✨ Features

- **Next.js 16** with App Router and Turbopack
- **TypeScript** for type safety
- **Tailwind CSS 4** for styling
- **shadcn/ui** for beautiful UI components
- **Dark Mode** support with next-themes
- **Internationalization** (i18n) with react-i18next
- **Data Fetching** with TanStack Query and Axios
- **Form Management** with React Hook Form and Zod validation
- **Storybook 10** for component development
- **ESLint** configured for code quality

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/thongdn-it/template-web-app.git

# Navigate to project directory
cd template-web-app

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Available Scripts

```bash
pnpm dev              # Start development server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm storybook        # Start Storybook on port 6006
pnpm build-storybook  # Build Storybook for production
pnpm clear            # Clean cache and dependencies
```

## 🛠️ Tech Stack

| Library         | Version | Description                              |
| --------------- | ------- | ---------------------------------------- |
| Next.js         | 16.0.5  | React framework with App Router          |
| React           | 19.2.0  | UI library                               |
| TypeScript      | 5.x     | Type-safe JavaScript                     |
| Tailwind CSS    | 4.x     | Utility-first CSS framework              |
| shadcn/ui       | latest  | Re-usable components built with Radix UI |
| TanStack Query  | 5.90.11 | Data fetching and caching                |
| React Hook Form | 7.66.1  | Form state management                    |
| Zod             | 4.1.13  | Schema validation                        |
| i18next         | 25.6.3  | Internationalization framework           |
| Storybook       | 10.1.1  | Component development environment        |
| Axios           | 1.13.2  | HTTP client                              |
| Lucide React    | 0.555.0 | Icon library                             |

## 📁 Project Structure

```
template-web-app/
├── .storybook/              # Storybook configuration
├── assets/                  # Static assets
│   ├── fonts/                  # Font files
│   ├── images/                 # Images
│   └── locales/                # Translation files (en, vi)
├── public/                  # Public static files
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── (auth)/         # Auth routes group
│   ├── components/         # React components
│   │   ├── providers/      # Context providers
│   │   ├── shared/         # Shared components
│   │   ├── stories/        # Storybook stories
│   │   └── ui/             # shadcn/ui components
│   ├── constants/          # App constants
│   │   ├── route.ts        # Route definitions
│   │   └── schema.ts       # Validation schemas
│   ├── data/               # Data layer
│   │   ├── api/            # API clients
│   │   ├── models/         # Data models
│   │   └── queries/        # TanStack Query hooks
│   ├── hooks/              # Custom React hooks
│   ├── screens/            # Feature screens
│   │   └── [feature]/
│   │       ├── controller.ts  # Business logic
│   │       ├── page.tsx       # UI component
│   │       └── views/         # Sub-components
│   ├── services/           # External services
│   ├── utils/              # Utility functions
│   └── db/                 # Database utilities
└── ...
```

## 🎨 Architecture Patterns

### Controller-Page Pattern

Each feature follows a clean separation between UI and logic:

```typescript
// screens/home/controller.ts - Business logic
export const useHomePageController = () => {
  const { data, isLoading } = useGetDataQuery();
  const handleClick = () => { /* logic */ };
  return { data, isLoading, handleClick };
};

// screens/home/page.tsx - UI implementation
export default function HomePage() {
  const { data, isLoading, handleClick } = useHomePageController();
  return <div>{/* UI */}</div>;
}
```

### API Client Pattern

API methods are added via declaration merging:

```typescript
// data/api/clients/wine-client.ts
declare module "../client" {
  interface APIClient {
    getWineList: () => Promise<BaseResponse<WineModel[]>>;
  }
}

APIClient.prototype.getWineList = async function () {
  return this.client.get("/wines/reds");
};
```

Then wrapped in TanStack Query hooks:

```typescript
// data/queries/wine-query.ts
export const useGetWineListQuery = () => {
  return useQuery({
    queryKey: ["wine-list"],
    queryFn: apiClient.getWineList,
  });
};
```

### Path Aliases

Use TypeScript path aliases for clean imports:

```typescript
import { Button } from "@components";
import { Routes } from "@constants";
import { useI18n } from "@hooks";
import { apiClient } from "@data";
```

## 🌐 Internationalization

Translation files are organized by namespace in `assets/locales/{en,vi}/`:

```typescript
const { t } = useI18n();

// Default namespace (translation)
t("welcome");

// Specific namespace
t("signin", { ns: "buttons" });
```

## 🎯 Adding UI Components

Install shadcn/ui components:

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add form
```

Components are added to `src/components/ui/` and re-exported through `@components`.

## 🔧 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://api.sampleapis.com/
```

## 📝 Code Quality

- **Auto-format on save** - Prettier integration
- **Auto-organize imports** - ESLint configuration
- **Type checking** - TypeScript strict mode
- **Linting** - ESLint with Next.js and React rules

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

## 📄 License

This project is open-source and available under the MIT License.

## 👤 Author

**Thong Dang**

- Email: thongdn.it@gmail.com
- GitHub: [@thongdn-it](https://github.com/thongdn-it)
- Website: [https://github.com/thongdn-it](https://github.com/thongdn-it)

---

<p align="center">
  <a href="https://www.buymeacoffee.com/thongdn.it">
    <img src="https://media.giphy.com/media/hXMGQqJFlIQMOjpsKC/giphy.gif" alt="Buy me a coffee" width="200" />
  </a>
</p>

<p align="center">
  If you find this template helpful, please consider giving it a ⭐️
</p>
