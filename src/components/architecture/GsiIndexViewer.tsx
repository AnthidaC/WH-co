"use client";

import React, { useState } from "react";
import { Search, Copy, Check, Database, Zap, Sparkles, Code2 } from "lucide-react";
import { COLLECTIONS_DATA } from "@/data/db-architecture-data";

export const GsiIndexViewer: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const allIndexes = COLLECTIONS_DATA.flatMap((col) =>
    col.gsiIndexes.map((idx) => ({
      ...idx,
      collectionName: col.name,
      displayNameTh: col.displayNameTh,
    }))
  );

  const handleCopy = (name: string, sql: string) => {
    navigator.clipboard.writeText(sql);
    setCopiedIndex(name);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-canvas border border-hairline rounded-2xl p-5 sm:p-7 md:p-9 shadow-soft space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-hairline-soft">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <Search className="w-3.5 h-3.5 text-primary" />
            <span>GSI Indexing &amp; Query Optimization</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-ink font-sans">
            กลยุทธ์การทำดัชนี GSI (Global Secondary Indexes) และ SQL++
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed max-w-2xl">
            เพื่อไม่ให้เกิด Primary Scan ในสภาวะ Production ระบบได้ออกแบบ Covered Indexes สำหรับการแสดงผังที่นั่งและการค้นหาประวัติการจอง ช่วยลดการสแกนข้อมูลส่วนเกินได้ 100%
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-surface-soft border border-hairline text-xs font-mono text-ink shrink-0">
          <Database className="w-3.5 h-3.5 text-primary" />
          <span>Zero Primary Scan Architecture</span>
        </div>
      </div>

      {/* Rationale Comparison Callout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-hairline bg-surface-soft/60 space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-ink text-sm">การกดบัตรความเร็วสูง (Rush Hold)</h4>
          </div>
          <p className="text-ink-body leading-relaxed">
            ใช้ <strong>Key-Value Direct Access</strong> ด้วย Deterministic Key เช่น <code>seat::fujii-kaze-bkk::VIP-01</code> ไม่ต้องพึ่งพา Index Engine จึงได้ความเร็วระดับ Sub-millisecond (&lt; 0.5 ms) โดยตรงจาก RAM
          </p>
        </div>

        <div className="p-4 rounded-xl border border-hairline bg-surface-soft/60 space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-emerald-600" />
            <h4 className="font-semibold text-ink text-sm">การโหลดผังที่นั่ง &amp; ประวัติตั๋ว (Seatmap &amp; Orders)</h4>
          </div>
          <p className="text-ink-body leading-relaxed">
            ใช้ <strong>SQL++ (N1QL) ผ่าน Covered GSI Index</strong> สแกนเฉพาะ B-Tree Index ที่ตรงกับ <code>concertId</code> และ <code>zone</code> โดยไม่ต้องดึง Document ตัวเต็ม ประหยัดแบนด์วิดท์มหาศาล
          </p>
        </div>
      </div>

      {/* Indexes List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-ink uppercase tracking-wider font-sans">
          รายการดัชนี GSI ทั้งหมดในคลัสเตอร์ ({allIndexes.length} Indexes)
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {allIndexes.map((idx) => {
            const isCopied = copiedIndex === idx.name;

            return (
              <div
                key={idx.name}
                className="p-4 sm:p-5 rounded-xl border border-hairline bg-canvas hover:border-ink/20 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="font-mono font-bold text-xs sm:text-sm text-ink break-all">
                      {idx.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-soft border border-hairline text-ink-muted">
                      Collection: {idx.collectionName}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(idx.name, idx.sqlPlusPlus)}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border border-hairline hover:bg-surface-soft text-xs text-ink-muted hover:text-ink transition-colors self-start sm:self-auto shrink-0"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-medium text-[11px]">คัดลอก SQL++ แล้ว</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px]">คัดลอก DDL</span>
                      </>
                    )}
                  </button>
                </div>

                {/* SQL++ Code Block */}
                <div className="p-3.5 rounded-xl bg-[#1e1e1e] text-amber-300 font-mono text-xs overflow-x-auto shadow-inner leading-relaxed">
                  <pre className="whitespace-pre-wrap break-all">
                    {idx.sqlPlusPlus}
                  </pre>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-ink-muted pt-1">
                  <p className="leading-relaxed">
                    <strong className="text-ink">วัตถุประสงค์:</strong> {idx.purposeTh}
                  </p>
                  <div className="flex items-center space-x-1 font-mono text-[11px] text-ink shrink-0">
                    <span>Keys:</span>
                    <span className="bg-surface-soft px-1.5 py-0.5 rounded border border-hairline text-[10px]">
                      {idx.fields.join(", ")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
