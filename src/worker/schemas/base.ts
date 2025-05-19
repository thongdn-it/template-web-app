import { z } from "zod";
import { extendZodWithOpenApi } from "@hono/zod-openapi";

extendZodWithOpenApi(z);

// - Error Response - //
const errorResponse = (errorCode: number, errorMessage: string) =>
  z
    .object({
      success: z.literal(false).openapi({ example: false }),
      code: z.number().openapi({ example: errorCode }),
      message: z.string().optional().openapi({ example: errorMessage }),
      data: z.any().optional().openapi({ example: null }),
    })
    .openapi("ErrorResponse");

// - Success Response - //

type ResponseType = "object" | "array";

// Meta information for pagination
const paginationMetaSchema = z
  .object({
    total: z.number().openapi({ example: 100 }),
    page: z.number().openapi({ example: 1 }),
    limit: z.number().openapi({ example: 10 }),
  })
  .openapi("PaginationMeta");

// Success Response: Data is an Object
const successObjectResponse = <T extends z.ZodTypeAny>(data: T) =>
  z
    .object({
      success: z.literal(true).openapi({ example: true }),
      data,
      message: z.string().optional().openapi({ example: "success" }),
    })
    .openapi("SuccessObjectResponse");

// Success Response: Data is an Array
const successPaginationResponse = <T extends z.ZodTypeAny>(item: T) =>
  z
    .object({
      success: z.literal(true).openapi({ example: true }),
      data: z.object({
        items: z.array(item),
        meta: paginationMetaSchema,
      }),
      message: z.string().optional().openapi({ example: "success" }),
    })
    .openapi("SuccessPaginationResponse");

// - Default Schema - //
export const defaultSchema = {
  email: z.string().email(),
  password: z.string().min(6),

  /**
   * Create custom error response
   */
  createErrorResponse: (
    exampleCode: number = 400,
    exampleMessage: string = "error"
  ) => errorResponse(exampleCode, exampleMessage),

  createSuccessResponse: <T extends z.ZodTypeAny>(
    data: T,
    type?: ResponseType
  ) => {
    if (type) {
      if (type === "array") return successPaginationResponse(data);
      return successObjectResponse(data);
    }

    // Auto detect if not provided
    if (data instanceof z.ZodArray)
      return successPaginationResponse(data.element);
    if (data instanceof z.ZodObject) return successObjectResponse(data);

    // Default fallback
    return successObjectResponse(data);
  },
};
