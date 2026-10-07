import { z } from "zod";

export const SeatStatusEnum = z.enum([
  "AVAILABLE", // ที่นั่งว่าง พร้อมให้จอง
  "HELD",      // อยู่ระหว่างรอชำระเงิน (มี TTL กำกับ)
  "BOOKED",    // ชำระเงินเรียบร้อยแล้ว
]);

export type SeatStatus = z.infer<typeof SeatStatusEnum>;

export const SeatDocumentSchema = z.object({
  _type: z.literal("seat"),
  id: z.string(), // "seat::<concertId>::<label>"
  concertId: z.string(), // เช่น "fujii-kaze-bkk" หรือ "cortis-debut-bkk"
  hallId: z.string().default("HALL-A"),
  zone: z.string(), // "MATSURI-VIP", "KIRARI-CATWALK", "SEATED-B"
  zoneName: z.string(), // ชื่อโซนภาษาไทย เช่น "Matsuri VIP Box"
  row: z.string(), // "A", "B", "C"
  seatNumber: z.number().int().positive(),
  label: z.string(), // เช่น "VIP-01"
  price: z.number().positive(),
  status: SeatStatusEnum,

  // Concurrency & Reservation Metadata
  heldBy: z.string().nullable().default(null),
  heldByName: z.string().nullable().default(null),
  heldUntil: z.string().datetime().nullable().default(null),
  bookingId: z.string().nullable().default(null),

  // Audit Fields ตามมาตรฐาน GEMINI.md
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable().default(null),
  createdBy: z.string().default("system"),
  updatedBy: z.string().default("system"),
});

export type SeatDocument = z.infer<typeof SeatDocumentSchema>;
