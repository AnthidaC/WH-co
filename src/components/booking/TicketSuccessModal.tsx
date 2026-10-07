"use client";

import React from "react";
import { BookingDocument } from "@/validators/booking.schema";
import { ConcertDocument } from "@/validators/concert.schema";
import { Check, QrCode, X } from "lucide-react";

interface TicketSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingDocument | null;
  concert: ConcertDocument | null;
  onViewMyTickets?: () => void;
}

export const TicketSuccessModal: React.FC<TicketSuccessModalProps> = ({
  isOpen,
  onClose,
  booking,
  concert,
  onViewMyTickets,
}) => {
  if (!isOpen || !booking || !concert) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/40 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-canvas border border-hairline rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden shadow-soft transition-all z-10">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-hairline-soft text-center relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-surface-soft text-ink-muted hover:text-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto mb-3 border border-emerald-200">
            <Check className="w-5 h-5 stroke-[2.5]" />
          </div>
          <h3 className="text-base font-semibold text-ink">การออกบัตรคอนเสิร์ตเสร็จสมบูรณ์</h3>
          <p className="text-xs text-ink-muted mt-0.5">
            ยืนยันสิทธิ์ถาวรและบันทึกสู่ Couchbase Document สำเร็จ
          </p>
        </div>

        {/* Digital Ticket Card */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div className="border border-hairline rounded-xl p-5 bg-surface-soft space-y-4">
            <div className="border-b border-dashed border-hairline-soft pb-3">
              <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider block">
                {concert.artist}
              </span>
              <h4 className="font-semibold text-sm text-ink mt-0.5 line-clamp-1">
                {concert.title}
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-ink-muted block text-[11px]">เลขที่นั่ง</span>
                <span className="font-semibold text-base text-ink font-mono">{booking.seatLabel}</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[11px]">โซน</span>
                <span className="font-medium text-ink">{booking.zoneName}</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[11px]">ยอดชำระ</span>
                <span className="font-medium text-ink">฿{booking.pricePaid.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[11px]">ผู้ถือบัตร</span>
                <span className="font-medium text-ink">{booking.userName}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-dashed border-hairline-soft flex items-center justify-between text-[11px] text-ink-muted">
              <div>
                <span className="block font-mono">รหัสการจอง: {booking.id.replace("booking::", "")}</span>
                <span className="block font-mono text-[9px] text-ink-muted/80 mt-0.5">
                  CAS Token: {booking.casToken}
                </span>
              </div>
              <div className="w-12 h-12 bg-canvas border border-hairline rounded-lg flex items-center justify-center">
                <QrCode className="w-8 h-8 text-ink" />
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {onViewMyTickets && (
              <button
                onClick={() => {
                  onClose();
                  onViewMyTickets();
                }}
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary-active text-canvas font-semibold text-xs sm:text-sm transition-all shadow-float active:scale-98"
              >
                ดูในบัตรคอนเสิร์ตของฉัน (My Tickets)
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handlePrint}
                className="h-10 rounded-xl border border-hairline bg-canvas hover:bg-surface-soft text-ink text-xs font-medium transition-colors"
              >
                พิมพ์ตั๋ว (Print)
              </button>
              <button
                onClick={onClose}
                className="h-10 rounded-xl border border-hairline-soft bg-surface-soft hover:bg-surface-soft/80 text-ink text-xs font-medium transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
