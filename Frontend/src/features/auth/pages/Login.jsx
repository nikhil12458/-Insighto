import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  const { handleLogin } = useAuth();

  const navigate = useNavigate();

  const submitForm = async (event) => {
    event.preventDefault();

    const payload = {
      email,
      password,
    };

    await handleLogin(payload);
    navigate("/");
  };

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="min-h-screen w-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 px-3 py-6 xs:px-4 sm:px-6 md:px-8 lg:px-12 text-white flex items-center justify-center overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-10 xs:top-20 left-5 xs:left-10 w-48 xs:w-72 sm:w-96 h-48 xs:h-72 sm:h-96 bg-purple-600/20 xs:bg-purple-600/30 rounded-full blur-2xl xs:blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 xs:bottom-20 right-5 xs:right-10 w-48 xs:w-72 sm:w-96 h-48 xs:h-72 sm:h-96 bg-blue-600/20 xs:bg-blue-600/30 rounded-full blur-2xl xs:blur-3xl animate-pulse" style={{animationDelay: "1s"}}></div>
      </div>

      <div className="w-full max-w-xs xs:max-w-sm md:max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-6 xs:mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 mb-3 xs:mb-4 shadow-lg">
            <svg className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-1 xs:mb-2">
            Perplexity
          </h1>
          <p className="text-xs xs:text-sm text-white/60">Welcome back to the future</p>
        </div>

        {/* Login Card */}
        <div className="rounded-xl xs:rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 p-5 xs:p-6 sm:p-8 shadow-2xl">
          <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-white mb-1 xs:mb-2">Sign In</h2>
          <p className="text-xs xs:text-sm text-white/60 mb-6 xs:mb-8">Enter your email and password to continue</p>

          <form onSubmit={submitForm} className="space-y-4 xs:space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 xs:mb-2 block text-xs xs:text-sm font-semibold text-white"
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
                className="w-full rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm px-3 xs:px-4 py-2.5 xs:py-3 text-sm xs:text-base text-white outline-none transition placeholder:text-white/30 focus:border-purple-500/50 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 xs:mb-2 block text-xs xs:text-sm font-semibold text-white"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm px-3 xs:px-4 py-2.5 xs:py-3 text-sm xs:text-base text-white outline-none transition placeholder:text-white/30 focus:border-purple-500/50 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-3 xs:px-4 py-2.5 xs:py-3 text-sm xs:text-base font-semibold text-white transition hover:from-purple-500 hover:to-blue-500 active:scale-95 shadow-lg hover:shadow-purple-500/50"
            >
              Sign In
            </button>
          </form>

          <div className="mt-4 xs:mt-6 border-t border-white/10 pt-4 xs:pt-6">
            <p className="text-center text-xs xs:text-sm text-white/70">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-purple-400 hover:text-purple-300 transition"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-white/40 text-xs mt-4 xs:mt-6 px-2">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </section>
  );
};

export default Login;
