import { useMemo, useState } from "react";

import {
  Map as MapIcon,
  Search,
  Filter,
  AlertTriangle,
  RefreshCw
} from "lucide-react";

import ComplaintMap from "./ComplaintMap";


function MapView({
  complaints = []
}) {

  const [
    search,
    setSearch
  ] = useState("");

  const [
    priority,
    setPriority
  ] = useState("ALL");

  const [
    department,
    setDepartment
  ] = useState("ALL");


  const departments =
    [
      ...new Set(
        complaints
          .map(
            (item) =>
              item.department
          )
          .filter(Boolean)
      )
    ]
      .sort();


  const filteredComplaints =
    useMemo(() => {

      return complaints.filter(
        (complaint) => {

          const matchesSearch =
            !search.trim() ||
            complaint.title
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            complaint.location
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            complaint.category
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              );


          const matchesPriority =
            priority === "ALL" ||
            complaint.priority ===
              priority;


          const matchesDepartment =
            department === "ALL" ||
            complaint.department ===
              department;


          return (
            matchesSearch &&
            matchesPriority &&
            matchesDepartment
          );
        }
      );

    }, [
      complaints,
      search,
      priority,
      department
    ]);


  const mapped =
    filteredComplaints.filter(
      (item) =>
        Number.isFinite(
          Number(item.latitude)
        ) &&
        Number.isFinite(
          Number(item.longitude)
        )
    );


  return (

    <div className="space-y-5">


      {/* HEADER */}

      <div>

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">

            <MapIcon
              size={22}
              className="text-cyan-400"
            />

          </div>

          <div>

            <h1 className="text-2xl font-bold text-white">
              Civic Issue Map
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              Geographic view of citizen-reported civic issues.
            </p>

          </div>

        </div>

      </div>


      {/* FILTERS */}

      <div className="bg-[#0b1728] border border-slate-800 rounded-2xl p-4">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">


          <div className="relative">

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
              placeholder="Search location, issue..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-blue-500"
            />

          </div>


          <select
            value={priority}
            onChange={(event) =>
              setPriority(
                event.target.value
              )
            }
            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-300 outline-none"
          >

            <option value="ALL">
              All Priorities
            </option>

            <option value="CRITICAL">
              Critical
            </option>

            <option value="HIGH">
              High
            </option>

            <option value="MEDIUM">
              Medium
            </option>

            <option value="LOW">
              Low
            </option>

          </select>


          <select
            value={department}
            onChange={(event) =>
              setDepartment(
                event.target.value
              )
            }
            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-300 outline-none"
          >

            <option value="ALL">
              All Departments
            </option>

            {departments.map(
              (item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>

              )
            )}

          </select>

        </div>

      </div>


      {/* MAP */}

      <div className="bg-[#0b1728] border border-slate-800 rounded-2xl overflow-hidden">

        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">

          <div>

            <h3 className="font-bold text-white">
              Geographic Distribution
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              {mapped.length} mapped issue
              {mapped.length !== 1
                ? "s"
                : ""}
            </p>

          </div>


          <div className="flex items-center gap-3 text-xs">

            <LegendDot
              color="bg-red-500"
              label="Critical"
            />

            <LegendDot
              color="bg-orange-500"
              label="High"
            />

            <LegendDot
              color="bg-blue-500"
              label="Medium"
            />

            <LegendDot
              color="bg-green-500"
              label="Low"
            />

          </div>

        </div>


        <ComplaintMap
          complaints={
            filteredComplaints
          }
        />

      </div>


      {/* SUMMARY */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

        <MapStat
          label="Total Issues"
          value={
            filteredComplaints.length
          }
        />

        <MapStat
          label="Mapped"
          value={mapped.length}
        />

        <MapStat
          label="Critical"
          value={
            filteredComplaints.filter(
              (item) =>
                item.priority ===
                "CRITICAL"
            ).length
          }
        />

        <MapStat
          label="High"
          value={
            filteredComplaints.filter(
              (item) =>
                item.priority ===
                "HIGH"
            ).length
          }
        />

      </div>

    </div>
  );
}


function LegendDot({
  color,
  label
}) {

  return (

    <span className="flex items-center gap-1.5 text-slate-400">

      <span
        className={`w-2.5 h-2.5 rounded-full ${color}`}
      />

      {label}

    </span>
  );
}


function MapStat({
  label,
  value
}) {

  return (

    <div className="bg-[#0b1728] border border-slate-800 rounded-xl p-4">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="text-xl font-bold text-white mt-1">
        {value}
      </p>

    </div>
  );
}


export default MapView;