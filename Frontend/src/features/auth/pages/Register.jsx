import React, { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../hook/useAuth";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [formError, setFormError] = useState("");

  const { handleRegister, handleResendEmail } = useAuth();

  const submitForm = async (event) => {
    event.preventDefault();
    setStatus("");
    setFormError("");

    const payload = {
      username,
      email,
      password,
    };

    const result = await handleRegister(payload);
    if (result?.error) {
      setFormError(result.error);
      return;
    }

    setStatus("Account created successfully. Please check your email for confirmation.");
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8 flex items-center justify-center">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: "1s"}}></div>
      </div>

      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 mb-4 shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Perplexity
          </h1>
          <p className="text-white/60">Join the AI revolution</p>
        </div>

        {/* Register Card */}
        <div className="rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-white/60 text-sm mb-8">Set up your account to get started</p>

          <form onSubmit={submitForm} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-semibold text-white"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Choose a username"
                required
                className="w-full rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-purple-500/50 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-white"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-purple-500/50 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-white"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a password"
                required
                className="w-full rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-purple-500/50 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 font-semibold text-white transition hover:from-purple-500 hover:to-blue-500 active:scale-95 shadow-lg hover:shadow-purple-500/50"
            >
              Create Account
            </button>
          </form>

          {formError && (
            <p className="mt-4 text-center text-sm font-medium text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">
              {formError}
            </p>
          )}
          {status && (
            <p className="mt-4 text-center text-sm font-medium text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg p-3">
              {status}
            </p>
          )}

          <div className="mt-6 border-t border-white/10 pt-6">
            <p className="text-center text-sm text-white/70">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-purple-400 hover:text-purple-300 transition"
              >
                Sign In
              </Link>
            </p>
            <button
              type="button"
              onClick={async (event) => {
                event.preventDefault();
                setStatus("");
                setFormError("");

                if (!email || !username) {
                  setFormError("Enter username and email first to resend verification.");
                  return;
                }

                const result = await handleResendEmail({ email, username });
                if (result?.error) {
                  setFormError(result.error);
                } else {
                  setStatus("Verification email re-sent. Check your inbox.");
                }
              }}
              className="mt-3 w-full px-4 py-2 font-medium cursor-pointer text-blue-400 hover:text-blue-300 transition text-sm"
            >
              Resend Verification Email
            </button>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-white/40 text-xs mt-8">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </section>
  );
};

export default Register;
