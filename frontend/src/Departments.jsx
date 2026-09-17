import {
  Building2,
  AlertTriangle,
  Clock3,
  CheckCircle2,
  Search
} from "lucide-react";

import { useState } from "react";


function Departments({
  complaints = [],
  stats = {}
}) {

  const [
    selectedDepartment,
    setSelectedDepartment
  ] = useState(null);

  const [
    search,
    setSearch
  ] = useState("");


  const departmentNames =
    Object.keys(
      stats.departments || {}
    );


  const departments =
    departmentNames
      .map((name) => {

        const items =
          complaints.filter(
            (item) =>
              item.department ===
              name
          );

        return {

          name,

          total:
            items.length,

          pending:
            items.filter(
              (item) =>
                item.status !==
                "RESOLVED"
            ).length,

          resolved:
            items.filter(
              (item) =>
                item.status ===
                "RESOLVED"
            ).length,

          critical:
            items.filter(
              (item) =>
                item.priority ===
                  "CRITICAL" ||
                item.priority ===
                  "HIGH"
            ).length
        };
      })
      .filter(
        (item) =>
          !search.trim() ||
          item.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      )
      .sort(
        (a, b) =>
          b.total - a.total
      );


  const selectedComplaints =
    selectedDepartment
      ? complaints.filter(
          (item) =>
            item.department ===
            selectedDepartment
        )
      : [];


  return (

    <div className="space-y-5">


      <div>

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">

            <Building2
              size={22}
              className="text-purple-400"
            />

          </div>

          <div>

            <h1 className="text-2xl font-bold text-white">
              Departments
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              Monitor workload and complaint distribution across departments.
            </p>

          </div>

        </div>

      </div>


      {/* SEARCH */}

      <div className="bg-[#0b1728] border border-slate-800 rounded-2xl p-4">

        <div className="relative max-w-xl">

          <Search
            size={17}
            className="absolute left-3 top-3 text-slate-500"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search departments..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-blue-500"
          />

        </div>

      </div>


      {/* DEPARTMENT CARDS */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {departments.map(
          (department) => (

            <button
              key={
                department.name
              }
              onClick={() =>
                setSelectedDepartment(
                  department.name
                )
              }
              className="text-left bg-[#0b1728] border border-slate-800 hover:border-blue-500/50 rounded-2xl p-5 transition"
            >

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">

                    <Building2
                      size={18}
                      className="text-blue-400"
                    />

                  </div>

                  <div>

                    <h3 className="font-semibold text-white">
                      {department.name}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      Civic service department
                    </p>

                  </div>

                </div>

                <span className="text-2xl font-bold text-white">
                  {department.total}
                </span>

              </div>


              <div className="grid grid-cols-3 gap-3 mt-5">

                <MiniStat
                  icon={Clock3}
                  label="Pending"
                  value={
                    department.pending
                  }
                  color="amber"
                />

                <MiniStat
                  icon={CheckCircle2}
                  label="Resolved"
                  value={
                    department.resolved
                  }
                  color="green"
                />

                <MiniStat
                  icon={AlertTriangle}
                  label="High"
                  value={
                    department.critical
                  }
                  color="red"
                />

              </div>

            </button>

          )
        )}

      </div>


      {!departments.length && (

        <div className="bg-[#0b1728] border border-slate-800 rounded-2xl p-12 text-center text-slate-500">

          No department data available.

        </div>

      )}


      {/* SELECTED DEPARTMENT */}

      {selectedDepartment && (

        <div className="bg-[#0b1728] border border-slate-800 rounded-2xl overflow-hidden">

          <div className="p-5 border-b border-slate-800 flex items-center justify-between">

            <div>

              <h2 className="font-bold text-white">
                {selectedDepartment}
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Assigned complaints
              </p>

            </div>

            <button
              onClick={() =>
                setSelectedDepartment(
                  null
                )
              }
              className="text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>

          </div>


          <div className="divide-y divide-slate-800">

            {selectedComplaints.map(
              (complaint) => (

                <div
                  key={complaint.id}
                  className="p-4"
                >

                  <div className="flex items-center justify-between gap-4">

                    <div>

                      <p className="font-medium text-white">
                        #{complaint.id}{" "}
                        {complaint.title}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {complaint.location ||
                          "Location not provided"}
                      </p>

                    </div>

                    <span className="text-xs text-slate-400">
                      {complaint.status}
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      )}

    </div>
  );
}


function MiniStat({
  icon: Icon,
  label,
  value,
  color
}) {

  const styles = {
    amber: "text-amber-400",
    green: "text-emerald-400",
    red: "text-red-400"
  };


  return (

    <div className="bg-slate-900 rounded-xl p-3">

      <Icon
        size={15}
        className={styles[color]}
      />

      <p className="text-[11px] text-slate-500 mt-2">
        {label}
      </p>

      <p className="text-lg font-bold text-white">
        {value}
      </p>

    </div>
  );
}


export default Departments;