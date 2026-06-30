import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend, LabelList,
} from "recharts";
import { Search, FileText } from "lucide-react";
import CambodiaMap from "./components/CambodiaMap";
import { provinces, ProvinceData } from "./data/provinces";

// ─── Static Data ─────────────────────────────────────────────────────────────

const categoryData = [
  { name: "របាយការណ៍ហិរញ្ញវត្ថុ - Financial Report", reports: 36 },
  { name: "របាយការណ៍អនុវត្តថវិកា - Budget Execution Report", reports: 1 },
  { name: "របាយការណ៍បិទបញ្ជី - Budget Closing Report", reports: 1 },
  { name: "របាយការណ៍ច្បាប់ទូទាត់ - Budget Settlement Law Report", reports: 15 },
  { name: "របាយការណ៍ស្តង់ដារអន្តរជាតិ - Standard Report", reports: 5 },
];

const categoryQueryLabels: Record<string, string> = {
  BA: "មុខងារវិភាជន៍ថវិកា",
  PR: "មុខងារលទ្ធកម្ម",
  PO: "មុខងារការទិញ",
  AP: "មុខងារគណនីត្រូវសង",
  AR: "មុខងារគណនីត្រូវទារ",
  CM: "មុខងារគ្រប់គ្រងសាច់ប្រាក់",
  GL: "មុខងារសៀវភៅធំ",
  "For Approver": "មុខងារសម្រាប់អ្នកអនុម័ត",
};

const categoryQueryData = [
  { name: "BA", queries: 6 },
  { name: "PR", queries: 1 },
  { name: "PO", queries: 2 },
  { name: "AP", queries: 5 },
  { name: "AR", queries: 2 },
  { name: "CM", queries: 3 },
  { name: "GL", queries: 1 },
  { name: "For Approver", queries: 1 },
];

const BUData = [
  { name: "GDNT: អគ្គ.រតនាគារជាតិ", reports: 123663, queries: 33960 },
  { name: "PT012: រតនាគាររាជធានីភ្នំពេញ", reports: 35555, queries: 6737 },
  { name: "PT006: រតនាគារខេត្តកំពង់ធំ", reports: 32312, queries: 6440 },
  { name: "PT008: រតនាគារខេត្តកណ្តាល", reports: 29192, queries: 3101 },
  { name: "PT018: រតនាគារខេត្តព្រះសីហនុ", reports: 22175, queries: 5638 },
];

const reportNatBUData = [
  { name: "GDNT: អគ្គ.រតនាគារជាតិ", reports: 11126 },
  { name: "GID: អគ្គ.សវនកម្ម", reports: 2350 },
  { name: "GDPFMIT: អគ្គ.បច្ចេកវិទ្យាព័ត៌មាន", reports: 1399 },
  { name: "DEF01: មន្ទីរសេដ្ឋកិច្ចខេត្តបន្ទាយមានជ័យ", reports: 740 },
  { name: "LM10: ក្រសួងសេដ្ឋកិច្ចនិងហិរញ្ញវត្ថុ", reports: 622 },
  { name: "DEF08: មន្ទីរសេដ្ឋកិច្ចខេត្តកណ្តាល", reports: 572 },
  { name: "LM16: ក្រសួងអប់រំ យុវជន និងកីឡា", reports: 529 },
  { name: "LM22: ក្រសួងប្រៃសនីយ៍", reports: 373 },
  { name: "LM72: ក្រសួងមហាផ្ទៃ", reports: 365 },
  { name: "DEF05: មន្ទិរសេដ្ឋកិច្ចខេត្តកំពង់ស្ពឺ", reports: 321 },
];

