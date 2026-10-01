export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
}

export const siteConfig = {
  name: "QShield-QDS",
  fullName: "Quantum-Inspired Cyber Threat Detection for Teleportation-Based Quantum Digital Signatures",
  sihDetails: "Smart India Hackathon 2026 | Problem Statement: SIH26141 | Category: Blockchain & Cybersecurity",
  version: "v1.0.0-SIH26141",
  mainNav: [
    { title: "Overview", href: "/", icon: "Activity" },
    { title: "Live Monitor", href: "/monitor", icon: "Radio" },
    { title: "Quantum Simulator", href: "/simulator", icon: "Atom" },
    { title: "Attack Lab", href: "/attack-lab", icon: "ShieldAlert" },
    { title: "Sessions", href: "/sessions", icon: "Workflow" },
    { title: "Threat Alerts", href: "/alerts", icon: "AlertTriangle", badge: "3" },
    { title: "Security Planner", href: "/planner", icon: "Sliders" },
    { title: "Security Envelope", href: "/security-envelope", icon: "Grid" },
    { title: "Audit Ledger", href: "/audit", icon: "Layers" },
    { title: "Reports", href: "/reports", icon: "FileText" },
    { title: "Architecture", href: "/architecture", icon: "Network" },
    { title: "Documentation", href: "/documentation", icon: "BookOpen" },
    { title: "Settings", href: "/settings", icon: "Settings" },
  ] as NavItem[],
  thresholds: {
    warningQber: 0.08, // 8% warning
    criticalQber: 0.11, // 11% critical abort
    honestBaselineQber: 0.02, // 2% normal channel noise
    sprtAlpha: 0.001, // false alarm rate (10^-3)
    sprtBeta: 0.000000001, // missed detection rate (10^-9)
  },
};
