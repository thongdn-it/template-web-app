import { z } from "zod";

const emailSchema = z.string().email({ message: "Invalid email address" });
const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" });

export const formSchema = {
  signin: z.object({
    email: emailSchema.min(1, { message: "Email is required" }),
    password: passwordSchema.min(1, { message: "Password is required" }),
  }),
};
