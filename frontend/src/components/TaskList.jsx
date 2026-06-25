/**
 * TaskList — CampusFlow
 * Displays tasks created in this session (optimistic).
 * When teammates complete the Supabase integration, swap the `tasks`
 * prop with a data-fetched list from GET /tasks.
 */

import React from "react";

const URGENCY = (deadline) => {
  const diff = (new Date(deadline) - new Date()) / 86400000;
  if (diff <= 2) return { label: "Due soon", cls: "bg-red-100 text-red-700" };
  if (diff <= 7) return { label: "This week", cls: "bg-amber-100 text-amber-700" };
  return { label: "Upcoming", cls: "bg-emerald-100 text-emerald-700" };
};

export default function TaskList({ tasks = [] }) {
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
        <div className="text-4xl mb-3">📭</div>
        <p className="text-slate-500 text-sm">No tasks yet. Add one using the form.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-800 text-base">My Tasks</h3>
        <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      <ul className="divide-y divide-slate-50">
        {tasks.map((task, i) => {
          const urgency = URGENCY(task.deadline);
          return (
            <li key={i} className="px-5 py-4 flex items-start justify-between gap-3 hover:bg-slate-50 transition">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-base flex-shrink-0 mt-0.5">
                  📋
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{task.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{task.subject}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${urgency.cls}`}>
                  {urgency.label}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(task.deadline).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric"
                  })}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
