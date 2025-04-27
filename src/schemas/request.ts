import { z } from "zod";
import { defaultSchema } from "./base";

const { email: emailSchema, password: passwordSchema } = defaultSchema;

export const requestSchema = {
  login: z.object({
    email: emailSchema.openapi({ example: "thong@gmail.com" }),
    password: passwordSchema.openapi({ example: "123456" }),
  }),
  register: z.object({
    email: emailSchema,
    password: passwordSchema,
    fullName: z.string().optional(),
  }),
};
