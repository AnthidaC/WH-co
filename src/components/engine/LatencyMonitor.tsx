"use client";

import React from "react";
import { Activity } from "lucide-react";

interface LatencyMonitorProps {
  lastKvLatency?: number;
  lastCasLatency?: number;
  lastQueryLatency?: number;
}

export const LatencyMonitor: React.FC<LatencyMonitorProps> = ({
  lastKvLatency = 0.45,
  lastCasLatency = 0.92,
  lastQueryLatency = 2.40,
}) => {
  return (
    <div className="bg-canvas border border-hairline rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs font-semibold text-ink uppercase tracking-wider">
            Memory-First Latency Monitor
          </h4>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-soft text-ink border border-hairline-soft">
          Sub-millisecond SLA
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 text-center">
        {/* KV Read */}
        <div className="p-3 rounded-xl bg-surface-soft border border-hairline-soft">
          <span className="text-ink-muted text-[11px] block font-medium">RAM KV Read</span>
          <span className="text-base font-semibold font-mono text-ink block mt-0.5">
            {lastKvLatency.toFixed(2)} <span className="text-[10px] font-normal text-ink-muted">ms</span>
          </span>
          <span className="text-[9px] text-emerald-700 block mt-0.5 font-medium">Memory Cache</span>
        </div>

        {/* CAS Replace */}
        <div className="p-3 rounded-xl bg-surface-soft border border-hairline-soft">
          <span className="text-ink-muted text-[11px] block font-medium">CAS Atomic</span>
          <span className="text-base font-semibold font-mono text-ink block mt-0.5">
            {lastCasLatency.toFixed(2)} <span className="text-[10px] font-normal text-ink-muted">ms</span>
          </span>
          <span className="text-[9px] text-emerald-700 block mt-0.5 font-medium">Lockless</span>
        </div>

        {/* SQL++ Query */}
        <div className="p-3 rounded-xl bg-surface-soft border border-hairline-soft">
          <span className="text-ink-muted text-[11px] block font-medium">SQL++ GSI</span>
          <span className="text-base font-semibold font-mono text-ink block mt-0.5">
            {lastQueryLatency.toFixed(2)} <span className="text-[10px] font-normal text-ink-muted">ms</span>
          </span>
          <span className="text-[9px] text-ink-muted block mt-0.5 font-medium">Index Scan</span>
        </div>
      </div>
    </div>
  );
};
