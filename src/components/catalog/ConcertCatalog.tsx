"use client";

import React, { useState } from "react";
import { ConcertDocument } from "@/validators/concert.schema";
import { Search, ChevronRight, SlidersHorizontal, ShieldCheck } from "lucide-react";

interface ConcertCatalogProps {
  concerts: ConcertDocument[];
  onSelectConcertToBook: (concertId: string) => void;
  onViewConcertDetails: (concertId: string) => void;
  onOpenEngineDrawer: () => void;
}

export const ConcertCatalog: React.FC<ConcertCatalogProps> = ({
  concerts,
  onSelectConcertToBook,
  onViewConcertDetails,
  onOpenEngineDrawer,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredConcerts = concerts.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.artist.toLowerCase().includes(q) ||
      c.venue.toLowerCase().includes(q);

    if (!matchSearch) return false;

    if (selectedCategory === "arena") {
      return (
        c.venue.toLowerCase().includes("arena") ||
        c.venue.toLowerCase().includes("อิมแพ็ค")
      );
    }
    if (selectedCategory === "dome") {
      return (
        c.venue.toLowerCase().includes("dome") ||
        c.venue.toLowerCase().includes("ธันเดอร์")
      );
    }
    return true;
  });

  return (
    <div className="space-y-12 py-8 animate-fadeIn">
      {/* 1. Airbnb-Style Floating Search Pill Bar */}
      <section className="max-w-3xl mx-auto px-4">
        <div className="p-2 sm:p-2.5 rounded-full border border-hairline bg-canvas shadow-soft hover:shadow-float transition-all duration-200 flex items-center justify-between">
          <div className="flex-1 flex items-center divide-x divide-hairline-soft px-3 sm:px-4 text-xs sm:text-sm">
            {/* Search Input: Event / Artist */}
            <div className="flex-1 pr-3">
              <span className="block text-[11px] font-semibold text-ink tracking-tight">
                ศิลปิน หรือ คอนเสิร์ต
              </span>
              <input
                type="text"
                placeholder="ค้นหาชื่อศิลปิน, ชื่องาน..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-ink placeholder:text-ink-muted/60 text-xs sm:text-sm focus:outline-none"
              />
            </div>

            {/* Venue Pill */}
            <div className="hidden sm:block flex-1 px-4">
              <span className="block text-[11px] font-semibold text-ink tracking-tight">
                สถานที่จัดแสดง
              </span>
              <span className="text-xs text-ink-muted">อิมแพ็ค / ธันเดอร์โดม</span>
            </div>

            {/* Performance Mode */}
            <div className="hidden sm:block flex-1 pl-4">
              <span className="block text-[11px] font-semibold text-ink tracking-tight">
                ความเร็วระบบ
              </span>
              <span className="text-xs text-emerald-700 font-medium font-mono">
                Memory Sub-ms SLA
              </span>
            </div>
          </div>

          {/* Airbnb Signature Rausch Search Orb (32px to 48px circle in #ff385c) */}
          <button
            onClick={() => {}}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-primary hover:bg-primary-active text-canvas flex items-center justify-center shrink-0 shadow-xs transition-transform active:scale-95"
            title="ค้นหาคอนเสิร์ต"
          >
            <Search className="w-4 h-4 text-canvas stroke-[2.5]" />
          </button>
        </div>
      </section>

      {/* 2. Category Sub-Nav - Modest weights, horizontal whitespace */}
      <section className="border-b border-hairline-soft pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 text-xs sm:text-sm">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`pb-3 font-medium transition-colors border-b-2 -mb-4 ${
                selectedCategory === "all"
                  ? "border-ink text-ink font-semibold"
                  : "border-transparent text-ink-muted hover:text-ink"
              }`}
            >
              เปิดจำหน่ายทั้งหมด ({concerts.length})
            </button>
            <button
              onClick={() => setSelectedCategory("arena")}
              className={`pb-3 font-medium transition-colors border-b-2 -mb-4 ${
                selectedCategory === "arena"
                  ? "border-ink text-ink font-semibold"
                  : "border-transparent text-ink-muted hover:text-ink"
              }`}
            >
              อิมแพ็ค อารีน่า (Impact Arena)
            </button>
            <button
              onClick={() => setSelectedCategory("dome")}
              className={`pb-3 font-medium transition-colors border-b-2 -mb-4 ${
                selectedCategory === "dome"
                  ? "border-ink text-ink font-semibold"
                  : "border-transparent text-ink-muted hover:text-ink"
              }`}
            >
              ธันเดอร์โดม (Thunder Dome)
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-2 text-xs text-ink-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Couchbase CAS Protection Active</span>
          </div>
        </div>
      </section>

      {/* 3. Property Listing Cards Grid - Exact Airbnb Restraint Design */}
      <section className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-12">
          {filteredConcerts.map((concert) => {
            const isKaze = concert.artist.includes("Fujii Kaze");
            const posterSrc = isKaze ? "/posters/fujii-kaze.jpg" : "/posters/cortis.jpg";
            const lowestPrice = Math.min(...concert.zones.map((z) => z.price));
            const highestPrice = Math.max(...concert.zones.map((z) => z.price));

            return (
              <div
                key={concert.id}
                className="group flex flex-col space-y-3 cursor-pointer"
                onClick={() => onViewConcertDetails(concert.id)}
              >
                {/* Image Container: Clean 4:3 or 1:1, Soft 14px Radius ({rounded.md}), Single Elevation Hover Lift */}
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-surface-soft border border-hairline-soft transition-all duration-300 group-hover:shadow-float">
                  <img
                    src={posterSrc}
                    alt={concert.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-102"
                  />

                  {/* Micro Pill Badge - Clean White Surface */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-canvas/90 backdrop-blur-md text-ink shadow-xs border border-black/5">
                      เปิดจำหน่ายบัตร
                    </span>
                  </div>

                  {/* VIP Last Seat Indicator */}
                  {isKaze && (
                    <div className="absolute top-3.5 right-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-canvas/90 backdrop-blur-md text-ink shadow-xs border border-black/5">
                        VIP เหลือ 1 ที่
                      </span>
                    </div>
                  )}
                </div>

                {/* Typography Block - Modest Weights (20-22px display max, 500-600 weight) */}
                <div className="space-y-1 text-sm">
                  {/* Row 1: Venue & Date */}
                  <div className="flex items-center justify-between text-xs text-ink-muted">
                    <span className="font-normal truncate">{concert.venue}</span>
                    <span className="font-normal shrink-0 ml-2">{concert.date.split(" ")[2]} พ.ย. 2026</span>
                  </div>

                  {/* Row 2: Headline / Title */}
                  <h3 className="font-medium text-base text-ink line-clamp-1 group-hover:text-ink/80 transition-colors">
                    {concert.artist} — {concert.title}
                  </h3>

                  {/* Row 3: Subtitle / Description */}
                  <p className="text-xs text-ink-muted line-clamp-1">
                    {concert.subtitle || "การแสดงสดเต็มรูปแบบ พร้อมผังที่นั่งความเร็วสูง"}
                  </p>

                  {/* Row 4: Price & CTA Link */}
                  <div className="pt-2 flex items-baseline justify-between">
                    <div>
                      <span className="font-semibold text-sm sm:text-base text-ink">
                        ฿{lowestPrice.toLocaleString()} – ฿{highestPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-ink-muted font-normal"> / ที่นั่ง</span>
                    </div>

                    <span className="text-xs font-semibold text-primary group-hover:underline flex items-center space-x-1">
                      <span>เลือกที่นั่ง</span>
                      <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Understated Couchbase System Signal (Restrained Callout) */}
      <section className="pt-8 border-t border-hairline-soft">
        <div className="p-6 rounded-2xl bg-surface-soft border border-hairline-soft flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-semibold text-sm text-ink">
              ระบบจำลองการกดบัตรความเร็วสูง KAZETIX Engine
            </h4>
            <p className="text-xs text-ink-muted max-w-xl">
              ขับเคลื่อนด้วย Couchbase Key-Value In-Memory อ่านข้อมูลเร็วกว่า 1 มิลลิวินาที
              และกลไก Compare-And-Swap (CAS) ป้องกันการซื้อซ้ำในเสี้ยววินาทีเดียว
            </p>
          </div>

          <button
            onClick={onOpenEngineDrawer}
            className="shrink-0 px-4 py-2.5 rounded-full bg-canvas border border-hairline hover:border-ink/20 text-ink text-xs font-medium transition-all shadow-xs hover:shadow-float"
          >
            เปิดแผงทดสอบ Concurrency
          </button>
        </div>
      </section>
    </div>
  );
};
