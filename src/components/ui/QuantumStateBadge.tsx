import React from "react";
import { cn } from "@/lib/utils";
import { QuantumBasis, QuantumStateName } from "@/types";

interface QuantumStateBadgeProps {
  state: QuantumStateName | string;
  basis?: QuantumBasis;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function QuantumStateBadge({
  state,
  basis,
  className,
  size = "md",
}: QuantumStateBadgeProps) {
  // Infer basis if not provided
  let detectedBasis = basis;
  if (!detectedBasis) {
    if (state.includes("0") || state.includes("1")) detectedBasis = "Z";
    else if (state.includes("+i") || state.includes("−i") || state.includes("-i")) detectedBasis = "Y";
    else detectedBasis = "X";
  }

  const basisColor = {
    Z: "border-cyan-500/40 text-cyan-300 bg-cyan-950/40",
    X: "border-emerald-500/40 text-emerald-300 bg-emerald-950/40",
    Y: "border-purple-500/40 text-purple-300 bg-purple-950/40",
  }[detectedBasis || "Z"];

  const sizeClass = {
    sm: "px-1.5 py-0.5 text-xs font-mono",
    md: "px-2.5 py-1 text-sm font-mono font-semibold",
    lg: "px-3.5 py-1.5 text-base font-mono font-bold",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded border tracking-wider",
        basisColor,
        sizeClass,
        className
      )}
      title={`Basis ${detectedBasis}`}
    >
      {state}
    </span>
  );
}
