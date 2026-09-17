import {
  FileBarChart,
  Download,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Building2
} from "lucide-react";


function Reports({
  complaints = [],
  stats = {}
}) {

  const total =
    complaints.length;

  const resolved =
    complaints.filter(
      (item) =>
        item.status ===
        "RESOLVED"
    ).length;

  const highPriority =
    complaints.filter(
      (item) =>
        item.priority ===
          "HIGH" ||
        item.priority ===
          "CRITICAL"
    ).length;


  const generateCSV =
    () => {

      const headers = [
        "ID",
        "Title",
        "Category",
        "Subcategory",
        "Priority",
        "Priority Score",
        "Department",
        "Status",
        "Location",
        "Sentiment",
        "Cluster ID",
        "Similarity Score"
      ];


      const rows =
        complaints.map(
          (item) => [

            item.id,

            item.title,

            item.category,

            item.subcategory,

            item.priority,

            item.priority_score,

            item.department,

            item.status,

            item.location,

            item.sentiment,

            item.cluster_id,

            item.similarity_score

          ]
        );


      const csv = [
        headers,
        ...rows
      ]
        .map(
          (row) =>
            row
              .map(
                (value) =>
                  `"${String(
                    value ?? ""
                  ).replace(
                    /"/g,
                    '""'
                  )}"`
              )
              .join(",")
        )
        .join("\n");


      const blob =
        new Blob(
          [csv],
          {
            type:
              "text/csv;charset=utf-8;"
          }
        );


      const url =
        URL.createObjectURL(
          blob
        );


      const link =
        document.createElement(
          "a"
        );

      link.href = url;

      link.download =
        `civicai-report-${new Date()
          .toISOString()
          .slice(0, 10)}.csv`;

      link.click();

      URL.revokeObjectURL(
        url
      );
    };


  return (

    <div className="space-y-5">


      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">

            <FileBarChart
              size={22}
              className="text-cyan-400"
            />

          </div>

          <div>

            <h1 className="text-2xl font-bold text-white">
              Reports
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              Generate and export CivicAI grievance reports.
            </p>

          </div>

        </div>


        <button
          onClick={
            generateCSV
          }
          disabled={
            !complaints.length
          }
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white px-4 py-2.5 rounded-xl font-medium"
        >

          <Download
            size={17}
          />

          Export CSV

        </button>

      </div>


      {/* REPORT SUMMARY */}

      <div className="bg-[#0b1728] border border-slate-800 rounded-2xl p-6">

        <div className="flex items-center gap-3 mb-6">

          <FileText
            size={20}
            className="text-blue-400"
          />

          <div>

            <h2 className="font-bold text-white">
              CivicAI Grievance Report
            </h2>

            <p className="text-xs text-slate-500">
              Current system data
            </p>

          </div>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

          <ReportStat
            icon={FileText}
            label="Total"
            value={total}
          />

          <ReportStat
            icon={CheckCircle2}
            label="Resolved"
            value={resolved}
          />

          <ReportStat
            icon={AlertTriangle}
            label="High Priority"
            value={highPriority}
          />

          <ReportStat
            icon={Copy}
            label="Duplicates"
            value={
              stats.duplicate_complaints ||
              0
            }
          />

        </div>

      </div>


      {/* REPORT CONTENT */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">


        <ReportSection
          icon={Building2}
          title="Department Distribution"
        >

          {Object.entries(
            stats.departments || {}
          ).map(
            ([name, value]) => (

              <ReportRow
                key={name}
                label={name}
                value={value}
              />

            )
          )}

        </ReportSection>


        <ReportSection
          icon={FileText}
          title="Category Distribution"
        >

          {Object.entries(
            stats.categories || {}
          ).map(
            ([name, value]) => (

              <ReportRow
                key={name}
                label={name}
                value={value}
              />

            )
          )}

        </ReportSection>

      </div>


      <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5">

        <div className="flex items-start gap-3">

          <FileBarChart
            size={20}
            className="text-blue-400 mt-0.5"
          />

          <div>

            <h3 className="font-semibold text-white">
              Report contents
            </h3>

            <p className="text-sm text-slate-400 mt-1">
              The CSV export includes complaint identifiers,
              AI classification, priority scores, department
              routing, status, location, sentiment and
              duplicate-clustering information.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}


function ReportStat({
  icon: Icon,
  label,
  value
}) {

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">

      <Icon
        size={18}
        className="text-blue-400"
      />

      <p className="text-xs text-slate-500 mt-3">
        {label}
      </p>

      <p className="text-2xl font-bold text-white mt-1">
        {value}
      </p>

    </div>
  );
}


function ReportSection({
  icon: Icon,
  title,
  children
}) {

  return (

    <div className="bg-[#0b1728] border border-slate-800 rounded-2xl overflow-hidden">

      <div className="p-5 border-b border-slate-800 flex items-center gap-3">

        <Icon
          size={18}
          className="text-blue-400"
        />

        <h3 className="font-bold text-white">
          {title}
        </h3>

      </div>

      <div className="p-4 space-y-2">

        {children}

      </div>

    </div>
  );
}


function ReportRow({
  label,
  value
}) {

  return (

    <div className="flex items-center justify-between bg-slate-900 rounded-lg px-4 py-3">

      <span className="text-sm text-slate-300">
        {label}
      </span>

      <span className="text-sm font-bold text-white">
        {value}
      </span>

    </div>
  );
}


export default Reports;