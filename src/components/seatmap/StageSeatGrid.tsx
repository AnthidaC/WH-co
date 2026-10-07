"use client";

import React from "react";
import { SeatDocument } from "@/validators/seat.schema";
import { Check } from "lucide-react";

interface StageSeatGridProps {
  seats: SeatDocument[];
  selectedSeatId: string | null;
  onSelectSeat: (seat: SeatDocument) => void;
  selectedZoneId: string | null;
  highlightSeatId?: string;
}

export const StageSeatGrid: React.FC<StageSeatGridProps> = ({
  seats,
  selectedSeatId,
  onSelectSeat,
  selectedZoneId,
  highlightSeatId = "seat::fujii-kaze-bkk::VIP-01",
}) => {
  const filteredSeats = selectedZoneId
    ? seats.filter((s) => s.zone === selectedZoneId)
    : seats;

  const rows = Array.from(new Set(filteredSeats.map((s) => s.row))).sort();

  return (
    <div className="bg-canvas border border-hairline-soft rounded-2xl p-6 sm:p-10 shadow-xs">
      {/* Stage Element - Minimal, Architectural */}
      <div className="max-w-md mx-auto mb-12 text-center">
        <div className="h-10 rounded-lg bg-ink text-canvas flex items-center justify-center font-medium text-xs tracking-widest uppercase">
          เวทีการแสดง (STAGE)
        </div>
        <p className="text-[11px] text-ink-muted mt-2 font-normal">
          ผังที่นั่งระยะจริง • อัปเดตสถานะแบบ Sub-millisecond Memory SLA
        </p>
      </div>

      {/* Seat Rows Grid */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {rows.map((row) => {
          const rowSeats = filteredSeats
            .filter((s) => s.row === row)
            .sort((a, b) => a.seatNumber - b.seatNumber);

          const rowZoneName = rowSeats[0]?.zoneName ?? `แถว ${row}`;
          const rowPrice = rowSeats[0]?.price ?? 0;

          return (
            <div key={row} className="space-y-2">
              <div className="flex items-center justify-between text-xs text-ink-muted px-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-ink">แถว {row}</span>
                  <span>•</span>
                  <span>{rowZoneName}</span>
                </div>
                <span className="font-mono text-ink">฿{rowPrice.toLocaleString()}</span>
              </div>

              {/* Seats Row Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-2.5">
                {rowSeats.map((seat) => {
                  const isSelected = selectedSeatId === seat.id;
                  const isAvailable = seat.status === "AVAILABLE";
                  const isHeld = seat.status === "HELD";
                  const isBooked = seat.status === "BOOKED";
                  const isTarget = seat.id === highlightSeatId;

                  let seatClasses =
                    "relative flex flex-col items-center justify-center min-h-[50px] sm:min-h-[52px] rounded-lg text-xs font-medium transition-all duration-200 select-none ";

                  if (isSelected) {
                    // Single Accent Voltage Rausch (#ff385c)
                    seatClasses +=
                      "bg-primary text-canvas border border-primary shadow-float scale-102 z-10 ";
                  } else if (isAvailable) {
                    seatClasses +=
                      "bg-canvas text-ink border border-hairline hover:border-ink hover:shadow-float cursor-pointer active:scale-98 ";
                    if (isTarget) {
                      seatClasses += "ring-2 ring-primary/80 border-primary shadow-xs ";
                    }
                  } else if (isHeld) {
                    const isBattleWonSeat = isTarget;
                    seatClasses += isBattleWonSeat
                      ? "bg-amber-100 text-amber-950 border-2 border-amber-500 shadow-md ring-2 ring-amber-400/60 animate-pulse "
                      : "bg-amber-50 text-amber-800 border border-amber-200/80 cursor-not-allowed opacity-90 ";
                  } else {
                    // Booked
                    seatClasses +=
                      "bg-surface-strong text-ink-muted/50 border border-transparent cursor-not-allowed ";
                  }

                  return (
                    <button
                      key={seat.id}
                      onClick={() => isAvailable && onSelectSeat(seat)}
                      disabled={!isAvailable}
                      title={`ที่นั่ง ${seat.label} (${seat.zoneName}) - ${
                        isAvailable
                          ? `฿${seat.price.toLocaleString()} (ว่าง)`
                          : isHeld
                          ? `กำลังรอชำระเงิน (${seat.heldByName || "จองชั่วคราว"})`
                          : "จำหน่ายแล้ว"
                      }`}
                      className={seatClasses}
                    >
                      {/* Micro Badge for Battle Target */}
                      {isTarget && isAvailable && (
                        <span className="absolute -top-1.5 px-1 py-0.2 rounded-full bg-primary text-canvas text-[8px] font-bold shadow-xs">
                          CAS
                        </span>
                      )}
                      {isTarget && isHeld && (
                        <span className="absolute -top-1.5 px-1.5 py-0.2 rounded-full bg-amber-600 text-canvas text-[8px] font-bold shadow-xs animate-bounce-short">
                          WINNER
                        </span>
                      )}

                      <span className="font-semibold text-[11px] sm:text-xs">
                        {seat.label}
                      </span>

                      <span className="text-[10px] mt-0.5 leading-none">
                        {isSelected ? (
                          <Check className="w-3 h-3 text-canvas inline stroke-[2.5]" />
                        ) : isAvailable ? (
                          <span className="text-ink-muted text-[10px] font-normal">ว่าง</span>
                        ) : isHeld ? (
                          <span className="text-amber-900 text-[9px] font-medium truncate max-w-[48px] block">
                            {seat.heldByName?.includes("Kaze-Fan")
                              ? seat.heldByName.replace("แฟนคลับ Kaze-", "")
                              : seat.heldByName?.includes("FAN-")
                              ? seat.heldByName
                              : "รอชำระ"}
                          </span>
                        ) : (
                          <span className="text-ink-muted/40 text-[9px]">ขายแล้ว</span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend Bar - Restrained & Clean */}
      <div className="mt-12 pt-6 border-t border-hairline-soft flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-ink-muted">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-canvas border border-hairline" />
          <span>ว่าง (พร้อมจอง)</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <span>ที่นั่งที่เลือก (Single Accent)</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-amber-50 border border-amber-200" />
          <span>รอชำระเงิน (Hold 5 นาที)</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-surface-strong" />
          <span>จำหน่ายแล้ว</span>
        </div>
      </div>
    </div>
  );
};
