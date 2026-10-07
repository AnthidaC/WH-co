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
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Cpu,
} from "lucide-react";

export const CouchbaseWhatIsSection: React.FC = () => {
  const [activeFeatureTab, setActiveFeatureTab] = useState<
    "memory" | "cas" | "ttl" | "n1ql" | "hierarchy"
  >("memory");
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const featureTabs = [
    {
      id: "memory" as const,
      title: "1. Memory-First (< 0.5 ms)",
      badge: "In-Memory RAM",
      icon: Zap,
    },
    {
      id: "cas" as const,
      title: "2. Atomic CAS Lock",
      badge: "ป้องกันจองซ้ำ",
      icon: ShieldCheck,
    },
    {
      id: "ttl" as const,
      title: "3. Auto Expiry (TTL)",
      badge: "คืนที่นั่ง 5 นาที",
      icon: Clock,
    },
    {
      id: "n1ql" as const,
      title: "4. SQL++ (N1QL)",
      badge: "คิวรีภาษา SQL",
      icon: Code2,
    },
    {
      id: "hierarchy" as const,
      title: "5. Hierarchy",
      badge: "Bucket & Scope",
      icon: Layers,
    },
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <section id="what-is-couchbase-section" className="space-y-8 animate-fadeIn">
      {/* 1. Header & Simple Plain Thai Definition */}
      <div className="space-y-3 pb-2 border-b border-hairline-soft">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-1 rounded-full">
            Section 00 • บทนำฐานข้อมูล
          </span>
          <span className="text-hairline-strong">•</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink font-sans tracking-tight">
            ทำความรู้จัก Couchbase (Couchbase คืออะไร?)
          </h2>
        </div>

        <p className="text-base sm:text-lg text-ink leading-relaxed max-w-4xl font-normal">
          <strong>Couchbase</strong> คือฐานข้อมูลแบบ <strong>NoSQL Document Database</strong> ระดับ Enterprise ที่รวม
          <span className="text-primary font-semibold"> In-Memory Cache (ความเร็วสูงระดับ RAM)</span>,
          <span className="font-semibold text-ink"> เอกสาร JSON</span> และ
          <span className="font-semibold text-ink"> ภาษา SQL++ (N1QL)</span> เข้าไว้ในคลัสเตอร์เดียวกัน
          ทำให้รองรับทราฟฟิกแฟนคลับแย่งกดบัตรหลักหมื่นพร้อมกันได้โดย <strong>ไม่มีวันค้าง และไม่มีการจองซ้ำ</strong>
        </p>

        {/* 3 Main Highlights in Big, Clear Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-canvas border border-hairline shadow-subtle hover:shadow-float transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-ink">ความเร็วระดับ Microsecond</h3>
            <p className="text-sm text-ink-muted mt-1 leading-relaxed">
              ประมวลผลบน RAM โดยตรง (<span className="text-emerald-700 font-semibold font-mono">&lt; 0.5 ms</span>) ไม่ต้องต่อ Redis เพิ่มอีกชั้น
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-canvas border border-hairline shadow-subtle hover:shadow-float transition-all">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-ink">ป้องกันการกดซ้ำ 100% (CAS)</h3>
            <p className="text-sm text-ink-muted mt-1 leading-relaxed">
              ใช้ Atomic CAS Token ป้องกัน Race Condition ระดับฮาร์ดแวร์ โดยไม่ต้องล็อกตารางจนค้าง
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-canvas border border-hairline shadow-subtle hover:shadow-float transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-ink">คืนที่นั่งอัตโนมัติ 5 นาที (TTL)</h3>
            <p className="text-sm text-ink-muted mt-1 leading-relaxed">
              มี Document Expiry ในตัว เมื่อหมดเวลาจองระบบปล่อยที่นั่งทันทีโดยไม่ต้องรัน Cron Job
            </p>
          </div>
        </div>
      </div>

      {/* 2. Clear Visual Comparison: Traditional Stack vs. Couchbase */}
      <div className="border border-hairline rounded-2xl overflow-hidden bg-canvas shadow-subtle">
        <div className="p-5 sm:p-6 border-b border-hairline-soft bg-surface-soft/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-ink">
              เปรียบเทียบสถาปัตยกรรม: ทำไมระบบจำหน่ายบัตรยุคใหม่ถึงเลือก Couchbase?
            </h3>
            <p className="text-sm text-ink-muted mt-0.5">
              เปรียบเทียบระหว่างระบบเดิม (3-Tier Stack) กับสถาปัตยกรรม All-in-One ของ Couchbase ในระบบ KAZETIX
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold font-mono self-start sm:self-auto">
            Sub-Millisecond Engine
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-hairline">
          {/* Left: Traditional Multi-Layer Stack */}
          <div className="p-6 sm:p-8 space-y-5 bg-surface-soft/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">
                  ✕
                </div>
                <div>
                  <h4 className="text-base font-bold text-ink">
                    ระบบเดิม (Traditional 3-Tier Stack)
                  </h4>
                  <span className="text-xs text-ink-muted">Web API &rarr; Redis &rarr; MySQL / Postgres</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                มักเกิดปัญหา
              </span>
            </div>

            {/* Pain Points List - Readable & Spacious */}
            <div className="space-y-3.5 text-sm">
              <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-canvas border border-hairline-soft">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink block font-semibold">ข้อมูลไม่ตรงกัน (Cache Desync):</strong>
                  <span className="text-ink-muted text-xs sm:text-sm leading-relaxed">
                    ต้องเขียนข้อมูลลงทั้ง Redis และฐานข้อมูลหลัก หากเกิดข้อผิดพลาดจะทำให้สถานะที่นั่งสองฝั่งหลุดไม่ตรงกัน
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-canvas border border-hairline-soft">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink block font-semibold">ฐานข้อมูลค้างและ Deadlock (Table Lock):</strong>
                  <span className="text-ink-muted text-xs sm:text-sm leading-relaxed">
                    การล็อกแถวหรือตาราง (<code className="font-mono text-ink text-xs">SELECT FOR UPDATE</code>) ทำให้คำขอค้างสะสม เมื่อคนกดพร้อมกันระบบจะล่ม
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-canvas border border-hairline-soft">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink block font-semibold">ความหน่วงสูง (Multiple Network Hops):</strong>
                  <span className="text-ink-muted text-xs sm:text-sm leading-relaxed">
                    คำขอต้องวิ่งข้ามเซิร์ฟเวอร์หลายชั้น ส่งผลให้ผู้ใช้รู้สึกกระตุกเมื่อเข้าคิวซื้อบัตร
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Couchbase Unified Architecture */}
          <div className="p-6 sm:p-8 space-y-5 bg-canvas">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  ✓
                </div>
                <div>
                  <h4 className="text-base font-bold text-ink">
                    ระบบ KAZETIX (Couchbase Unified Engine)
                  </h4>
                  <span className="text-xs text-primary font-semibold">All-in-One: Memory + JSON + N1QL</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                สถาปัตยกรรมแนะนำ
              </span>
            </div>

            {/* Key Advantages List - Readable & Spacious */}
            <div className="space-y-3.5 text-sm">
              <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-200/60">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink block font-semibold">อ่านและเขียนบน RAM ทันที (&lt; 0.5 ms):</strong>
                  <span className="text-ink-muted text-xs sm:text-sm leading-relaxed">
                    Couchbase บันทึกข้อมูลลงหน่วยความจำ RAM เป็นลำดับแรก แล้วจึงซิงก์ลงดิสก์เบื้องหลังแบบไร้รอยต่อ
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-200/60">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink block font-semibold">ไร้การล็อกตาราง ปลอดภัย 100% (Atomic CAS):</strong>
                  <span className="text-ink-muted text-xs sm:text-sm leading-relaxed">
                    ใช้หมายเลข 64-bit CAS เปรียบเทียบในเสี้ยววินาที คนที่มาก่อนได้ตั๋ว คนที่มาช้าจะถูกแจ้งทันที ไร้ Deadlock
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-200/60">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink block font-semibold">จับเวลาคืนสิทธิ์ในตัว (Native Document Expiry):</strong>
                  <span className="text-ink-muted text-xs sm:text-sm leading-relaxed">
                    กำหนด TTL 300 วินาที เมื่อครบเวลาฐานข้อมูลจะปล่อยที่นั่งให้คนอื่นจองต่ออัตโนมัติ 100%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Deep-Dive Tabs: 5 Core Capabilities with Clear Explanations */}
      <div className="border border-hairline rounded-2xl bg-canvas overflow-hidden shadow-subtle">
        {/* Navigation Tabs Bar */}
        <div className="p-3 border-b border-hairline-soft bg-surface-soft/60 flex flex-wrap gap-2 overflow-x-auto scrollbar-none">
          {featureTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFeatureTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFeatureTab(tab.id)}
                className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-canvas text-ink font-bold shadow-xs border border-hairline"
                    : "text-ink-muted hover:text-ink hover:bg-surface-soft"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-ink-muted"}`} />
                <span>{tab.title}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                    isActive ? "bg-primary text-canvas font-semibold" : "bg-surface-strong text-ink-muted"
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display - Clean, High Contrast, Comfortable Typography */}
        <div className="p-6 sm:p-8">
          {activeFeatureTab === "memory" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-semibold">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sub-Millisecond Direct Memory Access</span>
                </div>
                <h4 className="text-xl font-bold text-ink">
                  1. Memory-First Architecture: ตอบสนองในระดับ Microsecond
                </h4>
                <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                  Couchbase ออกแบบให้ <strong>RAM เป็นจุดผ่านแรกของทุกคำขอ (First-Class Storage)</strong> เมื่อผู้ใช้กดอ่านหรือจองที่นั่ง ระบบจะเข้าถึงและเขียนข้อมูลลงใน RAM Quota ทันทีโดยไม่ต้องรอจังหวะเขียนลงฮาร์ดดิสก์ ทำให้ค่าความหน่วง (Latency) ของการอ่านและเขียนเร็วกว่า 0.5 มิลลิวินาที
                </p>
                <div className="space-y-2 pt-2 text-sm text-ink-muted">
                  <div className="flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Asynchronous Disk Persistence:</strong> ข้อมูลจะถูกบันทึกลงฮาร์ดดิสก์เบื้องหลังแบบ Non-blocking ไม่ทำให้ผู้ใช้รอนาน</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Database Change Protocol (DCP):</strong> กระจายข้อมูลข้ามเซิร์ฟเวอร์ในคลัสเตอร์ด้วยความเร็วของหน่วยความจำ</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 rounded-2xl border border-hairline bg-[#1e1e1e] text-white p-5 font-mono text-xs shadow-soft space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-white/60">
                  <span className="text-[11px] uppercase tracking-wider font-semibold">Couchbase KV In-Memory Call</span>
                  <button
                    onClick={() =>
                      handleCopy(`// Direct In-Memory Key-Value Access (< 0.5ms)
const doc = await couchbaseCluster.get(
  "seats", 
  "seat::fujii-kaze-bkk::VIP-01"
);
console.log(doc.latencyMs); // ~0.18 ms`)
                    }
                    className="hover:text-white transition-colors"
                  >
                    {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <pre className="text-emerald-300 leading-relaxed overflow-x-auto">
{`// Direct In-Memory Key-Value Access (< 0.5ms)
const doc = await couchbaseCluster.get(
  "seats", 
  "seat::fujii-kaze-bkk::VIP-01"
);

// วัดผลความเร็วจริงในระบบ KAZETIX
console.log(doc.latencyMs); // ~0.18 ms`}
                </pre>
              </div>
            </div>
          )}

          {activeFeatureTab === "cas" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-mono font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Lockless Optimistic Concurrency Control</span>
                </div>
                <h4 className="text-xl font-bold text-ink">
                  2. CAS (Compare-And-Swap): ป้องกันการแย่งที่นั่งชนกัน 100%
                </h4>
                <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                  ในระบบเดิม การจองที่นั่งมักใช้ <code className="font-mono text-ink bg-surface-soft px-1.5 py-0.5 rounded text-xs">SELECT FOR UPDATE</code> ซึ่งทำการล็อกแถวในตาราง ทำให้คนอื่นค้างและระบบล่ม แต่ใน Couchbase ทุกเอกสารจะมีหมายเลข <strong>CAS (Check-And-Set)</strong> ขนาด 64-bit กำกับอยู่เสมอ
                </p>
                <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                  เมื่อมีคน 50 คนแย่งกดที่นั่งเดียวกันในมิลลิวินาทีเดียวกัน: <strong>คำขอแรก</strong> ที่ส่ง CAS Token ตรงกับฐานข้อมูลจะบันทึกสำเร็จทันที ส่วนอีก 49 คนที่เหลือระบบจะปฏิเสธด้วยสถานะ <code className="font-mono text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded text-xs">CAS_MISMATCH</code> ภายในเสี้ยววินาที ทำให้สต็อกไม่ติดลบและไร้การจองซ้ำแน่นอน
                </p>
              </div>

              <div className="lg:col-span-5 rounded-2xl border border-hairline bg-[#1e1e1e] text-white p-5 font-mono text-xs shadow-soft space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-white/60">
                  <span className="text-[11px] uppercase tracking-wider font-semibold">Atomic CAS Mutation</span>
                  <button
                    onClick={() =>
                      handleCopy(`// Atomic CAS Replace ใน KAZETIX
const result = await couchbaseCluster.replaceWithCas(
  "seats",
  seatId,
  updatedSeatDoc,
  expectedCasToken
);
// หาก CAS ไม่ตรง จะเกิด Error CAS_MISMATCH ทันที`)
                    }
                    className="hover:text-white transition-colors"
                  >
                    {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <pre className="text-amber-300 leading-relaxed overflow-x-auto">
{`// Atomic CAS Replace ใน KAZETIX
const result = await couchbaseCluster.replaceWithCas(
  "seats",
  seatId,
  updatedSeatDoc,
  expectedCasToken // ตรวจสอบ Token 64-bit
);

// หาก CAS ไม่ตรง (มีคนชิงไปก่อน)
// ระบบจะ Reject ทันที: CAS_MISMATCH (< 0.3ms)`}
                </pre>
              </div>
            </div>
          )}

          {activeFeatureTab === "ttl" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-mono font-semibold">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Native Automatic Expiry (300 Seconds)</span>
                </div>
                <h4 className="text-xl font-bold text-ink">
                  3. Native Document Expiry (TTL): คืนที่นั่งอัตโนมัติ 5 นาที
                </h4>
                <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                  เมื่อผู้ใช้กดเลือกที่นั่ง ระบบจะให้เวลาชำระเงิน <strong>5 นาที (300 วินาที)</strong> หากหมดเวลาแล้วไม่ชำระเงิน ในระบบทั่วไปต้องเขียน Batch Script หรือ Cron Job มาคอยสแกนหาที่นั่งที่หมดอายุ ซึ่งช้าและสิ้นเปลืองพลังงานเซิร์ฟเวอร์
                </p>
                <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                  Couchbase มีฟังก์ชัน <strong>Document Expiry (TTL)</strong> ในระดับคอร์ของฐานข้อมูล เมื่อครบกำหนดเวลา 300 วินาที สถานะจะถูกคืนกลับมาว่าง (<code className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-xs">AVAILABLE</code>) ทันทีในหน่วยความจำ RAM อย่างแม่นยำ
                </p>
              </div>

              <div className="lg:col-span-5 rounded-2xl border border-hairline bg-[#1e1e1e] text-white p-5 font-mono text-xs shadow-soft space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-white/60">
                  <span className="text-[11px] uppercase tracking-wider font-semibold">TTL Expiry Configuration</span>
                  <button
                    onClick={() =>
                      handleCopy(`// กำหนดเวลาคืนที่นั่ง 5 นาที (TTL 300s)
await couchbaseCluster.replaceWithCas(
  "seats",
  seatId,
  {
    ...seatDoc,
    status: "HELD",
    heldByUserId: userId,
  },
  casToken,
  300 // Expiry ในระดับฐานข้อมูล Couchbase
);`)}
                    className="hover:text-white transition-colors"
                  >
                    {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <pre className="text-cyan-300 leading-relaxed overflow-x-auto">
{`// กำหนดเวลาคืนที่นั่ง 5 นาที (TTL 300 วินาที)
await couchbaseCluster.replaceWithCas(
  "seats",
  seatId,
  {
    ...seatDoc,
    status: "HELD",
    heldByUserId: userId,
  },
  casToken,
  300 // Expiry ในระดับฐานข้อมูล Couchbase
);`}
                </pre>
              </div>
            </div>
          )}

          {activeFeatureTab === "n1ql" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-mono font-semibold">
                  <Code2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Declarative SQL++ Query on JSON</span>
                </div>
                <h4 className="text-xl font-bold text-ink">
                  4. SQL++ (N1QL): สืบค้าข้อมูล JSON ด้วยภาษา SQL มาตรฐาน
                </h4>
                <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                  แม้ Couchbase จะจัดเก็บข้อมูลเป็น NoSQL JSON แต่รองรับภาษา <strong>SQL++ (เดิมชื่อ N1QL)</strong> ซึ่งมีไวยากรณ์เหมือน SQL มาตรฐาน (<code className="font-mono text-ink bg-surface-soft px-1.5 py-0.5 rounded text-xs">SELECT, JOIN, WHERE, GROUP BY</code>) ทำให้เขียนโค้ดง่ายและรองรับการวิเคราะห์ข้อมูลซับซ้อน
                </p>
                <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                  เมื่อใช้งานร่วมกับ <strong>Global Secondary Indexes (GSI)</strong> ที่เก็บดัชนีไว้ใน RAM คำสั่งคิวรีจะดึงข้อมูลผังที่นั่งคอนเสิร์ตนับพันที่นั่งได้ภายในเวลาไม่ถึง 2 มิลลิวินาที
                </p>
              </div>

              <div className="lg:col-span-5 rounded-2xl border border-hairline bg-[#1e1e1e] text-white p-5 font-mono text-xs shadow-soft space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-white/60">
                  <span className="text-[11px] uppercase tracking-wider font-semibold">SQL++ (N1QL) Query Example</span>
                  <button
                    onClick={() =>
                      handleCopy(`SELECT meta().id, label, status, price 
FROM ticketing.seats 
WHERE concertId = "fujii-kaze-bkk" 
  AND status = "AVAILABLE" 
ORDER BY price DESC;`)}
                    className="hover:text-white transition-colors"
                  >
                    {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <pre className="text-indigo-300 leading-relaxed overflow-x-auto">
{`-- ดึงเฉพาะที่นั่งที่ว่างผ่าน Index GSI
SELECT meta().id, label, status, price 
FROM ticketing.seats 
WHERE concertId = "fujii-kaze-bkk" 
  AND status = "AVAILABLE" 
ORDER BY price DESC;

-- ตอบสนองภายใน < 1.5ms ผ่าน Memory Index`}
                </pre>
              </div>
            </div>
          )}

          {activeFeatureTab === "hierarchy" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-xs font-mono font-semibold">
                  <Layers className="w-3.5 h-3.5 text-purple-600" />
                  <span>Bucket &rarr; Scope &rarr; Collection</span>
                </div>
                <h4 className="text-xl font-bold text-ink">
                  5. โครงสร้างแบบองค์กร: Bucket, Scope และ Collection
                </h4>
                <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                  Couchbase จัดระเบียบข้อมูลตามมาตรฐานสากลคล้ายกับ RDBMS:
                </p>
                <div className="space-y-2.5 text-sm text-ink-muted">
                  <div className="p-3 rounded-xl bg-surface-soft border border-hairline-soft">
                    <strong className="text-ink">1. Bucket (<span className="font-mono text-primary font-bold">main</span>):</strong> ระดับพื้นที่จัดสรรโควต้า RAM และดิสก์ (คล้าย Database Instance)
                  </div>
                  <div className="p-3 rounded-xl bg-surface-soft border border-hairline-soft">
                    <strong className="text-ink">2. Scope (<span className="font-mono text-primary font-bold">ticketing</span>):</strong> ระดับหมวดหมู่ระบบธุรกิจ (คล้าย Database Schema) เพื่อความปลอดภัยแบบ Multi-Tenant
                  </div>
                  <div className="p-3 rounded-xl bg-surface-soft border border-hairline-soft">
                    <strong className="text-ink">3. Collections (<span className="font-mono text-primary font-bold">concerts, seats, bookings</span>):</strong> ระดับกลุ่มเอกสารข้อมูล (คล้าย Table ใน SQL)
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 rounded-2xl border border-hairline bg-surface-soft p-5 font-mono text-xs space-y-3">
                <div className="text-xs font-bold text-ink uppercase tracking-wider pb-2 border-b border-hairline">
                  Hierarchy Namespace Mapping
                </div>
                <div className="space-y-2 text-ink">
                  <div className="p-2.5 rounded-lg bg-canvas border border-hairline flex items-center justify-between">
                    <span className="text-ink-muted">RDBMS Concept</span>
                    <span className="font-semibold text-primary">Couchbase Equivalent</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-canvas border border-hairline flex items-center justify-between">
                    <span>Database Instance</span>
                    <span className="font-semibold font-mono">Bucket (`main`)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-canvas border border-hairline flex items-center justify-between">
                    <span>Database Schema</span>
                    <span className="font-semibold font-mono">Scope (`ticketing`)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-canvas border border-hairline flex items-center justify-between">
                    <span>Table</span>
                    <span className="font-semibold font-mono">Collection (`seats`)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-canvas border border-hairline flex items-center justify-between">
                    <span>Row / Record</span>
                    <span className="font-semibold font-mono">JSON Document</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
