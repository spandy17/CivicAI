import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Search,
  RefreshCw,
  CheckCircle2,
  Brain,
  X,
  Clock3,
  AlertCircle,
  Copy,
  MapPin,
  Building2,
  Sparkles,
  ShieldCheck
} from "lucide-react";

import {
  getComplaints,
  updateComplaintStatus
} from "./api";


/* =========================================================
   COMPLAINTS
========================================================= */

function Complaints() {

  const [
    complaints,
    setComplaints
  ] = useState([]);

  const [
    selectedComplaint,
    setSelectedComplaint
  ] = useState(null);

  const [
    search,
    setSearch
  ] = useState("");

  const [
    priorityFilter,
    setPriorityFilter
  ] = useState("ALL");

  const [
    statusFilter,
    setStatusFilter
  ] = useState("ALL");

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    updatingStatus,
    setUpdatingStatus
  ] = useState(false);

  const [
    statusMessage,
    setStatusMessage
  ] = useState("");


  /* -------------------------------------------------------
     LOAD
  ------------------------------------------------------- */

  const loadComplaints =
    async () => {

      try {

        setLoading(true);

        const token =
          localStorage.getItem(
            "civicai_token"
          );

        const data =
          await getComplaints(
            token
          );

        setComplaints(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        console.error(
          "Failed to load complaints:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


  useEffect(() => {

    loadComplaints();

  }, []);


  /* -------------------------------------------------------
     FILTER
  ------------------------------------------------------- */

  const filteredComplaints =
    useMemo(() => {

      let result =
        [...complaints];


      if (search.trim()) {

        const query =
          search
            .toLowerCase()
            .trim();

        result =
          result.filter(
            (complaint) =>

              complaint.title
                ?.toLowerCase()
                .includes(query) ||

              complaint.description
                ?.toLowerCase()
                .includes(query) ||

              complaint.category
                ?.toLowerCase()
                .includes(query) ||

              complaint.department
                ?.toLowerCase()
                .includes(query) ||

              complaint.location
                ?.toLowerCase()
                .includes(query)

          );

      }


      if (
        priorityFilter !==
        "ALL"
      ) {

        result =
          result.filter(
            (complaint) =>
              complaint.priority ===
              priorityFilter
          );

      }


      if (
        statusFilter !==
        "ALL"
      ) {

        result =
          result.filter(
            (complaint) =>
              complaint.status ===
              statusFilter
          );

      }


      return result;

    }, [
      complaints,
      search,
      priorityFilter,
      statusFilter
    ]);


  /* -------------------------------------------------------
     STATUS UPDATE
  ------------------------------------------------------- */

  const handleStatusChange =
    async (
      complaint,
      newStatus
    ) => {

      try {

        setUpdatingStatus(
          true
        );

        setStatusMessage("");

        const token =
          localStorage.getItem(
            "civicai_token"
          );

        await updateComplaintStatus(
          token,
          complaint.id,
          newStatus
        );


        setComplaints(
          (previous) =>
            previous.map(
              (item) =>
                item.id ===
                complaint.id
                  ? {
                      ...item,
                      status:
                        newStatus
                    }
                  : item
            )
        );


        setSelectedComplaint(
          (previous) =>
            previous
              ? {
                  ...previous,
                  status:
                    newStatus
                }
              : previous
        );


        setStatusMessage(
          "Status updated successfully."
        );

      } catch (error) {

        console.error(
          error
        );

        setStatusMessage(
          error.response
            ?.data
            ?.detail ||
            "Failed to update status."
        );

      } finally {

        setUpdatingStatus(
          false
        );

      }

    };


  return (

    <div className="max-w-[1500px] mx-auto space-y-4">


      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

        <div>

          <div className="flex items-center gap-2">

            <ShieldCheck
              size={20}
              className="text-blue-400"
            />

            <h1 className="text-xl font-bold text-white">
              Complaint Management
            </h1>

          </div>

          <p className="text-xs text-slate-500 mt-1">
            Review, analyze and manage citizen grievances.
          </p>

        </div>


        <button
          onClick={loadComplaints}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[#304762] bg-[#0b1728] text-xs text-slate-300 hover:text-white hover:border-blue-500/50"
        >

          <RefreshCw
            size={14}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh

        </button>

      </div>


      {/* FILTERS */}

      <div className="rounded-xl border border-[#2a405c] bg-[#0b1728] p-3">

        <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_180px] gap-2">


          <div className="relative">

            <Search
              size={15}
              className="absolute left-3 top-3 text-slate-600"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search complaints, locations, departments..."
              className="w-full h-10 bg-[#081423] border border-[#263b55] rounded-lg pl-9 pr-3 text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:border-blue-500/60"
            />

          </div>


          <select
            value={
              priorityFilter
            }
            onChange={(event) =>
              setPriorityFilter(
                event.target.value
              )
            }
            className="h-10 bg-[#081423] border border-[#263b55] rounded-lg px-3 text-xs text-slate-300 outline-none"
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
            value={
              statusFilter
            }
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="h-10 bg-[#081423] border border-[#263b55] rounded-lg px-3 text-xs text-slate-300 outline-none"
          >

            <option value="ALL">
              All Statuses
            </option>

            <option value="SUBMITTED">
              Submitted
            </option>

            <option value="IN_PROGRESS">
              In Progress
            </option>

            <option value="RESOLVED">
              Resolved
            </option>

          </select>

        </div>

      </div>


      {/* LIST */}

      <div className="rounded-xl border border-[#2a405c] bg-[#0b1728] overflow-hidden">

        <div className="px-4 py-3 border-b border-[#21344b] flex items-center justify-between">

          <div>

            <p className="text-sm font-bold text-white">
              All Complaints
            </p>

            <p className="text-[9px] text-slate-600 mt-1">
              {filteredComplaints.length} result
              {filteredComplaints.length !== 1
                ? "s"
                : ""}
            </p>

          </div>

          <div className="flex items-center gap-2">

            <span className="w-2 h-2 rounded-full bg-emerald-400" />

            <span className="text-[9px] text-emerald-400">
              LIVE DATA
            </span>

          </div>

        </div>


        {loading ? (

          <div className="py-16 text-center">

            <RefreshCw
              size={26}
              className="mx-auto text-blue-400 animate-spin mb-3"
            />

            <p className="text-xs text-slate-500">
              Loading complaints...
            </p>

          </div>

        ) : filteredComplaints.length === 0 ? (

          <div className="py-16 text-center">

            <Brain
              size={32}
              className="mx-auto text-slate-700 mb-3"
            />

            <p className="text-sm text-slate-500">
              No complaints found.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-[#1d3046]">

            {filteredComplaints.map(
              (complaint) => (

                <button
                  key={complaint.id}
                  onClick={() =>
                    setSelectedComplaint(
                      complaint
                    )
                  }
                  className="w-full text-left p-4 hover:bg-[#0f1d30] transition"
                >

                  <div className="flex items-start gap-4">

                    <div className="hidden sm:flex w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 items-center justify-center text-blue-400 text-[10px] font-bold shrink-0">

                      #{complaint.id}

                    </div>


                    <div className="flex-1 min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="text-sm font-semibold text-slate-200 truncate">
                          {complaint.title}
                        </h3>

                        <PriorityBadge
                          priority={
                            complaint.priority
                          }
                        />

                      </div>


                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                        {complaint.description}
                      </p>


                      <div className="flex flex-wrap gap-3 mt-3">

                        <Meta
                          icon={
                            <Building2
                              size={11}
                            />
                          }
                          value={
                            complaint.department ||
                            "Unassigned"
                          }
                        />

                        <Meta
                          icon={
                            <MapPin
                              size={11}
                            />
                          }
                          value={
                            complaint.location ||
                            "No location"
                          }
                        />

                        <StatusBadge
                          status={
                            complaint.status
                          }
                        />

                        {complaint.cluster_id && (

                          <Meta
                            icon={
                              <Copy
                                size={11}
                              />
                            }
                            value={
                              complaint.cluster_id
                            }
                          />

                        )}

                      </div>

                    </div>


                    <div className="hidden sm:block text-right shrink-0">

                      <p className="text-[9px] text-slate-600">
                        AI SCORE
                      </p>

                      <p className="text-lg font-bold text-blue-400">
                        {complaint.priority_score ??
                          0}
                      </p>

                    </div>

                  </div>

                </button>

              )
            )}

          </div>

        )}

      </div>


      {/* DETAILS */}

      {selectedComplaint && (

        <ComplaintDetails
          complaint={
            selectedComplaint
          }
          onClose={() =>
            setSelectedComplaint(
              null
            )
          }
          onStatusChange={
            handleStatusChange
          }
          updatingStatus={
            updatingStatus
          }
          statusMessage={
            statusMessage
          }
        />

      )}

    </div>

  );

}


/* =========================================================
   META
========================================================= */

function Meta({
  icon,
  value
}) {

  return (

    <span className="flex items-center gap-1.5 text-[9px] text-slate-500">

      <span className="text-slate-600">
        {icon}
      </span>

      {value}

    </span>

  );

}


/* =========================================================
   PRIORITY
========================================================= */

function PriorityBadge({
  priority
}) {

  const styles = {

    CRITICAL:
      "bg-red-500/15 text-red-400 border-red-500/25",

    HIGH:
      "bg-orange-500/15 text-orange-400 border-orange-500/25",

    MEDIUM:
      "bg-amber-500/15 text-amber-400 border-amber-500/25",

    LOW:
      "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"

  };

  return (

    <span
      className={`px-2 py-1 rounded-md border text-[8px] font-bold ${
        styles[priority] ||
        "bg-slate-800 text-slate-400 border-slate-700"
      }`}
    >

      {priority || "MEDIUM"}

    </span>

  );

}


/* =========================================================
   STATUS
========================================================= */

function StatusBadge({
  status
}) {

  const styles = {

    SUBMITTED:
      "bg-purple-500/15 text-purple-400",

    IN_PROGRESS:
      "bg-blue-500/15 text-blue-400",

    RESOLVED:
      "bg-emerald-500/15 text-emerald-400"

  };


  return (

    <span
      className={`px-2 py-1 rounded-md text-[8px] font-bold ${
        styles[status] ||
        "bg-slate-800 text-slate-500"
      }`}
    >

      {status === "IN_PROGRESS"
        ? "IN PROGRESS"
        : status || "SUBMITTED"}

    </span>

  );

}


/* =========================================================
   DETAILS MODAL
========================================================= */

function ComplaintDetails({
  complaint,
  onClose,
  onStatusChange,
  updatingStatus,
  statusMessage
}) {

  const hasDuplicate =
    Number(
      complaint.similarity_score
    ) >= 0.45;


  return (

    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">

      <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#0b1728] border border-[#304762] rounded-2xl shadow-2xl">


        {/* HEADER */}

        <div className="sticky top-0 z-10 bg-[#0b1728]/95 backdrop-blur border-b border-[#243a54] px-5 py-4 flex items-center justify-between">

          <div>

            <p className="text-[9px] text-slate-600">
              COMPLAINT #{complaint.id}
            </p>

            <h2 className="text-lg font-bold text-white mt-1">
              {complaint.title}
            </h2>

          </div>


          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >

            <X size={17} />

          </button>

        </div>


        <div className="p-5 space-y-4">


          {/* STATUS */}

          <div className="rounded-xl bg-[#07111f] border border-[#233750] p-4">

            <div className="flex items-center gap-2 mb-3">

              <Clock3
                size={16}
                className="text-blue-400"
              />

              <p className="text-sm font-bold text-white">
                Complaint Status
              </p>

            </div>


            <select
              value={
                complaint.status
              }
              disabled={
                updatingStatus
              }
              onChange={(event) =>
                onStatusChange(
                  complaint,
                  event.target.value
                )
              }
              className="w-full sm:w-auto bg-[#0b1728] border border-[#304762] rounded-lg px-3 py-2 text-xs text-white outline-none"
            >

              <option value="SUBMITTED">
                Submitted
              </option>

              <option value="IN_PROGRESS">
                In Progress
              </option>

              <option value="RESOLVED">
                Resolved
              </option>

            </select>


            {statusMessage && (

              <div className="mt-3 text-xs text-emerald-400">
                {statusMessage}
              </div>

            )}

          </div>


          {/* AI ANALYSIS */}

          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">

            <div className="flex items-center gap-2 mb-2">

              <Brain
                size={17}
                className="text-blue-400"
              />

              <p className="text-sm font-bold text-white">
                AI Analysis
              </p>

            </div>

            <p className="text-xs leading-relaxed text-slate-400">
              {complaint.ai_summary ||
                "No AI summary available."}
            </p>

          </div>


          {/* INFO */}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">

            <InfoBox
              label="Category"
              value={
                complaint.category ||
                "Unclassified"
              }
            />

            <InfoBox
              label="Subcategory"
              value={
                complaint.subcategory ||
                "Not specified"
              }
            />

            <InfoBox
              label="Department"
              value={
                complaint.department ||
                "Unassigned"
              }
            />

            <InfoBox
              label="Location"
              value={
                complaint.location ||
                "Not provided"
              }
            />

            <InfoBox
              label="Priority"
              value={`${complaint.priority} • ${complaint.priority_score}/100`}
            />

            <InfoBox
              label="Sentiment"
              value={
                complaint.sentiment ||
                "Unknown"
              }
            />

          </div>


          {/* DESCRIPTION */}

          <div className="rounded-xl bg-[#07111f] border border-[#233750] p-4">

            <p className="text-[9px] uppercase tracking-wider text-slate-600 font-bold mb-2">
              Citizen Complaint
            </p>

            <p className="text-xs leading-relaxed text-slate-400">
              {complaint.description}
            </p>

          </div>


          {/* ACTION */}

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">

            <div className="flex items-center gap-2 mb-2">

              <CheckCircle2
                size={17}
                className="text-emerald-400"
              />

              <p className="text-sm font-bold text-white">
                Recommended Action
              </p>

            </div>

            <p className="text-xs leading-relaxed text-slate-400">
              {complaint.recommended_action ||
                "No recommendation available."}
            </p>

          </div>


          {/* DUPLICATE */}

          <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">

            <div className="flex items-center gap-2 mb-3">

              <Copy
                size={17}
                className="text-purple-400"
              />

              <p className="text-sm font-bold text-white">
                Complaint Intelligence
              </p>

            </div>


            {hasDuplicate ? (

              <div>

                <p className="text-xs text-purple-300 font-semibold">
                  Similar complaint detected
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  CivicAI detected similar content
                  and associated this complaint
                  with an issue cluster.
                </p>

                <div className="mt-3">

                  <div className="flex justify-between text-[10px] mb-1">

                    <span className="text-slate-500">
                      Similarity
                    </span>

                    <span className="text-purple-400 font-bold">
                      {(
                        complaint.similarity_score *
                        100
                      ).toFixed(1)}
                      %
                    </span>

                  </div>

                  <div className="h-1.5 rounded-full bg-purple-500/10 overflow-hidden">

                    <div
                      className="h-full rounded-full bg-purple-500"
                      style={{
                        width:
                          `${Math.min(
                            complaint.similarity_score *
                              100,
                            100
                          )}%`
                      }}
                    />

                  </div>

                </div>

              </div>

            ) : (

              <p className="text-xs text-emerald-400">
                No significant duplicate detected.
              </p>

            )}

          </div>

        </div>

      </div>

    </div>

  );

}


/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({
  label,
  value
}) {

  return (

    <div className="rounded-lg bg-[#07111f] border border-[#1e3148] p-3">

      <p className="text-[8px] uppercase tracking-wider text-slate-600 font-bold">
        {label}
      </p>

      <p className="text-[10px] font-semibold text-slate-300 mt-1 truncate">
        {value}
      </p>

    </div>

  );

}


export default Complaints;