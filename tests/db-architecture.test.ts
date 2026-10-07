import { describe, it, expect } from "vitest";
import { couchbaseCluster } from "@/lib/couchbase/cluster";
import { COLLECTIONS_DATA, ARCHITECTURE_META, CAS_LIFECYCLE_STEPS } from "@/data/db-architecture-data";
import { ConcertDocumentSchema } from "@/validators/concert.schema";
import { SeatDocumentSchema } from "@/validators/seat.schema";
import { BookingDocumentSchema } from "@/validators/booking.schema";

describe("Database Architecture & Presentation Schemas", () => {
  it("should have valid cluster overview with accurate metrics", () => {
    const overview = couchbaseCluster.getClusterOverview();
    expect(overview.bucket).toBe("main");
    expect(overview.scope).toBe("ticketing");
    expect(overview.clusterStatus).toBe("HEALTHY");
    expect(overview.counts.concerts).toBeGreaterThanOrEqual(2);
    expect(overview.counts.seats).toBeGreaterThanOrEqual(50);
    expect(overview.seatBreakdown.available).toBeGreaterThan(0);
  });

  it("should validate all 3 collections exist with matching Zod schemas", () => {
    const collectionIds = COLLECTIONS_DATA.map((c) => c.id);
    expect(collectionIds).toContain("seats");
    expect(collectionIds).toContain("concerts");
    expect(collectionIds).toContain("bookings");

    // Check sample documents validate cleanly against Zod schemas
    const seatsDef = COLLECTIONS_DATA.find((c) => c.id === "seats")!;
    const concertsDef = COLLECTIONS_DATA.find((c) => c.id === "concerts")!;
    const bookingsDef = COLLECTIONS_DATA.find((c) => c.id === "bookings")!;

    expect(() => SeatDocumentSchema.parse(seatsDef.sampleDocument)).not.toThrow();
    expect(() => ConcertDocumentSchema.parse(concertsDef.sampleDocument)).not.toThrow();
    expect(() => BookingDocumentSchema.parse(bookingsDef.sampleDocument)).not.toThrow();
  });

  it("should verify CAS lifecycle steps contain complete concurrency timeline", () => {
    expect(CAS_LIFECYCLE_STEPS.length).toBe(5);
    const stepNumbers = CAS_LIFECYCLE_STEPS.map((s) => s.stepNumber);
    expect(stepNumbers).toEqual(["01", "02", "03", "04", "05"]);

    const winnerStep = CAS_LIFECYCLE_STEPS.find((s) => s.status === "WINNER");
    const rejectedStep = CAS_LIFECYCLE_STEPS.find((s) => s.status === "REJECTED");
    expect(winnerStep).toBeDefined();
    expect(rejectedStep).toBeDefined();
  });

  it("should ensure deterministic key patterns follow standard Couchbase format", () => {
    for (const col of COLLECTIONS_DATA) {
      expect(col.keyPattern.startsWith(`${col.name.slice(0, -1)}::`) || col.keyPattern.startsWith(`${col.name}::`)).toBe(true);
      expect(col.fields.length).toBeGreaterThan(5);
      // Ensure all fields have required Thai descriptions
      for (const f of col.fields) {
        expect(f.descriptionTh.length).toBeGreaterThan(0);
      }
    }
  });
});
