"use client";

import React, { useState } from "react";
import { RushBattleResult } from "@/services/ticket.service";
import { ShieldCheck, Loader2, ChevronRight } from "lucide-react";

interface FanRushSimulatorProps {
  targetSeatLabel: string;
  targetSeatId: string;
  onSimulate: (fanCount: number) => Promise<RushBattleResult | null>;
  isSimulating: boolean;
  battleResult: RushBattleResult | null;
}

export const FanRushSimulator: React.FC<FanRushSimulatorProps> = ({
  targetSeatLabel,
  targetSeatId,
  onSimulate,
  isSimulating,
  battleResult,
}) => {
  const [fanCount, setFanCount] = useState<number>(20);

  const handleLaunch = async () => {
    await onSimulate(fanCount);
  };

  return (
    <div className="bg-canvas border border-hairline rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header */}
      <div>
        <h4 className="text-xs font-semibold text-ink uppercase tracking-wider">
          Concurrency Rush Battle Simulator
        </h4>
        <p className="text-xs text-ink-muted mt-0.5">
          จำลองแฟนคลับยิงคำขอกดที่นั่งเดียวกันในเสี้ยววินาทีเดียว (Promise.all)
        </p>
      </div>

      {/* Target Info */}
      <div className="p-3 rounded-xl bg-surface-soft border border-hairline-soft flex items-center justify-between text-xs">
        <div>
          <span className="text-ink-muted block text-[11px]">ที่นั่งเป้าหมาย</span>
          <span className="font-semibold text-sm text-ink">{targetSeatLabel}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="text-[11px] text-ink-muted">จำนวนผู้แย่ง:</span>
          <div className="flex bg-canvas rounded-lg border border-hairline p-0.5">
            <button
              onClick={() => setFanCount(20)}
              className={`px-2.5 py-0.5 text-xs rounded font-medium transition-colors ${
                fanCount === 20 ? "bg-ink text-canvas font-semibold" : "text-ink-muted"
              }`}
            >
              20 คน
            </button>
            <button
              onClick={() => setFanCount(50)}
              className={`px-2.5 py-0.5 text-xs rounded font-medium transition-colors ${
                fanCount === 50 ? "bg-ink text-canvas font-semibold" : "text-ink-muted"
              }`}
            >
              50 คน
            </button>
          </div>
        </div>
      </div>

      {/* Action Button (Single Accent Voltage #ff385c, 44px height) */}
      <button
        onClick={handleLaunch}
        disabled={isSimulating}
        className="w-full h-11 rounded-xl bg-primary hover:bg-primary-active text-canvas font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-float active:scale-98 disabled:opacity-50"
      >
        {isSimulating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>กำลังประมวลผลคำขอพร้อมกัน ({fanCount} Requests)...</span>
          </>
        ) : (
          <>
            <span>ยิงคำขอจำลอง {fanCount} คนแย่งกดพร้อมกัน</span>
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Battle Result Presentation */}
      {battleResult && (
        <div className="space-y-3 pt-2 animate-fadeIn text-xs">
          {/* Winner Block */}
          <div className="p-3.5 rounded-xl bg-surface-soft border border-hairline space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-ink">
                ผู้ชนะเพียงคนเดียว: {battleResult.winnerName ?? "ไม่มี (ที่นั่งไม่ว่าง)"}
              </span>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-canvas border border-hairline text-ink">
                1/{battleResult.totalRequesters} ได้สิทธิ์
              </span>
            </div>

            <div className="text-[11px] text-ink-muted flex items-center justify-between pt-1 border-t border-hairline-soft">
              <span>เวลาประมวลผลรวม:</span>
              <span className="font-mono text-ink font-semibold">
                {battleResult.durationTotalMs.toFixed(2)} ms
              </span>
            </div>
          </div>

          {/* Guarantee Signal */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>CAS Lockless Protection:</strong> อีก {battleResult.rejectedCount} คำขอ ถูกปฏิเสธด้วย CAS Mismatch
              สต็อกไม่ติดลบ ปราศจาก Double Booking 100%
            </div>
          </div>

          {/* Attempts Log */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-ink-muted mb-1 px-1">
              <span>Atomic Processing Order:</span>
              <span className="font-mono">{battleResult.attempts.length} รายการ</span>
            </div>

            <div className="max-h-44 overflow-y-auto rounded-xl border border-hairline-soft bg-surface-soft p-1 space-y-1">
              {battleResult.attempts.map((attempt) => {
                const isWon = attempt.status === "SUCCESS_WON";
                return (
                  <div
                    key={attempt.attemptId}
                    className={`p-2 rounded-lg text-[11px] flex items-center justify-between border ${
                      isWon
                        ? "bg-canvas border-hairline text-ink font-semibold"
                        : "bg-surface-soft/60 border-transparent text-ink-muted"
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className="font-mono text-[10px] text-ink-muted">
                        #{String(attempt.attemptId).padStart(2, "0")}
                      </span>
                      <span className="truncate">{attempt.userName}</span>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="font-mono text-[10px] text-ink-muted">
                        {attempt.durationMs.toFixed(2)}ms
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                          isWon
                            ? "bg-emerald-100 text-emerald-900 font-semibold"
                            : "text-ink-muted"
                        }`}
                      >
                        {isWon ? "Success (CAS Acquired)" : "CAS Mismatch"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
