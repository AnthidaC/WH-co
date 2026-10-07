"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-24 border-t border-hairline-soft bg-surface-soft text-ink-muted text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-2">
            <span className="font-semibold text-sm text-ink block">KAZETIX</span>
            <p className="text-[11px] leading-relaxed text-ink-muted">
              ระบบจำลองการกดบัตรคอนเสิร์ตความเร็วสูง สถาปัตยกรรม In-Memory NoSQL
              พร้อมกลไก Compare-And-Swap (CAS) ป้องกันการซื้อซ้ำซ้อน
            </p>
          </div>

          {/* Col 2: Support */}
          <div className="space-y-2">
            <span className="font-semibold text-ink block">ศูนย์ช่วยเหลือ</span>
            <ul className="space-y-1.5 text-[11px]">
              <li>คำถามที่พบบ่อย (FAQ)</li>
              <li>การรับบัตรหน้างาน</li>
              <li>เงื่อนไขการโอนสิทธิ์</li>
            </ul>
          </div>

          {/* Col 3: Promoters */}
          <div className="space-y-2">
            <span className="font-semibold text-ink block">สถานที่จัดแสดง</span>
            <ul className="space-y-1.5 text-[11px]">
              <li>อิมแพ็ค อารีน่า เมืองทองธานี</li>
              <li>ธันเดอร์โดม เมืองทองธานี</li>
              <li>ผู้จัด: AEG Presents Asia</li>
            </ul>
          </div>

          {/* Col 4: Technology */}
          <div className="space-y-2">
            <span className="font-semibold text-ink block">สถาปัตยกรรมระบบ</span>
            <div className="flex items-center space-x-1.5 text-[11px] text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Couchbase CAS Atomic Protection</span>
            </div>
            <p className="text-[10px] text-ink-muted">
              Key-Value Memory SLA &lt; 1 ms • Zero Double Booking Guarantee
            </p>
            <div className="pt-1">
              <a
                href="/db-architecture"
                className="text-[11px] text-primary hover:text-primary-active font-medium inline-flex items-center"
              >
                ดูพิมพ์เขียวสถาปัตยกรรม DB (Presentation) &rarr;
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-hairline-soft flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-ink-muted">
          <div>
            © 2026 KAZETIX. สงวนลิขสิทธิ์ตามกฎหมาย
          </div>
          <div className="flex items-center space-x-4">
            <span>นโยบายความเป็นส่วนตัว</span>
            <span>•</span>
            <span>เงื่อนไขการใช้บริการ</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
