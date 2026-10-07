"use client";

import React from "react";
import Link from "next/link";
import { X, RefreshCw, SlidersHorizontal, ArrowRight } from "lucide-react";
import { LatencyMonitor } from "./LatencyMonitor";
import { FanRushSimulator } from "./FanRushSimulator";
import { LiveDocViewer } from "./LiveDocViewer";
import { SeatDocument } from "@/validators/seat.schema";
import { RushBattleResult } from "@/services/ticket.service";

interface EngineDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  targetSeat: SeatDocument | null;
  casToken?: string;
  onSimulateRush: (fanCount: number) => Promise<RushBattleResult | null>;
  isSimulating: boolean;
  battleResult: RushBattleResult | null;
  onResetSeats: () => void;
  isResetting: boolean;
  lastKvLatency?: number;
  lastCasLatency?: number;
  lastQueryLatency?: number;
}

export const EngineDrawer: React.FC<EngineDrawerProps> = ({
  isOpen,
  onClose,
  targetSeat,
  casToken,
  onSimulateRush,
  isSimulating,
  battleResult,
  onResetSeats,
  isResetting,
  lastKvLatency,
  lastCasLatency,
  lastQueryLatency,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop: Subtle, clear overlay so background seat map remains clearly visible */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-ink/10 transition-opacity"
      />

      {/* Slide-over Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-canvas border-l border-hairline shadow-soft flex flex-col justify-between overflow-y-auto">
          {/* Drawer Header */}
          <div className="p-5 border-b border-hairline-soft bg-canvas flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center space-x-2.5">
              <SlidersHorizontal className="w-4 h-4 text-ink-muted" />
              <div>
                <h3 className="text-sm font-semibold text-ink tracking-tight">
                  Couchbase Engine Inspector
                </h3>
                <p className="text-xs text-ink-muted">
                  แผงตรวจสอบการทำงาน In-Memory & CAS Concurrency
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-surface-soft text-ink-muted hover:text-ink transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-5 sm:p-6 space-y-6 flex-1">
            {/* 1. Latency Monitor */}
            <LatencyMonitor
              lastKvLatency={lastKvLatency}
              lastCasLatency={lastCasLatency}
              lastQueryLatency={lastQueryLatency}
            />

            {/* 2. Concurrency Battle Simulator */}
            <FanRushSimulator
              targetSeatLabel={targetSeat?.label || "VIP-01"}
              targetSeatId={targetSeat?.id || "seat::fujii-kaze-bkk::VIP-01"}
              onSimulate={onSimulateRush}
              isSimulating={isSimulating}
              battleResult={battleResult}
            />

            {/* 3. Live Couchbase Document Viewer */}
            <LiveDocViewer seat={targetSeat} casToken={casToken} />

            {/* 4. Architecture Deep-Dive Link */}
            <div className="pt-2 border-t border-hairline-soft">
              <Link
                href="/db-architecture"
                className="group flex items-center justify-between p-3.5 rounded-xl bg-surface-soft hover:bg-canvas border border-hairline hover:border-accent/40 transition-all shadow-subtle hover:shadow-float"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-semibold text-xs shrink-0">
                    CB
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-ink flex items-center gap-1.5 group-hover:text-accent transition-colors">
                      <span>ดูพิมพ์เขียวสถาปัตยกรรม Couchbase Blueprint</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 transform group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-[11px] text-ink-muted truncate">
                      ทำความรู้จัก Couchbase, Memory-First, CAS Token, TTL และ N1QL
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-hairline-soft bg-surface-soft/60 flex items-center justify-between sticky bottom-0">
            <button
              onClick={onResetSeats}
              disabled={isResetting}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-medium text-ink-muted hover:text-ink bg-canvas border border-hairline hover:border-ink/20 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? "animate-spin" : ""}`} />
              <span>รีเซ็ตผังที่นั่ง</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-ink text-canvas text-xs font-medium hover:bg-ink/90 transition-colors"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
