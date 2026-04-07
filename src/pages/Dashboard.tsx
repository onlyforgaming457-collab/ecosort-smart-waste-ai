import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, Recycle, FileCheck, Gavel, TrendingUp,
  Clock, CheckCircle2, AlertCircle, Loader2,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

const statusIcon = (status: string) => {
  if (status === "Resolved") return <CheckCircle2 className="h-4 w-4 text-primary" />;
  if (status === "Investigating") return <Loader2 className="h-4 w-4 text-accent animate-spin" />;
  return <AlertCircle className="h-4 w-4 text-amber-500" />;
};

const fallbackArea = [
  { month: "Sep", recyclable: 12, organic: 8, hazardous: 3 },
  { month: "Oct", recyclable: 18, organic: 14, hazardous: 5 },
  { month: "Nov", recyclable: 24, organic: 18, hazardous: 4 },
  { month: "Dec", recyclable: 30, organic: 22, hazardous: 7 },
  { month: "Jan", recyclable: 38, organic: 28, hazardous: 6 },
  { month: "Feb", recyclable: 45, organic: 32, hazardous: 9 },
];

const fallbackPie = [
  { name: "Recyclable", value: 45, color: "hsl(152, 55%, 38%)" },
  { name: "Organic", value: 30, color: "hsl(168, 60%, 42%)" },
  { name: "Hazardous", value: 15, color: "hsl(40, 80%, 50%)" },
  { name: "General", value: 10, color: "hsl(200, 30%, 60%)" },
];

