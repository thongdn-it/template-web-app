import React from "react";

import type { Preview } from "@storybook/react";

import "../src/app/globals.css";
import { ThemeProvider } from "../src/components/providers/ThemeProvider";

const preview: Preview = {
  initialGlobals: {
    locale: "en",
    theme: "light",
  },

  globalTypes: {
    theme: {
      description: "Global theme for components",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: ["light", "dark"],
        dynamicTitle: true,
      },
    },
    locale: {
      description: "Internationalization locale",
      toolbar: {
        icon: "globe",
        items: [
          { value: "en", right: "🇺🇸", title: "English" },
          { value: "vi", right: "🇻🇳", title: "Việt Nam" },
        ],
      },
    },
  },

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
      layout: "centered",
    },
  },

  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || "light";

      return (
        <ThemeProvider defaultTheme={theme} storageKey="vite-ui-theme">
          <div className={theme}>
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
