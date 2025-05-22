import { z } from "zod";
import { extendZodWithOpenApi } from "@hono/zod-openapi";

extendZodWithOpenApi(z);

// Meta information for pagination
const paginationMetaSchema = z.object({
  total: z.number().openapi({ example: 100 }),
  page: z.number().openapi({ example: 1 }),
  limit: z.number().openapi({ example: 10 }),
});

// - Default Schema - //
export const defaultSchema = {
  email: z.string().email().openapi({ example: "thongdn.it@gmail.com" }),
  password: z.string().min(6).openapi({ example: "123456" }),

  /**
   * Create custom error response
   */
  errorResponse: (
    exampleCode: number = 400,
    exampleMessage: string = "error"
  ) =>
    z.object({
      success: z.boolean().openapi({ example: false }),
      code: z.number().openapi({ example: exampleCode }),
      message: z.string().optional().openapi({ example: exampleMessage }),
      data: z.any().optional().openapi({ description: "error data" }),
    }),

  /**
   * Create custom success response
   */
  successObjectResponse: (data: z.AnyZodObject) =>
    z.object({
      success: z.boolean().openapi({ example: true }),
      code: z.number().openapi({ example: 200 }),
      message: z.string().optional().openapi({ example: "success" }),
      data: data,
    }),

  /**
   * Create custom success response with pagination
   */
  successPaginationResponse: <T extends z.ZodTypeAny>(item: T) =>
    z.object({
      success: z.boolean().openapi({ example: true }),
      code: z.number().openapi({ example: 200 }),
      message: z.string().optional().openapi({ example: "success" }),
      data: z.object({
        items: z.array(item),
        pagination: paginationMetaSchema,
      }),
    }),
};
