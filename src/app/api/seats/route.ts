import { NextRequest } from "next/server";
import { seatRepository } from "@/repositories/seat.repository";
import { apiSuccess, apiError } from "@/lib/response";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const concertId = searchParams.get("concertId") || "fujii-kaze-bkk";
    const zone = searchParams.get("zone") || undefined;

    const result = await seatRepository.findByConcert(concertId, zone);

    return apiSuccess(
      {
        concertId,
        seats: result.seats,
        total: result.count,
        summary: {
          available: result.seats.filter((s) => s.status === "AVAILABLE").length,
          held: result.seats.filter((s) => s.status === "HELD").length,
          booked: result.seats.filter((s) => s.status === "BOOKED").length,
        },
      },
      {
        durationMs: result.latencyMs,
        operationType: "SQL_PLUS_PLUS",
      }
    );
  } catch (error: any) {
    return apiError("INTERNAL_ERROR", error?.message || "เกิดข้อผิดพลาดในการดึงผังที่นั่ง", 500);
  }
}
