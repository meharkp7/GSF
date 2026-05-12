import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  ApiRouteError,
  parseJsonBody,
  parseQuery,
  withRouteErrorHandling,
} from "./route-helpers";

function getJsonFromResponse(res: Response) {
  return res.json() as Promise<{
    error: string;
    code?: string;
    fieldErrors?: Record<string, string[] | undefined>;
  }>;
}

describe("lib/api/route-helpers", () => {
  describe("parseJsonBody()", () => {
    it("accepts and returns a valid JSON body matching the schema", async () => {
      const schema = z.object({
        name: z.string().min(1),
        age: z.number().int().nonnegative(),
      });

      const req = new Request("http://localhost/api/test", {
        method: "POST",
        body: JSON.stringify({ name: "Ada", age: 30 }),
        headers: { "content-type": "application/json" },
      });

      const data = await parseJsonBody(req, schema);
      expect(data).toEqual({ name: "Ada", age: 30 });
    });

    it("throws ApiRouteError with code INVALID_JSON for malformed JSON", async () => {
      const schema = z.object({ name: z.string() });

      const req = new Request("http://localhost/api/test", {
        method: "POST",
        body: "{not-valid-json",
        headers: { "content-type": "application/json" },
      });

      await expect(parseJsonBody(req, schema)).rejects.toMatchObject({
        status: 400,
        code: "INVALID_JSON",
        message: "Invalid JSON payload",
      });
    });

    it("throws ApiRouteError with code VALIDATION_ERROR for Zod validation errors (and includes fieldErrors)", async () => {
      const schema = z.object({
        name: z.string().min(2),
        age: z.number().int().nonnegative(),
      });

      const req = new Request("http://localhost/api/test", {
        method: "POST",
        body: JSON.stringify({ name: "A", age: -5 }),
        headers: { "content-type": "application/json" },
      });

      try {
        await parseJsonBody(req, schema);
        throw new Error("Expected parseJsonBody to throw");
      } catch (err) {
        expect(err).toBeInstanceOf(ApiRouteError);
        const e = err as ApiRouteError;
        expect(e.status).toBe(400);
        expect(e.code).toBe("VALIDATION_ERROR");
        expect(e.message).toBe("Validation failed");
        expect(e.fieldErrors).toBeDefined();
        expect(e.fieldErrors?.name?.length).toBeGreaterThan(0);
        expect(e.fieldErrors?.age?.length).toBeGreaterThan(0);
      }
    });
  });

  describe("parseQuery()", () => {
    it("parses valid query params from the request URL (including coercion)", () => {
      const schema = z.object({
        limit: z.coerce.number().int().positive(),
        q: z.string().min(1),
      });

      const req = new Request("http://localhost/api/test?limit=10&q=hello", {
        method: "GET",
      });

      const data = parseQuery(req, schema);
      expect(data).toEqual({ limit: 10, q: "hello" });
    });

    it("throws ApiRouteError with code VALIDATION_ERROR for invalid query params (and includes fieldErrors)", () => {
      const schema = z.object({
        limit: z.coerce.number().int().positive(),
        q: z.string().min(2),
      });

      const req = new Request("http://localhost/api/test?limit=-1&q=x", {
        method: "GET",
      });

      try {
        parseQuery(req, schema);
        throw new Error("Expected parseQuery to throw");
      } catch (err) {
        expect(err).toBeInstanceOf(ApiRouteError);
        const e = err as ApiRouteError;
        expect(e.status).toBe(400);
        expect(e.code).toBe("VALIDATION_ERROR");
        expect(e.message).toBe("Validation failed");
        expect(e.fieldErrors).toBeDefined();
        expect(e.fieldErrors?.limit?.length).toBeGreaterThan(0);
        expect(e.fieldErrors?.q?.length).toBeGreaterThan(0);
      }
    });
  });

  describe("withRouteErrorHandling()", () => {
    it("converts ApiRouteError into JSON response with correct HTTP status and payload", async () => {
      const wrapped = withRouteErrorHandling(async () => {
        throw new ApiRouteError(422, "Validation failed", {
          code: "VALIDATION_ERROR",
          fieldErrors: { email: ["Invalid email"], name: ["Required"] },
        });
      });

      const res = await wrapped();
      expect(res.status).toBe(422);

      const payload = await getJsonFromResponse(res);
      expect(payload).toMatchObject({
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        fieldErrors: {
          email: ["Invalid email"],
          name: ["Required"],
        },
      });
    });

    it("converts unexpected errors into a 500 INTERNAL_ERROR JSON response", async () => {
      const wrapped = withRouteErrorHandling(async () => {
        throw new Error("Boom");
      });

      const res = await wrapped();
      expect(res.status).toBe(500);

      const payload = await getJsonFromResponse(res);
      expect(payload).toEqual({
        error: "Internal server error",
        code: "INTERNAL_ERROR",
      });
    });
  });
});

