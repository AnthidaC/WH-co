"use client";

import React from "react";
import Link from "next/link";
import { SlidersHorizontal, ChevronRight, Database } from "lucide-react";
import { ConcertDocument } from "@/validators/concert.schema";

interface NavbarProps {
  concerts: ConcertDocument[];
  selectedConcertId: string;
  onSelectConcert: (id: string) => void;
  onOpenEngineDrawer: () => void;
  onResetSeats: () => void;
  isResetting?: boolean;
  currentView: "catalog" | "detail" | "seatmap" | "mytickets";
  onGoToCatalog: () => void;
  onGoToMyTickets: () => void;
  myTicketsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  concerts,
  selectedConcertId,
  onSelectConcert,
  onOpenEngineDrawer,
  onResetSeats,
  isResetting = false,
  currentView,
  onGoToCatalog,
  onGoToMyTickets,
  myTicketsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-canvas/95 backdrop-blur-md border-b border-hairline-soft transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo - Minimal, typographic, restrained */}
        <div className="flex items-center space-x-6">
          <button
            onClick={onGoToCatalog}
            className="flex items-center space-x-2.5 text-left group focus:outline-none"
          >
            {/* Minimal SVG Mark in Single Accent Voltage */}
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-canvas shadow-xs">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-canvas"
              >
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                <path d="M13 5v2" />
                <path d="M13 17v2" />
                <path d="M13 11v2" />
              </svg>
            </div>
            <div>
              <span className="font-semibold text-lg tracking-tight text-ink font-sans">
                kazetix
              </span>
            </div>
          </button>
        </div>

        {/* Center Navigation - Understated, clean typography */}
        <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
          <button
            onClick={onGoToCatalog}
            className={`px-4 py-2 rounded-full transition-colors ${
              currentView === "catalog"
                ? "text-ink font-semibold bg-surface-soft"
                : "text-ink-muted hover:text-ink hover:bg-surface-soft/60"
            }`}
          >
            คอนเสิร์ตทั้งหมด
          </button>

          {concerts.map((c) => {
            const isSelected = c.id === selectedConcertId && (currentView === "detail" || currentView === "seatmap");
            return (
              <button
                key={c.id}
                onClick={() => onSelectConcert(c.id)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  isSelected
                    ? "text-ink font-semibold bg-surface-soft"
                    : "text-ink-muted hover:text-ink hover:bg-surface-soft/60"
                }`}
              >
                {c.artist}
              </button>
            );
          })}

          <button
            onClick={onGoToMyTickets}
            className={`px-4 py-2 rounded-full transition-colors inline-flex items-center space-x-2 ${
              currentView === "mytickets"
                ? "text-ink font-semibold bg-surface-soft"
                : "text-ink-muted hover:text-ink hover:bg-surface-soft/60"
            }`}
          >
            <span>บัตรของฉัน</span>
            {myTicketsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-primary text-canvas text-[10px] font-semibold">
                {myTicketsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Actions - Subtle and refined */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Mobile My Tickets Button */}
          <button
            onClick={onGoToMyTickets}
            className={`md:hidden relative p-2 rounded-full transition-colors ${
              currentView === "mytickets"
                ? "text-ink bg-surface-soft"
                : "text-ink-muted hover:text-ink hover:bg-surface-soft"
            }`}
            title="บัตรคอนเสิร์ตของฉัน"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
            {myTicketsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
            )}
          </button>

          <button
            onClick={onResetSeats}
            disabled={isResetting}
            title="รีเซ็ตผังที่นั่งสำหรับการเริ่มใหม่"
            className="text-xs text-ink-muted hover:text-ink px-2.5 sm:px-3 py-1.5 rounded-full hover:bg-surface-soft transition-colors disabled:opacity-40"
          >
            {isResetting ? "กำลังรีเซ็ต..." : "รีเซ็ตผัง"}
          </button>

          {/* DB Architecture Presentation Link */}
          <Link
            href="/db-architecture"
            title="เปิดพิมพ์เขียวสถาปัตยกรรมฐานข้อมูล (โหมดนำเสนอ)"
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-full border border-hairline hover:border-ink/20 bg-canvas hover:bg-surface-soft text-ink text-xs font-medium transition-all shadow-xs hover:shadow-float active:scale-98"
          >
            <Database className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">สถาปัตยกรรม DB</span>
          </Link>

          {/* Couchbase Engine Pill Button */}
          <button
            onClick={onOpenEngineDrawer}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-full border border-hairline hover:border-ink/20 bg-canvas hover:bg-surface-soft text-ink text-xs font-medium transition-all shadow-xs hover:shadow-float active:scale-98"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-ink-muted" />
            <span>Couchbase Engine</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </button>
        </div>
      </div>
    </header>
  );
};
