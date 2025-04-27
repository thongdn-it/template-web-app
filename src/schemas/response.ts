import { z } from "zod";
import { defaultSchema } from "./base";

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  fullName: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  lastLogin: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
  isVerified: z.boolean().default(false),
});

export const authSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: userSchema,
});

export const responseSchema = {
  error: defaultSchema.createErrorResponse(),
  auth: defaultSchema.createSuccessResponse(authSchema),
};
