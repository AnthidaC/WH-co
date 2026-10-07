import { NextRequest } from "next/server";
import { ticketService } from "@/services/ticket.service";
import { apiSuccess, apiError } from "@/lib/response";
import { z } from "zod";

const HoldRequestSchema = z.object({
  seatId: z.string().min(1, "กรุณาระบุ seatId"),
  userId: z.string().default("USER-GUEST-01"),
  userName: z.string().default("คุณ (ผู้ใช้งานปัจจุบัน)"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = HoldRequestSchema.safeParse(body);

    if (!validation.success) {
      return apiError(
        "VALIDATION_FAILED",
        validation.error.errors[0]?.message || "ข้อมูลคำขอไม่ถูกต้อง",
        400,
        validation.error.errors
      );
    }

    const { seatId, userId, userName } = validation.data;

    const result = await ticketService.holdSeatWithCas(seatId, userId, userName);

    return apiSuccess(
      {
        seat: result.seat,
        message: "🎉 ล็อกที่นั่งสำเร็จ! กรุณาชำระเงินภายใน 5 นาที",
      },
      {
        durationMs: result.durationMs,
        operationType: "KV_REPLACE",
        cas: result.cas,
      }
    );
  } catch (error: any) {
    const msg = error?.message || "เกิดข้อผิดพลาดในการจองที่นั่ง";
    if (msg.includes("CAS_MISMATCH")) {
      return apiError(
        "CAS_MISMATCH",
        "⚠️ ขออภัย มีผู้ใช้อื่นกดจองที่นั่งนี้ตัดหน้าในเสี้ยววินาทีเดียวกัน (CAS Protection)",
        409
      );
    }
    if (msg.includes("SEAT_ALREADY_TAKEN")) {
      return apiError("SEAT_ALREADY_TAKEN", msg.replace("SEAT_ALREADY_TAKEN: ", ""), 409);
    }
    if (msg.includes("NOT_FOUND")) {
      return apiError("NOT_FOUND", "ไม่พบที่นั่งที่ระบุ", 404);
    }
    return apiError("INTERNAL_ERROR", msg, 500);
  }
}
