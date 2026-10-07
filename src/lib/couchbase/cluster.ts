import { CasMismatchError, DocumentNotFoundError } from "./errors";
import { ConcertDocument } from "@/validators/concert.schema";
import { SeatDocument } from "@/validators/seat.schema";
import { BookingDocument } from "@/validators/booking.schema";
import { SEED_CONCERTS, generateSeedSeats } from "./seed-data";

export interface DocumentMeta<T = unknown> {
  value: T;
  cas: string;
  expiry?: number; // timestamp in ms when document expires
  updatedAt: string;
}

class CouchbaseMemoryCluster {
  private static instance: CouchbaseMemoryCluster;
  private casCounter = 1000000n;

  // Storage Map: collection -> key -> DocumentMeta
  private collections: {
    concerts: Map<string, DocumentMeta<ConcertDocument>>;
    seats: Map<string, DocumentMeta<SeatDocument>>;
    bookings: Map<string, DocumentMeta<BookingDocument>>;
  } = {
    concerts: new Map(),
    seats: new Map(),
    bookings: new Map(),
  };

  private constructor() {
    this.seedInitialData();
  }

  public static getInstance(): CouchbaseMemoryCluster {
    if (!CouchbaseMemoryCluster.instance) {
      CouchbaseMemoryCluster.instance = new CouchbaseMemoryCluster();
    }
    return CouchbaseMemoryCluster.instance;
  }

  private generateCas(): string {
    const timeComponent = BigInt(Date.now());
    this.casCounter += 1n;
    return `${timeComponent}${this.casCounter}`;
  }

  public seedInitialData(): void {
    this.collections.concerts.clear();
    this.collections.seats.clear();
    this.collections.bookings.clear();

    // 1. Seed Concerts
    for (const concert of SEED_CONCERTS) {
      const cas = this.generateCas();
      this.collections.concerts.set(`concert::${concert.id}`, {
        value: JSON.parse(JSON.stringify(concert)),
        cas,
        updatedAt: new Date().toISOString(),
      });

      // 2. Seed Seats for each concert
      const seats = generateSeedSeats(concert.id);
      for (const seat of seats) {
        this.collections.seats.set(seat.id, {
          value: JSON.parse(JSON.stringify(seat)),
          cas: this.generateCas(),
          updatedAt: new Date().toISOString(),
        });
      }
    }
  }

  private getMap(collectionName: "concerts" | "seats" | "bookings"): Map<string, DocumentMeta<any>> {
    return this.collections[collectionName] as unknown as Map<string, DocumentMeta<any>>;
  }

  // --- Key-Value Engine (Sub-millisecond) ---

  public async get<T>(
    collectionName: "concerts" | "seats" | "bookings",
    key: string
  ): Promise<{ value: T; cas: string; latencyMs: number }> {
    const startTime = performance.now();
    const map = this.getMap(collectionName);
    const docMeta = map.get(key);

    if (!docMeta) {
      throw new DocumentNotFoundError(key);
    }

    // Check TTL expiration
    if (docMeta.expiry && Date.now() > docMeta.expiry) {
      if (collectionName === "seats") {
        const seat = docMeta.value as SeatDocument;
        if (seat.status === "HELD") {
          seat.status = "AVAILABLE";
          seat.heldBy = null;
          seat.heldByName = null;
          seat.heldUntil = null;
          seat.updatedAt = new Date().toISOString();
          docMeta.cas = this.generateCas();
          delete docMeta.expiry;
        }
      }
    }

    const latencyMs = Math.max(0.12, Number((performance.now() - startTime).toFixed(3)));

    return {
      value: JSON.parse(JSON.stringify(docMeta.value)) as T,
      cas: docMeta.cas,
      latencyMs,
    };
  }

  public async replace<T>(
    collectionName: "concerts" | "seats" | "bookings",
    key: string,
    newValue: T,
    expectedCas: string,
    options?: { expirySeconds?: number }
  ): Promise<{ cas: string; latencyMs: number }> {
    const startTime = performance.now();
    const map = this.getMap(collectionName);
    const existing = map.get(key);

    if (!existing) {
      throw new DocumentNotFoundError(key);
    }

    // Atomic CAS check
    if (existing.cas !== expectedCas) {
      throw new CasMismatchError(
        `CAS mismatch: document ${key} has CAS ${existing.cas}, but replace expected ${expectedCas}`
      );
    }

    const nextCas = this.generateCas();
    const expiry = options?.expirySeconds
      ? Date.now() + options.expirySeconds * 1000
      : undefined;

    map.set(key, {
      value: JSON.parse(JSON.stringify(newValue)),
      cas: nextCas,
      expiry,
      updatedAt: new Date().toISOString(),
    });

    const latencyMs = Math.max(0.24, Number((performance.now() - startTime).toFixed(3)));

    return {
      cas: nextCas,
      latencyMs,
    };
  }

