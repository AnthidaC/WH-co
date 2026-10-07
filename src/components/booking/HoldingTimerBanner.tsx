"use client";

import React, { useEffect, useState } from "react";
import { SeatDocument } from "@/validators/seat.schema";
import { Clock } from "lucide-react";

interface HoldingTimerBannerProps {
  heldSeat: SeatDocument;
  onConfirmPayment: () => void;
  onReleaseSeat: () => void;
  isConfirming: boolean;
}

export const HoldingTimerBanner: React.FC<HoldingTimerBannerProps> = ({
  heldSeat,
  onConfirmPayment,
  onReleaseSeat,
  isConfirming,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300);

  useEffect(() => {
    if (!heldSeat.heldUntil) return;

    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((new Date(heldSeat.heldUntil!).getTime() - Date.now()) / 1000)
      );
      setSecondsRemaining(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [heldSeat.heldUntil]);

  const displayMin = Math.floor(secondsRemaining / 60);
  const displaySec = secondsRemaining % 60;
  const timeFormatted = `${String(displayMin).padStart(2, "0")}:${String(displaySec).padStart(2, "0")}`;

  return (
    <div className="bg-surface-soft border border-hairline rounded-2xl p-4 sm:p-5 mb-6 transition-all animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left Info */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-canvas border border-hairline flex items-center justify-center text-ink shrink-0">
            <Clock className="w-4 h-4 text-ink-muted" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm text-ink">
                สิทธิ์ถือครองที่นั่ง {heldSeat.label}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-canvas border border-hairline font-mono font-semibold text-ink">
                {timeFormatted}
              </span>
            </div>
            <p className="text-xs text-ink-muted mt-0.5">
              ระบบล็อกที่นั่งไว้ชั่วคราว 5 นาที (Document TTL) กรุณากรอกข้อมูลและชำระเงินก่อนหมดเวลา
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={onReleaseSeat}
            disabled={isConfirming}
            className="px-4 py-2 text-xs font-medium text-ink-muted hover:text-ink hover:bg-canvas rounded-full transition-colors"
          >
            สละสิทธิ์
          </button>
          <button
            onClick={onConfirmPayment}
            disabled={isConfirming || secondsRemaining <= 0}
            className="h-10 px-5 rounded-full bg-ink hover:bg-ink/90 text-canvas font-medium text-xs sm:text-sm flex items-center space-x-1.5 transition-all shadow-xs active:scale-98 disabled:opacity-50"
          >
            <span>กรอกข้อมูล & ชำระเงิน</span>
          </button>
        </div>
      </div>
    </div>
  );
};
