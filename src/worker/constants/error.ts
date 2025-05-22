export const ERRORS = {
  /** code: 400 */
  BAD_REQUEST: {
    code: 400,
    message: "Bad Request",
  },
  /** code: 401 */
  INVALID_CREDENTIALS: {
    code: 401,
    message: "Invalid credentials",
  },
  /** code: 401 */
  UNAUTHORIZED: {
    code: 401,
    message: "Unauthorized",
  },
  INVALID_REFRESH_TOKEN: {
    code: 401,
    message: "Invalid refresh token",
  },
  /** code: 404 */
  USER_NOT_FOUND: {
    code: 404,
    message: "User not found",
  },
  /** code: 409 */
  EMAIL_EXISTS: {
    code: 409,
    message: "Email already exists",
  },
  /** code: 500 */
  DATABASE_ERROR: {
    code: 500,
    message: "Database error",
  },
  /** code: 500 */
  UNKNOWN: {
    code: 500,
    message: "Unknown error",
  },
};
