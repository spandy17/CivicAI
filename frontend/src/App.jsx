import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  LogOut,
  RefreshCw,
  Brain,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Copy,
  BarChart3,
  Map as MapIcon,
  Building2,
  FileBarChart,
  Settings as SettingsIcon,
  Users as UsersIcon,
  Sparkles,
  Menu,
  Search,
  Bell,
  ChevronDown,
  ArrowUpRight,
  Activity
} from "lucide-react";

import Login from "./Login";
import Complaints from "./Complaints";
import SubmitComplaint from "./SubmitComplaint";
import ComplaintMap from "./ComplaintMap";

import Analytics from "./Analytics";
import MapView from "./MapView";
import Departments from "./Departments";
import Reports from "./Reports";
import Users from "./Users";
import Settings from "./Settings";

import {
  getComplaintStats,
  getComplaints
} from "./api";


/* =========================================================
   CONSTANTS
========================================================= */

const PRIORITY_COLORS = {
  CRITICAL: "#ff4655",
  HIGH: "#ff9418",
  MEDIUM: "#2998ff",
  LOW: "#16d39a"
};

const STATUS_COLORS = {
  SUBMITTED: "#ffb21a",
  IN_PROGRESS: "#2998ff",
  RESOLVED: "#19d39a"
};

const BAR_COLORS = [
  "#ff4655",
  "#ff9418",
  "#ffb21a",
  "#2998ff",
  "#855cff",
  "#16d39a",
  "#ef4fa3",
  "#9aa8bb"
];


/* =========================================================
   APP
========================================================= */

