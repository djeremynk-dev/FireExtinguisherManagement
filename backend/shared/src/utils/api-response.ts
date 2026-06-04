export const successResponse = (message: string, data?: unknown) => ({
  success: true,
  message,
  data
});

export const errorResponse = (message: string, errors?: unknown) => ({
  success: false,
  message,
  errors
});