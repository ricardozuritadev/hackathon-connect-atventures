import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { fillEmptyString, DEMO_PERSONA } from "@/lib/demo/persona";
import { userProfileSchema } from "@/lib/treatments/types";

describe("DEMO_PERSONA", () => {
  it("satisfies userProfileSchema", () => {
    const result = userProfileSchema.safeParse(DEMO_PERSONA.profile);
    assert.equal(result.success, true);
  });

  it("uses clearly fictional identity markers", () => {
    assert.match(DEMO_PERSONA.profile.fullName, /Demo/i);
    assert.match(DEMO_PERSONA.insurance.policyNumber, /^DEMO-/);
  });
});

describe("fillEmptyString", () => {
  it("fills empty values from demo data", () => {
    assert.equal(fillEmptyString("", "Andrea Demo"), "Andrea Demo");
    assert.equal(fillEmptyString("   ", "Andrea Demo"), "Andrea Demo");
  });

  it("preserves user-entered values", () => {
    assert.equal(fillEmptyString("María", "Andrea Demo"), "María");
  });
});
