"use client";

import React from "react";
import { ConcertZone } from "@/validators/concert.schema";
import { SeatDocument } from "@/validators/seat.schema";

interface ZoneSelectorProps {
  zones: ConcertZone[];
  seats: SeatDocument[];
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string | null) => void;
}

export const ZoneSelector: React.FC<ZoneSelectorProps> = ({
  zones,
  seats,
  selectedZoneId,
  onSelectZone,
}) => {
  // คำนวณจำนวนที่นั่งว่างแต่ละโซน
  const getZoneStats = (zoneId: string) => {
    const zoneSeats = seats.filter((s) => s.zone === zoneId);
    const available = zoneSeats.filter((s) => s.status === "AVAILABLE").length;
    return {
      total: zoneSeats.length,
      available,
    };
  };

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-ink uppercase tracking-wider">
          เลือกโซนและราคาบัตร (Zones & Pricing)
        </h2>
        <span className="text-xs text-ink-muted hidden sm:inline">
          คลิกโซนเพื่อกรองเฉพาะผังที่ต้องการ
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* All Zones Button */}
        <button
          onClick={() => onSelectZone(null)}
          className={`p-3.5 rounded-xl text-left transition-all border ${
            selectedZoneId === null
              ? "bg-canvas border-ink shadow-sm ring-1 ring-ink/10"
              : "bg-surface-soft/60 border-hairline-soft hover:bg-canvas hover:border-hairline"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-ink">
              ทุกโซน (All Zones)
            </span>
            <span className="text-xs font-mono text-ink-muted">
              {seats.filter((s) => s.status === "AVAILABLE").length} ว่าง
            </span>
          </div>
          <span className="block text-xs text-ink-muted mt-1">แสดงผังรวมทั้งฮอลล์</span>
        </button>

        {/* Individual Zones */}
        {zones.map((zone) => {
          const isSelected = selectedZoneId === zone.id;
          const stats = getZoneStats(zone.id);
          const isSoldOut = stats.available === 0;

          return (
            <button
              key={zone.id}
              onClick={() => onSelectZone(zone.id)}
              className={`p-3.5 rounded-xl text-left transition-all border relative ${
                isSelected
                  ? "bg-canvas border-primary shadow-sm ring-1 ring-primary/20"
                  : "bg-surface-soft/60 border-hairline-soft hover:bg-canvas hover:border-hairline"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-ink block truncate">
                    {zone.name}
                  </span>
                  <span className="text-base font-bold text-ink mt-0.5 block">
                    ฿{zone.price.toLocaleString()}{" "}
                    <span className="text-xs font-normal text-ink-muted">บาท</span>
                  </span>
                </div>
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    isSoldOut
                      ? "bg-surface-strong text-ink-soft"
                      : stats.available === 1
                      ? "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse font-semibold"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  {isSoldOut ? "เต็มแล้ว" : `เหลือ ${stats.available} ที่`}
                </span>
              </div>
              {zone.description && (
                <span className="block text-[11px] text-ink-muted mt-2 line-clamp-1">
                  {zone.description}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
