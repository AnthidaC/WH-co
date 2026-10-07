"use client";

import React, { useState } from "react";
import {
  Database,
  Zap,
  ShieldCheck,
  Clock,
  Code2,
  Layers,
  ArrowRight,
  Server,
  Cpu,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";

export const CouchbaseWhatIsSection: React.FC = () => {
  const [activeFeatureTab, setActiveFeatureTab] = useState<
    "memory" | "cas" | "ttl" | "n1ql" | "hierarchy"
  >("memory");

  const featureTabs = [
    {
      id: "memory" as const,
      title: "Memory-First Architecture",
      subtitle: "ความเร็วระดับ Microsecond",
      badge: "< 0.5 ms SLA",
      icon: Zap,
    },
    {
      id: "cas" as const,
      title: "Atomic CAS Concurrency",
      subtitle: "ป้องกันการกดบัตรซ้ำ",
      badge: "Lockless Gate",
      icon: ShieldCheck,
    },
    {
      id: "ttl" as const,
      title: "Native Document Expiry",
      subtitle: "คืนที่นั่งอัตโนมัติ 5 นาที",
      badge: "Built-in TTL",
      icon: Clock,
    },
    {
      id: "n1ql" as const,
      title: "SQL++ (N1QL) Queries",
      subtitle: "สืบค้น JSON ด้วยภาษา SQL",
      badge: "Index Covered",
      icon: Code2,
    },
    {
      id: "hierarchy" as const,
      title: "Enterprise Hierarchy",
      subtitle: "Bucket, Scope & Collection",
      badge: "Multi-Tenant",
      icon: Layers,
    },
  ];

  return (
    <section id="what-is-couchbase-section" className="space-y-8 animate-fadeIn">
      {/* 1. Header & Executive Summary */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider">
            Section 00
          </span>
          <span className="text-hairline-strong">•</span>
          <h2 className="text-xl sm:text-2xl font-bold text-ink font-sans">
            ทำความรู้จัก Couchbase (What is Couchbase?)
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-4xl">
          <strong>Couchbase</strong> คือระบบฐานข้อมูล NoSQL แบบกระจายศูนย์ (Distributed Document Database) ระดับ Enterprise ที่รวมเอาจุดเด่นของ
          <strong> In-Memory Cache</strong> (ความเร็วระดับ Microsecond แบบ Memcached/Redis) เข้ากับความยืดหยุ่นของ
          <strong> JSON Documents</strong> (แบบ MongoDB) และความสามารถในการประมวลผลคำสั่งด้วยภาษา
          <strong> SQL++ (N1QL)</strong> พร้อม ACID Transactions ไว้ในคลัสเตอร์เดียว
        </p>
      </div>

      {/* 2. Visual Architecture Comparison: Traditional Stack vs. Couchbase Unified */}
      <div className="border border-hairline rounded-2xl overflow-hidden bg-canvas shadow-xs">
        <div className="p-4 sm:p-5 border-b border-hairline-soft bg-surface-soft/60 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-ink">
              เปรียบเทียบสถาปัตยกรรม: Traditional 3-Tier vs. Couchbase Unified Engine
            </h3>
            <p className="text-xs text-ink-muted mt-0.5">
              เหตุผลที่ Couchbase ชนะระบบแบบเดิมในสถานการณ์แฟนคลับแย่งกดบัตรพร้อมกัน (High-Concurrency Rush)
            </p>
          </div>
          <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium font-mono">
            Unified In-Memory SLA
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-hairline-soft">
          {/* Left: Traditional Multi-Layer Stack */}
          <div className="p-5 sm:p-6 space-y-4 bg-surface-soft/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted flex items-center space-x-1.5">
                <Server className="w-4 h-4 text-ink-muted" />
                <span>ระบบสถาปัตยกรรมเดิม (Traditional Stack)</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-50 text-rose-800 border border-rose-200">
                Multi-Layer Contention
              </span>
            </div>

            {/* Architecture Flow Box */}
            <div className="p-3.5 rounded-xl bg-canvas border border-hairline-soft font-mono text-xs space-y-2 text-ink">
              <div className="flex items-center justify-between p-2 rounded bg-surface-soft text-[11px]">
                <span>1. Next.js / API Server</span>
                <span className="text-ink-muted">Web Layer</span>
              </div>
              <div className="text-center text-ink-muted text-[10px]">↓ แยกคนละระบบเครือข่าย (Network Hop)</div>
              <div className="flex items-center justify-between p-2 rounded bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-950">
                <span>2. Redis / Memcached</span>
                <span className="text-amber-800">Cache Layer (RAM)</span>
              </div>
              <div className="text-center text-ink-muted text-[10px]">↓ ต้องเขียน Sync ข้อมูลสองฝั่ง (Dual-Write)</div>
              <div className="flex items-center justify-between p-2 rounded bg-surface-strong text-[11px]">
                <span>3. MySQL / PostgreSQL</span>
                <span className="text-ink-muted">Disk Storage (RDBMS)</span>
              </div>
            </div>

            {/* Pain Points */}
            <div className="space-y-1.5 text-xs text-ink-muted">
              <div className="flex items-start space-x-2">
                <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span><strong>Cache Desync:</strong> ข้อมูลระหว่าง Redis กับ Database หลุดไม่ตรงกันเมื่อมีคนกดบัตรพร้อมกัน</span>
              </div>
              <div className="flex items-start space-x-2">
                <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span><strong>Row / Table Lock:</strong> การใช้ Pessimistic Lock ทำให้ฐานข้อมูลติดคอขวดและเกิด Deadlock</span>
              </div>
              <div className="flex items-start space-x-2">
                <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span><strong>High Network Latency:</strong> ต้องวิ่งข้ามโหนดหลายรอบ (API → Cache → RDBMS)</span>
              </div>
            </div>
          </div>

          {/* Right: Couchbase Unified Architecture */}
          <div className="p-5 sm:p-6 space-y-4 bg-primary/2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center space-x-1.5">
                <Database className="w-4 h-4 text-primary" />
                <span>ระบบ KAZETIX (Couchbase Unified Engine)</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                Sub-ms Memory SLA
              </span>
            </div>

            {/* Architecture Flow Box */}
            <div className="p-3.5 rounded-xl bg-canvas border border-hairline font-mono text-xs space-y-2 text-ink shadow-xs">
              <div className="flex items-center justify-between p-2 rounded bg-surface-soft text-[11px]">
                <span>1. Next.js / API Server</span>
                <span className="text-ink-muted">Client / Edge</span>
              </div>
              <div className="text-center text-primary text-[10px] font-semibold">↓ เชื่อมต่อ Sub-ms Direct Memory KV Protocol</div>
              <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 text-emerald-950 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span>2. Couchbase Managed Cluster</span>
                  <span className="text-emerald-700 font-mono">All-in-One Engine</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px] text-emerald-900/90 font-sans">
                  <div className="p-1 rounded bg-canvas/80 border border-emerald-200/60">
                    ⚡ <strong>In-Memory Cache:</strong> ประมวลผลบน RAM ก่อน
                  </div>
                  <div className="p-1 rounded bg-canvas/80 border border-emerald-200/60">
                    🛡️ <strong>CAS Engine:</strong> ล็อกแบบไร้กุญแจ (Lockless)
                  </div>
                  <div className="p-1 rounded bg-canvas/80 border border-emerald-200/60">
                    📄 <strong>JSON Document:</strong> บันทึกโครงสร้างเอกสาร
                  </div>
                  <div className="p-1 rounded bg-canvas/80 border border-emerald-200/60">
                    🔍 <strong>GSI & SQL++:</strong> ค้นหาเร็วผ่าน Memory Index
                  </div>
                </div>
              </div>
            </div>

            {/* Key Advantages */}
            <div className="space-y-1.5 text-xs text-ink">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Single Tier Simplicity:</strong> ไม่ต้องต่อ Redis อีกชั้น ข้อมูลใน RAM และ Storage สอดคล้องกันเสมอ 100%</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Atomic CAS:</strong> เปรียบเทียบ Token ในเสี้ยววินาที ตัดปัญหาการซื้อตั๋วซ้ำโดยไม่ต้องล็อกตาราง</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Built-in TTL:</strong> จับเวลาคืนที่นั่ง 5 นาทีในตัวระดับ Document Engine โดยไม่ต้องใช้ Background Worker</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Deep-Dive Interactive Tabs into 5 Core Capabilities */}
      <div className="border border-hairline rounded-2xl bg-canvas overflow-hidden shadow-xs">
        {/* Tab Buttons */}
        <div className="p-2 border-b border-hairline-soft bg-surface-soft/60 flex flex-wrap gap-1.5 overflow-x-auto scrollbar-none">
          {featureTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFeatureTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFeatureTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-canvas text-ink font-semibold shadow-xs border border-hairline"
                    : "text-ink-muted hover:text-ink hover:bg-surface-soft"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-primary" : "text-ink-muted"}`} />
                <span>{tab.title}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? "bg-primary text-canvas font-semibold" : "bg-surface-strong text-ink-muted"
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="p-5 sm:p-6">
          {activeFeatureTab === "memory" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-3">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono">
                  <Zap className="w-3 h-3 text-emerald-600" />
                  <span>Sub-Millisecond Direct Memory Access</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-ink">
                  1. Memory-First Architecture: ตอบสนองในเสี้ยววินาทีด้วย RAM
                </h4>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                  Couchbase ออกแบบให้ <strong>RAM เป็นจุดผ่านแรกของทุกคำขอ (First-Class Storage)</strong> เมื่อผู้ใช้กดอ่านหรือจองที่นั่ง ระบบจะเข้าถึงและเขียนข้อมูลลงใน RAM Quota ทันทีโดยไม่ต้องรอจังหวะเขียนลงฮาร์ดดิสก์ ทำให้ค่า Latency ของการอ่านและเขียน (Key-Value SLA) เร็วกว่า 0.5 มิลลิวินาที
                </p>
                <ul className="text-xs text-ink-muted space-y-1.5 pt-1">
                  <li>• <strong>Asynchronous Disk Persistence:</strong> ข้อมูลจะถูกเขียนลงดิสก์เบื้องหลังแบบ Non-blocking</li>
                  <li>• <strong>Database Change Protocol (DCP):</strong> กระจายข้อมูลข้าม Node ในคลัสเตอร์ผ่านหน่วยความจำความเร็วสูง</li>
                </ul>
              </div>

              <div className="lg:col-span-5 rounded-xl border border-hairline bg-surface-soft p-4 font-mono text-[11px] space-y-2 text-ink">
                <div className="text-[10px] text-ink-muted uppercase tracking-wider pb-1 border-b border-hairline-soft">
                  Implementation in KAZETIX Cluster
                </div>
                <pre className="text-[10px] sm:text-[11px] text-ink overflow-x-auto leading-relaxed">
{`// Key-Value Sub-millisecond Execution
const startTime = performance.now();
const doc = await couchbaseCluster.get(
  "seats", 
  "seat::fujii-kaze-bkk::VIP-01"
);
// doc.latencyMs: 0.18ms (Direct In-Memory)`}
                </pre>
              </div>
            </div>
          )}

          {activeFeatureTab === "cas" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-3">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-mono">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Lockless Optimistic Concurrency Control</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-ink">
                  2. CAS (Compare-And-Swap): ป้องกันการแย่งที่นั่งโดยไม่เกิด Deadlock
                </h4>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                  ในระบบเดิม การจองที่นั่งมักใช้ <code className="font-mono text-ink">SELECT FOR UPDATE</code> ซึ่งทำการล็อกแถวในตาราง ทำให้คำขออื่นค้างสะสมและระบบล่ม แต่ใน Couchbase ทุก Document มีหมายเลข <strong>CAS (Check-And-Set / Compare-And-Swap)</strong> ประจำตัวขนาด 64-bit
                </p>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                  เมื่อแฟนคลับ 20-50 คนแย่งกดที่นั่งเดียวกันในมิลลิวินาทีเดียวกัน:
                  คำขอแรกที่นำ CAS เดิมมาส่งจะเขียนทับสำเร็จ (CAS Matches) และได้ Token ใหม่ทันที ส่วนอีก 49 คนที่เหลือ ระบบจะปฏิเสธด้วย <code className="font-mono text-ink">CAS_MISMATCH</code> ทันทีในหน่วยไมโครวินาที ทำให้สต็อกไม่มีวันติดลบและปราศจากปัญหา Double Booking 100%
                </p>
              </div>

              <div className="lg:col-span-5 rounded-xl border border-hairline bg-surface-soft p-4 font-mono text-[11px] space-y-2 text-ink">
                <div className="text-[10px] text-ink-muted uppercase tracking-wider pb-1 border-b border-hairline-soft">
                  Atomic CAS Replace Code
                </div>
                <pre className="text-[10px] sm:text-[11px] text-ink overflow-x-auto leading-relaxed">
{`// Atomic CAS Replace
const { cas: existingCas } = await get("seat::VIP-01");

// หากมีคนอื่นตัดหน้า CAS จะเปลี่ยนทันที
if (currentDoc.cas !== existingCas) {
  throw new CasMismatchError("ถูกตัดหน้าแล้ว!");
}

// ผู้ชนะคนแรกจะได้รับ CAS Token ใหม่
const nextCas = generateNextCas();`}
                </pre>
              </div>
            </div>
          )}

          {activeFeatureTab === "ttl" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-3">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-mono">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>Native Automatic Document TTL</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-ink">
                  3. Native Document Expiry (TTL 300s): ล็อกเวลาและปล่อยคืนอัตโนมัติ
                </h4>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                  เมื่อผู้ใช้กดล็อกที่นั่งสำเร็จ ระบบขายบัตรจะต้องให้เวลาชำระเงินจำกัด (เช่น 5 นาที = 300 วินาที) หากไม่ชำระเงิน ที่นั่งต้องกลับสู่สถานะว่าง
                </p>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                  Couchbase รองรับ <strong>Document Expiry ระดับเอนจิน</strong> เมื่อบันทึกเอกสารการถือสิทธิ์ชั่วคราว เราสามารถระบุค่า <code className="font-mono text-ink">expiry: 300</code> ได้ทันที เอนจินของฐานข้อมูลจะติดตามเวลาและคืนสิทธิ์ให้โดยอัตโนมัติโดยที่นักพัฒนาไม่ต้องเขียน Background Cron Job คอยวนลูปตรวจจับฐานข้อมูลให้เปลืองทรัพยากร
                </p>
              </div>

              <div className="lg:col-span-5 rounded-xl border border-hairline bg-surface-soft p-4 font-mono text-[11px] space-y-2 text-ink">
                <div className="text-[10px] text-ink-muted uppercase tracking-wider pb-1 border-b border-hairline-soft">
                  Document Expiry Setting
                </div>
                <pre className="text-[10px] sm:text-[11px] text-ink overflow-x-auto leading-relaxed">
{`// ล็อกที่นั่งพร้อมกำหนด TTL 300 วินาที
await seatRepository.replaceWithCas(
  seatId, 
  heldSeatDoc, 
  currentCas, 
  { expirySeconds: 300 } // 5 Minutes TTL
);

// เมื่อหมดเวลา 300s:
// Couchbase engine resets status -> "AVAILABLE"`}
                </pre>
              </div>
            </div>
          )}

          {activeFeatureTab === "n1ql" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-3">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-mono">
                  <Code2 className="w-3 h-3 text-blue-600" />
                  <span>Declarative SQL++ on JSON Documents</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-ink">
                  4. SQL++ (N1QL): ภาษาคิวรีระดับโลกที่คนทั้งโลกคุ้นเคย
                </h4>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                  แม้ข้อมูลจะถูกบันทึกเป็น JSON Document ที่มีความยืดหยุ่นสูง แต่นักพัฒนาไม่ต้องเรียนรู้ภาษาคิวรีเฉพาะตัวใหม่ เพราะ Couchbase พัฒนาภาษา <strong>SQL++ (เดิมชื่อ N1QL)</strong> ซึ่งเป็นส่วนขยายของมาตรฐาน ANSI SQL
                </p>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                  สามารถสั่ง <code className="font-mono text-ink">SELECT</code>, <code className="font-mono text-ink">WHERE</code>, <code className="font-mono text-ink">JOIN</code> ข้าม Collection และสร้าง <strong>Global Secondary Index (GSI)</strong> บนฟิลด์ที่ค้นหาบ่อยเพื่อให้ได้ Index-Covered Query ที่ตอบกลับในระดับไม่กี่มิลลิวินาที
                </p>
              </div>

              <div className="lg:col-span-5 rounded-xl border border-hairline bg-surface-soft p-4 font-mono text-[11px] space-y-2 text-ink">
                <div className="text-[10px] text-ink-muted uppercase tracking-wider pb-1 border-b border-hairline-soft">
                  SQL++ Query Example
                </div>
                <pre className="text-[10px] sm:text-[11px] text-ink overflow-x-auto leading-relaxed">
{`-- SQL++ ค้นหาที่นั่งว่างในคอนเสิร์ต
SELECT id, label, price, zoneName
FROM \`kazetix\`.\`warehouse\`.\`seats\`
WHERE concertId = "fujii-kaze-bkk"
  AND status = "AVAILABLE"
ORDER BY row, seatNumber;

-- อาศัย GSI Index: idx_seats_status_search`}
                </pre>
              </div>
            </div>
          )}

          {activeFeatureTab === "hierarchy" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-3">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-900 border border-purple-200 text-xs font-mono">
                  <Layers className="w-3 h-3 text-purple-600" />
                  <span>Enterprise Scopes & Collections</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-ink">
                  5. การจัดโครงสร้าง: Bucket → Scope → Collection
                </h4>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                  ในสถาปัตยกรรม Couchbase ยุคใหม่ มีการจัดหมวดหมู่ข้อมูลที่ตอบโจทย์ระดับ Microservices และ Multi-Tenancy:
                </p>
                <div className="space-y-2 text-xs text-ink-muted pt-1">
                  <div className="p-2.5 rounded-lg bg-surface-soft border border-hairline-soft">
                    <strong className="text-ink">1. Bucket (<code className="font-mono text-primary">main</code>):</strong> หน่วยจัดสรรโควตา RAM และ Disk เช่น กำหนด 1,024 MB
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface-soft border border-hairline-soft">
                    <strong className="text-ink">2. Scope (<code className="font-mono text-primary">warehouse</code>):</strong> กลุ่มของโมดูลหรือ Business Domain
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface-soft border border-hairline-soft">
                    <strong className="text-ink">3. Collections:</strong> แหล่งเก็บ Document แต่ละประเภท ได้แก่ <code className="font-mono text-ink">concerts</code>, <code className="font-mono text-ink">seats</code>, และ <code className="font-mono text-ink">bookings</code>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 rounded-xl border border-hairline bg-surface-soft p-4 font-mono text-[11px] space-y-2 text-ink">
                <div className="text-[10px] text-ink-muted uppercase tracking-wider pb-1 border-b border-hairline-soft">
                  Hierarchical Document Key
                </div>
                <pre className="text-[10px] sm:text-[11px] text-ink overflow-x-auto leading-relaxed">
{`// Key Pattern ในระบบ KAZETIX
Bucket:     "main"
Scope:      "warehouse"
Collection: "seats"
Key:        "seat::fujii-kaze-bkk::VIP-01"

// การเข้าถึงแบบ Type-Safe ผ่าน Zod
const parsedSeat = SeatDocumentSchema.parse(doc);`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
