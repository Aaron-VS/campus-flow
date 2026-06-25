/**
 * AttendanceForm — CampusFlow
 * Submits to POST /attendance-risk
 * Returns { risk, classesNeeded, recommendation } per project API spec.
 */

import React, { useState } from "react";
import { getAttendanceRisk } from "../api/campusflow";

const SUBJECTS = [
  "DBMS",
  "Operating Systems",
  "Computer Networks",
  "Data Structures",
  "Software Engineering",
  "Mathematics",
  "Other",
];

const RISK_CONFIG = {
  High: {
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-700",
    icon: "🚨",
    bar: "bg-red-500",
  },
  Medium: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    icon: "⚠️",
    bar: "bg-amber-400",
  },
  Low: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    icon: "✅",
    bar: "bg-emerald-500",
  },
};

function AttendanceBar({ value }) {
  const pct = Math.min(100, Math.max(0, value));
  const color = pct >= 75 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-400" : "bg-red-500";
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-slate-500 mb-1">
        <span>0%</span>
        <span className="font-semibold text-slate-700">{pct}%</span>
        <span>100%</span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="relative mt-0.5">
        <div className="absolute left-[75%] w-px h-3 bg-slate-400 -top-2.5" />
        <span className="absolute left-[75%] -translate-x-1/2 text-[10px] text-slate-400 mt-0.5">75% min</span>
      </div>
    </div>
  );
}

export default function AttendanceForm() {
  const [form, setForm] = useState({ subject: "", attendance: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setResult(null);
  };

  const validate = () => {
    if (!form.subject) return "Please select a subject.";
    const pct = Number(form.attendance);
    if (!form.attendance || isNaN(pct)) return "Enter a valid attendance percentage.";
    if (pct < 0 || pct > 100) return "Attendance must be between 0 and 100.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError("");
    try {
      const data = await getAttendanceRisk({
        subject: form.subject,
        attendance: Number(form.attendance),
      });
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const cfg = result ? (RISK_CONFIG[result.risk] || RISK_CONFIG.High) : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📊</span>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">Attendance Risk Check</h2>
            <p className="text-rose-200 text-xs mt-0.5">Know your risk before it's too late</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Subject */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject</label>
          <select
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition bg-white"
          >
            <option value="">Select subject…</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Attendance % */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Current Attendance (%)
          </label>
          <input
            name="attendance"
            type="number"
            min="0"
            max="100"
            value={form.attendance}
            onChange={handleChange}
            placeholder="e.g. 72"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
          />
          {form.attendance !== "" && !isNaN(Number(form.attendance)) && (
            <AttendanceBar value={Number(form.attendance)} />
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            <span>⚠️</span> <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white font-semibold text-sm py-2.5 px-5 rounded-xl transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Analysing…
            </>
          ) : "Check Risk"}
        </button>
      </form>

      {/* Result */}
      {result && cfg && (
        <div className={`border-t border-slate-100 px-6 py-5 ${cfg.bg} ${cfg.border} border`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              {cfg.icon} Risk Analysis
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${cfg.badge}`}>
              {result.risk} Risk
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-xl p-3 text-center border border-slate-100">
              <div className="text-2xl font-black text-slate-800">{result.classesNeeded}</div>
              <div className="text-xs text-slate-500 mt-0.5">Classes needed</div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center border border-slate-100">
              <div className="text-2xl font-black text-slate-800">{form.attendance}%</div>
              <div className="text-xs text-slate-500 mt-0.5">Current attendance</div>
            </div>
          </div>

          <div className="bg-white rounded-xl px-4 py-3 border border-slate-100">
            <p className="text-xs font-semibold text-slate-500 mb-1">Recommendation</p>
            <p className="text-sm text-slate-700">{result.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
