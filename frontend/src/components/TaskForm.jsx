/**
 * TaskForm — CampusFlow
 * Submits to POST /task and optionally fetches a deadline plan via POST /deadline-plan.
 * Both API contracts are defined in the project spec and must not be changed.
 */

import React, { useState } from "react";
import { createTask, getDeadlinePlan } from "../api/campusflow";

const SUBJECTS = [
  "DBMS",
  "Operating Systems",
  "Computer Networks",
  "Data Structures",
  "Software Engineering",
  "Mathematics",
  "Other",
];

export default function TaskForm({ onTaskCreated }) {
  const [form, setForm] = useState({ title: "", subject: "", deadline: "" });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [planLoading, setPlanLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess("");
    setPlan(null);
  };

  const validate = () => {
    if (!form.title.trim()) return "Task title is required.";
    if (!form.subject) return "Please select a subject.";
    if (!form.deadline) return "Deadline is required.";
    if (form.deadline < today) return "Deadline cannot be in the past.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError("");
    try {
      await createTask(form);
      setSuccess("Task saved successfully!");
      onTaskCreated?.({ ...form });

      // Auto-fetch AI deadline plan after task is saved
      setPlanLoading(true);
      const result = await getDeadlinePlan({ title: form.title, deadline: form.deadline });
      setPlan(result.plan);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setPlanLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ title: "", subject: "", deadline: "" });
    setPlan(null);
    setError("");
    setSuccess("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📋</span>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">Add New Task</h2>
            <p className="text-indigo-200 text-xs mt-0.5">AI deadline plan generated automatically</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Task Title */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Task Title
          </label>
          <input
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. DBMS Assignment Chapter 4"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Subject
          </label>
          <select
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition bg-white"
          >
            <option value="">Select subject…</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Deadline
          </label>
          <input
            name="deadline"
            type="date"
            value={form.deadline}
            min={today}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
          />
        </div>

        {/* Feedback */}
        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            <span>⚠️</span> <span>{error}</span>
          </div>
        )}
        {success && !error && (
          <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3">
            <span>✅</span> <span>{success}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm py-2.5 px-5 rounded-xl transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Saving…
              </>
            ) : "Save Task"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition"
          >
            Clear
          </button>
        </div>
      </form>

      {/* AI Deadline Plan */}
      {(planLoading || plan) && (
        <div className="border-t border-slate-100 px-6 py-5 bg-slate-50">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🤖</span>
            <h3 className="text-sm font-bold text-slate-700">AI Deadline Plan</h3>
            {planLoading && (
              <svg className="animate-spin h-3.5 w-3.5 text-indigo-500 ml-1" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            )}
          </div>
          {plan && (
            <ol className="space-y-2">
              {plan.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
