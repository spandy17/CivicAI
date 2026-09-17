import { useState } from "react";

import {
  Brain,
  LogIn,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff
} from "lucide-react";

import { loginUser } from "./api";


function Login({ onLogin }) {

  const [
    email,
    setEmail
  ] = useState("");

  const [
    password,
    setPassword
  ] = useState("");

  const [
    showPassword,
    setShowPassword
  ] = useState(false);

  const [
    error,
    setError
  ] = useState("");

  const [
    loading,
    setLoading
  ] = useState(false);


  /* =======================================================
     LOGIN
  ======================================================= */

  const handleLogin =
    async (event) => {

      event.preventDefault();

      setError("");
      setLoading(true);


      try {

        const data =
          await loginUser(
            email,
            password
          );


        console.log(
          "LOGIN RESPONSE:",
          data
        );


        /* ---------------------------------------------------
           SAVE AUTHENTICATION
        --------------------------------------------------- */

        localStorage.setItem(
          "civicai_token",
          data.access_token
        );

        localStorage.setItem(
          "civicai_user",
          JSON.stringify(
            data.user
          )
        );


        /* ---------------------------------------------------
           CONTINUE TO DASHBOARD
        --------------------------------------------------- */

        onLogin();


      } catch (error) {

        console.error(
          "FULL LOGIN ERROR:",
          error
        );


        if (
          error.response
        ) {

          console.error(
            "SERVER RESPONSE:",
            error.response.data
          );


          setError(
            error.response.data?.detail ||
            "Login request failed."
          );


        } else if (
          error.request
        ) {

          console.error(
            "REQUEST ERROR:",
            error.request
          );


          setError(
            "Unable to connect to CivicAI server. Make sure the backend is running."
          );


        } else {

          setError(
            error.message ||
            "Unexpected login error."
          );

        }

      } finally {

        setLoading(false);

      }

    };


  return (

    <div className="min-h-screen bg-[#07111f] relative overflow-hidden flex items-center justify-center px-4 py-8">


      {/* =================================================
          BACKGROUND GLOW
      ================================================= */}

      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      <div className="absolute -bottom-48 -right-40 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="relative z-10 w-full max-w-[560px]">


        {/* =================================================
            BRAND
        ================================================= */}

        <div className="text-center mb-7">


          <div className="inline-flex items-center justify-center w-[68px] h-[68px] rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl shadow-blue-900/30 mb-4">

            <Brain
              size={38}
              strokeWidth={2}
              className="text-white"
            />

          </div>


          <h1 className="text-[36px] leading-none font-bold tracking-tight text-white">

            Civic<span className="text-blue-400">AI</span>

          </h1>


          <p className="text-[15px] text-slate-400 mt-3">

            AI-powered Civic Intelligence

          </p>

        </div>


        {/* =================================================
            LOGIN CARD
        ================================================= */}

        <div className="bg-white rounded-[22px] shadow-2xl shadow-black/30 border border-white/10 p-7 sm:p-9">


          {/* HEADER */}

          <div className="mb-7">

            <h2 className="text-[28px] font-bold tracking-tight text-slate-900">

              Welcome back

            </h2>


            <p className="text-[15px] text-slate-500 mt-1.5">

              Sign in to access the command center.

            </p>

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

              <p className="text-sm font-medium text-red-600">

                {error}

              </p>

            </div>

          )}


          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={
              handleLogin
            }
            className="space-y-5"
          >


            {/* =================================================
                EMAIL
            ================================================= */}

            <div>

              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-800 mb-2"
              >

                Email

              </label>


              <div className="relative">


                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />


                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  className="
                    w-full
                    h-[54px]
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    pl-12
                    pr-4
                    text-[15px]
                    font-medium
                    text-slate-900
                    placeholder:text-slate-400
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-500/10
                  "
                />

              </div>

            </div>


            {/* =================================================
                PASSWORD
            ================================================= */}

            <div>

              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-800 mb-2"
              >

                Password

              </label>


              <div className="relative">


                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />


                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="
                    w-full
                    h-[54px]
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    pl-12
                    pr-12
                    text-[15px]
                    font-medium
                    text-slate-900
                    placeholder:text-slate-400
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-500/10
                  "
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    w-9
                    h-9
                    rounded-lg
                    flex
                    items-center
                    justify-center
                    text-slate-400
                    hover:text-slate-700
                    hover:bg-slate-100
                    transition
                  "
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showPassword ? (

                    <EyeOff
                      size={18}
                    />

                  ) : (

                    <Eye
                      size={18}
                    />

                  )}

                </button>

              </div>

            </div>


            {/* =================================================
                REMEMBER / FORGOT
            ================================================= */}

            <div className="flex items-center justify-between">


              <label className="flex items-center gap-2 cursor-pointer">

                <input
                  type="checkbox"
                  className="
                    w-4
                    h-4
                    rounded
                    border-slate-300
                    text-blue-600
                    focus:ring-blue-500
                  "
                />

                <span className="text-sm text-slate-600">

                  Remember me

                </span>

              </label>


              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
                onClick={() =>
                  setError(
                    "Password recovery is not implemented yet."
                  )
                }
              >

                Forgot password?

              </button>

            </div>


            {/* =================================================
                SIGN IN
            ================================================= */}

            <button
              type="submit"
              disabled={
                loading
              }
              className="
                w-full
                h-[54px]
                rounded-xl
                bg-blue-600
                hover:bg-blue-700
                active:bg-blue-800
                disabled:bg-blue-300
                text-white
                text-[15px]
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                shadow-lg
                shadow-blue-600/20
                transition
              "
            >

              {loading ? (

                <>

                  <Brain
                    size={19}
                    className="animate-pulse"
                  />

                  Signing in...

                </>

              ) : (

                <>

                  <LogIn
                    size={19}
                  />

                  Sign In

                </>

              )}

            </button>


          </form>


          {/* =================================================
              DIVIDER
          ================================================= */}

          <div className="flex items-center gap-4 my-7">

            <div className="h-px bg-slate-200 flex-1" />

            <span className="text-sm text-slate-400">
              OR
            </span>

            <div className="h-px bg-slate-200 flex-1" />

          </div>


          {/* =================================================
              SIGN UP
          ================================================= */}

          <div className="text-center">

            <span className="text-sm text-slate-500">

              Don't have an account?

            </span>


            <button
              type="button"
              className="ml-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
              onClick={() =>
                setError(
                  "Sign-up page can be connected next."
                )
              }
            >

              Sign up

            </button>

          </div>

        </div>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="text-center mt-6">

          <p className="text-xs text-slate-500">

            Cleaner Cities
            <span className="mx-2 text-slate-700">
              •
            </span>
            Safer Communities
            <span className="mx-2 text-slate-700">
              •
            </span>
            Smarter Governance

          </p>

        </div>

      </div>

    </div>

  );

}


export default Login;