function App() {

  const [isAuthenticated, setIsAuthenticated] =
    useState(
      Boolean(
        localStorage.getItem("civicai_token")
      )
    );

  const [user, setUser] = useState(() => {

    try {

      const storedUser =
        localStorage.getItem("civicai_user");

      return storedUser
        ? JSON.parse(storedUser)
        : null;

    } catch {

      return null;

    }

  });

  const [page, setPage] = useState(() => {

    const storedUser =
      localStorage.getItem("civicai_user");

    try {

      const parsedUser =
        storedUser
          ? JSON.parse(storedUser)
          : null;

      return parsedUser?.role === "admin"
        ? "dashboard"
        : "complaints";

    } catch {

      return "complaints";

    }

  });

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const [stats, setStats] =
    useState(null);

  const [complaints, setComplaints] =
    useState([]);

  const [loading, setLoading] =
    useState(false);


  const isAdmin =
    user?.role === "admin";


  /* =======================================================
     LOAD DASHBOARD DATA
  ======================================================= */

  const loadDashboard = async () => {

    const token =
      localStorage.getItem("civicai_token");

    if (!token) {
      return;
    }

    try {

      setLoading(true);

      if (isAdmin) {

        const [
          statsData,
          complaintsData
        ] = await Promise.all([

          getComplaintStats(token),

          getComplaints(token)

        ]);

        setStats(statsData);

        setComplaints(
          Array.isArray(complaintsData)
            ? complaintsData
            : []
        );

      } else {

        const complaintsData =
          await getComplaints(token);

        setComplaints(
          Array.isArray(complaintsData)
            ? complaintsData
            : []
        );

      }

    } catch (error) {

      console.error(
        "CivicAI dashboard error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  /* =======================================================
     INITIAL DATA LOAD
  ======================================================= */

  useEffect(() => {

    if (isAuthenticated) {
      loadDashboard();
    }

  }, [isAuthenticated, isAdmin]);


  /* =======================================================
     LOGIN
  ======================================================= */

  const handleLogin = () => {

    const storedUser =
      localStorage.getItem("civicai_user");

    try {

      const loggedUser =
        storedUser
          ? JSON.parse(storedUser)
          : null;

      setUser(loggedUser);

      setPage(
        loggedUser?.role === "admin"
          ? "dashboard"
          : "complaints"
      );

    } catch {

      setUser(null);
      setPage("complaints");

    }

    setIsAuthenticated(true);

  };


  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {

    localStorage.removeItem(
      "civicai_token"
    );

    localStorage.removeItem(
      "civicai_user"
    );

    setUser(null);
    setStats(null);
    setComplaints([]);
    setIsAuthenticated(false);
    setMobileMenu(false);

  };


  /* =======================================================
     LOGIN SCREEN
  ======================================================= */

  if (!isAuthenticated) {

    return (
      <Login
        onLogin={handleLogin}
      />
    );

  }


  /* =======================================================
     MAIN APPLICATION
  ======================================================= */

  return (

    <div className="min-h-screen bg-[#07111f] text-slate-100">


      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {mobileMenu && (

        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() =>
            setMobileMenu(false)
          }
        />

      )}


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`
          fixed left-0 top-0 bottom-0 z-50
          w-[220px]
          bg-[#0b1728]
          border-r border-[#22334a]
          flex flex-col
          transition-transform duration-300
          ${
            mobileMenu
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >

        {/* BRAND */}

        <div className="h-[72px] px-5 border-b border-[#22334a] flex items-center">

          <div className="flex items-center gap-3">

            <div className="relative">

              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/40">

                <Building2
                  size={22}
                  className="text-white"
                />

              </div>

              <span className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-blue-400 border-2 border-[#0b1728]" />

            </div>

            <div>

              <h1 className="text-[21px] font-bold tracking-tight text-white">

                Civic<span className="text-blue-400">
                  AI
                </span>

              </h1>

              <p className="text-[8px] text-slate-500 tracking-wide">
                SMARTER CITIES, HAPPIER CITIZENS
              </p>

            </div>

          </div>

        </div>


        {/* NAVIGATION */}

        <div className="flex-1 px-3 py-5 overflow-y-auto">

          <p className="px-3 mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
            Command Center
          </p>


          {isAdmin && (

            <SidebarButton
              active={page === "dashboard"}
              icon={<LayoutDashboard size={17} />}
              onClick={() => {
                setPage("dashboard");
                setMobileMenu(false);
              }}
            >
              Dashboard
            </SidebarButton>

          )}


          <SidebarButton
            active={page === "complaints"}
            icon={<FileText size={17} />}
            onClick={() => {
              setPage("complaints");
              setMobileMenu(false);
            }}
          >
            Complaints
          </SidebarButton>


          <SidebarButton
            active={page === "submit"}
            icon={<PlusCircle size={17} />}
            onClick={() => {
              setPage("submit");
              setMobileMenu(false);
            }}
          >
            Submit Complaint
          </SidebarButton>


          {isAdmin && (

            <div className="mt-6">

              <p className="px-3 mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                Intelligence
              </p>


              <SidebarButton
                active={page === "analytics"}
                icon={<BarChart3 size={17} />}
                onClick={() => {
                  setPage("analytics");
                  setMobileMenu(false);
                }}
              >
                Analytics
              </SidebarButton>


              <SidebarButton
                active={page === "map"}
                icon={<MapIcon size={17} />}
                onClick={() => {
                  setPage("map");
                  setMobileMenu(false);
                }}
              >
                Map View
              </SidebarButton>


              <SidebarButton
                active={page === "departments"}
                icon={<Building2 size={17} />}
                onClick={() => {
                  setPage("departments");
                  setMobileMenu(false);
                }}
              >
                Departments
              </SidebarButton>


              <SidebarButton
                active={page === "users"}
                icon={<UsersIcon size={17} />}
                onClick={() => {
                  setPage("users");
                  setMobileMenu(false);
                }}
              >
                Users
              </SidebarButton>


              <SidebarButton
                active={page === "reports"}
                icon={<FileBarChart size={17} />}
                onClick={() => {
                  setPage("reports");
                  setMobileMenu(false);
                }}
              >
                Reports
              </SidebarButton>


              <SidebarButton
                active={page === "settings"}
                icon={<SettingsIcon size={17} />}
                onClick={() => {
                  setPage("settings");
                  setMobileMenu(false);
                }}
              >
                Settings
              </SidebarButton>

            </div>

          )}

        </div>


        {/* BOTTOM STATUS */}

        <div className="p-3">

          <div className="rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-cyan-500/5 p-3">

            <div className="flex items-center gap-2">

              <div className="w-8 h-8 rounded-lg bg-emerald-400/10 flex items-center justify-center">

                <Sparkles
                  size={16}
                  className="text-emerald-400"
                />

              </div>

              <div>

                <p className="text-[10px] font-semibold text-slate-300">
                  Clean Cities
                </p>

                <p className="text-[10px] text-slate-500">
                  Bright Tomorrow
                </p>

              </div>

            </div>

          </div>


          <p className="text-center text-[9px] text-slate-700 mt-3">
            CivicAI v1.0.0
          </p>

        </div>

      </aside>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="md:ml-[220px] min-h-screen">


        {/* =================================================
            HEADER
        ================================================= */}

        <header className="h-[72px] border-b border-[#22334a] bg-[#0b1728]/95 backdrop-blur-xl sticky top-0 z-30">

          <div className="h-full px-4 sm:px-6 flex items-center justify-between">


            <div className="flex items-center gap-3">

              <button
                className="md:hidden w-9 h-9 rounded-lg border border-slate-700 flex items-center justify-center"
                onClick={() =>
                  setMobileMenu(true)
                }
              >

                <Menu size={18} />

              </button>


              <div>

                <h2 className="text-xl sm:text-[22px] font-bold text-white">

                  {getPageTitle(page)}

                </h2>

                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">

                  {getPageSubtitle(page)}

                </p>

              </div>

            </div>


            <div className="flex items-center gap-2 sm:gap-4">


              {/* SEARCH */}

              <div className="hidden lg:flex items-center w-[292px] h-10 rounded-xl border border-[#38506d] bg-[#0c192b] px-3">

                <Search
                  size={16}
                  className="text-slate-500"
                />

                <span className="ml-2 text-[11px] text-slate-500">
                  Search complaints, departments...
                </span>

              </div>


              {/* NOTIFICATION */}

              <button className="relative w-9 h-9 rounded-lg flex items-center justify-center hover:bg-slate-800 transition">

                <Bell
                  size={18}
                  className="text-slate-300"
                />

                <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full border border-[#0b1728]" />

              </button>


              {/* USER */}

              <div className="hidden sm:flex items-center gap-2">

                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">

                  {(user?.name || "A")
                    .charAt(0)
                    .toUpperCase()}

                </div>


                <div className="hidden lg:block">

                  <p className="text-[11px] font-semibold text-white">
                    {user?.name || "Admin"}
                  </p>

                  <p className="text-[9px] text-slate-500">
                    {isAdmin
                      ? "Municipal Administrator"
                      : "Citizen"}
                  </p>

                </div>


                <ChevronDown
                  size={14}
                  className="text-slate-500"
                />

              </div>


              {/* LOGOUT */}

              <button
                onClick={handleLogout}
                className="hidden sm:flex w-9 h-9 rounded-lg items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                title="Logout"
              >

                <LogOut size={16} />

              </button>

            </div>

          </div>

        </header>


        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="p-3 sm:p-4 lg:p-5">


          {/* DASHBOARD */}

          {page === "dashboard" && isAdmin && (

            <DashboardHome
              stats={stats}
              complaints={complaints}
              loading={loading}
              onRefresh={loadDashboard}
            />

          )}


          {/* COMPLAINTS */}

          {page === "complaints" && (

            <Complaints />

          )}


          {/* SUBMIT */}

          {page === "submit" && (

            <SubmitComplaint
              onSubmitted={() => {
                setPage("complaints");
                loadDashboard();
              }}
            />

          )}


          {/* ANALYTICS */}

          {page === "analytics" && isAdmin && (

            <Analytics
              complaints={complaints}
              stats={stats}
              onRefresh={loadDashboard}
            />

          )}


          {/* MAP */}

          {page === "map" && isAdmin && (

            <MapView
              complaints={complaints}
            />

          )}


          {/* DEPARTMENTS */}

          {page === "departments" && isAdmin && (

            <Departments
              complaints={complaints}
              stats={stats}
            />

          )}


          {/* REPORTS */}

          {page === "reports" && isAdmin && (

            <Reports
              complaints={complaints}
              stats={stats}
            />

          )}


          {/* USERS */}

          {page === "users" && isAdmin && (

            <Users />

          )}


          {/* SETTINGS */}

          {page === "settings" && isAdmin && (

            <Settings />

          )}

        </div>

      </main>

    </div>

  );

}


/* =========================================================
   DASHBOARD HOME
========================================================= */

function DashboardHome({
  stats,
  complaints,
  loading,
  onRefresh
}) {

  const total =
    stats?.total_complaints || 0;

  const pending =
    stats?.pending_complaints || 0;

  const resolved =
    stats?.resolved_complaints || 0;

  const highPriority =
    stats?.high_priority_complaints || 0;

  const duplicate =
    stats?.duplicate_complaints || 0;


  const priorityData = [

    {
      name: "Critical",
      value:
        stats?.priorities?.CRITICAL || 0
    },

    {
      name: "High",
      value:
        stats?.priorities?.HIGH || 0
    },

    {
      name: "Medium",
      value:
        stats?.priorities?.MEDIUM || 0
    },

    {
      name: "Low",
      value:
        stats?.priorities?.LOW || 0
    }

  ];


  const statusData = [

    {
      name: "In Progress",
      value:
        stats?.statuses?.IN_PROGRESS || 0
    },

    {
      name: "Resolved",
      value:
        stats?.statuses?.RESOLVED || 0
    },

    {
      name: "Submitted",
      value:
        stats?.statuses?.SUBMITTED || 0
    }

  ];


  const departments =
    Object.entries(
      stats?.departments || {}
    )
      .map(([name, value]) => ({
        name,
        value
      }))
      .sort(
        (a, b) =>
          b.value - a.value
      );


  const categories =
    Object.entries(
      stats?.categories || {}
    )
      .map(([name, value]) => ({
        name,
        value
      }))
      .sort(
        (a, b) =>
          b.value - a.value
      );


  const recentComplaints =
    [...complaints]
      .sort(
        (a, b) =>
          new Date(
            b.created_at || 0
          ) -
          new Date(
            a.created_at || 0
          )
      )
      .slice(0, 5);


  if (loading && !stats) {

    return (

      <div className="h-[70vh] flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">

            <Brain
              size={24}
              className="text-blue-400 animate-pulse"
            />

          </div>

          <p className="text-sm text-slate-400">
            Loading CivicAI command center...
          </p>

        </div>

      </div>

    );

  }


  return (

    <div className="max-w-[1500px] mx-auto space-y-4">


      {/* SYSTEM HEADER */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">

          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.7)]" />

          <span className="text-[9px] font-bold tracking-[0.18em] text-emerald-400">
            CIVICAI COMMAND CENTER
          </span>

        </div>


        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#304762] bg-[#0b1728] text-[10px] text-slate-400 hover:text-white hover:border-blue-500/40 transition"
        >

          <RefreshCw
            size={12}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh

        </button>

      </div>


      {/* KPI CARDS */}

      <div className="grid grid-cols-2 xl:grid-cols-5 gap-2.5">

        <KpiCard
          title="Total Complaints"
          value={total}
          icon={<FileText size={21} />}
          color="blue"
          trend="+25%"
          subtitle="vs last month"
        />

        <KpiCard
          title="Pending"
          value={pending}
          icon={<Clock3 size={21} />}
          color="amber"
          trend="+10%"
          subtitle="vs last month"
        />

        <KpiCard
          title="Resolved"
          value={resolved}
          icon={<CheckCircle2 size={21} />}
          color="green"
          trend="+0%"
          subtitle="vs last month"
        />

        <KpiCard
          title="High Priority"
          value={highPriority}
          icon={<AlertTriangle size={21} />}
          color="red"
          trend="+60%"
          subtitle="vs last month"
        />

        <KpiCard
          title="Duplicates"
          value={duplicate}
          icon={<Copy size={21} />}
          color="purple"
          trend="-20%"
          subtitle="vs last month"
        />

      </div>


      {/* PRIORITY + STATUS */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">

        <DashboardCard
          title="Priority Distribution"
          icon={<AlertTriangle size={17} />}
          action="This Month"
        >

          <PriorityChart
            data={priorityData}
            total={total}
          />

        </DashboardCard>


        <DashboardCard
          title="Complaint Status"
          icon={<Activity size={17} />}
          action="This Month"
        >

          <StatusChart
            data={statusData}
            total={total}
          />

        </DashboardCard>

      </div>


      {/* DEPARTMENT + CATEGORY */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">

        <DashboardCard
          title="Department Workload"
          subtitle="Complaints assigned to civic departments"
          icon={<ShieldCheck size={17} />}
          action="This Month"
        >

          <HorizontalBars
            data={departments}
            colors={BAR_COLORS}
          />

        </DashboardCard>


        <DashboardCard
          title="Complaint Categories"
          subtitle="Distribution by civic issue type"
          icon={<FileText size={17} />}
          action="This Month"
        >

          <HorizontalBars
            data={categories}
            colors={BAR_COLORS}
          />

        </DashboardCard>

      </div>


      {/* MAP + RECENT */}

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_1fr] gap-3">

        <DashboardCard
          title="Civic Issue Hotspot Map"
          icon={<MapIcon size={17} />}
          action="View Full Map"
        >

          <ComplaintMap
            complaints={complaints}
          />

        </DashboardCard>


        <RecentComplaints
          complaints={recentComplaints}
        />

      </div>


      {/* AI PIPELINE */}

      <DashboardCard
        title="CivicAI Intelligence Pipeline"
        icon={<Brain size={17} />}
        action="AI ENGINE ACTIVE"
      >

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">

          {[
            "Complaint",
            "AI Analysis",
            "Priority Score",
            "SLA Recommendation",
            "Department Routing",
            "Duplicate Detection",
            "Resolution Recommendation"
          ].map(
            (item, index) => (

              <div
                key={item}
                className="relative rounded-xl border border-[#233750] bg-[#0a1627] px-3 py-3 text-center"
              >

                <div className="w-7 h-7 mx-auto mb-2 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[9px] font-bold text-blue-400">
                  {index + 1}
                </div>

                <p className="text-[9px] text-slate-400 leading-tight">
                  {item}
                </p>

                {index < 6 && (

                  <span className="hidden lg:block absolute -right-2 top-1/2 text-slate-700">
                    →
                  </span>

                )}

              </div>

            )
          )}

        </div>

      </DashboardCard>

    </div>

  );

}


/* =========================================================
   KPI CARD
========================================================= */

function KpiCard({
  title,
  value,
  icon,
  color,
  trend,
  subtitle
}) {

  const styles = {

    blue: {
      border: "border-blue-500/40",
      icon: "bg-blue-500/20 text-blue-400",
      glow: "shadow-blue-900/10",
      trend: "text-emerald-400"
    },

    amber: {
      border: "border-amber-500/40",
      icon: "bg-amber-500/15 text-amber-400",
      glow: "shadow-amber-900/10",
      trend: "text-red-400"
    },

    green: {
      border: "border-emerald-500/40",
      icon: "bg-emerald-500/15 text-emerald-400",
      glow: "shadow-emerald-900/10",
      trend: "text-emerald-400"
    },

    red: {
      border: "border-red-500/40",
      icon: "bg-red-500/15 text-red-400",
      glow: "shadow-red-900/10",
      trend: "text-red-400"
    },

    purple: {
      border: "border-purple-500/40",
      icon: "bg-purple-500/15 text-purple-400",
      glow: "shadow-purple-900/10",
      trend: "text-emerald-400"
    }

  };


  const s =
    styles[color] ||
    styles.blue;


  return (

    <div
      className={`
        relative overflow-hidden
        rounded-xl border
        bg-[#0c192b]
        ${s.border}
        shadow-lg ${s.glow}
        p-3.5
      `}
    >

      <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white/[0.015]" />


      <div className="flex items-start justify-between">

        <div>

          <p className="text-[10px] text-slate-400 font-medium">
            {title}
          </p>

          <p className="text-2xl font-bold text-white mt-1">
            {value}
          </p>

        </div>


        <div
          className={`
            w-10 h-10 rounded-xl
            flex items-center justify-center
            ${s.icon}
          `}
        >

          {icon}

        </div>

      </div>


      <div className="flex items-center justify-between mt-2">

        <span
          className={`text-[10px] font-semibold ${s.trend}`}
        >

          {trend === "+0%"
            ? "↗"
            : trend.startsWith("-")
            ? "↘"
            : "↑"}

          {" "}

          {trend}

        </span>

        <span className="text-[9px] text-slate-600">
          {subtitle}
        </span>

      </div>

    </div>

  );

}


/* =========================================================
   DASHBOARD CARD
========================================================= */

function DashboardCard({
  title,
  subtitle,
  icon,
  action,
  children
}) {

  return (

    <section className="rounded-xl border border-[#2a405c] bg-[#0b1728] overflow-hidden">

      <div className="min-h-[55px] px-4 py-3 border-b border-[#21344b] flex items-center justify-between gap-3">

        <div>

          <div className="flex items-center gap-2">

            <span className="text-blue-400">
              {icon}
            </span>

            <h3 className="text-sm font-bold text-white">
              {title}
            </h3>

          </div>


          {subtitle && (

            <p className="text-[9px] text-slate-500 mt-1">
              {subtitle}
            </p>

          )}

        </div>


        {action && (

          <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#38506d] bg-[#0d1b2d] text-[10px] font-medium text-slate-300 hover:text-white hover:border-blue-400/50 transition">

            {action}

            {action !== "AI ENGINE ACTIVE" && (
              <ChevronDown size={12} />
            )}

          </button>

        )}

      </div>


      <div className="p-3">

        {children}

      </div>

    </section>

  );

}


/* =========================================================
   PRIORITY CHART
========================================================= */

function PriorityChart({
  data,
  total
}) {

  const segments = [];

  let current = 0;

  data.forEach((item) => {

    if (!item.value || !total) {
      return;
    }

    const start = current;

    const end =
      current +
      (item.value / total) *
        360;

    const color =
      PRIORITY_COLORS[
        item.name.toUpperCase()
      ];

    segments.push(
      `${color} ${start}deg ${end}deg`
    );

    current = end;

  });


  const background =
    total
      ? `conic-gradient(${segments.join(", ")})`
      : "conic-gradient(#18283d 0deg 360deg)";


  return (

    <div className="h-[225px] flex items-center justify-center gap-8">

      <div className="relative w-[145px] h-[145px] shrink-0">

        <div
          className="absolute inset-0 rounded-full"
          style={{
            background
          }}
        />

        <div className="absolute inset-[22px] rounded-full bg-[#0b1728] flex flex-col items-center justify-center">

          <span className="text-2xl font-bold text-white">
            {total}
          </span>

          <span className="text-[9px] text-slate-500">
            Total
          </span>

        </div>

      </div>


      <div className="space-y-3">

        {data.map((item) => {

          const percentage =
            total
              ? Math.round(
                  (item.value /
                    total) *
                    100
                )
              : 0;

          return (

            <div
              key={item.name}
              className="flex items-center gap-2 min-w-[150px]"
            >

              <span
                className="w-3 h-3 rounded-[3px]"
                style={{
                  background:
                    PRIORITY_COLORS[
                      item.name.toUpperCase()
                    ]
                }}
              />

              <span className="text-[10px] text-slate-400 flex-1">
                {item.name}
              </span>

              <span className="text-[10px] font-semibold text-slate-200">
                {item.value}
              </span>

              <span className="text-[9px] text-slate-600 w-8 text-right">
                {percentage}%
              </span>

            </div>

          );

        })}

      </div>

    </div>

  );

}


/* =========================================================
   STATUS CHART
========================================================= */

function StatusChart({
  data,
  total
}) {

  const submitted =
    data.find(
      (item) =>
        item.name === "Submitted"
    )?.value || 0;

  const inProgress =
    data.find(
      (item) =>
        item.name === "In Progress"
    )?.value || 0;

  const resolved =
    data.find(
      (item) =>
        item.name === "Resolved"
    )?.value || 0;


  const submittedAngle =
    total
      ? (submitted / total) *
        360
      : 0;

  const inProgressAngle =
    total
      ? (inProgress / total) *
        360
      : 0;


  return (

    <div className="h-[225px] flex items-center justify-center gap-8">

      <div className="relative w-[145px] h-[145px]">

        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: total
              ? `conic-gradient(
                  ${STATUS_COLORS.SUBMITTED} 0deg ${submittedAngle}deg,
                  ${STATUS_COLORS.IN_PROGRESS} ${submittedAngle}deg ${submittedAngle + inProgressAngle}deg,
                  ${STATUS_COLORS.RESOLVED} ${submittedAngle + inProgressAngle}deg 360deg
                )`
              : "#18283d"
          }}
        />

        <div className="absolute inset-[28px] rounded-full bg-[#0b1728] flex flex-col items-center justify-center">

          <span className="text-2xl font-bold text-white">
            {total}
          </span>

          <span className="text-[9px] text-slate-500">
            Total
          </span>

        </div>

      </div>


      <div className="space-y-4">

        {[
          {
            label: "In Progress",
            value: inProgress,
            color: STATUS_COLORS.IN_PROGRESS
          },
          {
            label: "Resolved",
            value: resolved,
            color: STATUS_COLORS.RESOLVED
          },
          {
            label: "Submitted",
            value: submitted,
            color: STATUS_COLORS.SUBMITTED
          }
        ].map((item) => (

          <div
            key={item.label}
            className="flex items-center gap-2 min-w-[145px]"
          >

            <span
              className="w-3 h-3 rounded-[3px]"
              style={{
                background:
                  item.color
              }}
            />

            <span className="text-[10px] text-slate-400 flex-1">
              {item.label}
            </span>

            <span className="text-[10px] font-semibold text-slate-200">
              {item.value}
            </span>

          </div>

        ))}

      </div>

    </div>

  );

}


/* =========================================================
   HORIZONTAL BARS
========================================================= */

function HorizontalBars({
  data,
  colors
}) {

  if (!data.length) {

    return (

      <div className="h-[235px] flex items-center justify-center">

        <div className="text-center">

          <BarChart3
            size={28}
            className="mx-auto text-slate-700 mb-2"
          />

          <p className="text-xs text-slate-600">
            No data available
          </p>

        </div>

      </div>

    );

  }


  const visibleData =
    data.slice(0, 8);

  const max =
    Math.max(
      ...visibleData.map(
        (item) =>
          Number(item.value) || 0
      ),
      1
    );


  return (

    <div className="space-y-2.5 py-1">

      {visibleData.map(
        (item, index) => {

          const value =
            Number(item.value) || 0;

          const width =
            Math.max(
              6,
              (value / max) *
                100
            );

          const barColor =
            colors[
              index %
                colors.length
            ];

          return (

            <div
              key={item.name}
              className="grid grid-cols-[145px_1fr_22px] sm:grid-cols-[155px_1fr_22px] items-center gap-2"
            >

              <div className="text-right">

                <span
                  className="text-[9px] sm:text-[10px] text-slate-300 line-clamp-2"
                  title={item.name}
                >
                  {item.name}
                </span>

              </div>


              <div className="h-[15px] rounded-full bg-[#17273b] overflow-hidden">

                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${width}%`,
                    background: barColor,
                    boxShadow:
                      `0 0 12px ${barColor}40`
                  }}
                />

              </div>


              <span className="text-[10px] font-bold text-slate-200">
                {value}
              </span>

            </div>

          );

        }
      )}

    </div>

  );

}


