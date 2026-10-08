export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AllowedImageMimeType = (typeof ALLOWED_IMAGE_MIME_TYPES)[number];

export type ImageValidationErrorCode =
  | "MISSING_FILE"
  | "EMPTY_FILE"
  | "FILE_TOO_LARGE"
  | "INVALID_FILE_TYPE"
  | "INVALID_IMAGE";

export type ImageValidationResult =
  | {
      ok: true;
      mimeType: AllowedImageMimeType;
      bytes: Uint8Array;
    }
  | {
      ok: false;
      code: ImageValidationErrorCode;
      message: string;
    };

function isJpeg(bytes: Uint8Array): boolean {
  return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
}

function isPng(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  );
}

function isWebp(bytes: Uint8Array): boolean {
  if (bytes.length < 12) return false;
  const riff =
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46;
  const webp =
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50;
  return riff && webp;
}

export function detectImageMimeType(
  bytes: Uint8Array
): AllowedImageMimeType | null {
  if (isJpeg(bytes)) return "image/jpeg";
  if (isPng(bytes)) return "image/png";
  if (isWebp(bytes)) return "image/webp";
  return null;
}

export function validatePrescriptionImage(
  file: File | null | undefined
): Promise<ImageValidationResult> {
  return validatePrescriptionImageBytes(file);
}

async function validatePrescriptionImageBytes(
  file: File | null | undefined
): Promise<ImageValidationResult> {
  if (!file || !(file instanceof File)) {
    return {
      ok: false,
      code: "MISSING_FILE",
      message: "Debes subir una imagen de la receta.",
    };
  }

  if (file.size === 0) {
    return {
      ok: false,
      code: "EMPTY_FILE",
      message: "El archivo está vacío.",
    };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return {
      ok: false,
      code: "FILE_TOO_LARGE",
      message: "La imagen no puede superar 5 MB.",
    };
  }

  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const detected = detectImageMimeType(bytes);

  if (!detected) {
    return {
      ok: false,
      code: "INVALID_IMAGE",
      message: "El archivo debe ser una imagen JPG, PNG o WebP válida.",
    };
  }

  const declared = file.type;
  if (
    declared &&
    declared !== detected &&
    !(declared === "image/jpg" && detected === "image/jpeg")
  ) {
    // Declared MIME is untrusted; still accept if magic bytes are valid,
    // but reject obvious mismatches with unsupported declared types.
    if (
      declared !== "application/octet-stream" &&
      !ALLOWED_IMAGE_MIME_TYPES.includes(declared as AllowedImageMimeType) &&
      declared !== "image/jpg"
    ) {
      return {
        ok: false,
        code: "INVALID_FILE_TYPE",
        message: "El archivo debe ser una imagen JPG, PNG o WebP.",
      };
    }
  }

  return { ok: true, mimeType: detected, bytes };
}

export function bytesToBase64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64");
}
