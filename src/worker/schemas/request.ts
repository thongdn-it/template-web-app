import { z } from "zod";

import { defaultSchema } from "./base";

const { email: emailSchema, password: passwordSchema } = defaultSchema;

export const requestSchema = {
  register: z.object({
    email: emailSchema,
    password: passwordSchema,
    full_name: z.string().optional(),
  }),
  login: z.object({
    email: emailSchema,
    password: passwordSchema,
  }),
  refreshToken: z.object({
    refresh_token: z.string(),
  }),
  search: z.object({
    q: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).default(10),
  }),
};
