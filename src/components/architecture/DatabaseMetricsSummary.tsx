"use client";

import React from "react";
import { Database, HardDrive, ShieldCheck, Zap, Activity, Layers } from "lucide-react";
import { ARCHITECTURE_META } from "@/data/db-architecture-data";

interface DatabaseMetricsSummaryProps {
  clusterStats?: {
    bucket: string;
    scope: string;
    clusterStatus: string;
    memoryEngine: string;
    counts: { concerts: number; seats: number; bookings: number };
    seatBreakdown: { available: number; held: number; booked: number };
    currentCasCounter: string;
    uptimeSeconds: number;
  } | null;
}

export const DatabaseMetricsSummary: React.FC<DatabaseMetricsSummaryProps> = ({
  clusterStats,
}) => {
  const counts = clusterStats?.counts ?? { concerts: 2, seats: 90, bookings: 0 };
  const breakdown = clusterStats?.seatBreakdown ?? { available: 90, held: 0, booked: 0 };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {/* Metric 1: In-Memory KV Speed */}
      <div className="bg-canvas border border-hairline rounded-xl p-4 shadow-xs space-y-1">
        <div className="flex items-center justify-between text-ink-muted text-xs">
          <span>Latency SLA</span>
          <Zap className="w-3.5 h-3.5 text-primary" />
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono text-ink tracking-tight">
          &lt; 0.5 ms
        </div>
        <div className="text-[11px] text-ink-muted truncate">
          Direct Memory Key-Value
        </div>
      </div>

      {/* Metric 2: Working Set Memory */}
      <div className="bg-canvas border border-hairline rounded-xl p-4 shadow-xs space-y-1">
        <div className="flex items-center justify-between text-ink-muted text-xs">
          <span>Memory Quota</span>
          <HardDrive className="w-3.5 h-3.5 text-ink-muted" />
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono text-ink tracking-tight">
          1,024 MB
        </div>
        <div className="text-[11px] text-ink-muted truncate">
          Bucket: <code className="font-mono text-ink">main</code>
        </div>
      </div>

      {/* Metric 3: Active Document Capacity */}
      <div className="bg-canvas border border-hairline rounded-xl p-4 shadow-xs space-y-1">
        <div className="flex items-center justify-between text-ink-muted text-xs">
          <span>Active Seats</span>
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono text-ink tracking-tight">
          {counts.seats} <span className="text-xs font-normal text-ink-muted font-sans">ที่นั่ง</span>
        </div>
        <div className="text-[11px] text-ink-muted flex items-center space-x-1 truncate font-mono">
          <span className="text-emerald-600 font-medium">{breakdown.available} ว่าง</span>
          <span>•</span>
          <span className="text-amber-600 font-medium">{breakdown.held} ล็อก</span>
          <span>•</span>
          <span className="text-ink-muted font-medium">{breakdown.booked} จอง</span>
        </div>
      </div>

      {/* Metric 4: CAS Protection Gate */}
      <div className="bg-canvas border border-hairline rounded-xl p-4 shadow-xs space-y-1">
        <div className="flex items-center justify-between text-ink-muted text-xs">
          <span>CAS Sequence</span>
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
        </div>
        <div className="text-sm sm:text-base font-bold font-mono text-primary truncate">
          {clusterStats?.currentCasCounter ? `#${clusterStats.currentCasCounter.slice(-7)}` : "ACTIVE"}
        </div>
        <div className="text-[11px] text-ink-muted truncate">
          Zero-Contention Gate
        </div>
      </div>
    </div>
  );
};
