import { NextRequest } from "next/server";
import { ticketService } from "@/services/ticket.service";
import { apiSuccess, apiError } from "@/lib/response";
import { z } from "zod";

const ReleaseRequestSchema = z.object({
  seatId: z.string().min(1),
  userId: z.string().default("USER-GUEST-01"),
});

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  try {
    const body = await request.json();
    const validation = ReleaseRequestSchema.safeParse(body);

    if (!validation.success) {
      return apiError("VALIDATION_FAILED", "ข้อมูลคำขอไม่ถูกต้อง", 400);
    }

    const { seatId, userId } = validation.data;
    const seat = await ticketService.releaseHold(seatId, userId);

    return apiSuccess(
      {
        seat,
        message: "ยกเลิกการถือสิทธิ์ที่นั่งเรียบร้อย คืนที่นั่งสู่ระบบแล้ว",
      },
      {
        durationMs: Number((performance.now() - startTime).toFixed(2)),
        operationType: "KV_REPLACE",
      }
    );
  } catch (error: any) {
    return apiError("INTERNAL_ERROR", error?.message || "ไม่สามารถยกเลิกการถือสิทธิ์ได้", 400);
  }
}
