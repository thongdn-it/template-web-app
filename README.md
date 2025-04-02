# NextJS App

## Features

- NextJS.
- shadcn/ui.
- lucide-react.
- Dark mode support (next-theme).
- Internationalization using i18next.
- Environment variable configuration (.env).
- HTTP client integration with Axios and TanStack Query. (demo using RESTful API from https://sampleapis.com).
- Storybook.

## Tech Stack

| Library               | Version  | Description                                                           |
| --------------------- | -------- | --------------------------------------------------------------------- |
| NextJS                | v15      |                                                                       |
| shadcn/ui             | v4       | `pnpm dlx shadcn@latest add ...`                                      |
| react-i18next         | ^15.4.1  | Internationalization framework for React                              |
| date-fns              | ^4.1.0   | Modern JavaScript date utility library                                |
| lucide-react          | ^0.484.0 | Icon library for React                                                |
| axios                 | ^1.8.4   | HTTP client for making API requests                                   |
| @tanstack/react-query | ^5.71.1  | Powerful data fetching and caching library                            |
| @storybook/nextjs     | ^8.6.11  | a frontend workshop for building UI components and pages in isolation |

## Folder Structure

```
assets                      # Application assets
├── fonts                       # Font files
├── images                      # Images and icons
├── locales                     # Translation files
src
├── app                     # App Router | React Navigation
|   ├── layout.tsx              # Main Layout
|   ├── page.tsx                # Main Page
├── components              # Shared UI components
│   ├── providers               # UI providers used in the app
│   ├── shared                  # Custom UI
│   ├── stories                 # Storybook files
│   ├── ui                      # Components & Patterns (e.g., shadcn, gluestack)
│   ├── stories                 # Storybook configurations for UI components
├── data                    # Data handling, API calls, and caching
│   ├── api                     # API request handlers
│   ├── cache                   # Data caching logic
│   ├── queries                 # TanStack Query logic
├── hooks                   # Custom hooks
├── screens                     # Application screens | Features
│   ├── welcome
│       ├── controller.ts          # Business logic
│       ├── page.tsx               # UI implementation
├── services                # API services, Firebase integration, GraphQL, etc.
├── stores                  # Zustand
├── themes                  # Theme config
├── utils                   # Utility functions
...
```

## License

This repo is open-source and available under the MIT license.

## Author

This template is developed by Thong Dang. You can contact me at thongdn.it@gmail.com

If you like my project, you can [support me][buy_me_a_coffee_url] or star (like) for it.

<p align="center">
<img src="https://media.giphy.com/media/hXMGQqJFlIQMOjpsKC/giphy.gif" alt="template-mobile-app-buy-me-a-coffee" style="aspect-ratio:385/405;" width="200" /></p>

[//]: # "reference links"
[buy_me_a_coffee_image_url]: https://media.giphy.com/media/hXMGQqJFlIQMOjpsKC/giphy.gif
[buy_me_a_coffee_url]: https://www.buymeacoffee.com/thongdn.it
