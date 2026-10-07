"use client";

import React, { useState } from "react";
import { ConcertDocument } from "@/validators/concert.schema";
import {
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  FileText,
  AlertCircle,
} from "lucide-react";

interface ConcertDetailViewProps {
  concert: ConcertDocument;
  onGoToSeatMap: () => void;
  onBackToCatalog: () => void;
  availableSeatsCount: number;
  totalSeatsCount: number;
}

export const ConcertDetailView: React.FC<ConcertDetailViewProps> = ({
  concert,
  onGoToSeatMap,
  onBackToCatalog,
  availableSeatsCount,
  totalSeatsCount,
}) => {
  const [activeTab, setActiveTab] = useState<"zones" | "rules">("zones");
  const isKaze = concert.artist.includes("Fujii Kaze");
  const posterSrc = isKaze ? "/posters/fujii-kaze.jpg" : "/posters/cortis.jpg";

  const lowestPrice = Math.min(...concert.zones.map((z) => z.price));
  const highestPrice = Math.max(...concert.zones.map((z) => z.price));

  return (
    <div className="space-y-10 py-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Navigation Breadcrumb */}
      <div>
        <button
          onClick={onBackToCatalog}
          className="inline-flex items-center space-x-1.5 text-xs text-ink-muted hover:text-ink transition-colors p-1 -ml-1 rounded-lg hover:bg-surface-soft"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>ย้อนกลับไปคอนเสิร์ตทั้งหมด</span>
        </button>
      </div>

      {/* Main Listing Layout: 2-Column Airbnb Structure */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Official Poster Showcase */}
        <div className="md:col-span-5">
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-surface-soft border border-hairline shadow-soft">
            <img
              src={posterSrc}
              alt={concert.title}
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        {/* Right Column: Title, Event Specifics, Pricing & Action */}
        <div className="md:col-span-7 space-y-6">
          {/* Header Typography - Modest 24-28px */}
          <div className="space-y-1.5 border-b border-hairline-soft pb-5">
            <span className="text-xs font-semibold tracking-wider text-ink-muted uppercase">
              {concert.artist}
            </span>
            <h1 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight">
              {concert.title}
            </h1>
            {concert.subtitle && (
              <p className="text-sm text-ink-muted font-normal pt-0.5">
                {concert.subtitle}
              </p>
            )}
          </div>

          {/* Event Details Grid */}
          <div className="space-y-3 text-xs sm:text-sm text-ink border-b border-hairline-soft pb-6">
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-ink-muted shrink-0" />
              <div>
                <span className="font-medium text-ink">{concert.date}</span>
                <span className="text-ink-muted text-xs block">ประตูเปิด 17:30 น. • เริ่มการแสดง {concert.time}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-ink-muted shrink-0" />
              <div>
                <span className="font-medium text-ink">{concert.venue}</span>
                <span className="text-ink-muted text-xs block">อิมแพ็ค เมืองทองธานี, ประเทศไทย</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs text-ink-muted">
                ป้องกันการแย่งสิทธิ์แบบ Real-time ด้วย Couchbase CAS In-Memory
              </span>
            </div>
          </div>

          {/* Pricing & Booking Card (Floating Box in Airbnb Style) */}
          <div className="p-6 rounded-2xl border border-hairline bg-surface-soft space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-ink-muted block">ราคาบัตรเข้าชม</span>
                <div className="flex items-baseline space-x-1 mt-0.5">
                  <span className="text-2xl font-semibold text-ink">
                    ฿{lowestPrice.toLocaleString()} – ฿{highestPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-ink-muted"> / ที่นั่ง</span>
                </div>
              </div>

              <span className="text-xs font-mono text-emerald-800 bg-emerald-100/60 px-2.5 py-1 rounded-full">
                ว่าง {availableSeatsCount} / {totalSeatsCount} ที่นั่ง
              </span>
            </div>

            {/* Single Accent Voltage Primary Button (Height 48px according to design.md) */}
            <button
              onClick={onGoToSeatMap}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary-active text-canvas font-semibold text-sm sm:text-base flex items-center justify-center space-x-2 transition-all shadow-float active:scale-98"
            >
              <span>เลือกที่นั่งบนผัง (Select Seat)</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <p className="text-[11px] text-center text-ink-muted">
              เมื่อกดจอง ระบบจะล็อกที่นั่งไว้ให้ 5 นาที เพื่อให้ดำเนินการชำระเงิน
            </p>
          </div>
        </div>
      </div>

      {/* Tabs: Zone Pricing vs Terms */}
      <div className="border-t border-hairline-soft pt-8 space-y-6">
        <div className="flex items-center space-x-6 text-sm">
          <button
            onClick={() => setActiveTab("zones")}
            className={`pb-2 font-medium border-b-2 transition-colors ${
              activeTab === "zones"
                ? "border-ink text-ink font-semibold"
                : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            โซนและสิทธิประโยชน์
          </button>
          <button
            onClick={() => setActiveTab("rules")}
            className={`pb-2 font-medium border-b-2 transition-colors ${
              activeTab === "rules"
                ? "border-ink text-ink font-semibold"
                : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            ข้อกำหนดการเข้าชม
          </button>
        </div>

        {activeTab === "zones" ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {concert.zones.map((zone) => (
              <div
                key={zone.id}
                className="p-5 rounded-xl border border-hairline-soft bg-canvas space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-ink">{zone.name}</span>
                  <span className="font-mono text-xs font-semibold text-ink">
                    ฿{zone.price.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">
                  {zone.description || "ที่นั่งมองเห็นเวทีชัดเจน ระบบเสียงรอบทิศทาง"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 text-xs sm:text-sm text-ink-muted leading-relaxed max-w-3xl">
            <p>
              • <strong>การตรวจบัตรประชาชน:</strong> ผู้เข้าชมต้องแสดงบัตรประชาชนหรือหนังสือเดินทางตัวจริงที่มีชื่อตรงกับชื่อบนบัตรคอนเสิร์ต
            </p>
            <p>
              • <strong>การถือสิทธิ์ชั่วคราว (TTL):</strong> เอกสารการจองจะหมดอายุใน 5 นาที หากไม่ชำระเงิน Couchbase จะคืนที่นั่งสู่ระบบอัตโนมัติ
            </p>
            <p>
              • <strong>มาตรการป้องกันบัตรผี:</strong> ตั๋วทุกใบมี CAS Token สำหรับตรวจสอบความถูกต้อง ไม่สามารถแก้ไขหรือปลอมแปลงได้
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