const queryNatBUData = [
  { name: "GDNT: អគ្គ.រតនាគារជាតិ", queries: 5734 },
  { name: "GDPFMIT: អគ្គ.បច្ចេកវិទ្យាព័ត៌មាន", queries: 937 },
  { name: "LM10: ក្រសួងសេដ្ឋកិច្ចនិងហិរញ្ញវត្ថុ", queries: 904 },
  { name: "LM17: ក្រសួងកសិកម្ម", queries: 156 },
  { name: "GDIA: អគ្គ.សវនកម្មបច្ចេកវិទ្យា", queries: 116 },
  { name: "LM22: ក្រសួងប្រៃសនីយ៍", queries: 64 },
  { name: "LM15: ក្រសួងពាណិជ្ជកម្ម", queries: 57 },
  { name: "GDB: អគ្គថវិកា", queries: 56 },
  { name: "LM28: ក្រសួងរៀបចំដែនដី", queries: 52 },
  { name: "LM26: ក្រសួងយុត្តិធម៌", queries: 45 },
];

const reportsubNatBUData = [
  { name: "PT006: រតនាគារខេត្តកំពង់ធំ", reports: 1789 },
  { name: "PT008: រតនាគារខេត្តកណ្តាល", reports: 1705 },
  { name: "PT014: រតនាគារខេត្តព្រៃវែង", reports: 1598 },
  { name: "PT018: រតនាគារខេត្តព្រះសីហនុ", reports: 1555 },
  { name: "PT005: រតនាគារខេត្តកំពង់ស្ពឺ", reports: 1450 },
  { name: "PT012: រតនាគាររាជធានីភ្នំពេញ", reports: 1382 },
  { name: "PT025: រតនាគារខេត្តត្បូងឃ្មុំ", reports: 1320 },
  { name: "PT010: រតនាគារខេត្តក្រចេះ", reports: 1314 },
  { name: "PT004: រតនាគារខេត្តកំពង់ឆ្នាំង", reports: 1257 },
  { name: "PT001: រតនាគារខេត្តបន្ទាយមានជ័យ", reports: 1237 },
];

const querysubNatBUData = [
  { name: "PT002: រតនាគារខេត្តបាត់ដំបង", queries: 1626 },
  { name: "PT017: រតនាគារខេត្តសៀមរាប", queries: 959 },
  { name: "PT020: រតនាគារខេត្តស្វាយរៀង", queries: 944 },
  { name: "PT001: រតនាគារខេត្តបន្ទាយមានជ័យ", queries: 775 },
  { name: "PT006: រតនាគារខេត្តកំពង់ធំ", queries: 642 },
  { name: "PT012: រតនាគាររាជធានីភ្នំពេញ", queries: 615 },
  { name: "PT018: រតនាគារខេត្តព្រះសីហនុ", queries: 612 },
  { name: "PT009: រតនាគារខេត្តកោះកុង", queries: 520 },
  { name: "PT004: រតនាគារខេត្តកំពង់ឆ្នាំង", queries: 519 },
  { name: "PT003: រតនាគារខេត្តកំពង់ចាម", queries: 518 },
];

const userGroups = [
  { label: "National Users: អ្នកប្រើប្រាស់ថ្នាក់ជាតិ", active: 1976, inactive: 600, terminated: 390 },
  { label: "Sub-National Users: អ្នកប្រើប្រាស់ថ្នាក់ក្រោមជាតិ", active: 875, inactive: 300, terminated: 120 },
  { label: "APE Users: អ្នកប្រើប្រាស់តាមគ្រឹះស្ថានរដ្ឋបាលសាធារណៈ", active: 72, inactive: 21, terminated: 19 },
];

const siteGroups = [
  { label: "National Sites: ការដ្ឋានថ្នាក់ជាតិ", count: 229, trend: { value: 1.61, up: true } },
  { label: "Sub-National Sites: ការដ្ឋានថ្នាក់ក្រោមជាតិ", count: 145, trend: { value: 0.84, up: true } },
  { label: "APE Sites: ការដ្ឋានគ្រឹះស្ថានរដ្ឋបាលសាធារណៈ", count: 9, trend: { value: 0.01, up: true } },
];

const CAT_COLORS = ["#38bdf8", "#34d399", "#a78bfa", "#fb923c", "#f472b6", "#facc15"];

// ─── Derived Totals ───────────────────────────────────────────────────────────

