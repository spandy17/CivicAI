import {
  useRef,
  useState
} from "react";

import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  ImagePlus,
  LocateFixed,
  MapPin,
  Send,
  Sparkles,
  Upload,
  X
} from "lucide-react";

import {
  createComplaint,
  extractComplaintText
} from "./api";


function SubmitComplaint({
  onSubmitted
}) {

  const [
    title,
    setTitle
  ] = useState("");

  const [
    description,
    setDescription
  ] = useState("");

  const [
    location,
    setLocation
  ] = useState("");

  const [
    latitude,
    setLatitude
  ] = useState(null);

  const [
    longitude,
    setLongitude
  ] = useState(null);

  const [
    image,
    setImage
  ] = useState(null);

  const [
    ocrLoading,
    setOcrLoading
  ] = useState(false);

  const [
    submitting,
    setSubmitting
  ] = useState(false);

  const [
    error,
    setError
  ] = useState("");

  const [
    success,
    setSuccess
  ] = useState(false);

  const fileInput =
    useRef(null);


  /* =======================================================
     IMAGE OCR
  ======================================================= */

  const handleImage =
    async (event) => {

      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      setImage(file);
      setError("");

      try {

        setOcrLoading(true);

        const token =
          localStorage.getItem(
            "civicai_token"
          );

        const result =
          await extractComplaintText(
            token,
            file
          );


        if (
          result?.text &&
          !result.text.startsWith(
            "No readable"
          )
        ) {

          setDescription(
            (previous) =>
              previous
                ? `${previous}\n\n${result.text}`
                : result.text
          );

        }

      } catch (error) {

        console.error(
          "OCR failed:",
          error
        );

        setError(
          "Image uploaded, but OCR could not extract text."
        );

      } finally {

        setOcrLoading(false);

      }

    };


  /* =======================================================
     GPS
  ======================================================= */

  const captureLocation =
    () => {

      setError("");

      if (
        !navigator.geolocation
      ) {

        setError(
          "Geolocation is not supported by this browser."
        );

        return;

      }


      navigator.geolocation.getCurrentPosition(

        (position) => {

          setLatitude(
            position.coords.latitude
          );

          setLongitude(
            position.coords.longitude
          );

        },

        () => {

          setError(
            "Unable to access your current location."
          );

        },

        {
          enableHighAccuracy:
            true,

          timeout:
            20000,

          maximumAge:
            0
        }

      );

    };


  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");
      setSuccess(false);


      if (
        !title.trim() ||
        !description.trim()
      ) {

        setError(
          "Please provide a complaint title and description."
        );

        return;

      }


      try {

        setSubmitting(true);

        const token =
          localStorage.getItem(
            "civicai_token"
          );


        await createComplaint(
          token,
          {
            title:
              title.trim(),

            description:
              description.trim(),

            location:
              location.trim() ||
              null,

            latitude,

            longitude
          }
        );


        setSuccess(true);

        setTitle("");
        setDescription("");
        setLocation("");
        setLatitude(null);
        setLongitude(null);
        setImage(null);


        setTimeout(() => {

          if (onSubmitted) {
            onSubmitted();
          }

        }, 1000);

      } catch (error) {

        console.error(
          "Complaint submission failed:",
          error
        );

        setError(
          error.response
            ?.data
            ?.detail ||
          "Failed to submit complaint."
        );

      } finally {

        setSubmitting(false);

      }

    };


  return (

    <div className="max-w-[1050px] mx-auto space-y-4">


      {/* HEADER */}

      <div className="rounded-xl border border-[#2a405c] bg-gradient-to-r from-[#0d1d31] to-[#0b1728] p-5">

        <div className="flex items-start gap-3">

          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">

            <Brain
              size={22}
              className="text-blue-400"
            />

          </div>

          <div>

            <h1 className="text-xl font-bold text-white">
              Submit Civic Complaint
            </h1>

            <p className="text-xs text-slate-500 mt-1">
              CivicAI will analyze, prioritize and route your complaint automatically.
            </p>

          </div>

        </div>

      </div>


      {/* SUCCESS */}

      {success && (

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center gap-3">

          <CheckCircle2
            size={20}
            className="text-emerald-400"
          />

          <div>

            <p className="text-sm font-semibold text-emerald-300">
              Complaint submitted successfully
            </p>

            <p className="text-[10px] text-emerald-400/70">
              CivicAI is processing your complaint.
            </p>

          </div>

        </div>

      )}


      {/* ERROR */}

      {error && (

        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-center gap-3">

          <AlertTriangle
            size={18}
            className="text-red-400"
          />

          <p className="text-xs text-red-300">
            {error}
          </p>

        </div>

      )}


      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-4"
      >


        {/* MAIN FORM */}

        <div className="rounded-xl border border-[#2a405c] bg-[#0b1728] overflow-hidden">


          <div className="px-5 py-4 border-b border-[#21344b]">

            <p className="text-sm font-bold text-white">
              Complaint Information
            </p>

            <p className="text-[9px] text-slate-600 mt-1">
              Provide enough detail for accurate AI analysis.
            </p>

          </div>


          <div className="p-5 space-y-4">


            {/* TITLE */}

            <div>

              <label className="text-[10px] font-semibold text-slate-400">
                Complaint Title
              </label>

              <input
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="Example: Street light not working"
                className="mt-1.5 w-full h-11 rounded-lg bg-[#07111f] border border-[#263b55] px-3 text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:border-blue-500/60"
                required
              />

            </div>


            {/* DESCRIPTION */}

            <div>

              <div className="flex items-center justify-between">

                <label className="text-[10px] font-semibold text-slate-400">
                  Complaint Description
                </label>

                <span className="text-[9px] text-slate-700">
                  AI Analysis Enabled
                </span>

              </div>

              <textarea
                value={
                  description
                }
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Describe the issue, its severity, and any useful details..."
                rows={7}
                className="mt-1.5 w-full rounded-lg bg-[#07111f] border border-[#263b55] px-3 py-3 text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:border-blue-500/60 resize-none"
                required
              />

            </div>


            {/* LOCATION */}

            <div>

              <div className="flex items-center justify-between">

                <label className="text-[10px] font-semibold text-slate-400">
                  Complaint Location
                </label>

                <span className="text-[9px] text-slate-600">
                  Can be different from your current location
                </span>

              </div>


              <div className="flex flex-col sm:flex-row gap-2 mt-1.5">

                <div className="relative flex-1">

                  <MapPin
                    size={15}
                    className="absolute left-3 top-3 text-slate-600"
                  />

                  <input
                    value={
                      location
                    }
                    onChange={(event) =>
                      setLocation(
                        event.target.value
                      )
                    }
                    placeholder="Example: Swargate, Pune"
                    className="w-full h-11 rounded-lg bg-[#07111f] border border-[#263b55] pl-9 pr-3 text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:border-blue-500/60"
                  />

                </div>


                <button
                  type="button"
                  onClick={
                    captureLocation
                  }
                  className="h-11 px-4 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs flex items-center justify-center gap-2 hover:bg-blue-500/15"
                >

                  <LocateFixed
                    size={15}
                  />

                  Use Current GPS

                </button>

              </div>


              {(latitude !== null &&
                longitude !== null) && (

                <div className="mt-2 flex items-center gap-2 text-[9px] text-emerald-400">

                  <CheckCircle2
                    size={12}
                  />

                  GPS captured:
                  {" "}
                  {latitude.toFixed(5)},
                  {" "}
                  {longitude.toFixed(5)}

                </div>

              )}

            </div>


            {/* IMAGE */}

            <div>

              <label className="text-[10px] font-semibold text-slate-400">
                Supporting Image
              </label>


              <input
                ref={
                  fileInput
                }
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={
                  handleImage
                }
                className="hidden"
              />


              {!image ? (

                <button
                  type="button"
                  onClick={() =>
                    fileInput.current?.click()
                  }
                  className="mt-1.5 w-full h-24 rounded-lg border border-dashed border-[#304762] bg-[#07111f] hover:bg-[#0d1b2d] flex flex-col items-center justify-center gap-2 transition"
                >

                  <ImagePlus
                    size={21}
                    className="text-slate-600"
                  />

                  <span className="text-[10px] text-slate-500">
                    Upload an image for OCR-assisted complaint entry
                  </span>

                </button>

              ) : (

                <div className="mt-1.5 rounded-lg border border-[#304762] bg-[#07111f] p-3 flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">

                      <Upload
                        size={16}
                        className="text-blue-400"
                      />

                    </div>

                    <div>

                      <p className="text-xs text-slate-300">
                        {image.name}
                      </p>

                      <p className="text-[9px] text-slate-600">
                        {ocrLoading
                          ? "Extracting text..."
                          : "Image processed"}
                      </p>

                    </div>

                  </div>


                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);

                      if (
                        fileInput.current
                      ) {
                        fileInput.current.value =
                          "";
                      }
                    }}
                    className="text-slate-600 hover:text-red-400"
                  >

                    <X
                      size={16}
                    />

                  </button>

                </div>

              )}

            </div>

          </div>

        </div>


        {/* AI PREVIEW */}

        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">

          <div className="flex items-center gap-2 mb-3">

            <Sparkles
              size={17}
              className="text-blue-400"
            />

            <p className="text-sm font-bold text-white">
              What CivicAI will do
            </p>

          </div>


          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">

            {[
              "Classify issue",
              "Score priority",
              "Route department",
              "Detect duplicates"
            ].map(
              (item) => (

                <div
                  key={item}
                  className="rounded-lg bg-[#07111f] border border-[#20344d] p-3"
                >

                  <CheckCircle2
                    size={14}
                    className="text-blue-400 mb-2"
                  />

                  <p className="text-[10px] text-slate-400">
                    {item}
                  </p>

                </div>

              )
            )}

          </div>

        </div>


        {/* SUBMIT */}

        <div className="flex justify-end">

          <button
            type="submit"
            disabled={
              submitting ||
              ocrLoading
            }
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-semibold shadow-lg shadow-blue-900/20 transition"
          >

            {submitting ? (

              <>

                <Brain
                  size={15}
                  className="animate-pulse"
                />

                Analyzing...

              </>

            ) : (

              <>

                <Send
                  size={15}
                />

                Submit Complaint

              </>

            )}

          </button>

        </div>

      </form>

    </div>

  );

}


export default SubmitComplaint;