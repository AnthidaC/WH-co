"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArchitectureHeader } from "@/components/architecture/ArchitectureHeader";
import { CouchbaseWhatIsSection } from "@/components/architecture/CouchbaseWhatIsSection";
import { FocalDiagram } from "@/components/architecture/FocalDiagram";
import { CollectionSchemaCard } from "@/components/architecture/CollectionSchemaCard";
import { CasLifecycleDiagram } from "@/components/architecture/CasLifecycleDiagram";
import { GsiIndexViewer } from "@/components/architecture/GsiIndexViewer";
import { RdbmsComparisonTable } from "@/components/architecture/RdbmsComparisonTable";
import { DatabaseMetricsSummary } from "@/components/architecture/DatabaseMetricsSummary";
import { Footer } from "@/components/layout/Footer";
import { COLLECTIONS_DATA, ARCHITECTURE_META } from "@/data/db-architecture-data";
import {
  Database,
  Layers,
  ShieldCheck,
  FileJson,
  Sparkles,
  ChevronRight,
  Maximize2,
  Minimize2,
  ArrowRight,
} from "lucide-react";

export default function DbArchitecturePage() {
  const [activeSection, setActiveSection] = useState<
    "whatis" | "diagram" | "schema" | "cas" | "gsi" | "comparison"
  >("whatis");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("seats");
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [clusterStats, setClusterStats] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const activeCollection =
    COLLECTIONS_DATA.find((c) => c.id === selectedCollectionId) ?? COLLECTIONS_DATA[0];

  // Fetch live cluster overview stats
  const fetchClusterStats = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/couchbase/overview");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setClusterStats(json.data);
        }
      }
    } catch {
      // Fallback cleanly without crashing
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchClusterStats();
  }, [fetchClusterStats]);

  const handleSelectSection = (
    section: "whatis" | "diagram" | "schema" | "cas" | "gsi" | "comparison"
  ) => {
    setActiveSection(section);
    const targetEl = document.getElementById(
      section === "whatis"
        ? "what-is-couchbase-section"
        : section === "diagram"
        ? "diagram-section"
        : section === "schema"
        ? "schema-section"
        : section === "cas"
        ? "cas-section"
        : section === "gsi"
        ? "gsi-section"
        : "comparison-section"
    );
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectCollectionFromDiagram = (colId: string) => {
    setSelectedCollectionId(colId);
    setActiveSection("schema");
    // Smooth scroll down to schema viewer if needed
    const schemaEl = document.getElementById("schema-section");
    if (schemaEl) {
      schemaEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={`min-h-screen bg-canvas text-ink flex flex-col font-sans transition-all ${
        isPresentationMode ? "presentation-mode-active" : ""
      }`}
    >
      {/* Top Header */}
      <ArchitectureHeader
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        isPresentationMode={isPresentationMode}
        onTogglePresentationMode={() => setIsPresentationMode((prev) => !prev)}
        clusterStats={clusterStats}
        onRefreshStats={fetchClusterStats}
        isRefreshing={isRefreshing}
      />

      {/* Main Presentation Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12">
        {/* Editorial Sub-Hero Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-hairline-soft">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center space-x-2 text-xs font-semibold text-primary uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>Enterprise Database Blueprint • Couchbase NoSQL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-ink font-sans">
              สถาปัตยกรรมฐานข้อมูลความเร็วสูง KAZETIX
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              แบบพิมพ์เขียวสถาปัตยกรรม (Architectural Blueprint) ออกแบบสำหรับการนำเสนอเชิงเทคนิค แสดงการจัดเก็บข้อมูลระดับ In-Memory, การป้องกัน Race Condition ด้วย CAS และโครงสร้างแบบ Type-Safe สากล
            </p>
          </div>

          {/* Quick Collection Switcher Pills */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="text-xs text-ink-muted font-medium mr-1">เลือกจุดโฟกัส:</span>
            {COLLECTIONS_DATA.map((c) => {
              const isSelected = selectedCollectionId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCollectionId(c.id);
                    if (activeSection !== "schema") setActiveSection("schema");
                  }}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? c.id === "seats"
                        ? "bg-primary text-canvas shadow-xs font-semibold"
                        : "bg-ink text-canvas shadow-xs font-semibold"
                      : "bg-surface-soft border border-hairline text-ink-muted hover:text-ink hover:bg-surface-strong"
                  }`}
                >
                  {c.id === "seats" ? (
                    <ShieldCheck className="w-3.5 h-3.5" />
                  ) : c.id === "concerts" ? (
                    <Layers className="w-3.5 h-3.5" />
                  ) : (
                    <FileJson className="w-3.5 h-3.5" />
                  )}
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Metrics Summary Bar */}
        <DatabaseMetricsSummary clusterStats={clusterStats} />

        {/* Section 00: What is Couchbase? Architecture Introduction */}
        <CouchbaseWhatIsSection />

        {/* Section 01: The Focal Architecture Diagram */}
        <section id="diagram-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-ink-muted uppercase tracking-wider">
                Section 01
              </span>
              <span className="text-hairline-strong">•</span>
              <h3 className="text-base sm:text-lg font-bold text-ink font-sans">
                แผนผังความสัมพันธ์เอนทิตี (Entity-Relationship Diagram / ERD)
              </h3>
            </div>
            {activeSection !== "diagram" && (
              <button
                onClick={() => setActiveSection("diagram")}
                className="text-xs text-primary font-semibold hover:underline inline-flex items-center"
              >
                ดูแบบขยาย <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            )}
          </div>

          <FocalDiagram
            collections={COLLECTIONS_DATA}
            selectedCollectionId={selectedCollectionId}
            onSelectCollection={handleSelectCollectionFromDiagram}
          />
        </section>

        {/* Section 02: Document Schema & Audit Fields */}
        <section id="schema-section" className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-ink-muted uppercase tracking-wider">
                Section 02
              </span>
              <span className="text-hairline-strong">•</span>
              <h3 className="text-base sm:text-lg font-bold text-ink font-sans">
                พจนานุกรมและโครงสร้างข้อมูลเอกสาร (Schema Dictionary &amp; Zod Validation)
              </h3>
            </div>

            {/* Collection Tabs */}
            <div className="flex items-center space-x-1.5 text-xs">
              {COLLECTIONS_DATA.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setSelectedCollectionId(col.id)}
                  className={`px-3 py-1 rounded-full font-medium transition-all ${
                    selectedCollectionId === col.id
                      ? "bg-ink text-canvas font-semibold shadow-xs"
                      : "text-ink-muted hover:text-ink hover:bg-surface-soft"
                  }`}
                >
                  {col.name}
                </button>
              ))}
            </div>
          </div>

          <CollectionSchemaCard collection={activeCollection} />
        </section>

        {/* Section 03: CAS Concurrency Lifecycle */}
        <section id="cas-section" className="space-y-4 pt-4">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold text-ink-muted uppercase tracking-wider">
              Section 03
            </span>
            <span className="text-hairline-strong">•</span>
            <h3 className="text-base sm:text-lg font-bold text-ink font-sans">
              ลำดับเวลาและกลไกความปลอดภัย CAS (Compare-And-Swap Concurrency Lifecycle)
            </h3>
          </div>

          <CasLifecycleDiagram />
        </section>

        {/* Section 04: GSI Indexing & SQL++ Query Architecture */}
        <section id="gsi-section" className="space-y-4 pt-4">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold text-ink-muted uppercase tracking-wider">
              Section 04
            </span>
            <span className="text-hairline-strong">•</span>
            <h3 className="text-base sm:text-lg font-bold text-ink font-sans">
              การทำดัชนี GSI และการเพิ่มประสิทธิภาพคำสั่งคิวรี (Indexing &amp; Covered Queries)
            </h3>
          </div>

          <GsiIndexViewer />
        </section>

        {/* Section 05: Comparison with Traditional RDBMS */}
        <section id="comparison-section" className="space-y-4 pt-4">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold text-ink-muted uppercase tracking-wider">
              Section 05
            </span>
            <span className="text-hairline-strong">•</span>
            <h3 className="text-base sm:text-lg font-bold text-ink font-sans">
              การเปรียบเทียบเชิงสถาปัตยกรรม (Couchbase vs Traditional Relational DB)
            </h3>
          </div>

          <RdbmsComparisonTable />
        </section>

        {/* Bottom Presenter Summary Card */}
        <div className="rounded-2xl border border-hairline bg-surface-soft/60 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h4 className="font-bold text-base text-ink font-sans">
              พร้อมทดลองจำลองแรงกดดันจริงในระบบ (Fan Rush Simulation)?
            </h4>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-xl">
              กลับสู่หน้าระบบกดบัตรหลัก เพื่อเปิดแผง Couchbase Engine Drawer และรันการทดสอบการแย่งชิงที่นั่งพร้อมกันด้วยผู้ใช้จำลอง 50-200 คนแบบ Real-time
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-full bg-primary hover:bg-primary-active text-canvas text-xs sm:text-sm font-semibold transition-all shadow-float active:scale-98 shrink-0"
          >
            <span>เปิดหน้าระบบกดบัตรจริง</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      {!isPresentationMode && <Footer />}
    </div>
  );
}
