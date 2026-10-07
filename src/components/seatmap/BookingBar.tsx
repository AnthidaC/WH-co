"use client";

import React from "react";
import { SeatDocument } from "@/validators/seat.schema";
import { ChevronRight, Loader2 } from "lucide-react";

interface BookingBarProps {
  selectedSeat: SeatDocument | null;
  onHoldSeat: () => void;
  isLoading: boolean;
}

export const BookingBar: React.FC<BookingBarProps> = ({
  selectedSeat,
  onHoldSeat,
  isLoading,
}) => {
  if (!selectedSeat) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-canvas/95 backdrop-blur-md border-t border-hairline-soft py-3 px-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-ink-muted">
          <span>คลิกเลือกที่นั่งบนผังเพื่อดำเนินการจอง</span>
          <span className="hidden sm:inline font-mono text-[11px]">
            Couchbase In-Memory Atomic Lockless
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-canvas/98 backdrop-blur-md border-t border-hairline shadow-soft py-4 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Selected Seat Summary */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm text-ink">
                ที่นั่ง {selectedSeat.label} ({selectedSeat.zoneName})
              </span>
              <span className="text-xs text-ink-muted">แถว {selectedSeat.row}</span>
            </div>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-xs text-ink-muted">ยอดรวม:</span>
              <span className="text-lg font-bold text-ink">
                ฿{selectedSeat.price.toLocaleString()}
              </span>
              <span className="text-xs text-ink-muted">บาท</span>
            </div>
          </div>
        </div>

        {/* Primary Action Button (Single Accent Voltage Rausch #ff385c, 48px height) */}
        <div className="w-full sm:w-auto">
          <button
            onClick={onHoldSeat}
            disabled={isLoading}
            className="w-full sm:w-auto h-12 px-8 rounded-xl bg-primary hover:bg-primary-active text-canvas font-semibold text-sm flex items-center justify-center space-x-2 transition-all shadow-float active:scale-98 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>กำลังส่งคำขอจอง (CAS)...</span>
              </>
            ) : (
              <>
                <span>ดำเนินการจองที่นั่งนี้</span>
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
