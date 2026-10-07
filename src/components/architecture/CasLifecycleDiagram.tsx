"use client";

import React, { useState } from "react";
import {
  CAS_LIFECYCLE_STEPS,
  CasLifecycleStep,
} from "@/data/db-architecture-data";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Timer,
  Users,
  Lock,
  Unlock,
  ArrowRight,
  Sparkles,
  Zap,
  Cpu,
} from "lucide-react";

export const CasLifecycleDiagram: React.FC = () => {
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(2); // Default to Step 03 (Winner CAS)

  const activeStep = CAS_LIFECYCLE_STEPS[selectedStepIndex];

  return (
    <div className="bg-canvas border border-hairline rounded-2xl p-5 sm:p-7 md:p-9 shadow-soft space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-hairline-soft">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <Lock className="w-3.5 h-3.5 text-primary" />
            <span>Atomic Concurrency Blueprint</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-ink font-sans">
            กลไก CAS (Compare-And-Swap) ป้องกันการจองซ้ำระดับฮาร์ดแวร์
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed max-w-2xl">
            เมื่อแฟนเพลงนับหมื่นกดแย่งเก้าอี้ตัวเดียวกันในเสี้ยววินาที ระบบใช้ CAS Token ระดับ In-Memory Memory Core เพื่อตัดสินผู้ชนะในเวลาไม่ถึง 1 มิลลิวินาที โดยไม่ต้องใช้ Pessimistic Lock
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">Zero Double-Booking Guarantee</span>
        </div>
      </div>

      {/* Step Sequence Horizontal Grid (Editorial Process Flow) */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {CAS_LIFECYCLE_STEPS.map((step, idx) => {
          const isSelected = selectedStepIndex === idx;
          const isWinner = step.status === "WINNER";
          const isRejected = step.status === "REJECTED";

          return (
            <button
              key={step.stepNumber}
              onClick={() => setSelectedStepIndex(idx)}
              className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? isWinner
                    ? "border-primary ring-2 ring-primary/20 bg-primary-subtle/30 shadow-xs"
                    : isRejected
                    ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/40 shadow-xs"
                    : "border-ink ring-2 ring-ink/10 bg-surface-soft shadow-xs"
                  : "border-hairline bg-canvas hover:border-ink/20 hover:bg-surface-soft/60"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-mono font-bold text-xs ${
                      isSelected ? "text-ink" : "text-ink-muted"
                    }`}
                  >
                    STEP {step.stepNumber}
                  </span>

                  {isWinner ? (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  ) : isRejected ? (
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-hairline-strong" />
                  )}
                </div>

                <h4 className="font-semibold text-xs text-ink line-clamp-2 font-sans">
                  {step.titleTh}
                </h4>
              </div>

              <div className="mt-3 pt-2 border-t border-hairline-soft/80 flex items-center justify-between text-[10px] text-ink-muted font-mono">
                <span>{step.latencyMs}</span>
                <span className="truncate max-w-[70px]">{step.actor}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Step Deep-Dive Showcase (Editorial Spotlight) */}
      <div className="rounded-2xl border border-hairline bg-surface-soft/40 p-5 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-hairline">
          <div className="flex items-center space-x-3.5 min-w-0">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                activeStep.status === "WINNER"
                  ? "bg-primary text-canvas"
                  : activeStep.status === "REJECTED"
                  ? "bg-amber-500 text-canvas"
                  : "bg-ink text-canvas"
              }`}
            >
              {activeStep.status === "WINNER" ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : activeStep.status === "REJECTED" ? (
                <AlertCircle className="w-6 h-6" />
              ) : (
                <Cpu className="w-6 h-6" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-ink-muted">
                  STEP {activeStep.stepNumber}
                </span>
                <span className="text-hairline-strong">•</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  {activeStep.subTitleTh}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-ink font-sans mt-0.5 truncate">
                {activeStep.titleTh}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <div className="px-3 py-1.5 rounded-full bg-canvas border border-hairline font-mono text-xs text-ink">
              Execution Time: <span className="font-bold text-primary">{activeStep.latencyMs}</span>
            </div>
          </div>
        </div>

        {/* Narrative & Technical Code Snippet */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 items-start">
          <div className="space-y-4">
            <div>
              <h5 className="text-xs uppercase font-bold text-ink-muted tracking-wider mb-1.5">
                พฤติกรรมในระบบ (System Behavior)
              </h5>
              <p className="text-sm sm:text-base text-ink leading-relaxed">
                {activeStep.descriptionTh}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-canvas border border-hairline space-y-2 text-sm">
              <span className="font-bold text-ink block text-xs uppercase tracking-wider">
                ทำไมวิธีนี้จึงเร็วกว่าฐานข้อมูลทั่วไป?
              </span>
              <p className="text-ink-muted leading-relaxed text-xs sm:text-sm">
                เพราะไม่มีการใช้ <code>SELECT ... FOR UPDATE</code> ที่ต้องรอคิว Disk I/O และไม่มีการเกิด Deadlock บนระบบ เอนจิน Couchbase ตรวจสอบเลข 64-bit CAS ในระดับ Register Memory ของ CPU โดยตรง
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-ink-muted">
              <span>Technical Instruction</span>
              <span>In-Memory KV Protocol</span>
            </div>

            <div className="p-4 rounded-xl bg-[#1e1e1e] text-emerald-300 font-mono text-xs overflow-x-auto shadow-inner leading-relaxed">
              <pre className="whitespace-pre-wrap break-all">
                {activeStep.technicalDetail}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Sequence Comparison: Winner vs Loser */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {/* Winner Scenario */}
        <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-900 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>คำขอผู้ชนะ (Request A - Winner)</span>
          </div>
          <p className="text-emerald-950 text-xs sm:text-sm leading-relaxed">
            CAS Token ที่ส่งมา (173820918290001) ตรงกับใน Memory &rarr; ทำการบันทึกสถานะเป็น <code>HELD</code> ทันที พร้อมออก CAS ใหม่เป็น <code>173820918290002</code> และเริ่มนับถอยหลัง TTL 300s
          </p>
        </div>

        {/* Loser Scenario */}
        <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
          <div className="flex items-center space-x-2 text-amber-900 font-bold">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span>คำขอที่ตามมา (Request B, C, D... - Losers)</span>
          </div>
          <p className="text-amber-950 text-xs sm:text-sm leading-relaxed">
            CAS Token ที่ส่งมา (173820918290001) ไม่ตรงกับระบบอีกต่อไป &rarr; ถูกตัดทิ้งทันทีด้วย <code>CasMismatchError</code> ภายใน 0.8 ms ผู้ใช้ทราบผลทันทีว่าที่นั่งถูกจองแล้ว ปลอดภัย 100%
          </p>
        </div>
      </div>
    </div>
  );
};
