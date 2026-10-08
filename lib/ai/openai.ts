import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

import {
  PRESCRIPTION_SYSTEM_INSTRUCTION,
  PRESCRIPTION_USER_PROMPT,
} from "@/lib/ai/prompts";
import type { AllowedImageMimeType } from "@/lib/validations/image";
import {
  prescriptionExtractionSchema,
  type PrescriptionExtraction,
} from "@/lib/validations/prescription";

const DEFAULT_MODEL = "gpt-4.1-mini";
const REQUEST_TIMEOUT_MS = 55_000;

export class OpenAIConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OpenAIConfigError";
  }
}

export class OpenAIResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OpenAIResponseError";
  }
}

function getApiKey(): string {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) {
    throw new OpenAIConfigError("MISSING_API_KEY");
  }
  return key;
}

function getModel(): string {
  const model = process.env.OPENAI_MODEL?.trim();
  return model && model.length > 0 ? model : DEFAULT_MODEL;
}

export type ExtractPrescriptionInput = {
  mimeType: AllowedImageMimeType;
  base64Data: string;
};

export async function extractPrescriptionFromImage(
  input: ExtractPrescriptionInput
): Promise<PrescriptionExtraction> {
  const apiKey = getApiKey();
  const model = getModel();
  const client = new OpenAI({
    apiKey,
    timeout: REQUEST_TIMEOUT_MS,
    maxRetries: 0,
  });

  const response = await client.responses.parse({
    model,
    store: false,
    temperature: 0.1,
    instructions: PRESCRIPTION_SYSTEM_INSTRUCTION,
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: PRESCRIPTION_USER_PROMPT },
          {
            type: "input_image",
            image_url: `data:${input.mimeType};base64,${input.base64Data}`,
            detail: "high",
          },
        ],
      },
    ],
    text: {
      format: zodTextFormat(
        prescriptionExtractionSchema,
        "prescription_extraction"
      ),
    },
  });

  if (response.status === "incomplete" || response.status === "failed") {
    throw new OpenAIResponseError(
      `Incomplete or failed response: ${response.status}`
    );
  }

  const refusal = response.output
    ?.flatMap((item) =>
      item.type === "message" ? item.content : []
    )
    .find((part) => part.type === "refusal");

  if (refusal) {
    throw new OpenAIResponseError("Model refused the request");
  }

  if (!response.output_parsed) {
    throw new OpenAIResponseError("Empty or unparsed model response");
  }

  // zodTextFormat already validates; re-parse for a hard contract boundary.
  const result = prescriptionExtractionSchema.safeParse(response.output_parsed);
  if (!result.success) {
    throw new OpenAIResponseError("Schema validation failed");
  }

  return result.data;
}
