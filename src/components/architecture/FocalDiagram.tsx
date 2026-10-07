"use client";

import React from "react";
import {
  Database,
  Layers,
  ShieldCheck,
  FileJson,
  Zap,
  Lock,
  Timer,
  Key,
  ArrowRight,
  ArrowDown,
  Sparkles,
  Cpu,
  ChevronRight,
  Fingerprint,
} from "lucide-react";
import { CollectionDefinition } from "@/data/db-architecture-data";

interface FocalDiagramProps {
  collections: CollectionDefinition[];
  selectedCollectionId: string;
  onSelectCollection: (id: string) => void;
}

export const FocalDiagram: React.FC<FocalDiagramProps> = ({
  collections,
  selectedCollectionId,
  onSelectCollection,
}) => {
  const seatsCol = collections.find((c) => c.id === "seats")!;
  const concertsCol = collections.find((c) => c.id === "concerts")!;
  const bookingsCol = collections.find((c) => c.id === "bookings")!;

  return (
    <div className="bg-canvas border border-hairline rounded-2xl p-4 sm:p-7 md:p-9 shadow-soft relative overflow-hidden">
      {/* Background Architectural Grid Pattern - Ultra Subtle */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(#222 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Top Header of Diagram - Editorial Swiss Style */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-hairline-soft">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span>Focal Topology Blueprint</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-ink font-sans">
            โครงสร้างการจัดเก็บข้อมูลและสายธารธุรกรรม (Data Topology & Flow)
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed max-w-2xl">
            ผังความสัมพันธ์ระดับองค์กร: แสดงสถาปัตยกรรม Bucket &rarr; Scope &rarr; Collections พร้อมจุดควบคุมความถูกต้องระดับเสี้ยววินาที (CAS &amp; TTL)
          </p>
        </div>

        {/* Legend / Quick Indicators */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-ink-muted shrink-0">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-surface-soft border border-hairline">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>Hot Core Focal Point</span>
          </div>
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-surface-soft border border-hairline">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>CAS Atomic Protected</span>
          </div>
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-surface-soft border border-hairline">
            <Timer className="w-3 h-3 text-amber-600" />
            <span>Native TTL Expiry</span>
          </div>
        </div>
      </div>

      {/* Diagram Canvas */}
      <div className="relative z-10 mt-8 space-y-8">
        {/* Tier 1: Client & Traffic Ingestion */}
        <div className="rounded-xl border border-hairline-soft bg-surface-soft/60 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-ink">
                Tier 1: High-Concurrency Ingestion Layer
              </span>
            </div>
            <span className="text-[11px] text-ink-muted">Next.js Edge API &rarr; HTTP/3</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-canvas border border-hairline rounded-lg p-3 flex items-center justify-between">
              <div>
                <span className="font-mono font-medium text-ink block">POST /api/ticket/hold</span>
                <span className="text-[11px] text-ink-muted">จองที่นั่งชั่วคราว (Optimistic CAS Lock)</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-subtle text-primary font-mono font-medium">
                &lt; 0.5 ms KV
              </span>
            </div>

            <div className="bg-canvas border border-hairline rounded-lg p-3 flex items-center justify-between">
              <div>
                <span className="font-mono font-medium text-ink block">POST /api/ticket/confirm</span>
                <span className="text-[11px] text-ink-muted">ชำระเงินและออกตั๋ว (ACID Ledger Commit)</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono font-medium">
                &lt; 0.8 ms Append
              </span>
            </div>
          </div>
        </div>

        {/* Central Vertical Vector Flow Arrow */}
        <div className="flex justify-center -my-3">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-canvas border border-hairline text-[11px] text-ink-muted shadow-xs">
            <ArrowDown className="w-3.5 h-3.5 text-primary animate-bounce" />
            <span>Direct KV Sub-millisecond Protocol (Memcached Binary / DCP)</span>
          </div>
        </div>

        {/* Tier 2: THE FOCAL POINT - Couchbase Cluster & Collections */}
        <div className="rounded-2xl border-2 border-hairline bg-surface-soft/40 p-5 sm:p-7 relative transition-all">
          {/* Bucket & Scope Hierarchy Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-hairline mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-ink text-canvas flex items-center justify-center shadow-xs">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs uppercase font-mono font-semibold tracking-wider text-ink-muted">
                    Bucket:
                  </span>
                  <span className="text-xs font-mono font-bold text-ink bg-canvas px-2 py-0.5 rounded border border-hairline">
                    main
                  </span>
                  <span className="text-hairline-strong">&rarr;</span>
                  <span className="text-xs uppercase font-mono font-semibold tracking-wider text-ink-muted">
                    Scope:
                  </span>
                  <span className="text-xs font-mono font-bold text-ink bg-canvas px-2 py-0.5 rounded border border-hairline">
                    ticketing
                  </span>
                </div>
                <span className="text-[11px] text-ink-muted mt-0.5 block">
                  Isolated Multi-Tenant Namespace • In-Memory Active Cache
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-canvas border border-hairline text-ink font-mono text-[11px]">
                <Cpu className="w-3 h-3 text-ink-muted" />
                <span>1,024 vBuckets Auto-Sharded</span>
              </span>
            </div>
          </div>

          {/* 3 Core Collections Grid with seats as THE 1 FOCAL POINT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Collection 1: Concerts (3 Cols) */}
            <div
              onClick={() => onSelectCollection("concerts")}
              className={`lg:col-span-3 rounded-xl border p-4 sm:p-5 cursor-pointer transition-all flex flex-col justify-between bg-canvas ${
                selectedCollectionId === "concerts"
                  ? "border-ink ring-2 ring-ink/10 shadow-float"
                  : "border-hairline hover:border-ink/30 hover:shadow-soft"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-7 h-7 rounded-lg bg-surface-soft border border-hairline flex items-center justify-center text-ink">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-soft border border-hairline text-ink-muted">
                    1 : N Parent
                  </span>
                </div>

                <h3 className="font-semibold text-sm text-ink font-sans">
                  {concertsCol.displayNameTh}
                </h3>
                <p className="text-[11px] text-ink-muted font-mono mt-1 break-all">
                  Key: {concertsCol.keyPattern}
                </p>

                <p className="text-xs text-ink-body mt-2.5 leading-relaxed line-clamp-3">
                  {concertsCol.descriptionTh}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-hairline-soft flex items-center justify-between text-[11px]">
                <span className="text-ink-muted">เข้าถึง: KV Memory</span>
                <span className="font-semibold text-ink inline-flex items-center">
                  ดูโครงสร้าง <ChevronRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>

            {/* Collection 2: Seats (THE HOT CORE FOCAL POINT - 6 Cols) */}
            <div
              onClick={() => onSelectCollection("seats")}
              className={`lg:col-span-6 rounded-xl border-2 p-5 sm:p-6 cursor-pointer transition-all flex flex-col justify-between relative bg-canvas ${
                selectedCollectionId === "seats"
                  ? "border-primary ring-4 ring-primary/10 shadow-float"
                  : "border-primary/50 hover:border-primary hover:shadow-float"
              }`}
            >
              {/* Focal Banner Ribbon */}
              <div className="absolute -top-3 left-6 bg-primary text-canvas px-3 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase shadow-xs flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Core Focal Point • Critical Path</span>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-primary text-canvas flex items-center justify-center shadow-xs">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-ink font-sans">
                        {seatsCol.displayNameTh}
                      </h3>
                      <span className="text-[11px] font-mono text-primary font-medium block">
                        Collection: `seats`
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-medium flex items-center space-x-1">
                      <Lock className="w-2.5 h-2.5" />
                      <span>CAS Protected</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-medium flex items-center space-x-1">
                      <Timer className="w-2.5 h-2.5" />
                      <span>TTL 300s</span>
                    </span>
                  </div>
                </div>

                {/* Key Pattern Callout */}
                <div className="p-2.5 rounded-lg bg-surface-soft border border-hairline font-mono text-xs text-ink flex items-center justify-between gap-2 overflow-x-auto">
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <Key className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[11px] text-ink-muted uppercase">Key:</span>
                  </div>
                  <span className="font-semibold text-primary truncate">
                    seat::&#123;concertId&#125;::&#123;label&#125;
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-canvas border border-hairline text-ink-muted shrink-0">
                    Sub-millisecond KV
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-ink-body mt-3 leading-relaxed">
                  {seatsCol.descriptionTh}
                </p>

                {/* Critical Attributes Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 text-[11px]">
                  <div className="p-2 rounded bg-surface-soft border border-hairline-soft">
                    <span className="text-ink-muted block text-[10px]">สถานะที่นั่ง (status)</span>
                    <span className="font-medium text-ink font-mono">AVAILABLE | HELD | BOOKED</span>
                  </div>
                  <div className="p-2 rounded bg-surface-soft border border-hairline-soft">
                    <span className="text-ink-muted block text-[10px]">กลไกล็อก (Locking)</span>
                    <span className="font-medium text-emerald-700">Atomic CAS (uint64)</span>
                  </div>
                  <div className="p-2 rounded bg-surface-soft border border-hairline-soft col-span-2 sm:col-span-1">
                    <span className="text-ink-muted block text-[10px]">การคืนสิทธิ์ (Release)</span>
                    <span className="font-medium text-amber-700">Auto TTL 5 นาที</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-hairline-soft flex items-center justify-between text-xs">
                <span className="text-ink-muted font-medium">SLA Latency: &lt; 0.5 ms</span>
                <span className="font-semibold text-primary inline-flex items-center">
                  ตรวจสอบ Schema ละเอียด <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
            </div>

            {/* Collection 3: Bookings (3 Cols) */}
            <div
              onClick={() => onSelectCollection("bookings")}
              className={`lg:col-span-3 rounded-xl border p-4 sm:p-5 cursor-pointer transition-all flex flex-col justify-between bg-canvas ${
                selectedCollectionId === "bookings"
                  ? "border-ink ring-2 ring-ink/10 shadow-float"
                  : "border-hairline hover:border-ink/30 hover:shadow-soft"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-7 h-7 rounded-lg bg-surface-soft border border-hairline flex items-center justify-center text-ink">
                    <FileJson className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-soft border border-hairline text-ink-muted">
                    1 : 1 Settlement
                  </span>
                </div>

                <h3 className="font-semibold text-sm text-ink font-sans">
                  {bookingsCol.displayNameTh}
                </h3>
                <p className="text-[11px] text-ink-muted font-mono mt-1 break-all">
                  Key: {bookingsCol.keyPattern}
                </p>

                <p className="text-xs text-ink-body mt-2.5 leading-relaxed line-clamp-3">
                  {bookingsCol.descriptionTh}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-hairline-soft flex items-center justify-between text-[11px]">
                <span className="text-ink-muted">เข้าถึง: ACID Upsert</span>
                <span className="font-semibold text-ink inline-flex items-center">
                  ดูโครงสร้าง <ChevronRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          </div>

          {/* Relationship Vectors (Cardinality Footnote) */}
          <div className="mt-6 pt-5 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-muted">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-1.5">
                <span className="font-mono font-medium text-ink">concerts</span>
                <ArrowRight className="w-3.5 h-3.5 text-hairline-strong" />
                <span className="font-mono font-semibold text-primary">seats</span>
                <span className="text-[11px] text-ink-muted">(1 : N ผ่าน `concertId`)</span>
              </div>

              <div className="hidden sm:inline text-hairline-strong">•</div>

              <div className="flex items-center space-x-1.5">
                <span className="font-mono font-semibold text-primary">seats</span>
                <ArrowRight className="w-3.5 h-3.5 text-hairline-strong" />
                <span className="font-mono font-medium text-ink">bookings</span>
                <span className="text-[11px] text-ink-muted">(1 : 1 ผูกด้วย `bookingId` + `casToken`)</span>
              </div>
            </div>

            <div className="text-[11px] font-medium text-ink-muted">
              *คลิกที่กล่องเพื่อดู Schema และ Live JSON
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
