import { couchbaseCluster } from "@/lib/couchbase/cluster";
import { SeatDocument, SeatDocumentSchema } from "@/validators/seat.schema";

export class SeatRepository {
  /**
   * ดึงข้อมูลที่นั่งพร้อม CAS token ด้วย Sub-millisecond Key-Value
   */
  async findByIdWithCas(seatId: string): Promise<{
    doc: SeatDocument;
    cas: string;
    latencyMs: number;
  }> {
    const result = await couchbaseCluster.get<SeatDocument>("seats", seatId);
    // Validate with Zod defensively
    const validated = SeatDocumentSchema.parse(result.value);
    return {
      doc: validated,
      cas: result.cas,
      latencyMs: result.latencyMs,
    };
  }

  /**
   * บันทึกการเปลี่ยนแปลงสถานะที่นั่งโดยใช้ CAS ป้องกัน Race Condition
   */
  async replaceWithCas(
    seatId: string,
    seat: SeatDocument,
    expectedCas: string,
    options?: { expirySeconds?: number }
  ): Promise<{ cas: string; latencyMs: number }> {
    // Validate before saving
    const validated = SeatDocumentSchema.parse(seat);
    return await couchbaseCluster.replace<SeatDocument>(
      "seats",
      seatId,
      validated,
      expectedCas,
      options
    );
  }

  /**
   * ดึงผังที่นั่งทั้งหมดของคอนเสิร์ต (จำลอง SQL++ query ผ่าน GSI Index)
   */
  async findByConcert(concertId: string, zone?: string): Promise<{
    seats: SeatDocument[];
    count: number;
    latencyMs: number;
  }> {
    const result = await couchbaseCluster.querySeats({ concertId, zone });
    return {
      seats: result.rows,
      count: result.count,
      latencyMs: result.latencyMs,
    };
  }

  /**
   * รีเซ็ตผังที่นั่งทั้งหมดกลับเป็นค่าเริ่มต้น
   */
  async resetSeats(): Promise<void> {
    couchbaseCluster.seedInitialData();
  }
}

export const seatRepository = new SeatRepository();
