import { useEffect } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import L from "leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";


/* =========================================================
   LEAFLET MARKER ICON
========================================================= */

const complaintIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,

  iconSize: [25, 41],

  iconAnchor: [12, 41],

  popupAnchor: [1, -34],

  shadowSize: [41, 41]
});


/* =========================================================
   MAP AUTO CENTER
========================================================= */

function MapUpdater({ complaints }) {

  const map =
    useMap();


  useEffect(() => {

    const validComplaints =
      complaints.filter(
        (complaint) => {

          const latitude =
            Number(
              complaint.latitude
            );

          const longitude =
            Number(
              complaint.longitude
            );

          return (
            Number.isFinite(latitude) &&
            Number.isFinite(longitude) &&
            latitude >= -90 &&
            latitude <= 90 &&
            longitude >= -180 &&
            longitude <= 180
          );

        }
      );


    console.log(
      "MAP RECEIVED COMPLAINTS:",
      complaints
    );

    console.log(
      "MAP VALID GPS COMPLAINTS:",
      validComplaints
    );


    if (
      validComplaints.length === 0
    ) {

      console.log(
        "MAP: No GPS coordinates available"
      );

      return;

    }


    const bounds =
      L.latLngBounds(
        validComplaints.map(
          (complaint) => [

            Number(
              complaint.latitude
            ),

            Number(
              complaint.longitude
            )

          ]
        )
      );


    console.log(
      "MAP MOVING TO:",
      bounds
    );


    map.fitBounds(
      bounds,
      {
        padding: [50, 50],

        maxZoom: 16,

        animate: true
      }
    );

  }, [
    complaints,
    map
  ]);


  return null;

}


/* =========================================================
   COMPLAINT MAP
========================================================= */

function ComplaintMap({
  complaints = []
}) {


  /* -------------------------------------------------------
     FILTER VALID GPS COMPLAINTS
  ------------------------------------------------------- */

  const mappedComplaints =
    complaints.filter(
      (complaint) => {

        const latitude =
          Number(
            complaint.latitude
          );

        const longitude =
          Number(
            complaint.longitude
          );

        return (
          Number.isFinite(latitude) &&
          Number.isFinite(longitude) &&
          latitude >= -90 &&
          latitude <= 90 &&
          longitude >= -180 &&
          longitude <= 180
        );

      }
    );


  console.log(
    "MAPPED COMPLAINTS:",
    mappedComplaints
  );


  /* -------------------------------------------------------
     MAP
  ------------------------------------------------------- */

  return (

    <div className="bg-[#0b1728] border border-[#2a405c] rounded-xl overflow-hidden">


      {/* ===================================================
          MAP HEADER
      =================================================== */}

      <div className="px-4 py-3 border-b border-[#21344b] flex items-center justify-between">

        <div>

          <h3 className="text-sm font-bold text-white">
            Civic Issue Hotspot Map
          </h3>

          <p className="text-[9px] text-slate-500 mt-1">
            Geographic distribution of reported civic issues
          </p>

        </div>


        <div className="text-[9px] text-slate-500">

          {mappedComplaints.length}

          {" "}

          mapped issue
          {mappedComplaints.length !== 1
            ? "s"
            : ""}

        </div>

      </div>


      {/* ===================================================
          LEAFLET MAP

          IMPORTANT:
          We intentionally use MapContainer.
          There is NO <Map> component here.
      =================================================== */}

      <MapContainer
        center={[
          18.5204,
          73.8567
        ]}
        zoom={12}
        scrollWheelZoom={true}
        style={{
          height: "450px",
          width: "100%"
        }}
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        {/* Automatically move map to complaint locations */}

        <MapUpdater
          complaints={complaints}
        />


        {/* Complaint markers */}

        {mappedComplaints.map(
          (complaint) => (

            <Marker
              key={complaint.id}
              position={[
                Number(
                  complaint.latitude
                ),
                Number(
                  complaint.longitude
                )
              ]}
              icon={complaintIcon}
            >

              <Popup>

                <div className="min-w-[230px]">

                  <h4 className="font-bold text-slate-900 mb-2">

                    {complaint.title}

                  </h4>


                  <p className="text-sm text-slate-700 mb-1">

                    <strong>
                      Category:
                    </strong>{" "}

                    {complaint.category ||
                      "General"}

                  </p>


                  <p className="text-sm text-slate-700 mb-1">

                    <strong>
                      Priority:
                    </strong>{" "}

                    {complaint.priority ||
                      "MEDIUM"}

                  </p>


                  <p className="text-sm text-slate-700 mb-1">

                    <strong>
                      Status:
                    </strong>{" "}

                    {complaint.status ||
                      "SUBMITTED"}

                  </p>


                  <p className="text-sm text-slate-700 mb-1">

                    <strong>
                      Department:
                    </strong>{" "}

                    {complaint.department ||
                      "Not assigned"}

                  </p>


                  <p className="text-sm text-slate-700 mb-1">

                    <strong>
                      Location:
                    </strong>{" "}

                    {complaint.location ||
                      "Not provided"}

                  </p>


                  <p className="text-xs text-slate-500 mt-2">

                    <strong>
                      Coordinates:
                    </strong>

                    <br />

                    {Number(
                      complaint.latitude
                    ).toFixed(6)}

                    {", "}

                    {Number(
                      complaint.longitude
                    ).toFixed(6)}

                  </p>

                </div>

              </Popup>

            </Marker>

          )
        )}

      </MapContainer>


      {/* ===================================================
          NO GPS MESSAGE
      =================================================== */}

      {mappedComplaints.length === 0 && (

        <div className="px-4 py-3 text-center border-t border-[#21344b]">

          <p className="text-[10px] text-slate-500">

            No GPS-based complaints found.

          </p>

          <p className="text-[9px] text-slate-600 mt-1">

            Complaints will appear here when location
            coordinates are available.

          </p>

        </div>

      )}

    </div>

  );

}


export default ComplaintMap;