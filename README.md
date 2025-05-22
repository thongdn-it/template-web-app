# ⚡️ Template Project: React + Vite + Hono + Cloudflare Workers

A modern, production-ready template for building fullstack web apps with React (frontend), Hono (backend), and Cloudflare Workers (serverless edge). Enjoy instant hot reload, type safety, API docs, and global deployment—all in one repo!

---

## 🚀 Features

- **React + Vite**: Lightning-fast frontend development
- **Hono**: Ultralight, modern backend framework for Cloudflare Workers
- **TypeScript**: End-to-end type safety
- **API Documentation**: Built-in OpenAPI/Swagger docs (Scalar)
- **Zod Validation**: Type-safe request/response validation
- **Cloudflare D1**: Edge database support (with SQL window functions)
- **Authentication**: JWT-based auth, ready for extension
- **ESLint & Prettier**: Code quality and formatting out of the box
- **Easy Deployment**: One command to deploy globally with Cloudflare
- **Smart Caching**: Built-in HTTP cache middleware, customizable per route

## 🛠️ Tech Stack

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Hono](https://hono.dev/)
- [Zod](https://zod.dev/)
- [Scalar](https://scalar.com/) (API Docs)
- Cloudflare Services:
  - [Cloudflare Workers](https://developers.cloudflare.com/workers/)
  - [Cloudflare D1](https://developers.cloudflare.com/d1/)
  - [Cloudflare KV](https://developers.cloudflare.com/kv)

---

## 📁 Folder Structure

```
template-project/
├── public/                   # Static assets (favicon, logos, etc.)
├── src/
│   ├── react-app/            # React frontend
│   │   ├── assets/           # Images, logos
│   │   ├── App.tsx           # Main React component
│   │   └── ...
│   └── worker/               # Cloudflare Worker (API backend)
│       ├── db/               # D1 database schema & access
│       ├── routes/           # API route definitions (RESTful, OpenAPI, pagination, ...)
│       ├── services/         # Business logic
│       ├── middlewares/      # Auth, admin, error handler, kv cache...
│       ├── schemas/          # Zod schemas for validation
│       ├── types/            # Shared types
│       ├── utils/            # Utility functions (hash, jwt, response, ...)
│       ├── index.ts          # Worker entry point
│       └── ...
├── .env                      # (Not committed) Local secrets
├── index.html                # React HTML template
├── package.json              # Project info & scripts
├── README.md                 # Project documentation
├── tsconfig*.json            # TypeScript configs
├── vite.config.ts            # Vite config
├── wrangler.json             # Cloudflare Worker config
```

---

## ⚡️ Getting Started

1. **Clone the repo:**
   ```bash
   git clone -b hono-cloudflare https://github.com/thongdn-it/template-web-app.git
   cd template-web-app
   ```
2. **Install dependencies:**
   ```bash
   pnpm install
   ```
3. **Start development:**

   ```bash
   pnpm run dev
   ```

   - App: [http://localhost:23600](http://localhost:23600).
   - _You can change dev port in [vite.config.ts](vite.config.ts)_

4. **Build for production:**
   ```bash
   pnpm run build
   ```
5. **Preview production build:**
   ```bash
   pnpm run preview
   ```
6. **Deploy to Cloudflare Workers:**
   ```bash
   npx wrangler deploy
   ```

---

## 📚 API Documentation

- Visit `/api/doc` (or see console for actual doc path) for live Swagger UI.
- Auth: Basic Auth (default: admin/123456)
- All API routes are type-safe, validated with Zod, and support OpenAPI docs.
- Pagination, search, cache and error handling are standardized.

---

## Cloudflare D1

- **Create database:**
  ```bash
   npx wrangler@latest d1 create template-project-develop
  ```
- **Create tables:**
  ```bash
   npx wrangler d1 execute template-project-develop --local --file=./src/worker/db/schema.sql
  ```
  Change `<database_name>` and `<database_id>` in [wrangler.json](./wrangler.json) with your config.
- **Query with pagination & total count:**
  - Use the window function `COUNT(*) OVER()` to get the total number of records and enable efficient pagination.
  - If there are no records, fallback to a traditional `COUNT(*)` query to get the total count.

---

## Cache

You can use one of options:

1. `"hono/cache"`(in [index.ts](./src/worker/index.ts))
2. `KV`(in [kv-cache.ts](./src/worker/middlewares/kv-cache.ts))

- Create a KV namespace

```bash
npx wrangler@latest kv namespace create KV
```

Change `<kv_id>` in [wrangler.json](./wrangler.json) with your config.

---

## 📝 License

This repo is open-source and available under the MIT license.

## 👤 Author

Template by **Thong Dang** — [thongdn.it@gmail.com](mailto:thongdn.it@gmail.com)

If you like this project, please ⭐️ star it or [buy me a coffee][buy_me_a_coffee_url]!

<p align="center">
    <img src="https://media.giphy.com/media/hXMGQqJFlIQMOjpsKC/giphy.gif" alt="template-mobile-app-buy-me-a-coffee" style="aspect-ratio:385/405;" width="200" />
</p>

[//]: # "reference links"
[buy_me_a_coffee_image_url]: https://media.giphy.com/media/hXMGQqJFlIQMOjpsKC/giphy.gif
[buy_me_a_coffee_url]: https://www.buymeacoffee.com/thongdn.it
