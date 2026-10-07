"use client";

import React from "react";
import { RDBMS_COMPARISONS } from "@/data/db-architecture-data";
import { CheckCircle2, XCircle, ArrowUpRight, Scale, ShieldCheck } from "lucide-react";

export const RdbmsComparisonTable: React.FC = () => {
  return (
    <div className="bg-canvas border border-hairline rounded-2xl p-5 sm:p-7 md:p-9 shadow-soft space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-hairline-soft">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <Scale className="w-3.5 h-3.5 text-primary" />
            <span>Architectural Justification</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-ink font-sans">
            เปรียบเทียบสถาปัตยกรรม: Couchbase In-Memory vs Traditional RDBMS
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed max-w-2xl">
            ตารางวิเคราะห์เชิงลึกสำหรับนำเสนอผู้บริหารและวิศวกรซอฟต์แวร์: เหตุผลที่ระบบจองตั๋วคอนเสิร์ตระดับ Rush Traffic ต้องใช้ Couchbase แทนฐานข้อมูลแบบเดิม
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">Performance Proven SLA</span>
        </div>
      </div>

      {/* Desktop Comparison Table (Zero Overflow) */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-hairline text-ink-muted font-mono uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4 font-semibold w-1/5">มิติด้านสถาปัตยกรรม</th>
              <th className="py-3 px-4 font-semibold w-2/5 bg-primary-subtle/30 text-primary">
                Couchbase Rush Engine (ระบบของเรา)
              </th>
              <th className="py-3 px-4 font-semibold w-2/5 text-ink-muted">
                Traditional RDBMS (MySQL / PostgreSQL)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline font-sans">
            {RDBMS_COMPARISONS.map((item, idx) => (
              <tr key={idx} className="hover:bg-surface-soft/60 transition-colors">
                <td className="py-4 px-4 align-top font-semibold text-ink break-words">
                  {item.featureTh}
                </td>

                <td className="py-4 px-4 align-top bg-primary-subtle/10 leading-relaxed text-ink-body break-words border-l border-r border-primary/10">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-ink block text-xs">
                        {item.couchbaseWay}
                      </span>
                      <p className="text-[11px] text-ink-body mt-1 leading-relaxed">
                        &rarr; {item.whyCouchbaseWinsTh}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4 align-top leading-relaxed text-ink-muted break-words">
                  <div className="flex items-start space-x-2">
                    <XCircle className="w-4 h-4 text-ink-muted/70 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-ink-muted block text-xs">
                        {item.traditionalRdbms}
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile / Tablet Collapsing Cards (Strict Overflow Prevention) */}
      <div className="lg:hidden space-y-4">
        {RDBMS_COMPARISONS.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-hairline bg-canvas space-y-3 text-xs"
          >
            <h4 className="font-bold text-sm text-ink font-sans pb-2 border-b border-hairline">
              {item.featureTh}
            </h4>

            {/* Couchbase Advantage */}
            <div className="p-3 rounded-lg bg-primary-subtle/30 border border-primary/20 space-y-1">
              <div className="flex items-center space-x-1.5 text-primary font-semibold text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Couchbase Engine (เราเลือกใช้):</span>
              </div>
              <p className="font-medium text-ink text-xs break-words">{item.couchbaseWay}</p>
              <p className="text-[11px] text-ink-muted leading-relaxed pt-1">
                {item.whyCouchbaseWinsTh}
              </p>
            </div>

            {/* Traditional Drawback */}
            <div className="p-3 rounded-lg bg-surface-soft border border-hairline-soft space-y-1">
              <div className="flex items-center space-x-1.5 text-ink-muted font-semibold text-xs">
                <XCircle className="w-3.5 h-3.5" />
                <span>Traditional RDBMS (ข้อจำกัด):</span>
              </div>
              <p className="text-ink-muted text-xs break-words">{item.traditionalRdbms}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
