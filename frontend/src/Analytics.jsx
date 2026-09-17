import {
  Activity,
  AlertTriangle,
  Brain,
  Building2,
  CheckCircle2,
  Clock3,
  Copy,
  FileText,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Users
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";


const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#22c55e",
  "#ec4899",
  "#eab308",
  "#ef4444"
];


function Analytics({
  complaints = [],
  stats = {},
  onRefresh
}) {

  const total =
    Number(stats.total_complaints || complaints.length);

  const pending =
    Number(stats.pending_complaints || 0);

  const resolved =
    Number(stats.resolved_complaints || 0);

  const highPriority =
    Number(stats.high_priority_complaints || 0);

  const duplicates =
    Number(stats.duplicate_complaints || 0);

  const resolutionRate =
    total > 0
      ? Math.round(
          (resolved / total) * 100
        )
      : 0;


  const priorityData = [
    {
      name: "Critical",
      value: Number(
        stats.priorities?.CRITICAL || 0
      ),
      color: "#ef4444"
    },
    {
      name: "High",
      value: Number(
        stats.priorities?.HIGH || 0
      ),
      color: "#f97316"
    },
    {
      name: "Medium",
      value: Number(
        stats.priorities?.MEDIUM || 0
      ),
      color: "#3b82f6"
    },
    {
      name: "Low",
      value: Number(
        stats.priorities?.LOW || 0
      ),
      color: "#22c55e"
    }
  ];


  const statusData = [
    {
      name: "Submitted",
      value: Number(
        stats.statuses?.SUBMITTED || 0
      ),
      color: "#8b5cf6"
    },
    {
      name: "In Progress",
      value: Number(
        stats.statuses?.IN_PROGRESS || 0
      ),
      color: "#f59e0b"
    },
    {
      name: "Resolved",
      value: Number(
        stats.statuses?.RESOLVED || 0
      ),
      color: "#22c55e"
    }
  ];


  const departments =
    Object.entries(
      stats.departments || {}
    )
      .map(
        ([name, value]) => ({
          name,
          value: Number(value)
        })
      )
      .sort(
        (a, b) =>
          b.value - a.value
      );


  const categories =
    Object.entries(
      stats.categories || {}
    )
      .map(
        ([name, value]) => ({
          name,
          value: Number(value)
        })
      )
      .sort(
        (a, b) =>
          b.value - a.value
      );


  const sentiment =
    complaints.reduce(
      (result, complaint) => {

        const value =
          String(
            complaint.sentiment ||
            "NEUTRAL"
          ).toUpperCase();

        if (
          value.includes("POSITIVE")
        ) {

          result.Positive++;

        } else if (
          value.includes("NEGATIVE")
        ) {

          result.Negative++;

        } else {

          result.Neutral++;
        }

        return result;

      },
      {
        Positive: 0,
        Neutral: 0,
        Negative: 0
      }
    );


  const sentimentData = [
    {
      name: "Positive",
      value: sentiment.Positive,
      color: "#22c55e"
    },
    {
      name: "Neutral",
      value: sentiment.Neutral,
      color: "#3b82f6"
    },
    {
      name: "Negative",
      value: sentiment.Negative,
      color: "#ef4444"
    }
  ];


  const aiCoverage =
    total > 0
      ? Math.round(
          (
            complaints.filter(
              (item) =>
                item.category &&
                item.department &&
                item.priority
            ).length / total
          ) * 100
        )
      : 0;


  return (

    <div className="space-y-5">


      <PageHeader
        title="Analytics"
        description="Advanced insights into citizen grievances and civic performance."
        icon={TrendingUp}
        action={
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-[#0b1728] text-slate-300 hover:text-white hover:border-blue-500 transition"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        }
      />


      {/* KPI */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">

        <Stat
          title="Total Complaints"
          value={total}
          icon={FileText}
          color="blue"
        />

        <Stat
          title="Pending"
          value={pending}
          icon={Clock3}
          color="amber"
        />

        <Stat
          title="Resolved"
          value={resolved}
          icon={CheckCircle2}
          color="green"
        />

        <Stat
          title="High Priority"
          value={highPriority}
          icon={AlertTriangle}
          color="red"
        />

        <Stat
          title="Duplicates"
          value={duplicates}
          icon={Copy}
          color="purple"
        />

      </div>


      {/* PRIORITY / STATUS */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        <ChartCard
          title="Priority Distribution"
          subtitle="Severity of reported civic issues"
          icon={AlertTriangle}
        >

          <Donut
            data={priorityData}
          />

        </ChartCard>


        <ChartCard
          title="Complaint Status"
          subtitle="Current resolution pipeline"
          icon={Activity}
        >

          <Donut
            data={statusData}
          />

        </ChartCard>

      </div>


      {/* DEPARTMENT / CATEGORY */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        <ChartCard
          title="Department Workload"
          subtitle="AI-routed complaints"
          icon={Building2}
        >

          <HorizontalBars
            data={departments}
          />

        </ChartCard>


        <ChartCard
          title="Complaint Categories"
          subtitle="Distribution by civic issue"
          icon={FileText}
        >

          <HorizontalBars
            data={categories}
          />

        </ChartCard>

      </div>


      {/* SENTIMENT / AI */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        <ChartCard
          title="Citizen Sentiment"
          subtitle="Sentiment extracted from complaints"
          icon={Users}
        >

          <Donut
            data={sentimentData}
          />

        </ChartCard>


        <ChartCard
          title="AI Intelligence"
          subtitle="CivicAI processing pipeline"
          icon={Brain}
        >

          <div className="space-y-3">

            <Engine
              icon={Brain}
              title="AI Classification"
              value={`${aiCoverage}%`}
              progress={aiCoverage}
              color="blue"
            />

            <Engine
              icon={AlertTriangle}
              title="Priority Detection"
              value="ACTIVE"
              progress={100}
              color="amber"
            />

            <Engine
              icon={Building2}
              title="Department Routing"
              value="ACTIVE"
              progress={100}
              color="cyan"
            />

            <Engine
              icon={Copy}
              title="Duplicate Detection"
              value={`${duplicates}`}
              progress={
                total
                  ? Math.round(
                      (duplicates / total) * 100
                    )
                  : 0
              }
              color="purple"
            />

            <Engine
              icon={ShieldCheck}
              title="Resolution Recommendation"
              value="ACTIVE"
              progress={100}
              color="green"
            />

          </div>

        </ChartCard>

      </div>


      {/* SUMMARY */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Insight
          icon={AlertTriangle}
          title="Priority Attention"
          value={highPriority}
          text="high or critical complaints"
          color="red"
        />

        <Insight
          icon={Copy}
          title="Duplicate Issues"
          value={duplicates}
          text="similar complaints detected"
          color="purple"
        />

        <Insight
          icon={CheckCircle2}
          title="Resolution Rate"
          value={`${resolutionRate}%`}
          text="complaints resolved"
          color="green"
        />

      </div>

    </div>
  );
}


/* ========================================================= */

function PageHeader({
  title,
  description,
  icon: Icon,
  action
}) {

  return (

    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

      <div className="flex items-center gap-3">

        <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">

          <Icon
            size={22}
            className="text-blue-400"
          />

        </div>

        <div>

          <h1 className="text-2xl font-bold text-white">
            {title}
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            {description}
          </p>

        </div>

      </div>

      {action}

    </div>
  );
}


/* ========================================================= */

function Stat({
  title,
  value,
  icon: Icon,
  color
}) {

  const styles = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    green: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    red: "text-red-400 bg-red-500/10 border-red-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20"
  };

  return (

    <div
      className={`bg-[#0b1728] border rounded-2xl p-4 ${styles[color]}`}
    >

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs text-slate-400">
            {title}
          </p>

          <p className="text-2xl font-bold text-white mt-2">
            {value}
          </p>

        </div>

        <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center">

          <Icon size={19} />

        </div>

      </div>

    </div>
  );
}


/* ========================================================= */

function ChartCard({
  title,
  subtitle,
  icon: Icon,
  children
}) {

  return (

    <div className="bg-[#0b1728] border border-slate-800 rounded-2xl overflow-hidden">

      <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-3">

        <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">

          <Icon
            size={17}
            className="text-blue-400"
          />

        </div>

        <div>

          <h3 className="text-sm font-bold text-white">
            {title}
          </h3>

          <p className="text-xs text-slate-500 mt-0.5">
            {subtitle}
          </p>

        </div>

      </div>

      <div className="p-4">

        {children}

      </div>

    </div>
  );
}


/* ========================================================= */

function Donut({ data }) {

  const total =
    data.reduce(
      (sum, item) =>
        sum + item.value,
      0
    );

  if (!total) {

    return (
      <div className="h-[260px] flex items-center justify-center text-slate-600">
        No data available
      </div>
    );
  }


  return (

    <div className="h-[270px]">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="48%"
            innerRadius={55}
            outerRadius={88}
            paddingAngle={4}
            stroke="none"
          >

            {data.map(
              (entry, index) => (

                <Cell
                  key={index}
                  fill={entry.color}
                />

              )
            )}

          </Pie>

          <Tooltip
            contentStyle={{
              background: "#0b1728",
              border:
                "1px solid #334155",
              borderRadius: "10px",
              color: "#fff"
            }}
          />

          <Legend
            wrapperStyle={{
              color: "#cbd5e1",
              fontSize: "12px"
            }}
          />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}


/* ========================================================= */

function HorizontalBars({
  data
}) {

  if (!data.length) {

    return (
      <div className="h-[300px] flex items-center justify-center text-slate-600">
        No data available
      </div>
    );
  }


  return (

    <div className="h-[310px]">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 5,
            right: 25,
            left: 10,
            bottom: 5
          }}
        >

          <CartesianGrid
            stroke="#1e293b"
            horizontal={false}
          />

          <XAxis
            type="number"
            allowDecimals={false}
            stroke="#64748b"
          />

          <YAxis
            type="category"
            dataKey="name"
            width={145}
            tick={{
              fill: "#94a3b8",
              fontSize: 10
            }}
            stroke="#334155"
          />

          <Tooltip
            cursor={{
              fill: "#111f33"
            }}
            contentStyle={{
              background: "#0b1728",
              border:
                "1px solid #334155",
              borderRadius: "10px"
            }}
          />

          <Bar
            dataKey="value"
            radius={[
              0,
              6,
              6,
              0
            ]}
          >

            {data.map(
              (_, index) => (

                <Cell
                  key={index}
                  fill={
                    COLORS[
                      index %
                        COLORS.length
                    ]
                  }
                />

              )
            )}

          </Bar>

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}


/* ========================================================= */

function Engine({
  icon: Icon,
  title,
  value,
  progress,
  color
}) {

  const colors = {
    blue: "bg-blue-500",
    amber: "bg-amber-500",
    cyan: "bg-cyan-500",
    purple: "bg-purple-500",
    green: "bg-emerald-500"
  };


  return (

    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3">

      <div className="flex items-center gap-3">

        <Icon
          size={18}
          className="text-slate-400"
        />

        <div className="flex-1">

          <div className="flex justify-between">

            <span className="text-sm text-slate-300">
              {title}
            </span>

            <span className="text-xs font-semibold text-slate-400">
              {value}
            </span>

          </div>

          <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">

            <div
              className={`h-full rounded-full ${colors[color]}`}
              style={{
                width:
                  `${Math.min(
                    100,
                    Math.max(
                      0,
                      progress
                    )
                  )}%`
              }}
            />

          </div>

        </div>

      </div>

    </div>
  );
}


/* ========================================================= */

function Insight({
  icon: Icon,
  title,
  value,
  text,
  color
}) {

  const styles = {
    red: "text-red-400",
    purple: "text-purple-400",
    green: "text-emerald-400"
  };

  return (

    <div className="bg-[#0b1728] border border-slate-800 rounded-2xl p-5">

      <div className="flex items-center gap-3">

        <Icon
          size={19}
          className={styles[color]}
        />

        <span className="text-sm text-slate-300">
          {title}
        </span>

      </div>

      <p
        className={`text-3xl font-bold mt-4 ${styles[color]}`}
      >
        {value}
      </p>

      <p className="text-xs text-slate-500 mt-1">
        {text}
      </p>

    </div>
  );
}


export default Analytics;