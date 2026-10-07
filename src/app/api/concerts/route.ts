import { NextRequest } from "next/server";
import { concertRepository } from "@/repositories/concert.repository";
import { apiSuccess, apiError } from "@/lib/response";

export async function GET(request: NextRequest) {
  const startTime = performance.now();
  try {
    const searchParams = request.nextUrl.searchParams;
    const concertId = searchParams.get("id");

    if (concertId) {
      const concert = await concertRepository.findById(concertId);
      if (!concert) {
        return apiError("NOT_FOUND", "ไม่พบคอนเสิร์ตที่ระบุ", 404);
      }
      return apiSuccess(
        concert,
        {
          durationMs: Number((performance.now() - startTime).toFixed(2)),
          operationType: "KV_GET",
        }
      );
    }

    const concerts = await concertRepository.findAll();
    return apiSuccess(
      concerts,
      {
        durationMs: Number((performance.now() - startTime).toFixed(2)),
        operationType: "SQL_PLUS_PLUS",
      }
    );
  } catch (error: any) {
    return apiError("INTERNAL_ERROR", error?.message || "เกิดข้อผิดพลาดในการดึงข้อมูลคอนเสิร์ต", 500);
  }
}