/* =========================================================
   RECENT COMPLAINTS
========================================================= */

function RecentComplaints({
  complaints
}) {

  return (

    <section className="rounded-xl border border-[#2a405c] bg-[#0b1728] overflow-hidden">

      <div className="min-h-[55px] px-4 py-3 border-b border-[#21344b] flex items-center justify-between">

        <div>

          <div className="flex items-center gap-2">

            <FileText
              size={17}
              className="text-blue-400"
            />

            <h3 className="text-sm font-bold text-white">
              Recent Complaints
            </h3>

          </div>

          <p className="text-[9px] text-slate-500 mt-1">
            Latest citizen reports
          </p>

        </div>


        <button className="px-2.5 py-1.5 rounded-lg border border-blue-500/50 text-[9px] text-blue-400 hover:bg-blue-500/10">
          View All
        </button>

      </div>


      <div className="overflow-x-auto">

        <table className="w-full min-w-[650px]">

          <thead>

            <tr className="bg-[#101f33] border-b border-[#243a54]">

              {[
                "ID",
                "Title",
                "Category",
                "Priority",
                "Status",
                "Location",
                "Date"
              ].map((heading) => (

                <th
                  key={heading}
                  className="px-3 py-2.5 text-left text-[9px] font-semibold text-slate-400"
                >
                  {heading}
                </th>

              ))}

            </tr>

          </thead>


          <tbody>

            {complaints.map(
              (complaint) => (

                <tr
                  key={complaint.id}
                  className="border-b border-[#1d3046] last:border-0 hover:bg-[#101f33] transition"
                >

                  <td className="px-3 py-2.5 text-[9px] font-bold text-slate-300">
                    #{complaint.id}
                  </td>

                  <td className="px-3 py-2.5">

                    <p className="max-w-[145px] truncate text-[9px] font-medium text-slate-200">
                      {complaint.title}
                    </p>

                  </td>

                  <td className="px-3 py-2.5">

                    <p className="max-w-[120px] truncate text-[9px] text-slate-400">
                      {complaint.category ||
                        "General"}
                    </p>

                  </td>

                  <td className="px-3 py-2.5">

                    <PriorityPill
                      priority={
                        complaint.priority
                      }
                    />

                  </td>

                  <td className="px-3 py-2.5">

                    <StatusPill
                      status={
                        complaint.status
                      }
                    />

                  </td>

                  <td className="px-3 py-2.5">

                    <p className="max-w-[100px] truncate text-[9px] text-slate-400">
                      {complaint.location ||
                        "—"}
                    </p>

                  </td>

                  <td className="px-3 py-2.5 text-[9px] text-slate-500">
                    {formatDate(
                      complaint.created_at
                    )}
                  </td>

                </tr>

              )
            )}


            {!complaints.length && (

              <tr>

                <td
                  colSpan="7"
                  className="py-12 text-center"
                >

                  <FileText
                    size={26}
                    className="mx-auto text-slate-700 mb-2"
                  />

                  <p className="text-xs text-slate-600">
                    No complaints found
                  </p>

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </section>

  );

}


/* =========================================================
   PRIORITY PILL
========================================================= */

function PriorityPill({
  priority
}) {

  const styles = {

    CRITICAL:
      "bg-red-500/20 text-red-300 border-red-500/30",

    HIGH:
      "bg-orange-500/20 text-orange-300 border-orange-500/30",

    MEDIUM:
      "bg-amber-500/20 text-amber-300 border-amber-500/30",

    LOW:
      "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"

  };


  return (

    <span
      className={`inline-flex px-2 py-1 rounded-md border text-[8px] font-bold ${
        styles[priority] ||
        "bg-slate-700 text-slate-300 border-slate-600"
      }`}
    >

      {priority || "MEDIUM"}

    </span>

  );

}


/* =========================================================
   STATUS PILL
========================================================= */

function StatusPill({
  status
}) {

  const styles = {

    SUBMITTED:
      "bg-purple-500/20 text-purple-300",

    IN_PROGRESS:
      "bg-blue-500/20 text-blue-300",

    RESOLVED:
      "bg-emerald-500/20 text-emerald-300"

  };


  return (

    <span
      className={`inline-flex px-2 py-1 rounded-md text-[8px] font-bold ${
        styles[status] ||
        "bg-slate-700 text-slate-300"
      }`}
    >

      {status === "IN_PROGRESS"
        ? "In Progress"
        : status || "Submitted"}

    </span>

  );

}


/* =========================================================
   SIDEBAR BUTTON
========================================================= */

function SidebarButton({
  active,
  icon,
  children,
  onClick,
  disabled
}) {

  return (

    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center gap-3
        px-3 py-2.5 mb-1
        rounded-lg
        text-left text-[12px]
        transition
        ${
          active
            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
            : disabled
            ? "text-slate-600 cursor-default"
            : "text-slate-400 hover:text-slate-200 hover:bg-[#122238]"
        }
      `}
    >

      <span
        className={
          active
            ? "text-white"
            : "text-slate-500"
        }
      >
        {icon}
      </span>

      <span>
        {children}
      </span>

      {active && (

        <ArrowUpRight
          size={12}
          className="ml-auto opacity-60"
        />

      )}

    </button>

  );

}


/* =========================================================
   PAGE TITLE
========================================================= */

function getPageTitle(page) {

  const titles = {

    dashboard: "Admin Dashboard",

    complaints: "Complaints",

    submit: "Submit Complaint",

    analytics: "Analytics",

    map: "Map View",

    departments: "Departments",

    users: "Users",

    reports: "Reports",

    settings: "Settings"

  };

  return titles[page] || "CivicAI";

}


/* =========================================================
   PAGE SUBTITLE
========================================================= */

function getPageSubtitle(page) {

  const subtitles = {

    dashboard:
      "Real-time insights into civic issues and department performance",

    complaints:
      "AI-analyzed citizen grievances",

    submit:
      "Report and track a civic issue",

    analytics:
      "AI-powered analysis of civic grievance patterns",

    map:
      "Geographic distribution of reported civic issues",

    departments:
      "Department workload and complaint distribution",

    users:
      "Manage CivicAI platform users",

    reports:
      "Generate and export civic intelligence reports",

    settings:
      "Monitor CivicAI platform services and configuration"

  };

  return (
    subtitles[page] ||
    "AI-powered Civic Intelligence"
  );

}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(date) {

  if (!date) {
    return "—";
  }

  const parsed =
    new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {

    return "—";

  }

  return parsed.toLocaleDateString(
    "en-IN",
    {
      month: "short",
      day: "numeric",
      year: "numeric"
    }
  );

}


export default App;