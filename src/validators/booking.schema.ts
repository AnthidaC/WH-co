import { z } from "zod";

export const BookingDocumentSchema = z.object({
  _type: z.literal("booking"),
  id: z.string(), // "booking::<id>"
  concertId: z.string(),
  seatId: z.string(),
  seatLabel: z.string(),
  zoneName: z.string(),
  userId: z.string(),
  userName: z.string(),
  pricePaid: z.number().positive(),
  paymentStatus: z.enum(["PAID", "FAILED", "EXPIRED"]),
  casToken: z.string(), // CAS token บันทึกความปลอดภัยตอน lock

  // Audit Fields
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable().default(null),
  createdBy: z.string(),
  updatedBy: z.string(),
});

export type BookingDocument = z.infer<typeof BookingDocumentSchema>;
