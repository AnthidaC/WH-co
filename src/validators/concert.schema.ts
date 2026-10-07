import { z } from "zod";

export const ConcertZoneSchema = z.object({
  id: z.string(),
  name: z.string(), // เช่น "Matsuri VIP Box" หรือ "Kirari Catwalk"
  price: z.number().positive(),
  color: z.string().default("#ff385c"),
  totalSeats: z.number().int().positive().default(10),
  description: z.string().optional(),
});

export const ConcertDocumentSchema = z.object({
  _type: z.literal("concert"),
  id: z.string(),
  artist: z.string(), // "Fujii Kaze" หรือ "CORTIS"
  title: z.string(), // เช่น "Best of Fujii Kaze Live in Bangkok"
  subtitle: z.string().optional(),
  venue: z.string(), // "Impact Arena, Exhibition Hall"
  date: z.string(),
  time: z.string(),
  status: z.enum(["OPEN_FOR_SALE", "SOLD_OUT", "UPCOMING"]),
  posterUrl: z.string().optional(),
  zones: z.array(ConcertZoneSchema),

  // Audit Fields ตามมาตรฐาน GEMINI.md
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable().default(null),
  createdBy: z.string().default("system"),
  updatedBy: z.string().default("system"),
});

export type ConcertZone = z.infer<typeof ConcertZoneSchema>;
export type ConcertDocument = z.infer<typeof ConcertDocumentSchema>;
