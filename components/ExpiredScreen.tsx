"use client";

import { useState, useEffect } from "react";

export default function ExpiredScreen() {
  const [phase, setPhase] = useState<"visible" | "glitching" | "hidden">("visible");

  useEffect(() => {
    const glitchTimer = setTimeout(() => setPhase("glitching"), 2500);
    const hideTimer = setTimeout(() => setPhase("hidden"), 3500);
    return () => {
      clearTimeout(glitchTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f5f5f5] transition-all duration-700 ${
        phase === "glitching" ? "animate-glitch opacity-0 scale-105" : "opacity-100"
      }`}
    >
      {/* Skip button */}
      <button
        onClick={() => setPhase("hidden")}
        className="absolute top-4 right-4 text-xs text-gray-400 hover:text-gray-600 transition-colors"
      >
        Skip &rarr;
      </button>

      {/* Fake ATS header bar */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[#6C63FF] flex items-center justify-center">
            <span className="text-white text-xs font-bold">B</span>
          </div>
          <span className="text-sm font-semibold text-gray-700">breezy<span className="text-[#6C63FF]">hr</span></span>
        </div>
      </div>

      {/* 404 Content */}
      <div className="text-center px-6 max-w-md">
        <div className="text-8xl font-bold text-gray-200 mb-4">404</div>
        <h1 className="text-xl font-semibold text-gray-700 mb-3">
          This scheduling link has expired
        </h1>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          The interview booking link you&apos;re trying to access is no longer active.
          Please contact the sender for an updated link.
        </p>
        <div className="inline-flex items-center gap-2 text-xs text-gray-400 bg-gray-100 rounded-full px-4 py-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Link expired on March 4, 2026
        </div>
      </div>

      {/* Fake footer */}
      <div className="absolute bottom-6 text-xs text-gray-300">
        Powered by BreezyHR
      </div>
    </div>
  );
}
