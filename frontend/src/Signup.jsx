import { useState } from "react";
import { Brain, UserPlus } from "lucide-react";
import { signupUser } from "./api";

function Signup({ onSignup, onBackToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await signupUser(name, email, password);

      alert("Account created successfully. Please login.");
      onSignup();
    } catch (error) {
      console.error("SIGNUP ERROR:", error);

      if (error.response) {
        setError(
          error.response.data?.detail ||
            "Unable to create account."
        );
      } else if (error.request) {
        setError("Browser could not reach CivicAI API.");
      } else {
        setError(error.message || "Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex bg-blue-600 p-3 rounded-xl text-white mb-4">
            <Brain size={32} />
          </div>

          <h1 className="text-3xl font-bold text-white">
            CivicAI
          </h1>

          <p className="text-slate-400 mt-2">
            AI-powered Civic Intelligence
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl">

          <h2 className="text-2xl font-bold text-slate-900">
            Create Account
          </h2>

          <p className="text-slate-500 mt-1 mb-6">
            Register as a citizen to submit complaints.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a password"
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Confirm your password"
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <UserPlus size={19} />

              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-slate-500">
              Already have an account?
            </p>

            <button
              type="button"
              onClick={onBackToLogin}
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm mt-1"
            >
              Sign In
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Signup;