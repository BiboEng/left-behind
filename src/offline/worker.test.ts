import { describe, expect, it } from "vitest";
import { byteRangeResponse, parseByteRange } from "./worker.js";

describe("offline NASA audio byte ranges", () => {
  it("handles bounded, open-ended and suffix ranges without changing the requested bytes", async () => {
    const source = new Uint8Array([10, 20, 30, 40, 50]);
    for (const [header, expected, contentRange] of [
      ["bytes=1-3", [20, 30, 40], "bytes 1-3/5"],
      ["bytes=3-", [40, 50], "bytes 3-4/5"],
      ["bytes=-2", [40, 50], "bytes 3-4/5"],
      ["bytes=0-999", [10, 20, 30, 40, 50], "bytes 0-4/5"],
      ["bytes=-999", [10, 20, 30, 40, 50], "bytes 0-4/5"],
    ] as const) {
      const request = new Request("https://example.test/evidence/audio.wav", { headers: { Range: header } });
      const response = await byteRangeResponse(request, new Response(source, { headers: { "Content-Type": "audio/wav", "Content-Encoding": "gzip" } }));
      expect(response.status).toBe(206);
      expect(response.headers.get("Content-Range")).toBe(contentRange);
      expect(response.headers.get("Content-Type")).toBe("audio/wav");
      expect(response.headers.has("Content-Encoding")).toBe(false);
      expect(Number(response.headers.get("Content-Length"))).toBe(expected.length);
      expect([...new Uint8Array(await response.arrayBuffer())]).toEqual(expected);
    }
  });
  it("rejects unsatisfiable and malformed ranges instead of returning a misleading successful response", async () => {
    for (const header of ["bytes=5-", "bytes=3-1", "bytes=-0", "bytes=-", "bytes=0-1,3-4", "bytes=NaN-1", "bytes=9007199254740993-", "items=0-2"]) {
      expect(parseByteRange(header, 5)).toBeNull();
      const response = await byteRangeResponse(new Request("https://example.test/audio.wav", { headers: { Range: header } }), new Response("12345"));
      expect(response.status).toBe(416);
      expect(response.headers.get("Content-Range")).toBe("bytes */5");
      expect(await response.text()).toBe("");
    }
    expect(parseByteRange("bytes=0-", 0)).toBeNull();
  });
});
