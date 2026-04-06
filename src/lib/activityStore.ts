// localStorage-based activity engine for EcoSort

export interface ScanRecord {
  id: string;
  category: string;
  confidence: number;
  disposal: string;
  impact: string;
  date: string;
  timestamp: number;
}

export interface ReportRecord {
  id: string;
  refId: string;
  location: string;
  description: string;
  category: string;
  hasEvidence: boolean;
  status: "pending" | "investigating" | "resolved";
  date: string;
  timestamp: number;
}

export interface ActivityRecord {
  action: string;
  type: "scan" | "report" | "legal" | "resolved";
  time: string;
  timestamp: number;
}

const KEYS = {
  scans: "ecosort_scans",
  reports: "ecosort_reports",
  activity: "ecosort_activity",
};

function read<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function write<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Scans
export function addScan(scan: Omit<ScanRecord, "id" | "date" | "timestamp">): ScanRecord {
  const record: ScanRecord = {
    ...scan,
    id: crypto.randomUUID(),
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    timestamp: Date.now(),
  };
  const scans = read<ScanRecord>(KEYS.scans);
  scans.unshift(record);
  write(KEYS.scans, scans.slice(0, 50));
  addActivity(`Waste classified as ${scan.category}`, "scan");
  return record;
}

export function getScans(): ScanRecord[] {
  return read<ScanRecord>(KEYS.scans);
}

// Reports
export function addReport(report: Omit<ReportRecord, "id" | "refId" | "status" | "date" | "timestamp">): ReportRecord {
  const refId = `ECO-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
  const record: ReportRecord = {
    ...report,
    id: crypto.randomUUID(),
    refId,
    status: "pending",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    timestamp: Date.now(),
  };
  const reports = read<ReportRecord>(KEYS.reports);
  reports.unshift(record);
  write(KEYS.reports, reports.slice(0, 50));
  addActivity(`New report filed: ${refId}`, "report");
  return record;
}

export function getReports(): ReportRecord[] {
  return read<ReportRecord>(KEYS.reports);
}

// Activity
export function addActivity(action: string, type: ActivityRecord["type"]) {
  const record: ActivityRecord = {
    action,
    type,
    time: "Just now",
    timestamp: Date.now(),
  };
  const activity = read<ActivityRecord>(KEYS.activity);
  activity.unshift(record);
  write(KEYS.activity, activity.slice(0, 20));
}

export function getActivity(): ActivityRecord[] {
  const activity = read<ActivityRecord>(KEYS.activity);
  // Update relative times
  return activity.map((a) => ({
    ...a,
    time: getRelativeTime(a.timestamp),
  }));
}

function getRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Dashboard stats
export function getStats() {
  const scans = getScans();
  const reports = getReports();

  // Calculate impact score based on scans
  const impactScore = Math.min(100, Math.round(scans.length * 3.5 + reports.length * 5));

  return {
    wasteScanned: scans.length,
    reportsFiled: reports.length,
    impactScore,
  };
}

// Get trend data for charts
export function getTrendData() {
  const scans = getScans();
  const monthMap: Record<string, { recyclable: number; organic: number; hazardous: number }> = {};

  scans.forEach((s) => {
    const d = new Date(s.timestamp);
    const key = d.toLocaleDateString("en-US", { month: "short" });
    if (!monthMap[key]) monthMap[key] = { recyclable: 0, organic: 0, hazardous: 0 };
    const cat = s.category.toLowerCase();
    if (cat.includes("recyclable")) monthMap[key].recyclable++;
    else if (cat.includes("organic")) monthMap[key].organic++;
    else if (cat.includes("hazardous")) monthMap[key].hazardous++;
    else monthMap[key].recyclable++;
  });

  return Object.entries(monthMap)
    .map(([month, data]) => ({ month, ...data }))
    .slice(-6);
}

export function getPieData() {
  const scans = getScans();
  let recyclable = 0, organic = 0, hazardous = 0, general = 0;
  scans.forEach((s) => {
    const cat = s.category.toLowerCase();
    if (cat.includes("recyclable")) recyclable++;
    else if (cat.includes("organic")) organic++;
    else if (cat.includes("hazardous")) hazardous++;
    else general++;
  });
  return [
    { name: "Recyclable", value: recyclable || 1, color: "hsl(152, 55%, 38%)" },
    { name: "Organic", value: organic || 1, color: "hsl(168, 60%, 42%)" },
    { name: "Hazardous", value: hazardous || 1, color: "hsl(40, 80%, 50%)" },
    { name: "General", value: general || 1, color: "hsl(200, 30%, 60%)" },
  ];
}
