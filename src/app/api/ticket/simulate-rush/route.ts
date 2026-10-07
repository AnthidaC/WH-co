import { NextRequest } from "next/server";
import { ticketService } from "@/services/ticket.service";
import { apiSuccess, apiError } from "@/lib/response";
import { z } from "zod";

const RushRequestSchema = z.object({
  seatId: z.string().min(1, "ต้องระบุ seatId"),
  fanCount: z.number().int().min(2).max(100).default(20),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = RushRequestSchema.safeParse(body);

    if (!validation.success) {
      return apiError(
        "VALIDATION_FAILED",
        validation.error.errors[0]?.message || "ข้อมูลคำขอไม่ถูกต้อง",
        400,
        validation.error.errors
      );
    }

    const { seatId, fanCount } = validation.data;
    const battleResult = await ticketService.simulateRushBattle(seatId, fanCount);

    return apiSuccess(
      battleResult,
      {
        durationMs: battleResult.durationTotalMs,
        operationType: "BATCH_KV",
      }
    );
  } catch (error: any) {
    return apiError("INTERNAL_ERROR", error?.message || "เกิดข้อผิดพลาดในการจำลองการกดบัตร", 500);
  }
}
