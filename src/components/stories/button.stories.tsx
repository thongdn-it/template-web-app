import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../ui/button";

const meta: Meta<typeof Button> = {
  title: "ShadCN/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

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
  render: (args, { globals: { locale } }) => {
    const caption = getCaptionForLocale(locale);
    return <Button {...args}>{caption}</Button>;
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    size: "default",
  },
  render: (args, { globals: { locale } }) => {
    const caption = getCaptionForLocale(locale);
    return <Button {...args}>{caption}</Button>;
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    size: "default",
  },
  render: (args, { globals: { locale } }) => {
    const caption = getCaptionForLocale(locale);
    return <Button {...args}>{caption}</Button>;
  },
};
