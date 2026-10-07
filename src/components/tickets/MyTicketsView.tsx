"use client";

import React from "react";
import { BookingDocument } from "@/validators/booking.schema";
import { ConcertDocument } from "@/validators/concert.schema";
import {
  Ticket,
  QrCode,
  Printer,
  ChevronLeft,
  Calendar,
  MapPin,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

interface MyTicketsViewProps {
  bookings: BookingDocument[];
  concerts: ConcertDocument[];
  onGoToCatalog: () => void;
  onSelectConcert: (concertId: string) => void;
}

export const MyTicketsView: React.FC<MyTicketsViewProps> = ({
  bookings,
  concerts,
  onGoToCatalog,
  onSelectConcert,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 py-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header & Breadcrumb */}
      <div className="flex items-center justify-between border-b border-hairline-soft pb-4">
        <div>
          <button
            onClick={onGoToCatalog}
            className="inline-flex items-center space-x-1.5 text-xs text-ink-muted hover:text-ink transition-colors p-1 -ml-1 rounded-lg hover:bg-surface-soft mb-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>ย้อนกลับไปหน้าคอนเสิร์ตทั้งหมด</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-semibold text-ink tracking-tight">
            บัตรคอนเสิร์ตของฉัน (My Tickets)
          </h1>
          <p className="text-xs text-ink-muted">
            รายการตั๋วอิเล็กทรอนิกส์ (E-Ticket) ที่ได้รับการยืนยันสิทธิ์ในระบบ Couchbase
          </p>
        </div>

        {bookings.length > 0 && (
          <button
            onClick={handlePrint}
            className="hidden sm:inline-flex items-center space-x-1.5 px-4 py-2 rounded-full border border-hairline hover:border-ink/20 bg-canvas hover:bg-surface-soft text-xs font-medium text-ink transition-all shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-ink-muted" />
            <span>พิมพ์ตั๋วทั้งหมด (Print)</span>
          </button>
        )}
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 space-y-4 bg-surface-soft rounded-2xl border border-hairline-soft p-8">
          <div className="w-12 h-12 rounded-full bg-canvas border border-hairline flex items-center justify-center mx-auto text-ink-muted">
            <Ticket className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-base text-ink">ยังไม่มีบัตรคอนเสิร์ตในบัญชีนี้</h3>
            <p className="text-xs text-ink-muted max-w-sm mx-auto">
              คุณยังไม่ได้ดำเนินการสั่งซื้อบัตรคอนเสิร์ต สามารถเลือกชมรายการคอนเสิร์ตที่เปิดจำหน่ายเพื่อเริ่มจองที่นั่งได้ทันที
            </p>
          </div>
          <button
            onClick={onGoToCatalog}
            className="h-11 px-6 rounded-full bg-primary hover:bg-primary-active text-canvas font-semibold text-xs sm:text-sm inline-flex items-center space-x-2 transition-all shadow-float"
          >
            <span>เลือกซื้อบัตรคอนเสิร์ต</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Tickets Grid */
        <div className="space-y-6">
          {bookings.map((booking) => {
            const concert = concerts.find((c) => c.id === booking.concertId);
            const artistName = concert?.artist || "ศิลปิน";
            const concertTitle = concert?.title || "คอนเสิร์ต";
            const venue = concert?.venue || "อิมแพ็ค อารีน่า เมืองทองธานี";
            const date = concert?.date || "พฤศจิกายน 2026";

            return (
              <div
                key={booking.id}
                className="bg-canvas border border-hairline rounded-2xl overflow-hidden shadow-xs hover:shadow-soft transition-all duration-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-12">
                  {/* Left Ticket Info */}
                  <div className="p-6 md:col-span-8 space-y-4 border-b md:border-b-0 md:border-r border-hairline-soft">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {artistName}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium font-mono">
                        ยืนยันสิทธิ์แล้ว (PAID)
                      </span>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg text-ink line-clamp-1">
                        {concertTitle}
                      </h3>
                      <div className="flex items-center space-x-3 text-xs text-ink-muted mt-1">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{date}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{venue}</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-surface-soft text-xs border border-hairline-soft">
                      <div>
                        <span className="text-[11px] text-ink-muted block">ที่นั่ง</span>
                        <span className="font-bold text-base text-ink font-mono">{booking.seatLabel}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-ink-muted block">โซน</span>
                        <span className="font-medium text-ink truncate block">{booking.zoneName}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-ink-muted block">ยอดชำระแล้ว</span>
                        <span className="font-semibold text-ink">฿{booking.pricePaid.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-ink-muted flex items-center justify-between pt-1">
                      <span>ผู้ถือบัตร: <strong>{booking.userName}</strong></span>
                      <span className="font-mono text-[10px]">
                        รหัสการจอง: {booking.id.replace("booking::", "")}
                      </span>
                    </div>
                  </div>

                  {/* Right QR Gate Pass */}
                  <div className="p-6 md:col-span-4 bg-surface-soft/60 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-28 h-28 bg-canvas border border-hairline rounded-xl p-2 flex items-center justify-center shadow-xs">
                      <QrCode className="w-full h-full text-ink" />
                    </div>
                    <div>
                      <span className="text-[10px] text-ink-muted uppercase tracking-wider block font-medium">
                        สแกนเข้าประตูฮอลล์
                      </span>
                      <span className="font-mono text-[10px] text-ink-muted/80 block mt-0.5">
                        CAS Token: {booking.casToken}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