const totalActive = userGroups.reduce((s, g) => s + g.active, 0);
const totalInactive = userGroups.reduce((s, g) => s + g.inactive, 0);
const totalTerminated = userGroups.reduce((s, g) => s + g.terminated, 0);
const totalUsers = totalActive + totalInactive + totalTerminated;
const usersTrend = { value: 4.2, up: true };

const totalSites = siteGroups.reduce((s, g) => s + g.count, 0);
const sitesTrend = { value: 0.26, up: true };

const totalReports = BUData.reduce((s, d) => s + d.reports, 0);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return n.toLocaleString();
}

// ─── TrendBadge ──────────────────────────────────────────────────────────────

const TrendBadge = ({ value, up, size = "md" }: { value: number; up: boolean; size?: "sm" | "md" }) => {
  const iconSize = size === "sm" ? 7 : 8;
  return (
    <span className={`flex items-center gap-1 font-medium rounded-full
      ${size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-[10px] px-2 py-0.5"}
      ${up ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"}`}>
      {up
        ? <svg width={iconSize} height={iconSize} viewBox="0 0 10 10" fill="none"><path d="M5 2L9 7H1L5 2Z" fill="currentColor" /></svg>
        : <svg width={iconSize} height={iconSize} viewBox="0 0 10 10" fill="none"><path d="M5 8L9 3H1L5 8Z" fill="currentColor" /></svg>
      }
      {value}%
    </span>
  );
};

// ─── Tooltips ────────────────────────────────────────────────────────────────

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="text-foreground font-semibold mb-1">{label}</p>
      <p className="text-sky-400">{payload[0].value.toLocaleString()}</p>
    </div>
  );
};

// ─── Reusable KPI Card ────────────────────────────────────────────────────────

const KpiCard = ({ label, value, icon: Icon, color, bg }: {
  label: string; value: string; icon: any; color: string; bg: string;
}) => (
  <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
    <div className={`${bg} p-3 rounded-xl`}>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <div>
      <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase mb-0.5 font-kantumruy">{label}</p>
      <p className="text-2xl font-semibold tracking-tight font-kantumruy">{value}</p>
    </div>
  </div>
);

// ─── Reusable Horizontal Bar Chart ───────────────────────────────────────────

