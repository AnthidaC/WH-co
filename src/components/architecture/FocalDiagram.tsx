"use client";

import React, { useState } from "react";
import {
  Database,
  Layers,
  ShieldCheck,
  FileJson,
  Key,
  ArrowRight,
  ArrowDown,
  Sparkles,
  Link2,
  CheckCircle2,
  Lock,
  Clock,
  ChevronRight,
  Info,
  Maximize2,
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
  const [selectedRelation, setSelectedRelation] = useState<
    "concerts-seats" | "seats-bookings" | "concerts-bookings" | null
  >("concerts-seats");
  const [diagramMode, setDiagramMode] = useState<"erd" | "flow">("erd");

  const concertsCol = collections.find((c) => c.id === "concerts")!;
  const seatsCol = collections.find((c) => c.id === "seats")!;
  const bookingsCol = collections.find((c) => c.id === "bookings")!;

  return (
    <div className="bg-canvas border border-hairline rounded-2xl p-5 sm:p-7 md:p-9 shadow-subtle relative overflow-hidden space-y-8 animate-fadeIn">
      {/* 1. ERD Header & Context Ribbon */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 border-b border-hairline-soft">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider">
              Entity-Relationship Diagram (ERD) • Couchbase NoSQL
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink font-sans">
            แผนผังความสัมพันธ์ข้อมูล (ER Diagram)
          </h2>

          <p className="text-sm sm:text-base text-ink-muted leading-relaxed max-w-3xl">
            แสดงโครงสร้างตารางข้อมูล (Collections) ทั้ง 3 ชุดใน Scope: <strong className="text-ink font-mono">ticketing</strong> พร้อมคีย์หลัก (PK), คีย์อ้างอิง (FK), อัตราความสัมพันธ์ (Cardinality) และกลไกป้องกันการจองซ้ำระดับฮาร์ดแวร์ (CAS Guard)
          </p>
        </div>

        {/* View Mode Toggle & Quick Legend */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <div className="flex items-center bg-surface-soft p-1 rounded-xl border border-hairline text-xs font-medium">
            <button
              onClick={() => setDiagramMode("erd")}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                diagramMode === "erd"
                  ? "bg-canvas text-ink font-bold shadow-xs border border-hairline"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              📊 ผัง ER Diagram
            </button>
            <button
              onClick={() => setDiagramMode("flow")}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                diagramMode === "flow"
                  ? "bg-canvas text-ink font-bold shadow-xs border border-hairline"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              ⚡ สายธาร In-Memory
            </button>
          </div>
        </div>
      </div>

      {/* 2. ER Legend Bar - Clear, Spacious, High Readability */}
      <div className="p-4 rounded-xl bg-surface-soft/60 border border-hairline-soft flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-ink">สัญลักษณ์ในผัง ER:</span>

          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-ink text-canvas font-mono font-bold text-[11px]">
            <span>PK</span>
            <span className="font-sans font-normal text-white/80">Primary Key (Document Key)</span>
          </span>

          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-mono font-bold text-[11px]">
            <span>FK</span>
            <span className="font-sans font-normal text-blue-900">Foreign Key (อ้างอิงข้ามชุด)</span>
          </span>

          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-primary-subtle text-primary border border-primary/20 font-mono font-bold text-[11px]">
            <span>CAS</span>
            <span className="font-sans font-normal text-primary">CAS Lock Token (กันจองซ้ำ)</span>
          </span>

          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold text-[11px]">
            <span>TTL</span>
            <span className="font-sans font-normal text-amber-900">คืนที่นั่งอัตโนมัติ 5 นาที</span>
          </span>
        </div>

        <div className="flex items-center space-x-4 text-ink-muted text-xs">
          <span><strong>1 : N</strong> = One-to-Many</span>
          <span><strong>1 : 0..1</strong> = One-to-Optional One</span>
        </div>
      </div>

      {/* 3. The Main ER Diagram Canvas */}
      {diagramMode === "erd" ? (
        <div className="space-y-6">
          {/* Relationship Buttons Quick Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-ink-muted mr-1">เลือกดูเส้นเชื่อมความสัมพันธ์:</span>
            <button
              onClick={() => setSelectedRelation("concerts-seats")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center space-x-1.5 ${
                selectedRelation === "concerts-seats"
                  ? "bg-primary text-canvas font-bold shadow-xs"
                  : "bg-canvas border border-hairline text-ink-muted hover:text-ink hover:border-ink/20"
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>concerts ── seats (1 : N)</span>
            </button>

            <button
              onClick={() => setSelectedRelation("seats-bookings")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center space-x-1.5 ${
                selectedRelation === "seats-bookings"
                  ? "bg-primary text-canvas font-bold shadow-xs"
                  : "bg-canvas border border-hairline text-ink-muted hover:text-ink hover:border-ink/20"
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>seats ── bookings (1 : 0..1)</span>
            </button>

            <button
              onClick={() => setSelectedRelation("concerts-bookings")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center space-x-1.5 ${
                selectedRelation === "concerts-bookings"
                  ? "bg-primary text-canvas font-bold shadow-xs"
                  : "bg-canvas border border-hairline text-ink-muted hover:text-ink hover:border-ink/20"
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>concerts ── bookings (1 : N)</span>
            </button>

            {selectedRelation && (
              <button
                onClick={() => setSelectedRelation(null)}
                className="px-2.5 py-1 text-xs text-ink-muted hover:text-ink underline ml-1"
              >
                ล้างการเลือก
              </button>
            )}
          </div>

          {/* 3 Entity Tables in Responsive Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 items-start">
            {/* Entity 1: concerts (Parent Table) */}
            <div
              onClick={() => onSelectCollection("concerts")}
              className={`rounded-2xl border transition-all cursor-pointer overflow-hidden bg-canvas ${
                selectedCollectionId === "concerts"
                  ? "border-ink ring-2 ring-ink/10 shadow-float"
                  : selectedRelation === "concerts-seats" || selectedRelation === "concerts-bookings"
                  ? "border-blue-500 ring-2 ring-blue-100 shadow-float"
                  : "border-hairline hover:border-ink/30 hover:shadow-subtle"
              }`}
            >
              {/* Entity Header */}
              <div className="p-4 sm:p-5 border-b border-hairline bg-surface-soft/80">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-strong text-ink flex items-center justify-center font-bold">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-mono font-bold text-base text-ink">
                        concerts
                      </h3>
                      <span className="text-xs text-ink-muted">แม่แบบคอนเสิร์ต (Parent Entity)</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-canvas border border-hairline text-[11px] font-mono font-semibold text-ink">
                    1 : N
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-canvas border border-hairline font-mono text-xs text-ink flex items-center justify-between">
                  <span className="text-ink-muted">Key:</span>
                  <span className="font-semibold text-ink">concert::&#123;id&#125;</span>
                </div>
              </div>

              {/* Attributes Table */}
              <div className="divide-y divide-hairline-soft font-sans text-xs">
                {/* PK: id */}
                <div className="p-3.5 flex items-start justify-between gap-3 bg-amber-50/20">
                  <div className="flex items-start space-x-2">
                    <span className="px-1.5 py-0.5 rounded bg-ink text-canvas font-mono font-bold text-[10px]">PK</span>
                    <div>
                      <span className="font-mono font-bold text-sm text-ink block">id</span>
                      <span className="text-ink-muted text-xs">รหัสคอนเสิร์ต (เช่น concert::fujii-kaze-bkk)</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-ink-muted uppercase">STRING</span>
                </div>

                {/* Attributes */}
                <div className="p-3 flex items-start justify-between gap-3 hover:bg-surface-soft/50">
                  <div>
                    <span className="font-mono font-medium text-xs text-ink block">title</span>
                    <span className="text-ink-muted text-[11px]">ชื่อคอนเสิร์ต</span>
                  </div>
                  <span className="font-mono text-xs text-ink-muted">STRING</span>
                </div>

                <div className="p-3 flex items-start justify-between gap-3 hover:bg-surface-soft/50">
                  <div>
                    <span className="font-mono font-medium text-xs text-ink block">artist</span>
                    <span className="text-ink-muted text-[11px]">ชื่อศิลปิน</span>
                  </div>
                  <span className="font-mono text-xs text-ink-muted">STRING</span>
                </div>

                <div className="p-3 flex items-start justify-between gap-3 hover:bg-surface-soft/50">
                  <div>
                    <span className="font-mono font-medium text-xs text-ink block">venue</span>
                    <span className="text-ink-muted text-[11px]">สถานที่จัดงาน (เช่น Impact Arena)</span>
                  </div>
                  <span className="font-mono text-xs text-ink-muted">STRING</span>
                </div>

                <div className="p-3 flex items-start justify-between gap-3 hover:bg-surface-soft/50">
                  <div>
                    <span className="font-mono font-medium text-xs text-ink block">showDate</span>
                    <span className="text-ink-muted text-[11px]">วันและเวลาจัดแสดง</span>
                  </div>
                  <span className="font-mono text-xs text-ink-muted">TIMESTAMP</span>
                </div>

                <div className="p-3 flex items-start justify-between gap-3 hover:bg-surface-soft/50">
                  <div>
                    <span className="font-mono font-medium text-xs text-ink block">totalSeats</span>
                    <span className="text-ink-muted text-[11px]">จำนวนที่นั่งรวมทั้งฮอลล์</span>
                  </div>
                  <span className="font-mono text-xs text-ink-muted">INTEGER</span>
                </div>

                <div className="p-3 flex items-start justify-between gap-3 hover:bg-surface-soft/50">
                  <div>
                    <span className="font-mono font-medium text-xs text-ink block">availableSeats</span>
                    <span className="text-ink-muted text-[11px]">จำนวนที่นั่งว่าง</span>
                  </div>
                  <span className="font-mono text-xs text-ink-muted">INTEGER</span>
                </div>

                <div className="p-3 flex items-start justify-between gap-3 hover:bg-surface-soft/50">
                  <div>
                    <span className="font-mono font-medium text-xs text-ink block">currency</span>
                    <span className="text-ink-muted text-[11px]">สกุลเงิน (THB)</span>
                  </div>
                  <span className="font-mono text-xs text-ink-muted">STRING</span>
                </div>

                <div className="p-3 flex items-start justify-between gap-3 hover:bg-surface-soft/50 bg-surface-soft/30">
                  <div>
                    <span className="font-mono font-medium text-xs text-ink-muted block">_type</span>
                    <span className="text-ink-muted text-[11px]">ฟิลด์ระบุประเภทเอกสาร (&quot;concert&quot;)</span>
                  </div>
                  <span className="font-mono text-xs text-ink-muted">AUDIT</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-3.5 border-t border-hairline-soft bg-surface-soft/40 flex items-center justify-between text-xs text-ink-muted">
                <span>11 Fields ใน Schema</span>
                <span className="font-semibold text-ink flex items-center">
                  คลิกเพื่อดู JSON <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
            </div>

            {/* Entity 2: seats (THE FOCAL TRANSACTIONAL CORE) */}
            <div
              onClick={() => onSelectCollection("seats")}
              className={`rounded-2xl border-2 transition-all cursor-pointer overflow-hidden bg-canvas relative ${
                selectedCollectionId === "seats"
                  ? "border-primary ring-4 ring-primary/10 shadow-float"
                  : selectedRelation === "concerts-seats" || selectedRelation === "seats-bookings"
                  ? "border-primary ring-2 ring-primary/20 shadow-float"
                  : "border-primary/60 hover:border-primary hover:shadow-float"
              }`}
            >
              {/* Hot Core Banner Ribbon */}
              <div className="bg-primary text-canvas px-4 py-1 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>★ Core Transactional Entity (จุดศูนย์กลางการกดบัตร)</span>
                </span>
                <span className="font-mono text-[11px]">CAS + TTL Active</span>
              </div>

              {/* Entity Header */}
              <div className="p-4 sm:p-5 border-b border-hairline bg-primary/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-primary text-canvas flex items-center justify-center font-bold shadow-xs">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-mono font-bold text-base text-ink">
                        seats
                      </h3>
                      <span className="text-xs text-primary font-semibold">รองรับทราฟฟิกแย่งกดบัตรระดับสูงสุด</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-canvas border border-primary/30 text-[11px] font-mono font-bold text-primary">
                    Core Focal
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-canvas border border-hairline font-mono text-xs text-ink flex items-center justify-between">
                  <span className="text-ink-muted">Key:</span>
                  <span className="font-semibold text-primary">seat::&#123;concertId&#125;::&#123;label&#125;</span>
                </div>
              </div>

              {/* Attributes Table */}
              <div className="divide-y divide-hairline-soft font-sans text-xs">
                {/* PK: id */}
                <div className="p-3.5 flex items-start justify-between gap-3 bg-amber-50/20">
                  <div className="flex items-start space-x-2">
                    <span className="px-1.5 py-0.5 rounded bg-ink text-canvas font-mono font-bold text-[10px]">PK</span>
                    <div>
                      <span className="font-mono font-bold text-sm text-ink block">id</span>
                      <span className="text-ink-muted text-xs">Deterministic Key เข้าถึงผ่าน In-Memory ได้โดยตรง</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-ink-muted uppercase">STRING</span>
                </div>

                {/* FK: concertId */}
                <div
                  className={`p-3.5 flex items-start justify-between gap-3 transition-colors ${
                    selectedRelation === "concerts-seats" ? "bg-blue-50/80 border-l-4 border-blue-500" : "bg-blue-50/30"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300 font-mono font-bold text-[10px]">
                      FK
                    </span>
                    <div>
                      <span className="font-mono font-bold text-sm text-blue-900 block">concertId</span>
                      <span className="text-blue-800 text-xs">อ้างอิง &rarr; concerts.id (ความสัมพันธ์ 1 : N)</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-blue-800 uppercase">STRING</span>
                </div>

                {/* Field: label */}
                <div className="p-3 flex items-start justify-between gap-3 hover:bg-surface-soft/50">
                  <div>
                    <span className="font-mono font-bold text-xs text-ink block">label</span>
                    <span className="text-ink-muted text-[11px]">หมายเลขที่นั่ง (เช่น VIP-01, A-02)</span>
                  </div>
                  <span className="font-mono text-xs text-ink-muted">STRING</span>
                </div>

                {/* Field: zone & price */}
                <div className="p-3 flex items-start justify-between gap-3 hover:bg-surface-soft/50">
                  <div>
                    <span className="font-mono font-medium text-xs text-ink block">zone &amp; price</span>
                    <span className="text-ink-muted text-[11px]">โซนที่นั่ง และราคาบัตร (บาท)</span>
                  </div>
                  <span className="font-mono text-xs text-ink-muted">STRING / NUM</span>
                </div>

                {/* Field: status */}
                <div className="p-3 flex items-start justify-between gap-3 bg-surface-soft/40">
                  <div>
                    <span className="font-mono font-bold text-xs text-ink block">status</span>
                    <span className="text-ink font-mono text-[11px] font-semibold text-primary">AVAILABLE | HELD | BOOKED</span>
                  </div>
                  <span className="font-mono text-xs text-purple-700 bg-purple-50 px-1 rounded">ENUM</span>
                </div>

                {/* Field: heldByUserId */}
                <div className="p-3 flex items-start justify-between gap-3 hover:bg-surface-soft/50">
                  <div>
                    <span className="font-mono font-medium text-xs text-ink block">heldByUserId</span>
                    <span className="text-ink-muted text-[11px]">รหัสผู้ถือสิทธิ์จองชั่วคราว</span>
                  </div>
                  <span className="font-mono text-xs text-ink-muted">STRING?</span>
                </div>

                {/* TTL: heldUntil */}
                <div className="p-3.5 flex items-start justify-between gap-3 bg-amber-50/40">
                  <div className="flex items-start space-x-2">
                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 font-mono font-bold text-[10px]">
                      TTL
                    </span>
                    <div>
                      <span className="font-mono font-bold text-xs text-amber-900 block">heldUntil</span>
                      <span className="text-amber-800 text-xs">หมดเวลา Hold (คืนสิทธิ์อัตโนมัติใน 5 นาที)</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-amber-900">TIMESTAMP</span>
                </div>

                {/* FK: bookingId */}
                <div
                  className={`p-3.5 flex items-start justify-between gap-3 transition-colors ${
                    selectedRelation === "seats-bookings" ? "bg-blue-50/80 border-l-4 border-blue-500" : "bg-blue-50/30"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300 font-mono font-bold text-[10px]">
                      FK
                    </span>
                    <div>
                      <span className="font-mono font-bold text-xs text-blue-900 block">bookingId</span>
                      <span className="text-blue-800 text-xs">อ้างอิง &rarr; bookings.id (เมื่อชำระเงินสำเร็จ)</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-blue-800">STRING?</span>
                </div>

                {/* CAS: casToken */}
                <div className="p-3.5 flex items-start justify-between gap-3 bg-emerald-50/50">
                  <div className="flex items-start space-x-2">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono font-bold text-[10px]">
                      CAS
                    </span>
                    <div>
                      <span className="font-mono font-bold text-xs text-emerald-950 block">casToken</span>
                      <span className="text-emerald-900 text-xs">64-bit Hardware Token ป้องกันการจองซ้ำ</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-emerald-900 font-bold">UINT64</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-3.5 border-t border-hairline-soft bg-primary/5 flex items-center justify-between text-xs text-ink-muted">
                <span className="font-semibold text-primary">SLA &lt; 0.5 ms KV</span>
                <span className="font-semibold text-primary flex items-center">
                  ตรวจสอบ Schema <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
            </div>

            {/* Entity 3: bookings (Settlement Ledger) */}
            <div
              onClick={() => onSelectCollection("bookings")}
              className={`rounded-2xl border transition-all cursor-pointer overflow-hidden bg-canvas ${
                selectedCollectionId === "bookings"
                  ? "border-ink ring-2 ring-ink/10 shadow-float"
                  : selectedRelation === "seats-bookings" || selectedRelation === "concerts-bookings"
                  ? "border-blue-500 ring-2 ring-blue-100 shadow-float"
                  : "border-hairline hover:border-ink/30 hover:shadow-subtle"
              }`}
            >
              {/* Entity Header */}
              <div className="p-4 sm:p-5 border-b border-hairline bg-surface-soft/80">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-strong text-ink flex items-center justify-center font-bold">
                      <FileJson className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-mono font-bold text-base text-ink">
                        bookings
                      </h3>
                      <span className="text-xs text-ink-muted">หลักฐานการสั่งซื้อ (Settlement Ledger)</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-canvas border border-hairline text-[11px] font-mono font-semibold text-ink">
                    1 : 0..1
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-canvas border border-hairline font-mono text-xs text-ink flex items-center justify-between">
                  <span className="text-ink-muted">Key:</span>
                  <span className="font-semibold text-ink truncate ml-1">booking::&#123;concertId&#125;::&#123;label&#125;::&#123;uid&#125;</span>
                </div>
              </div>

              {/* Attributes Table */}
              <div className="divide-y divide-hairline-soft font-sans text-xs">
                {/* PK: id */}
                <div className="p-3.5 flex items-start justify-between gap-3 bg-amber-50/20">
                  <div className="flex items-start space-x-2">
                    <span className="px-1.5 py-0.5 rounded bg-ink text-canvas font-mono font-bold text-[10px]">PK</span>
                    <div>
                      <span className="font-mono font-bold text-sm text-ink block">id</span>
                      <span className="text-ink-muted text-xs">รหัสการจองตั๋ว (Unique Booking ID)</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-ink-muted uppercase">STRING</span>
                </div>

                {/* FK: concertId */}
                <div
                  className={`p-3.5 flex items-start justify-between gap-3 transition-colors ${
                    selectedRelation === "concerts-bookings" ? "bg-blue-50/80 border-l-4 border-blue-500" : "bg-blue-50/30"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300 font-mono font-bold text-[10px]">
                      FK
                    </span>
                    <div>
                      <span className="font-mono font-bold text-sm text-blue-900 block">concertId</span>
                      <span className="text-blue-800 text-xs">อ้างอิง &rarr; concerts.id</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-blue-800 uppercase">STRING</span>
                </div>

                {/* FK: seatId */}
                <div
                  className={`p-3.5 flex items-start justify-between gap-3 transition-colors ${
                    selectedRelation === "seats-bookings" ? "bg-blue-50/80 border-l-4 border-blue-500" : "bg-blue-50/30"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300 font-mono font-bold text-[10px]">
                      FK
                    </span>
                    <div>
                      <span className="font-mono font-bold text-sm text-blue-900 block">seatId</span>
                      <span className="text-blue-800 text-xs">อ้างอิง &rarr; seats.id (1 ที่นั่งมีได้ 1 รายการ)</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-blue-800 uppercase">STRING</span>
                </div>

                {/* Field: userId */}
                <div className="p-3 flex items-start justify-between gap-3 hover:bg-surface-soft/50">
                  <div>
                    <span className="font-mono font-medium text-xs text-ink block">userId</span>
                    <span className="text-ink-muted text-[11px]">รหัสผู้ซื้อตั๋ว</span>
                  </div>
                  <span className="font-mono text-xs text-ink-muted">STRING</span>
                </div>

                {/* Field: amount */}
                <div className="p-3 flex items-start justify-between gap-3 hover:bg-surface-soft/50">
                  <div>
                    <span className="font-mono font-medium text-xs text-ink block">amount</span>
                    <span className="text-ink-muted text-[11px]">ยอดเงินสุทธิที่ชำระ (บาท)</span>
                  </div>
                  <span className="font-mono text-xs text-ink-muted">DECIMAL</span>
                </div>

                {/* Field: status */}
                <div className="p-3 flex items-start justify-between gap-3 bg-surface-soft/40">
                  <div>
                    <span className="font-mono font-bold text-xs text-ink block">status</span>
                    <span className="text-emerald-700 font-mono text-[11px] font-semibold">CONFIRMED | REFUNDED</span>
                  </div>
                  <span className="font-mono text-xs text-purple-700 bg-purple-50 px-1 rounded">ENUM</span>
                </div>

                {/* Field: paymentReference */}
                <div className="p-3 flex items-start justify-between gap-3 hover:bg-surface-soft/50">
                  <div>
                    <span className="font-mono font-medium text-xs text-ink block">paymentReference</span>
                    <span className="text-ink-muted text-[11px]">รหัสอ้างอิงธุรกรรมการเงิน</span>
                  </div>
                  <span className="font-mono text-xs text-ink-muted">STRING</span>
                </div>

                {/* CAS: casTokenSnapshot */}
                <div className="p-3.5 flex items-start justify-between gap-3 bg-emerald-50/50">
                  <div className="flex items-start space-x-2">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono font-bold text-[10px]">
                      CAS
                    </span>
                    <div>
                      <span className="font-mono font-bold text-xs text-emerald-950 block">casTokenSnapshot</span>
                      <span className="text-emerald-900 text-xs">บันทึก CAS Token ขณะทำรายการ</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-emerald-900 font-bold">UINT64</span>
                </div>

                {/* Field: confirmedAt */}
                <div className="p-3 flex items-start justify-between gap-3 hover:bg-surface-soft/50">
                  <div>
                    <span className="font-mono font-medium text-xs text-ink block">confirmedAt</span>
                    <span className="text-ink-muted text-[11px]">วันที่และเวลายืนยันชำระเงิน</span>
                  </div>
                  <span className="font-mono text-xs text-ink-muted">TIMESTAMP</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-3.5 border-t border-hairline-soft bg-surface-soft/40 flex items-center justify-between text-xs text-ink-muted">
                <span>10 Fields ใน Schema</span>
                <span className="font-semibold text-ink flex items-center">
                  คลิกเพื่อดู JSON <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
            </div>
          </div>

          {/* 4. Interactive Relationship Inspector Panel */}
          {selectedRelation && (
            <div className="p-5 sm:p-6 rounded-2xl bg-surface-soft/80 border border-hairline space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Link2 className="w-5 h-5 text-primary" />
                  <h4 className="text-base font-bold text-ink">
                    {selectedRelation === "concerts-seats" && "ความสัมพันธ์: concerts ──< seats (1 : N)"}
                    {selectedRelation === "seats-bookings" && "ความสัมพันธ์: seats ── bookings (1 : 0..1)"}
                    {selectedRelation === "concerts-bookings" && "ความสัมพันธ์: concerts ──< bookings (1 : N)"}
                  </h4>
                </div>
                <span className="px-3 py-1 rounded-full bg-canvas border border-hairline text-xs font-semibold font-mono text-ink">
                  {selectedRelation === "concerts-seats" && "One-to-Many"}
                  {selectedRelation === "seats-bookings" && "One-to-Optional One"}
                  {selectedRelation === "concerts-bookings" && "One-to-Many"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 rounded-xl bg-canvas border border-hairline space-y-1">
                  <span className="text-xs text-ink-muted font-semibold uppercase">Parent Key</span>
                  <div className="font-mono font-bold text-ink">
                    {selectedRelation === "concerts-seats" && "concerts.id (PK)"}
                    {selectedRelation === "seats-bookings" && "seats.id (PK)"}
                    {selectedRelation === "concerts-bookings" && "concerts.id (PK)"}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-canvas border border-hairline space-y-1">
                  <span className="text-xs text-ink-muted font-semibold uppercase">Foreign Key</span>
                  <div className="font-mono font-bold text-blue-700">
                    {selectedRelation === "concerts-seats" && "seats.concertId (FK)"}
                    {selectedRelation === "seats-bookings" && "bookings.seatId (FK)"}
                    {selectedRelation === "concerts-bookings" && "bookings.concertId (FK)"}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-canvas border border-hairline space-y-1">
                  <span className="text-xs text-ink-muted font-semibold uppercase">Couchbase Access</span>
                  <div className="font-semibold text-emerald-700">
                    {selectedRelation === "concerts-seats" && "GSI Index + Memory KV (< 0.5ms)"}
                    {selectedRelation === "seats-bookings" && "Atomic CAS Validation"}
                    {selectedRelation === "concerts-bookings" && "SQL++ Covered Index Scan"}
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                {selectedRelation === "concerts-seats" && (
                  <span>
                    <strong>คำอธิบายทางธุรกิจ:</strong> คอนเสิร์ต 1 รายการ ประกอบด้วยที่นั่งนับพันที่นั่งในฮอลล์ โดยทุกที่นั่งจะมีฟิลด์ <code className="font-mono text-ink">concertId</code> อ้างอิงกลับมาหาคอนเสิร์ตแม่ และสืบค้นผ่านดัชนี GSI <code className="font-mono text-ink">idx_seats_concert_status</code> ได้ทันที
                  </span>
                )}
                {selectedRelation === "seats-bookings" && (
                  <span>
                    <strong>คำอธิบายทางธุรกิจ:</strong> ที่นั่ง 1 ตัว จะถูกผูกกับใบเสร็จ <code className="font-mono text-ink">bookings</code> ได้สูงสุดเพียง 1 ใบเท่านั้นเมื่อการชำระเงินเสร็จสิ้น หากยังไม่ถูกจองจะยังไม่มีการสร้างเอกสาร booking (ความสัมพันธ์ 1 : 0..1)
                  </span>
                )}
                {selectedRelation === "concerts-bookings" && (
                  <span>
                    <strong>คำอธิบายทางธุรกิจ:</strong> คอนเสิร์ต 1 รายการ สามารถมีคำสั่งซื้อที่ได้รับการยืนยันได้จำนวนมาก (1 : N) เพื่อใช้ในการออกรายงานสรุปยอดขาย (Sales Ledger Summary)
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Alternative Flow View: Ingestion Architecture */
        <div className="space-y-6 animate-fadeIn">
          <div className="rounded-2xl border border-hairline bg-surface-soft/40 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-hairline">
              <div>
                <h3 className="text-lg font-bold text-ink">
                  สายธารข้อมูลและการประมวลผล In-Memory (KV Data Path)
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted">
                  เส้นทางการไหลของคำขอจากหน้าเว็บ Next.js ผ่าน Direct Memcached Protocol ไปยัง 1,024 vBuckets
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-semibold">
                &lt; 0.5 ms SLA
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-5 rounded-xl bg-canvas border border-hairline space-y-2">
                <span className="text-xs font-bold text-primary uppercase tracking-wider block">Step 1: Edge Request</span>
                <h4 className="font-bold text-ink">Next.js Client &rarr; API</h4>
                <p className="text-xs text-ink-muted leading-relaxed">
                  ผู้ใช้กดจองที่นั่ง ส่งคำขอไปยัง <code className="font-mono text-ink">POST /api/ticket/hold</code>
                </p>
              </div>

              <div className="p-5 rounded-xl bg-canvas border border-primary/50 shadow-subtle space-y-2">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">Step 2: RAM KV Core</span>
                <h4 className="font-bold text-ink">Couchbase Memory Check</h4>
                <p className="text-xs text-ink-muted leading-relaxed">
                  ตรวจสอบและล็อกด้วย CAS Token ระดับฮาร์ดแวร์ในหน่วยความจำ RAM ภายใน 0.2 มิลลิวินาที
                </p>
              </div>

              <div className="p-5 rounded-xl bg-canvas border border-hairline space-y-2">
                <span className="text-xs font-bold text-ink-muted uppercase tracking-wider block">Step 3: Background Sync</span>
                <h4 className="font-bold text-ink">Disk Persistence &amp; DCP</h4>
                <p className="text-xs text-ink-muted leading-relaxed">
                  บันทึกลง NVMe SSD และทำสำเนาข้ามคลัสเตอร์เบื้องหลังแบบ Non-blocking ไม่ทำให้ลูกค้ารอนาน
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
