import { z } from "zod";

import { authSchema, userSchema } from "../schemas";

export type AuthResponse = z.infer<typeof authSchema>;
export type UserResponse = z.infer<typeof userSchema>;
