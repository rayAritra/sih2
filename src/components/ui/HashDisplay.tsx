"use client";

import React, { useState } from "react";
import { cn, truncateHash } from "@/lib/utils";
import { Copy, Check } from "lucide-react";

interface HashDisplayProps {
  hash: string;
  truncate?: boolean;
  start?: number;
  end?: number;
  className?: string;
}

export function HashDisplay({
  hash,
  truncate = true,
  start = 6,
  end = 6,
  className,
}: HashDisplayProps) {
  const [copied, setCopied] = useState(false);

  const display = truncate ? truncateHash(hash, start, end) : hash;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-subtle/80 hover:bg-surface-panel border border-border/80 text-slate-300 font-mono text-xs transition-colors group cursor-pointer",
        className
      )}
      title="Click to copy hash"
    >
      <span>{display}</span>
      {copied ? (
        <Check className="w-3 h-3 text-emerald-400" />
      ) : (
        <Copy className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
      )}
    </button>
  );
}
