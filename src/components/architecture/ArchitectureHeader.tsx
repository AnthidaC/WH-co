"use client";

import React from "react";
import Link from "next/link";
import {
  Database,
  ArrowLeft,
  Maximize2,
  Minimize2,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";

interface ArchitectureHeaderProps {
  activeSection: "whatis" | "diagram" | "schema" | "cas" | "gsi" | "comparison";
  onSelectSection: (section: "whatis" | "diagram" | "schema" | "cas" | "gsi" | "comparison") => void;
  isPresentationMode: boolean;
  onTogglePresentationMode: () => void;
  clusterStats?: {
    counts: { concerts: number; seats: number; bookings: number };
    clusterStatus: string;
    memoryEngine: string;
  } | null;
  onRefreshStats?: () => void;
  isRefreshing?: boolean;
}

export const ArchitectureHeader: React.FC<ArchitectureHeaderProps> = ({
  activeSection,
  onSelectSection,
  isPresentationMode,
  onTogglePresentationMode,
  clusterStats,
  onRefreshStats,
  isRefreshing = false,
}) => {
  const sections = [
    { id: "whatis", label: "00 ทำความรู้จัก Couchbase", icon: "Couchbase" },
    { id: "diagram", label: "01 ผัง ER Diagram (ERD)", icon: "Topology" },
    { id: "schema", label: "02 โครงสร้าง Schemas", icon: "Schemas" },
    { id: "cas", label: "03 กลไก CAS Concurrency", icon: "CAS" },
    { id: "gsi", label: "04 ดัชนี GSI & Query", icon: "GSI" },
    { id: "comparison", label: "05 เปรียบเทียบ RDBMS", icon: "Compare" },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-canvas/95 backdrop-blur-md border-b border-hairline-soft transition-all">
      {/* Top Banner for Editorial Context */}
      <div className="border-b border-hairline-soft/60 bg-surface-soft/60 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-ink-muted">
            <span className="font-semibold tracking-wide uppercase text-[10px] text-ink bg-surface-strong px-2 py-0.5 rounded-full border border-hairline">
              Database Architecture
            </span>
            <span className="hidden sm:inline text-hairline-strong">•</span>
            <span className="hidden sm:inline">Couchbase In-Memory KV + SQL++ (N1QL) Engine</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium">
                Cluster: {clusterStats?.clusterStatus ?? "HEALTHY"} (1,024 MB Memory Quota)
              </span>
            </div>

            {onRefreshStats && (
              <button
                onClick={onRefreshStats}
                disabled={isRefreshing}
                title="รีเฟรชข้อมูลสถานะคลัสเตอร์"
                className="p-1 text-ink-muted hover:text-ink rounded-full hover:bg-surface-strong transition-colors disabled:opacity-40"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        {/* Left: Branding & Back Button */}
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-hairline hover:border-ink/20 text-xs font-medium text-ink bg-canvas hover:bg-surface-soft transition-all shadow-xs shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-ink-muted" />
            <span className="hidden sm:inline">กลับสู่หน้าระบบกดบัตร</span>
            <span className="sm:hidden">กลับ</span>
          </Link>

          <div className="h-5 w-px bg-hairline-soft shrink-0" />

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-canvas shrink-0 shadow-xs">
                <Database className="w-3.5 h-3.5" />
              </div>
              <h1 className="text-base sm:text-lg font-semibold tracking-tight text-ink truncate font-sans">
                สถาปัตยกรรมฐานข้อมูล Couchbase
              </h1>
            </div>
            <p className="text-[11px] text-ink-muted truncate hidden sm:block">
              Presentation Edition • Editorial Minimal Blueprint &amp; Concurrency Handshake
            </p>
          </div>
        </div>

        {/* Right Actions: Presentation Mode Button */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <button
            onClick={onTogglePresentationMode}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full border text-xs font-medium transition-all shadow-xs ${
              isPresentationMode
                ? "bg-ink text-canvas border-ink shadow-float"
                : "bg-canvas text-ink border-hairline hover:border-ink/20 hover:bg-surface-soft"
            }`}
            title={isPresentationMode ? "ออกจากโหมดพรีเซนต์" : "เปิดโหมดนำเสนอเต็มจอ"}
          >
            {isPresentationMode ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-canvas" />
                <span className="hidden sm:inline">ออกจากโหมดพรีเซนต์</span>
                <span className="sm:hidden">ย่อหน้าต่าง</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-primary" />
                <span className="hidden sm:inline">โหมดนำเสนอ (Presentation)</span>
                <span className="sm:hidden">พรีเซนต์</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Pills Bar (Editorial Section Selector) */}
      <div className="border-t border-hairline-soft/80 bg-canvas px-4 sm:px-6 lg:px-8 py-2.5 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center space-x-1.5 sm:space-x-2 text-xs font-medium min-w-max">
          {sections.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => onSelectSection(sec.id)}
                className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-ink text-canvas font-semibold shadow-xs"
                    : "text-ink-muted hover:text-ink hover:bg-surface-soft"
                }`}
              >
                {sec.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
