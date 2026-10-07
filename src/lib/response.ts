import { NextResponse } from "next/server";

export interface ApiResponseSuccess<T> {
  success: true;
  data: T;
  meta: {
    timestamp: string;
    durationMs: number;
    operationType: "KV_GET" | "KV_REPLACE" | "SQL_PLUS_PLUS" | "BATCH_KV";
    cas?: string;
  };
}

export interface ApiResponseError {
  success: false;
  error: {
    code:
      | "SEAT_ALREADY_TAKEN"
      | "CAS_MISMATCH"
      | "VALIDATION_FAILED"
      | "NOT_FOUND"
      | "INTERNAL_ERROR";
    message: string;
    details?: unknown;
  };
}

export function apiSuccess<T>(
  data: T,
  meta: Omit<ApiResponseSuccess<T>["meta"], "timestamp">,
  status = 200
) {
  return NextResponse.json<ApiResponseSuccess<T>>(
    {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    },
    { status }
  );
}

export function apiError(
  code: ApiResponseError["error"]["code"],
  message: string,
  status = 400,
  details?: unknown
) {
  return NextResponse.json<ApiResponseError>(
    {
      success: false,
      error: { code, message, details },
    },
    { status }
  );
}
