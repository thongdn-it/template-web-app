export const response = {
  successWithData: <T>(
    data: T,
    opts?: {
      code?: number;
      message?: string;
    }
  ) => {
    return {
      success: true,
      code: opts?.code || 200,
      message: opts?.message || "success",
      data,
    };
  },

  successWithPagination: <T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    opts?: {
      code?: number;
      message?: string;
    }
  ) => {
    return {
      success: true,
      code: opts?.code || 200,
      message: opts?.message || "success",
      data: {
        items: data,
        pagination: {
          total,
          page,
          limit,
        },
      },
    };
  },

  error: (
    errorCode: number,
    opts?: {
      message?: string;
      data?: unknown;
    }
  ) => {
    return {
      success: false,
      code: errorCode,
      message: opts?.message || "error",
      data: opts?.data,
    };
  },
};
