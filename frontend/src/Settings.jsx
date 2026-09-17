import {
  Settings as SettingsIcon,
  Brain,
  ScanText,
  Copy,
  ShieldCheck,
  Database,
  CheckCircle2,
  RefreshCw
} from "lucide-react";

import {
  useEffect,
  useState
} from "react";

import {
  getHealth,
  getDatabaseHealth
} from "./api";


function Settings() {

  const [
    health,
    setHealth
  ] = useState(null);

  const [
    database,
    setDatabase
  ] = useState(null);

  const [
    loading,
    setLoading
  ] = useState(true);


  const loadHealth =
    async () => {

      try {

        setLoading(true);

        const [
          api,
          db
        ] = await Promise.all([
          getHealth(),
          getDatabaseHealth()
        ]);

        setHealth(api);
        setDatabase(db);

      } catch (error) {

        console.error(
          "Health check failed:",
          error
        );

      } finally {

        setLoading(false);

      }
    };


  useEffect(() => {

    loadHealth();

  }, []);


  return (

    <div className="space-y-5">


      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-slate-500/10 border border-slate-700 flex items-center justify-center">

            <SettingsIcon
              size={22}
              className="text-slate-300"
            />

          </div>

          <div>

            <h1 className="text-2xl font-bold text-white">
              Settings
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              CivicAI system configuration and service status.
            </p>

          </div>

        </div>


        <button
          onClick={loadHealth}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-[#0b1728] text-slate-300 hover:text-white"
        >

          <RefreshCw
            size={16}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh

        </button>

      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


        <ServiceCard
          icon={Brain}
          title="Gemini AI Engine"
          description="Complaint classification, prioritization and recommendation."
          status="Active"
          active
        />


        <ServiceCard
          icon={ScanText}
          title="OCR Engine"
          description="Tesseract-based extraction from complaint images."
          status="Active"
          active
        />


        <ServiceCard
          icon={Copy}
          title="Duplicate Detection"
          description="TF-IDF vectorization and cosine similarity."
          status="Active"
          active
        />


        <ServiceCard
          icon={ShieldCheck}
          title="JWT Authentication"
          description="Token-based user and administrator access control."
          status="Active"
          active
        />


        <ServiceCard
          icon={Database}
          title="Database"
          description="SQLite + SQLAlchemy persistence layer."
          status={
            database?.database ===
            "connected"
              ? "Connected"
              : "Unavailable"
          }
          active={
            database?.database ===
            "connected"
          }
        />


        <ServiceCard
          icon={ShieldCheck}
          title="API Server"
          description="FastAPI backend service."
          status={
            health?.status ===
            "healthy"
              ? "Healthy"
              : "Unavailable"
          }
          active={
            health?.status ===
            "healthy"
          }
        />

      </div>


      <div className="bg-[#0b1728] border border-slate-800 rounded-2xl p-6">

        <h2 className="font-bold text-white">
          System Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

          <Info
            label="Platform"
            value="CivicAI"
          />

          <Info
            label="Backend"
            value="FastAPI"
          />

          <Info
            label="Database"
            value="SQLite + SQLAlchemy"
          />

          <Info
            label="AI"
            value="Gemini"
          />

          <Info
            label="OCR"
            value="Tesseract"
          />

          <Info
            label="Similarity"
            value="TF-IDF + Cosine Similarity"
          />

        </div>

      </div>

    </div>
  );
}


function ServiceCard({
  icon: Icon,
  title,
  description,
  status,
  active
}) {

  return (

    <div className="bg-[#0b1728] border border-slate-800 rounded-2xl p-5">

      <div className="flex items-start gap-4">

        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">

          <Icon
            size={19}
            className="text-blue-400"
          />

        </div>

        <div className="flex-1">

          <div className="flex items-center justify-between gap-3">

            <h3 className="font-semibold text-white">
              {title}
            </h3>

            <span
              className={
                active
                  ? "text-xs font-semibold text-emerald-400"
                  : "text-xs font-semibold text-red-400"
              }
            >

              ● {status}

            </span>

          </div>

          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            {description}
          </p>

        </div>

      </div>

    </div>
  );
}


function Info({
  label,
  value
}) {

  return (

    <div className="bg-slate-900 rounded-xl p-4">

      <p className="text-[11px] uppercase tracking-wide text-slate-600">
        {label}
      </p>

      <p className="text-sm font-semibold text-slate-300 mt-1">
        {value}
      </p>

    </div>
  );
}


export default Settings;