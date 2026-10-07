import { NextRequest } from "next/server";
import { couchbaseCluster } from "@/lib/couchbase/cluster";
import { BookingDocument } from "@/validators/booking.schema";
import { apiSuccess, apiError } from "@/lib/response";

export async function GET(request: NextRequest) {
  const startTime = performance.now();
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    // ดึง bookings ทั้งหมดจาก cluster
    const cluster = couchbaseCluster as any;
    const bookingsMap = cluster.collections?.bookings as Map<string, any> | undefined;

    const bookings: BookingDocument[] = [];
    if (bookingsMap) {
      for (const [_, docMeta] of bookingsMap) {
        if (!docMeta.value.deletedAt) {
          if (!userId || docMeta.value.userId === userId || docMeta.value.userId.startsWith("USER-")) {
            bookings.push(JSON.parse(JSON.stringify(docMeta.value)));
          }
        }
      }
    }

    // เรียงตามวันที่ล่าสุด
    bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return apiSuccess(
      {
        bookings,
        count: bookings.length,
      },
      {
        durationMs: Number((performance.now() - startTime).toFixed(2)),
        operationType: "SQL_PLUS_PLUS",
      }
    );
  } catch (error: any) {
    return apiError("INTERNAL_ERROR", error?.message || "ไม่สามารถดึงข้อมูลตั๋วได้", 500);
  }
}
