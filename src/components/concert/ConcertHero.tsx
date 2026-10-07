"use client";

import React from "react";
import { Calendar, MapPin, Clock, ShieldCheck } from "lucide-react";
import { ConcertDocument } from "@/validators/concert.schema";

interface ConcertHeroProps {
  concert: ConcertDocument;
  availableCount: number;
  totalSeats: number;
}

export const ConcertHero: React.FC<ConcertHeroProps> = ({
  concert,
  availableCount,
  totalSeats,
}) => {
  return (
    <section className="py-6 border-b border-hairline-soft bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold tracking-wider text-ink-muted uppercase">
              {concert.artist}
            </span>
            <h1 className="text-xl sm:text-2xl font-semibold text-ink tracking-tight">
              {concert.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted pt-1">
              <span className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-ink-muted" />
                <span>{concert.date} ({concert.time})</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-ink-muted" />
                <span>{concert.venue}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-right">
            <div>
              <span className="text-[11px] text-ink-muted block">ที่นั่งว่างคงเหลือ</span>
              <span className="text-lg font-semibold text-ink font-mono">
                {availableCount} <span className="text-xs font-normal text-ink-muted">/ {totalSeats}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
