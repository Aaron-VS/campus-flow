/**
 * DashboardStats — CampusFlow
 * Top-level summary cards. Data is passed as props from the Dashboard
 * so that teammates building the task/attendance modules can feed it in.
 */

import React from "react";

const CARDS = [
  {
    key: "totalTasks",
    label: "Total Tasks",
    icon: "📋",
    color: "from-indigo-500 to-indigo-600",
    default: 0,
  },
  {
    key: "dueSoon",
    label: "Due This Week",
    icon: "⏰",
    color: "from-amber-500 to-orange-500",
    default: 0,
  },
  {
    key: "atRiskSubjects",
    label: "At-Risk Subjects",
    icon: "🚨",
    color: "from-rose-500 to-pink-600",
    default: 0,
  },
  {
    key: "avgAttendance",
    label: "Avg Attendance",
    icon: "📊",
    color: "from-emerald-500 to-teal-600",
    suffix: "%",
    default: "--",
  },
];

export default function DashboardStats({ stats = {} }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map((card) => {
        const value = stats[card.key] ?? card.default;
        return (
          <div
            key={card.key}
            className={`bg-gradient-to-br ${card.color} rounded-2xl p-5 text-white shadow-sm`}
          >
            <div className="text-2xl mb-2">{card.icon}</div>
            <div className="text-3xl font-black leading-none">
              {value}{card.suffix || ""}
            </div>
            <div className="text-white/80 text-xs font-medium mt-1.5">{card.label}</div>
          </div>
        );
      })}
    </div>
  );
}
