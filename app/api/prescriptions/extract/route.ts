import {
  ErrorCodes,
  errorResponse,
  mapOpenAIError,
  statusForImageError,
  successResponse,
} from "@/lib/api/errors";
import {
  extractPrescriptionFromImage,
  OpenAIConfigError,
  OpenAIResponseError,
} from "@/lib/ai/openai";
import {
  bytesToBase64,
  validatePrescriptionImage,
} from "@/lib/validations/image";

export const maxDuration = 60;

export async function POST(request: Request): Promise<Response> {
  try {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return errorResponse(
        ErrorCodes.MISSING_FILE,
        "Debes subir una imagen de la receta.",
        400
      );
    }

    const fileEntry = formData.get("image");
    const file = fileEntry instanceof File ? fileEntry : null;

    const validation = await validatePrescriptionImage(file);
    if (!validation.ok) {
      return errorResponse(
        validation.code,
        validation.message,
        statusForImageError(validation.code)
      );
    }

    const base64Data = bytesToBase64(validation.bytes);

    try {
      const data = await extractPrescriptionFromImage({
        mimeType: validation.mimeType,
        base64Data,
      });
      return successResponse(data);
    } catch (error) {
      if (error instanceof OpenAIConfigError) {
        return errorResponse(
          ErrorCodes.MISSING_API_KEY,
          "Falta la configuración de la API de OpenAI en el servidor.",
          500
        );
      }

      if (error instanceof OpenAIResponseError) {
        return errorResponse(
          ErrorCodes.INVALID_MODEL_RESPONSE,
          "No se pudo interpretar la respuesta del modelo. Inténtalo de nuevo.",
          502
        );
      }

      const mapped = mapOpenAIError(error);
      if (process.env.NODE_ENV === "development") {
        // Non-sensitive diagnostic: model/API error shape only (no image/content).
        console.error(
          "[prescriptions/extract]",
          error instanceof Error ? error.message.slice(0, 500) : "unknown error"
        );
      }
      return errorResponse(mapped.code, mapped.message, mapped.status);
    }
  } catch {
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      "Ocurrió un error inesperado. Inténtalo de nuevo.",
      500
    );
  }
}
