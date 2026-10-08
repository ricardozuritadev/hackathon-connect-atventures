import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import {
  detectImageMimeType,
  MAX_IMAGE_BYTES,
  validatePrescriptionImage,
} from "./image";

describe("detectImageMimeType", () => {
  it("detects JPEG magic bytes", () => {
    const bytes = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
    assert.equal(detectImageMimeType(bytes), "image/jpeg");
  });

  it("detects PNG magic bytes", () => {
    const bytes = Uint8Array.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00,
    ]);
    assert.equal(detectImageMimeType(bytes), "image/png");
  });

  it("detects WebP magic bytes", () => {
    const bytes = Uint8Array.from([
      0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
    ]);
    assert.equal(detectImageMimeType(bytes), "image/webp");
  });

  it("rejects unknown bytes", () => {
    assert.equal(detectImageMimeType(Uint8Array.from([0x25, 0x50, 0x44, 0x46])), null);
  });
});

describe("validatePrescriptionImage", () => {
  it("accepts the synthetic PNG fixture", async () => {
    const buffer = readFileSync("tmp/synthetic-prescription.png");
    const file = new File([buffer], "synthetic-prescription.png", {
      type: "image/png",
    });
    const result = await validatePrescriptionImage(file);
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.mimeType, "image/png");
    }
  });

  it("rejects empty files", async () => {
    const file = new File([], "empty.png", { type: "image/png" });
    const result = await validatePrescriptionImage(file);
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.code, "EMPTY_FILE");
    }
  });

  it("rejects oversized files", async () => {
    const big = new Uint8Array(MAX_IMAGE_BYTES + 1);
    big[0] = 0xff;
    big[1] = 0xd8;
    big[2] = 0xff;
    const file = new File([big], "big.jpg", { type: "image/jpeg" });
    const result = await validatePrescriptionImage(file);
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.code, "FILE_TOO_LARGE");
    }
  });

  it("rejects PDF magic bytes", async () => {
    const pdf = Uint8Array.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34]);
    const file = new File([pdf], "doc.pdf", { type: "application/pdf" });
    const result = await validatePrescriptionImage(file);
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.code, "INVALID_IMAGE");
    }
  });
});
