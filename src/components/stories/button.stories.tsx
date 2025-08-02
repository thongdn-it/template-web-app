import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "../ui/button";

const meta = {
  title: "shadcn/Button",
  argTypes: {
    variant: {
      control: { type: "select" },
      options: [
        "link",
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
      ],
      description: "The variant of the button",
    },
    size: {
      control: { type: "select" },
      options: ["default", "sm", "lg", "icon"],
      description: "The size of the button",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Whether the button is disabled",
    },
  },
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const getCaptionForLocale = (locale: string) => {
  switch (locale) {
    case "vi":
      return "Nút";
    default:
      return "Button";
  }
};

export const Default: Story = {
  args: {
    variant: "default",
    size: "default",
  },
  render: (args, context) => {
    const caption = getCaptionForLocale(context.globals.locale || "en");
    return <Button {...args}>{caption}</Button>;
  },
};
