import { z } from "zod";

import { defaultSchema } from "./base";

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  full_name: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  last_login: z.string().datetime().optional(),
  is_active: z.boolean().default(true),
  is_verified: z.boolean().default(false),
});

export const authSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  user: userSchema,
});

export const responseSchema = {
  error: defaultSchema.createErrorResponse(),
  auth: defaultSchema.createSuccessResponse(authSchema),
};
