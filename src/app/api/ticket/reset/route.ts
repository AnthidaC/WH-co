import { NextRequest } from "next/server";
import { seatRepository } from "@/repositories/seat.repository";
import { apiSuccess, apiError } from "@/lib/response";

export async function POST(_request: NextRequest) {
  const startTime = performance.now();
  try {
    await seatRepository.resetSeats();
    return apiSuccess(
      { message: "รีเซ็ตผังที่นั่งและสถานะเอกสารทั้งหมดกลับสู่ค่าเริ่มต้นเรียบร้อยแล้ว" },
      {
        durationMs: Number((performance.now() - startTime).toFixed(2)),
        operationType: "BATCH_KV",
      }
    );
  } catch (error: any) {
    return apiError("INTERNAL_ERROR", error?.message || "ไม่สามารถรีเซ็ตผังที่นั่งได้", 500);
  }
}
