import { NextRequest } from "next/server";
import { ticketService } from "@/services/ticket.service";
import { apiSuccess, apiError } from "@/lib/response";
import { z } from "zod";

const ConfirmRequestSchema = z.object({
  seatId: z.string().min(1),
  userId: z.string().default("USER-GUEST-01"),
  userName: z.string().default("คุณ (ผู้ใช้งานปัจจุบัน)"),
});

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  try {
    const body = await request.json();
    const validation = ConfirmRequestSchema.safeParse(body);

    if (!validation.success) {
      return apiError("VALIDATION_FAILED", "ข้อมูลคำขอไม่ถูกต้อง", 400);
    }

    const { seatId, userId, userName } = validation.data;
    const result = await ticketService.confirmPayment(seatId, userId, userName);

    return apiSuccess(
      {
        booking: result.booking,
        seat: result.seat,
        message: "🎟️ ชำระเงินและออกบัตรคอนเสิร์ตสำเร็จเรียบร้อย!",
      },
      {
        durationMs: Number((performance.now() - startTime).toFixed(2)),
        operationType: "KV_REPLACE",
        cas: result.cas,
      }
    );
  } catch (error: any) {
    return apiError("INTERNAL_ERROR", error?.message || "การชำระเงินไม่สำเร็จ", 400);
  }
}
