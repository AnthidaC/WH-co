import { NextRequest } from "next/server";
import { couchbaseCluster } from "@/lib/couchbase/cluster";
import { apiSuccess, apiError } from "@/lib/response";

export async function GET(_request: NextRequest) {
  try {
    const overview = couchbaseCluster.getClusterOverview();
    return apiSuccess(overview, {
      durationMs: 0.15,
      operationType: "KV_GET",
    });
  } catch (error: any) {
    return apiError(
      "INTERNAL_ERROR",
      error?.message || "ไม่สามารถดึงข้อมูลสถิติคลัสเตอร์ได้",
      500
    );
  }
}