  public async upsert<T>(
    collectionName: "concerts" | "seats" | "bookings",
    key: string,
    value: T,
    options?: { expirySeconds?: number }
  ): Promise<{ cas: string; latencyMs: number }> {
    const startTime = performance.now();
    const map = this.getMap(collectionName);
    const nextCas = this.generateCas();
    const expiry = options?.expirySeconds
      ? Date.now() + options.expirySeconds * 1000
      : undefined;

    map.set(key, {
      value: JSON.parse(JSON.stringify(value)),
      cas: nextCas,
      expiry,
      updatedAt: new Date().toISOString(),
    });

    const latencyMs = Math.max(0.35, Number((performance.now() - startTime).toFixed(3)));

    return {
      cas: nextCas,
      latencyMs,
    };
  }

  // --- SQL++ (N1QL) Simulated Query Engine ---

  public async querySeats(options?: {
    concertId?: string;
    zone?: string;
    status?: string;
  }): Promise<{ rows: SeatDocument[]; count: number; latencyMs: number }> {
    const startTime = performance.now();
    const results: SeatDocument[] = [];

    // Trigger TTL check across all seats
    const nowMs = Date.now();
    for (const [_, docMeta] of this.collections.seats) {
      const seat = docMeta.value;
      if (docMeta.expiry && nowMs > docMeta.expiry && seat.status === "HELD") {
        seat.status = "AVAILABLE";
        seat.heldBy = null;
        seat.heldByName = null;
        seat.heldUntil = null;
        seat.updatedAt = new Date().toISOString();
        docMeta.cas = this.generateCas();
        delete docMeta.expiry;
      }

      let match = true;
      if (options?.concertId && seat.concertId !== options.concertId) match = false;
      if (options?.zone && seat.zone !== options.zone) match = false;
      if (options?.status && seat.status !== options.status) match = false;

      if (match && !seat.deletedAt) {
        results.push(JSON.parse(JSON.stringify(seat)));
      }
    }

    // Sort by row and seatNumber
    results.sort((a, b) => {
      if (a.row !== b.row) return a.row.localeCompare(b.row);
      return a.seatNumber - b.seatNumber;
    });

    const latencyMs = Math.max(1.85, Number((performance.now() - startTime + 1.2).toFixed(3)));

    return {
      rows: results,
      count: results.length,
      latencyMs,
    };
  }

  public async getConcert(concertId: string): Promise<ConcertDocument | null> {
    const key = `concert::${concertId}`;
    const docMeta = this.collections.concerts.get(key);
    if (!docMeta || docMeta.value.deletedAt) return null;
    return JSON.parse(JSON.stringify(docMeta.value));
  }

  public async getAllConcerts(): Promise<ConcertDocument[]> {
    const concerts: ConcertDocument[] = [];
    for (const [_, docMeta] of this.collections.concerts) {
      if (!docMeta.value.deletedAt) {
        concerts.push(JSON.parse(JSON.stringify(docMeta.value)));
      }
    }
    return concerts;
  }

  public getClusterOverview() {
    let availableSeats = 0;
    let heldSeats = 0;
    let bookedSeats = 0;

    for (const [_, meta] of this.collections.seats) {
      if (meta.value.status === "AVAILABLE") availableSeats++;
      else if (meta.value.status === "HELD") heldSeats++;
      else if (meta.value.status === "BOOKED") bookedSeats++;
    }

    return {
      bucket: "main",
      scope: "ticketing",
      clusterStatus: "HEALTHY",
      memoryEngine: "In-Memory KV Cache & CAS",
      counts: {
        concerts: this.collections.concerts.size,
        seats: this.collections.seats.size,
        bookings: this.collections.bookings.size,
      },
      seatBreakdown: {
        available: availableSeats,
        held: heldSeats,
        booked: bookedSeats,
      },
      currentCasCounter: this.casCounter.toString(),
      uptimeSeconds: Math.floor(typeof process !== "undefined" && process.uptime ? process.uptime() : 0),
    };
  }
}

export const couchbaseCluster = CouchbaseMemoryCluster.getInstance();
