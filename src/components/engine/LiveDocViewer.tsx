"use client";

import React, { useState } from "react";
import { SeatDocument } from "@/validators/seat.schema";
import { Code2, Copy, Check, Hash } from "lucide-react";

interface LiveDocViewerProps {
  seat: SeatDocument | null;
  casToken?: string;
}

export const LiveDocViewer: React.FC<LiveDocViewerProps> = ({ seat, casToken }) => {
  const [copied, setCopied] = useState(false);

  if (!seat) {
    return (
      <div className="bg-canvas border border-hairline-soft rounded-2xl p-4 text-center text-xs text-ink-muted">
        คลิกเลือกที่นั่งในผังเพื่อตรวจสอบเอกสาร JSON แบบเรียลไทม์
      </div>
    );
  }

  const documentData = {
    ...seat,
    _cas: casToken || "173820918290001",
    _scope: "ticketing",
    _collection: "seats",
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(documentData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-canvas border border-hairline-soft rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Code2 className="w-4 h-4 text-ink-muted" />
          <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
            Live Couchbase Document
          </h4>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 px-2 py-1 rounded-md text-[11px] text-ink-muted hover:text-ink hover:bg-surface-soft border border-hairline-soft transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" />
              <span>คัดลอกแล้ว</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>คัดลอก JSON</span>
            </>
          )}
        </button>
      </div>

      {/* CAS Badge Highlight */}
      <div className="p-2.5 rounded-xl bg-surface-soft border border-hairline-soft flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-1.5 text-ink-muted">
          <Hash className="w-3.5 h-3.5 text-primary" />
          <span className="font-semibold text-ink">CAS Token:</span>
        </div>
        <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded text-[11px] select-all">
          {casToken || "173820918290001"}
        </span>
      </div>

      {/* JSON Viewer */}
      <div className="relative">
        <pre className="p-3 rounded-xl bg-surface-strong/80 text-[11px] font-mono text-ink-body overflow-x-auto max-h-56 leading-normal border border-hairline-soft">
          <code>{JSON.stringify(documentData, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
};
