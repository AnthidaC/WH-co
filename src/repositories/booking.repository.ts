import { couchbaseCluster } from "@/lib/couchbase/cluster";
import { BookingDocument, BookingDocumentSchema } from "@/validators/booking.schema";

export class BookingRepository {
  async create(booking: BookingDocument): Promise<{ cas: string; latencyMs: number }> {
    const validated = BookingDocumentSchema.parse(booking);
    return await couchbaseCluster.upsert<BookingDocument>("bookings", booking.id, validated);
  }

  async findById(bookingId: string): Promise<BookingDocument | null> {
    try {
      const res = await couchbaseCluster.get<BookingDocument>("bookings", bookingId);
      return BookingDocumentSchema.parse(res.value);
    } catch {
      return null;
    }
  }
}

export const bookingRepository = new BookingRepository();