const Dashboard = () => {
  const { user } = useAuth();

  const { data: wasteLogs = [] } = useQuery({
    queryKey: ["dashboard_waste_logs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("waste_logs").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: reports = [] } = useQuery({
    queryKey: ["dashboard_reports"],
    queryFn: async () => {
      const { data, error } = await supabase.from("violation_reports").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const hasRealData = wasteLogs.length > 0 || reports.length > 0;

  const trendData = useMemo(() => {
    if (!wasteLogs.length) return [];
    const monthMap: Record<string, { recyclable: number; organic: number; hazardous: number }> = {};
    wasteLogs.forEach((s: any) => {
      const key = new Date(s.created_at).toLocaleDateString("en-US", { month: "short" });
      if (!monthMap[key]) monthMap[key] = { recyclable: 0, organic: 0, hazardous: 0 };
      const cat = s.category.toLowerCase();
      if (cat.includes("recyclable")) monthMap[key].recyclable++;
      else if (cat.includes("organic")) monthMap[key].organic++;
      else if (cat.includes("hazardous")) monthMap[key].hazardous++;
      else monthMap[key].recyclable++;
    });
    return Object.entries(monthMap).map(([month, data]) => ({ month, ...data })).slice(-6);
  }, [wasteLogs]);

  const pieData = useMemo(() => {
    if (!wasteLogs.length) return fallbackPie;
    let recyclable = 0, organic = 0, hazardous = 0, general = 0;
    wasteLogs.forEach((s: any) => {
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
  }, [wasteLogs]);

  const impactScore = Math.min(100, Math.round(wasteLogs.length * 3.5 + reports.length * 5));
  const chartArea = hasRealData && trendData.length > 0 ? trendData : fallbackArea;
  const chartPie = hasRealData ? pieData : fallbackPie;

  const overviewCards = [
    { label: "Waste Scanned", value: hasRealData ? String(wasteLogs.length) : "247", change: hasRealData ? `+${wasteLogs.length}` : "+12%", icon: Recycle },
    { label: "Reports Filed", value: hasRealData ? String(reports.length) : "18", change: hasRealData ? `+${reports.length}` : "+3", icon: FileCheck },
    { label: "Legal Consults", value: "5", change: "+2", icon: Gavel },
    { label: "Impact Score", value: hasRealData ? String(impactScore) : "92", change: "+8%", icon: TrendingUp },
  ];

  const displayComplaints = reports.length > 0
    ? reports.slice(0, 3).map((r: any) => ({
        id: r.reference_id,
        title: `${r.category} at ${r.location}`,
        status: r.status,
        date: new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      }))
    : [
        { id: "ECO-A3F2", title: "Illegal dumping on River Road", status: "Resolved", date: "Feb 27" },
        { id: "ECO-B7K9", title: "Industrial waste near school", status: "Investigating", date: "Feb 25" },
        { id: "ECO-C1D4", title: "Air pollution from factory", status: "Submitted", date: "Feb 22" },
      ];

  const displayTimeline = useMemo(() => {
    const items: { action: string; time: string }[] = [];
    wasteLogs.slice(0, 3).forEach((w: any) => {
      items.push({ action: `Waste classified as ${w.category}`, time: new Date(w.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) });
    });
    reports.slice(0, 3).forEach((r: any) => {
      items.push({ action: `Report filed: ${r.reference_id}`, time: new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) });
    });
    items.sort((a, b) => 0); // keep insertion order
    return items.length > 0 ? items.slice(0, 4) : [
      { action: "Waste analysis completed", time: "Feb 28" },
      { action: "Violation report ECO-A3F2 resolved", time: "Feb 27" },
      { action: "Consultation booked with Dr. Sharma", time: "Feb 26" },
      { action: "New report filed: ECO-B7K9", time: "Feb 25" },
    ];
  }, [wasteLogs, reports]);

  return (
    <Layout>
      <section className="hero-bg min-h-[calc(100vh-4rem)] py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-2"><span className="eco-gradient-text">Dashboard</span></h1>
            <p className="text-muted-foreground">Track your environmental impact and activity.</p>
          </motion.div>

          {/* Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {overviewCards.map((card, i) => (
              <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 card-hover">
                <div className="flex items-center justify-between mb-3">
                  <card.icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{card.change}</span>
                </div>
                <div className="text-2xl font-extrabold">{card.value}</div>
                <div className="text-xs text-muted-foreground">{card.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 lg:col-span-2">
              <h3 className="font-bold mb-4 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" />Classification Trends</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartArea}>
                  <defs>
                    <linearGradient id="gradRecyclable" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(152, 55%, 38%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(152, 55%, 38%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradOrganic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(168, 60%, 42%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(168, 60%, 42%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(145, 20%, 88%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(160, 10%, 45%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(160, 10%, 45%)" />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(145, 20%, 88%)", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }} />
                  <Area type="monotone" dataKey="recyclable" stroke="hsl(152, 55%, 38%)" fill="url(#gradRecyclable)" strokeWidth={2} />
                  <Area type="monotone" dataKey="organic" stroke="hsl(168, 60%, 42%)" fill="url(#gradOrganic)" strokeWidth={2} />
                  <Area type="monotone" dataKey="hazardous" stroke="hsl(40, 80%, 50%)" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-6">
              <h3 className="font-bold mb-4">Waste Breakdown</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={chartPie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={2} stroke="hsl(140, 20%, 97%)">
                    {chartPie.map((entry) => (<Cell key={entry.name} fill={entry.color} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {chartPie.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />{d.name}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Complaints + Timeline */}
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
              <h3 className="font-bold mb-4">Complaint Tracking</h3>
              <div className="space-y-3">
                {displayComplaints.map((c) => (
                  <div key={c.id} className="flex items-center justify-between bg-secondary/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      {statusIcon(c.status)}
                      <div>
                        <p className="text-sm font-medium">{c.title}</p>
                        <p className="text-xs text-muted-foreground">{c.id} · {c.date}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold capitalize px-2.5 py-1 rounded-full ${
                      c.status === "Resolved" ? "bg-primary/10 text-primary"
                        : c.status === "Investigating" ? "bg-accent/10 text-accent"
                        : "bg-amber-500/10 text-amber-600"
                    }`}>{c.status}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Clock className="h-5 w-5 text-primary" />Recent Activity</h3>
              <div className="space-y-4">
                {displayTimeline.map((t, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full eco-gradient-bg mt-1.5" />
                      {i < displayTimeline.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium">{t.action}</p>
                      <p className="text-xs text-muted-foreground">{t.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
