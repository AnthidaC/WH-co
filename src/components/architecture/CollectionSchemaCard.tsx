"use client";

import React, { useState } from "react";
import {
  CollectionDefinition,
  SchemaField,
} from "@/data/db-architecture-data";
import {
  Key,
  Database,
  Copy,
  Check,
  Code2,
  FileJson,
  Layers,
  ShieldCheck,
  Search,
  Sparkles,
  Info,
} from "lucide-react";

interface CollectionSchemaCardProps {
  collection: CollectionDefinition;
}

export const CollectionSchemaCard: React.FC<CollectionSchemaCardProps> = ({
  collection,
}) => {
  const [activeTab, setActiveTab] = useState<"fields" | "json" | "indexes">("fields");
  const [hasCopiedJson, setHasCopiedJson] = useState(false);
  const [hasCopiedKey, setHasCopiedKey] = useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(collection.sampleDocument, null, 2));
    setHasCopiedJson(true);
    setTimeout(() => setHasCopiedJson(false), 2000);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(collection.keyPattern);
    setHasCopiedKey(true);
    setTimeout(() => setHasCopiedKey(false), 2000);
  };

  const renderTagBadge = (tag?: SchemaField["tag"]) => {
    if (!tag) return null;
    switch (tag) {
      case "PK":
        return (
          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-ink text-canvas whitespace-nowrap shadow-xs">
            PRIMARY KEY
          </span>
        );
      case "FK":
        return (
          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
            FOREIGN KEY
          </span>
        );
      case "CAS":
        return (
          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-primary-subtle text-primary border border-primary/20 whitespace-nowrap">
            CAS GUARD
          </span>
        );
      case "TTL":
        return (
          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 whitespace-nowrap">
            TTL EXPIRY
          </span>
        );
      case "AUDIT":
        return (
          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-surface-soft text-ink-muted border border-hairline whitespace-nowrap">
            AUDIT
          </span>
        );
      case "GSI":
        return (
          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap">
            INDEXED
          </span>
        );
      case "ENUM":
        return (
          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-purple-50 text-purple-800 border border-purple-200 whitespace-nowrap">
            ENUM
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-canvas border border-hairline rounded-2xl overflow-hidden shadow-soft transition-all">
      {/* Header Bar */}
      <div className="p-5 sm:p-7 border-b border-hairline bg-surface-soft/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-3.5 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                collection.isFocalCore
                  ? "bg-primary text-canvas"
                  : "bg-ink text-canvas"
              }`}
            >
              {collection.id === "seats" ? (
                <ShieldCheck className="w-5 h-5" />
              ) : collection.id === "concerts" ? (
                <Layers className="w-5 h-5" />
              ) : (
                <FileJson className="w-5 h-5" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-ink truncate font-sans">
                  {collection.displayNameTh}
                </h3>
                {collection.isFocalCore && (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-primary text-canvas text-[10px] font-semibold tracking-wide uppercase">
                    Focal Point
                  </span>
                )}
              </div>
              <p className="text-xs text-ink-muted mt-0.5">
                Collection: <code className="font-mono text-ink font-semibold">{collection.name}</code> | Scope:{" "}
                <code className="font-mono text-ink font-semibold">{collection.scope}</code> | Bucket:{" "}
                <code className="font-mono text-ink font-semibold">{collection.bucket}</code>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <div className="px-3 py-1 rounded-full bg-canvas border border-hairline text-[11px] font-medium text-ink-muted">
              SLA: <span className="font-mono text-ink font-semibold">{collection.slaLatency}</span>
            </div>
          </div>
        </div>

        {/* Key Strategy Callout with Copy Action */}
        <div className="mt-4 p-3.5 rounded-xl bg-canvas border border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
          <div className="flex items-start sm:items-center space-x-2.5 min-w-0">
            <Key className="w-4 h-4 text-primary shrink-0 mt-0.5 sm:mt-0" />
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-semibold text-ink-muted tracking-wider block">
                Deterministic Document Key Pattern
              </span>
              <span className="font-mono text-xs sm:text-sm font-semibold text-primary break-all block">
                {collection.keyPattern}
              </span>
            </div>
          </div>

          <button
            onClick={handleCopyKey}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border border-hairline hover:bg-surface-soft text-xs text-ink-muted hover:text-ink transition-colors shrink-0 self-start sm:self-auto"
            title="คัดลอก Key Pattern"
          >
            {hasCopiedKey ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] text-emerald-600 font-medium">คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px]">คัดลอก Key</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-ink-muted mt-2 leading-relaxed">
          {collection.keyDescriptionTh}
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-hairline-soft bg-canvas px-5 sm:px-7 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
        <div className="flex space-x-1 text-xs font-medium py-2 min-w-max">
          <button
            onClick={() => setActiveTab("fields")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "fields"
                ? "bg-ink text-canvas font-semibold shadow-xs"
                : "text-ink-muted hover:text-ink hover:bg-surface-soft"
            }`}
          >
            พจนานุกรมฟิลด์ ({collection.fields.length} Fields)
          </button>
          <button
            onClick={() => setActiveTab("json")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "json"
                ? "bg-ink text-canvas font-semibold shadow-xs"
                : "text-ink-muted hover:text-ink hover:bg-surface-soft"
            }`}
          >
            ตัวอย่างเอกสาร JSON (Live Document)
          </button>
          <button
            onClick={() => setActiveTab("indexes")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "indexes"
                ? "bg-ink text-canvas font-semibold shadow-xs"
                : "text-ink-muted hover:text-ink hover:bg-surface-soft"
            }`}
          >
            ดัชนี GSI Index ({collection.gsiIndexes.length})
          </button>
        </div>

        {activeTab === "json" && (
          <button
            onClick={handleCopyJson}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded border border-hairline hover:bg-surface-soft text-[11px] text-ink-muted hover:text-ink transition-colors shrink-0"
          >
            {hasCopiedJson ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-600 font-medium">คัดลอก JSON แล้ว</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>คัดลอก JSON</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Tab Content: Fields Table (Responsive, Zero Overflow) */}
      {activeTab === "fields" && (
        <div className="p-4 sm:p-6">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-hairline text-ink-muted font-mono uppercase text-xs tracking-wider">
                  <th className="py-3 px-3.5 font-bold w-1/4">Field Name</th>
                  <th className="py-3 px-3.5 font-bold w-1/5">Data Type</th>
                  <th className="py-3 px-3.5 font-bold w-1/6">Role / Tag</th>
                  <th className="py-3 px-3.5 font-bold">คำอธิบายมาตรฐานสากล (Description)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline-soft font-sans">
                {collection.fields.map((field) => (
                  <tr key={field.name} className="hover:bg-surface-soft/60 transition-colors">
                    <td className="py-3.5 px-3.5 align-top font-mono font-bold text-sm text-ink break-words">
                      {field.name}
                      {field.required && (
                        <span className="text-primary ml-1 font-bold" title="จำเป็นต้องมี (Required)">
                          *
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3.5 align-top font-mono text-xs text-ink-body break-words">
                      <code className="bg-surface-soft px-1.5 py-0.5 rounded">{field.type}</code>
                    </td>
                    <td className="py-3.5 px-3.5 align-top">
                      {renderTagBadge(field.tag)}
                    </td>
                    <td className="py-3.5 px-3.5 align-top text-sm text-ink leading-relaxed break-words">
                      <p>{field.descriptionTh}</p>
                      {field.example !== undefined && field.example !== null && (
                        <span className="text-xs font-mono text-ink-muted mt-1.5 p-1 rounded bg-surface-soft border border-hairline-soft inline-block">
                          ตัวอย่าง: {typeof field.example === "object" ? JSON.stringify(field.example) : String(field.example)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View (Strict Overflow Prevention) */}
          <div className="md:hidden space-y-3.5">
            {collection.fields.map((field) => (
              <div
                key={field.name}
                className="p-4 rounded-xl border border-hairline-soft bg-canvas space-y-2.5 text-sm"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-mono font-bold text-ink text-base break-all">
                    {field.name}
                    {field.required && <span className="text-primary ml-1">*</span>}
                  </span>
                  {renderTagBadge(field.tag)}
                </div>

                <div className="font-mono text-xs text-ink-muted bg-surface-soft px-2.5 py-1 rounded break-all">
                  <code>{field.type}</code>
                </div>

                <p className="text-ink leading-relaxed text-sm break-words">
                  {field.descriptionTh}
                </p>

                {field.example !== undefined && field.example !== null && (
                  <div className="text-xs font-mono text-ink-muted pt-1.5 border-t border-hairline-soft/60 break-all">
                    ตัวอย่าง: {typeof field.example === "object" ? JSON.stringify(field.example) : String(field.example)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: JSON Document Viewer */}
      {activeTab === "json" && (
        <div className="p-4 sm:p-6">
          <div className="rounded-xl border border-hairline bg-[#1e1e1e] p-4 text-emerald-300 font-mono text-xs overflow-x-auto shadow-inner">
            <pre className="leading-relaxed break-normal whitespace-pre">
              {JSON.stringify(collection.sampleDocument, null, 2)}
            </pre>
          </div>
          <p className="text-[11px] text-ink-muted mt-2.5">
            *ตัวอย่างเอกสารจริงที่ถูกตรวจสอบความถูกต้องผ่าน Zod Strict Schema ก่อนบันทึกลง Couchbase
          </p>
        </div>
      )}

      {/* Tab Content: GSI Indexes */}
      {activeTab === "indexes" && (
        <div className="p-4 sm:p-6 space-y-4">
          {collection.gsiIndexes.map((idx) => (
            <div
              key={idx.name}
              className="p-4 rounded-xl border border-hairline bg-surface-soft/40 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-mono font-bold text-xs text-ink">{idx.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Covered Index
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#1e1e1e] text-amber-300 font-mono text-xs overflow-x-auto">
                <pre className="whitespace-pre-wrap break-all leading-relaxed">
                  {idx.sqlPlusPlus}
                </pre>
              </div>

              <p className="text-xs text-ink-muted leading-relaxed">
                {idx.purposeTh}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
