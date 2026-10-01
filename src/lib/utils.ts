import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(val: number, decimals = 2): string {
  if (Math.abs(val) < 1e-4 && val !== 0) {
    return val.toExponential(2);
  }
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(val);
}

export function formatScientific(val: number, precision = 2): string {
  if (val === 0) return "0";
  const str = val.toExponential(precision);
  const [base, exp] = str.split("e");
  const expNum = parseInt(exp, 10);
  return `${base} × 10${toSuperscript(expNum)}`;
}

function toSuperscript(num: number): string {
  const superscripts: Record<string, string> = {
    "-": "⁻",
    "0": "⁰",
    "1": "¹",
    "2": "²",
    "3": "³",
    "4": "⁴",
    "5": "⁵",
    "6": "⁶",
    "7": "⁷",
    "8": "⁸",
    "9": "⁹",
  };
  return num
    .toString()
    .split("")
    .map((ch) => superscripts[ch] || ch)
    .join("");
}

export function truncateHash(hash: string, start = 6, end = 6): string {
  if (!hash) return "";
  if (hash.length <= start + end) return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}

export function formatPercent(val: number, decimals = 1): string {
  return `${(val * 100).toFixed(decimals)}%`;
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