const HorizontalBarChart = ({ data, dataKey, color, reversed, labelPosition, yAxisOrientation, title, margin }: {
  data: any[];
  dataKey: string;
  color: string;
  reversed?: boolean;
  labelPosition: "right" | "insideLeft";
  yAxisOrientation: "left" | "right";
  title: string;
  margin?: { top?: number; right?: number; left?: number; bottom?: number };
}) => (
  <div className="bg-card border border-border rounded-xl p-5">
    <h2 className="text-sm font-semibold text-foreground mb-3">{title}</h2>
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 60, left: 8, bottom: 0, ...margin }}
        barSize={10}
      >
        <XAxis type="number" hide reversed={reversed} />
        <YAxis
          type="category"
          dataKey="name"
          orientation={yAxisOrientation}
          tick={{ fill: "#64748b", fontSize: 11, fontFamily: "Kantumruy Pro" }}
          axisLine={false}
          tickLine={false}
          width={240}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-xl text-xs">
                <p className="text-foreground font-semibold mb-1">{label}</p>
                <p style={{ color }}>{dataKey}: {payload[0].value.toLocaleString()}</p>
              </div>
            );
          }}
        />
        <Bar dataKey={dataKey} fill={color} radius={[0, 4, 4, 0]}>
          <LabelList
            dataKey={dataKey}
            position={labelPosition}
            style={{ fill: "#94a3b8", fontSize: 11, fontFamily: "Kantumruy Pro" }}
            formatter={(v: number) => v.toLocaleString()}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<"users" | "reports">("users");
  const [hovered, setHovered] = useState<ProvinceData | null>(null);

  const totals = useMemo(() => ({
    queries: provinces.reduce((s, p) => s + p.queries, 0),
  }), []);

  const CustomXAxisTick = ({ x, y, payload }: any) => {
    const words = payload.value.split(" ");
    const lines: string[] = [];
    let current = "";
    words.forEach((word: string) => {
      const test = current ? `${current} ${word}` : word;
      if (test.length > 12) { lines.push(current); current = word; }
      else { current = test; }
    });
    if (current) lines.push(current);
    return (
      <g transform={`translate(${x},${y + 8})`}>
        {lines.map((line, i) => (
          <text key={i} x={0} y={0} dy={i * 12 + 8} textAnchor="middle"
            dominantBaseline="hanging" fill="#64748b" fontSize={12} fontFamily="Kantumruy Pro">
            {line}
          </text>
        ))}
      </g>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-[1400px] mx-auto px-6 py-8">

        {/* Toggle Navigation */}
        <div className="flex justify-end mb-6">
          <div className="flex items-center bg-card border border-border rounded-full p-1 gap-1">
            <button
              onClick={() => setPage("users")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all
                ${page === "users" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
            >
              Users & Sites
            </button>
            <button
              onClick={() => setPage("reports")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all
                ${page === "reports" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
            >
              Reports & Queries
            </button>
          </div>
        </div>

        {/* ── PAGE: Users & Sites ── */}
        {page === "users" && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">

              {/* Sites Card */}
              <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
                <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase font-kantumruy">
                  Total Sites · ចំនួនការដ្ឋានសរុប
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-semibold tracking-tight font-kantumruy">{fmt(totalSites)}</p>
                  <TrendBadge value={sitesTrend.value} up={sitesTrend.up} />
                  <span className="text-[10px] text-muted-foreground">vs last month</span>
                </div>
                <div className="border-t border-border pt-3 flex flex-col gap-2">
                  {siteGroups.map((g) => (
                    <div key={g.label} className="flex justify-between items-center">
                      <p className="text-[10px] font-medium text-muted-foreground">{g.label}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground">{fmt(g.count)}</span>
                        <TrendBadge value={g.trend.value} up={g.trend.up} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* User Status Card */}
              <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
                <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase font-kantumruy">
                  Total Users · ចំនួនអ្នកប្រើប្រាស់សរុប
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-semibold tracking-tight font-kantumruy">{fmt(totalUsers)}</p>
                  <TrendBadge value={usersTrend.value} up={usersTrend.up} />
                  <span className="text-[10px] text-muted-foreground">vs last month</span>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden gap-[2px]">
                  <div className="bg-emerald-400" style={{ flex: totalActive }} />
                  <div className="bg-yellow-400" style={{ flex: totalInactive }} />
                  <div className="bg-red-400" style={{ flex: totalTerminated }} />
                </div>
                <div className="flex gap-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />{fmt(totalActive)} Active</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />{fmt(totalInactive)} Inactive</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />{fmt(totalTerminated)} Terminated</span>
                </div>
                <div className="border-t border-border pt-3 flex flex-col gap-2">
                  {userGroups.map((g) => (
                    <div key={g.label} className="flex justify-between items-center">
                      <p className="text-[10px] font-medium text-muted-foreground">{g.label}</p>
                      <div className="flex gap-2 text-[10px]">
                        <span className="text-emerald-400 font-semibold">{fmt(g.active)}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-yellow-400 font-semibold">{fmt(g.inactive)}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-red-400 font-semibold">{fmt(g.terminated)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>




            {/* Cambodia Map */}
            <div className="mb-2 flex items-center gap-2">
              <h2 className="text-sm font-semibold text-foreground">Geographic Distribution: របាយភូមិសាស្ត្រ</h2>
            </div>
            <CambodiaMap />

            {/* Province Ranking Table */}
            <h2 className="text-sm font-semibold text-foreground mt-6 mb-4">Detailed Geographic Data: ទិន្នន័យលម្អិតតាមរាជធានី/ខេត្ត</h2>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-auto max-h-[400px]">
                <table className="w-full text-xs relative">
                  <thead className="sticky top-0 bg-card z-10">
                    <tr className="border-b border-border">
                      <th className="text-left px-5 py-3 text-muted-foreground font-medium">#</th>
                      <th className="text-left px-5 py-3 text-muted-foreground font-medium">Province</th>
                      <th className="text-right px-5 py-3 text-muted-foreground font-medium">Sites</th>
                      <th className="text-right px-5 py-3 text-muted-foreground font-medium">Users</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...provinces]
                      .sort((a, b) => b.users - a.users)
                      .map((p, i) => (
                        <tr
                          key={p.id}
                          className="border-b border-border/50 hover:bg-white/[0.02] transition-colors"
                          onMouseEnter={() => setHovered(p)}
                          onMouseLeave={() => setHovered(null)}
                        >
                          <td className="px-5 py-3 text-muted-foreground">{i + 1}</td>
                          <td className="px-5 py-3 font-medium text-foreground">{p.name}</td>
                          <td className="px-5 py-3 text-right text-emerald-400">{fmt(p.sites)}</td>
                          <td className="px-5 py-3 text-right text-sky-400 font-semibold">{fmt(p.users)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── PAGE: Reports & Queries ── */}
        {page === "reports" && (
          <>
            {/* Unique Types KPI Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <KpiCard label="Total Reports - ចំនួនរបាយការណ៍សរុប" value={fmt(58)} icon={FileText} color="text-sky-400" bg="bg-sky-400/10" />
              <KpiCard label="Total Queries - ចំនួនរបាយការណ៍ប្រតិបត្តិការណ៍លម្អិតសរុប" value={fmt(21)} icon={Search} color="text-emerald-400" bg="bg-emerald-400/10" />
            </div>

            {/* Category Charts */}
            <div className="grid grid-cols-2 gap-4 mb-4">

              {/* Reports by Category */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="text-sm font-semibold text-foreground mb-3" style={{ fontFamily: "Kantumruy Pro" }}>
                  Reports by Category - របាយការណ៍តាមប្រភេទ
                </h2>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={categoryData} margin={{ top: 20, right: 4, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
                    <XAxis dataKey="name" tick={<CustomXAxisTick />} axisLine={false} tickLine={false} interval={0} height={100} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 12, fontFamily: "Kantumruy Pro" }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(148,163,184,0.04)" }} />
                    <Bar dataKey="reports" radius={[5, 5, 0, 0]}>
                      <LabelList dataKey="reports" position="top" style={{ fill: "#94a3b8", fontSize: 12, fontFamily: "Kantumruy Pro" }} />
                      {categoryData.map((_, i) => (<Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* FMIS Queries by Category */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="text-sm font-semibold text-foreground mb-3" style={{ fontFamily: "Kantumruy Pro" }}>
                  Queries by Module - របាយការណ៍ប្រតិបត្តិការណ៍លម្អិតតាមមុខងារ
                </h2>
                <ResponsiveContainer width="100%" height={360}>
                  <BarChart data={categoryQueryData} margin={{ top: 20, right: 4, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
                    <XAxis dataKey="name" tick={<CustomXAxisTick />} axisLine={false} tickLine={false} interval={0} height={100} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 12, fontFamily: "Kantumruy Pro" }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(148,163,184,0.04)" }} />
                    <Bar dataKey="queries" radius={[5, 5, 0, 0]}>
                      <LabelList dataKey="queries" position="top" style={{ fill: "#94a3b8", fontSize: 12, fontFamily: "Kantumruy Pro" }} />
                      {categoryQueryData.map((_, i) => (<Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />))}
                    </Bar>
                    <Legend
                      verticalAlign="bottom"
                      content={() => (
                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3">
                          {categoryQueryData.map((entry, i) => (
                            <div key={entry.name} className="flex items-center gap-1.5">
                              <span
                                className="w-2 h-2 rounded-full inline-block flex-shrink-0"
                                style={{ backgroundColor: CAT_COLORS[i % CAT_COLORS.length] }}
                              />
                              <span style={{ color: "#94a3b8", fontSize: 11, fontFamily: "Kantumruy Pro" }}>
                                {entry.name} — {categoryQueryLabels[entry.name]}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>


            {/* Generated Report / Query Totals KPI Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <KpiCard label="Total Reports Generated - ចំនួនការទាញរបាយការណ៍សរុប" value={fmt(totalReports)} icon={FileText} color="text-amber-400" bg="bg-amber-400/10" />
              <KpiCard label="Total Queries Generated - ចំនួនការទាញរបាយការណ៍ប្រតិបត្តិការណ៍លម្អិតសរុប" value={fmt(totals.queries)} icon={Search} color="text-violet-400" bg="bg-violet-400/10" />
            </div>

            {/* National Level */}
            <h2 className="text-lg font-bold text-foreground mb-4">ការទាញរបាយការណ៍ថ្នាក់ជាតិ</h2>
            <h4 className="text-xs text-muted-foreground">ទិន្នន័យរបាយការណ៍ និងរបាយការណ៍ប្រតិបត្តិការណ៍លម្អិតថ្នាក់ជាតិដែលទាញចេញពី FMIS ច្រើនជាងគេ</h4>
            <br />
            <div className="grid grid-cols-2 gap-4 mb-6">
              <HorizontalBarChart
                title="Top 10 Entities Generated Reports: អង្គភាពដែលទាញរបាយការណ៍ច្រើនជាងគេទាំង ១០"
                data={reportNatBUData}
                dataKey="reports"
                color="#facc15"
                labelPosition="right"
                yAxisOrientation="left"
                margin={{ right: 80, left: 0 }}
              />
              <HorizontalBarChart
                title="Top 10 Entities Generated Queries: អង្គភាពដែលទាញរបាយការណ៍ប្រតិបត្តិការណ៍លម្អិតច្រើនជាងគេទាំង ១០"
                data={queryNatBUData}
                dataKey="queries"
                color="#38bdf8"
                reversed
                labelPosition="right"
                yAxisOrientation="right"
                margin={{ right: 80, left: 0 }}
              />
            </div>

            {/* Sub-National Level */}
            <h2 className="text-lg font-bold text-foreground mb-4">ការទាញរបាយការណ៍ថ្នាក់ក្រោមជាតិ</h2>
            <h4 className="text-xs text-muted-foreground">ទិន្នន័យរបាយការណ៍ និងរបាយការណ៍ប្រតិបត្តិការណ៍លម្អិតថ្នាក់ក្រោមជាតិដែលទាញចេញពី FMIS ច្រើនជាងគេ</h4>
            <br />
            <div className="grid grid-cols-2 gap-4 mb-6">
              <HorizontalBarChart
                title="Top 10 Entities Generated Reports: អង្គភាពដែលទាញរបាយការណ៍ច្រើនជាងគេទាំង ១០"
                data={reportsubNatBUData}
                dataKey="reports"
                color="#facc15"
                labelPosition="right"
                yAxisOrientation="left"
                margin={{ right: 80, left: 0 }}
              />
              <HorizontalBarChart
                title="Top 10 Entities Generated Queries: អង្គភាពដែលទាញរបាយការណ៍ប្រតិបត្តិការណ៍លម្អិតច្រើនជាងគេទាំង ១០"
                data={querysubNatBUData}
                dataKey="queries"
                color="#38bdf8"
                reversed
                labelPosition="right"
                yAxisOrientation="right"
                margin={{ right: 80, left: 0 }}
              />
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="border-t border-border mt-10 pt-6 pb-4 flex flex-col items-center gap-1.5">
          <p className="text-xs text-muted-foreground" style={{ fontFamily: "Kantumruy Pro" }}>
            រៀបចំឡើងដោយការិយាល័យគ្រប់គ្រងព័ត៌មាន · Developed by OIM
          </p>
          <p className="text-sm font-semibold text-foreground" style={{ fontFamily: "Kantumruy Pro" }}>
            ទិន្នន័យក្នុងឆ្នាំ ២០២៦ (មករា-មិថុនា)
          </p>

        </footer>
      </div>
    </div>
  );
}
