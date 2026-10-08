export const ErrorCodes = {
  MISSING_FILE: "MISSING_FILE",
  EMPTY_FILE: "EMPTY_FILE",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  INVALID_FILE_TYPE: "INVALID_FILE_TYPE",
  INVALID_IMAGE: "INVALID_IMAGE",
  MISSING_API_KEY: "MISSING_API_KEY",
  INVALID_API_KEY: "INVALID_API_KEY",
  RATE_LIMITED: "RATE_LIMITED",
  TIMEOUT: "TIMEOUT",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  INVALID_MODEL_RESPONSE: "INVALID_MODEL_RESPONSE",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export type ApiErrorBody = {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
  };
};

export type ApiSuccessBody<T> = {
  success: true;
  data: T;
};

export function errorResponse(
  code: ErrorCode,
  message: string,
  status: number
): Response {
  const body: ApiErrorBody = {
    success: false,
    error: { code, message },
  };
  return Response.json(body, { status });
}

export function successResponse<T>(data: T, status = 200): Response {
  const body: ApiSuccessBody<T> = { success: true, data };
  return Response.json(body, { status });
}

const IMAGE_ERROR_STATUS: Record<string, number> = {
  MISSING_FILE: 400,
  EMPTY_FILE: 400,
  FILE_TOO_LARGE: 413,
  INVALID_FILE_TYPE: 415,
  INVALID_IMAGE: 400,
};

export function statusForImageError(code: string): number {
  return IMAGE_ERROR_STATUS[code] ?? 400;
}

export function mapOpenAIError(error: unknown): {
  code: ErrorCode;
  message: string;
  status: number;
} {
  const status =
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as { status: unknown }).status === "number"
      ? (error as { status: number }).status
      : undefined;

  const raw =
    error instanceof Error
      ? `${error.name} ${error.message}`
      : String(error ?? "");
  const lower = raw.toLowerCase();

  if (
    status === 401 ||
    status === 403 ||
    lower.includes("api key") ||
    lower.includes("api_key") ||
    lower.includes("unauthorized") ||
    lower.includes("invalid_api_key") ||
    lower.includes("authentication")
  ) {
    return {
      code: ErrorCodes.INVALID_API_KEY,
      message:
        "La clave de la API de OpenAI no es válida o no tiene permisos.",
      status: 401,
    };
  }

  if (
    status === 429 ||
    lower.includes("rate limit") ||
    lower.includes("rate_limit") ||
    lower.includes("insufficient_quota") ||
    lower.includes("quota") ||
    lower.includes("billing")
  ) {
    return {
      code: ErrorCodes.RATE_LIMITED,
      message:
        "Se alcanzó el límite de uso o la cuota de OpenAI. Revisa tu plan e inténtalo más tarde.",
      status: 429,
    };
  }

  if (
    lower.includes("timeout") ||
    lower.includes("timed out") ||
    lower.includes("etimedout") ||
    lower.includes("aborted")
  ) {
    return {
      code: ErrorCodes.TIMEOUT,
      message: "La solicitud a OpenAI tardó demasiado. Inténtalo de nuevo.",
      status: 504,
    };
  }

  if (
    status === 404 ||
    lower.includes("model_not_found") ||
    lower.includes("does not exist") ||
    lower.includes("not found")
  ) {
    return {
      code: ErrorCodes.SERVICE_UNAVAILABLE,
      message:
        "El modelo de OpenAI configurado no está disponible. Revisa OPENAI_MODEL en las variables de entorno.",
      status: 502,
    };
  }

  if (
    status === 500 ||
    status === 502 ||
    status === 503 ||
    lower.includes("unavailable") ||
    lower.includes("overloaded") ||
    lower.includes("server_error")
  ) {
    return {
      code: ErrorCodes.SERVICE_UNAVAILABLE,
      message:
        "El servicio de OpenAI no está disponible temporalmente. Inténtalo más tarde.",
      status: 503,
    };
  }

  return {
    code: ErrorCodes.INTERNAL_ERROR,
    message: "No se pudo analizar la receta. Inténtalo de nuevo.",
    status: 500,
  };
}
