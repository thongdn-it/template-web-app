import { z } from "zod";

import { defaultSchema } from "./base";

const userSchema = z
  .object({
    id: z.string(),
    email: z.string().email(),
    full_name: z.string().optional(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    is_active: z.boolean(),
  })
  .openapi("UserResponse");

const authSchema = z
  .object({
    access_token: z.string(),
    refresh_token: z.string(),
    user: userSchema,
  })
  .openapi("AuthResponse");

const refreshTokenSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});

export const responseSchema = {
  error: defaultSchema.errorResponse(),
  auth: defaultSchema.successObjectResponse(authSchema),
  refreshToken: defaultSchema.successObjectResponse(refreshTokenSchema),
  user: defaultSchema.successObjectResponse(userSchema),
  users: defaultSchema.successPaginationResponse(userSchema),
};
