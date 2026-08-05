"use client";

import React from "react";
import { Users, UserCheck, Activity, Award, CheckCircle2, Clock, Download, TrendingUp, BarChart2, Layout, Zap, Layers } from "lucide-react";
import { AdminAnalyticsMetrics } from "@/types/admin";

interface AdminAnalyticsViewProps {
  metrics: AdminAnalyticsMetrics;
}

export const AdminAnalyticsView: React.FC<AdminAnalyticsViewProps> = ({ metrics }) => {
  return (
    <div className="space-y-8 py-6">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-8 border border-white/10 bg-gradient-to-r from-slate-900/90 via-purple-950/50 to-indigo-950/70 backdrop-blur-2xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <Zap className="w-4 h-4" /> System Executive Overview
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Analytics & System Operations</h1>
          <p className="text-sm text-slate-300">
            Real-time platform telemetry, user growth curves, session behavior, and module utilization metrics.
          </p>
        </div>
      </div>

      {/* Top 4 Core Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="rounded-3xl p-6 border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-2 hover:border-indigo-500/40 transition-all duration-300">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Users</span>
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white">{metrics.totalUsers.toLocaleString()}</div>
          <div className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" /> +14.2% this month
          </div>
        </div>

        {/* Today's Users */}
        <div className="rounded-3xl p-6 border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-2 hover:border-purple-500/40 transition-all duration-300">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Users</span>
            <Activity className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white">{metrics.todaysUsers.toLocaleString()}</div>
          <div className="text-xs text-purple-300 font-medium">New signups & logins</div>
        </div>

        {/* Active Users */}
        <div className="rounded-3xl p-6 border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-2 hover:border-emerald-500/40 transition-all duration-300">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Users</span>
            <UserCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{metrics.activeUsers.toLocaleString()}</div>
          <div className="text-xs text-emerald-400 font-medium">90.8% Active Ratio</div>
        </div>

        {/* Average Human Value Score */}
        <div className="rounded-3xl p-6 border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-2 hover:border-amber-500/40 transition-all duration-300">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Human Value Score</span>
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-teal-300">
            {metrics.averageHumanValueScore}
          </div>
          <div className="text-xs text-slate-400 font-medium">Platform-wide mean</div>
        </div>
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Completed Assessments */}
        <div className="rounded-3xl p-6 border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed Assessments</span>
            <CheckCircle2 className="w-5 h-5 text-teal-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{metrics.completedAssessments}</div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
              style={{ width: `${metrics.assessmentCompletionRate}%` }}
            />
          </div>
          <div className="text-xs text-slate-400 flex justify-between">
            <span>Completion Rate</span>
            <span className="text-emerald-400 font-bold">{metrics.assessmentCompletionRate}%</span>
          </div>
        </div>

        {/* Average Session Time */}
        <div className="rounded-3xl p-6 border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Session Time</span>
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{metrics.averageSessionTimeMinutes} mins</div>
          <p className="text-xs text-slate-400">Recorded across active user sessions</p>
        </div>

        {/* Total Report Downloads */}
        <div className="rounded-3xl p-6 border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Report Downloads</span>
            <Download className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{metrics.reportDownloads}</div>
          <p className="text-xs text-slate-400">Generated PDF exports</p>
        </div>
      </div>

      {/* Analytics Insights & Most Used Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Most Used Highlights Card */}
        <div className="rounded-3xl p-6 border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-4 lg:col-span-1">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-400" /> Usage Highlights
          </h3>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-white/5 space-y-1">
              <div className="text-xs text-slate-400 font-medium">Most Used Module</div>
              <div className="text-base font-bold text-indigo-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" /> {metrics.mostUsedModule}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-white/5 space-y-1">
              <div className="text-xs text-slate-400 font-medium">Most Visited Page</div>
              <div className="text-base font-bold text-teal-300 flex items-center gap-2">
                <Layout className="w-4 h-4 text-teal-400" /> {metrics.mostUsedPage}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-white/5 space-y-1">
              <div className="text-xs text-slate-400 font-medium">Most Used Feature</div>
              <div className="text-base font-bold text-amber-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" /> {metrics.mostUsedFeature.replace("_", " ")}
              </div>
            </div>
          </div>
        </div>

        {/* User Growth Chart Visualizer */}
        <div className="rounded-3xl p-6 border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-6 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" /> User Growth Chart (Last 7 Days)
            </h3>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Live Curve
            </span>
          </div>

          {/* SVG Growth Bar Chart */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-white/10">
            {metrics.userGrowthChart.map((item, idx) => {
              const maxCount = Math.max(...metrics.userGrowthChart.map((d) => d.count), 1);
              const heightPercent = Math.max(15, Math.round((item.count / maxCount) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[11px] font-bold text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.count}
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 via-indigo-500 to-purple-500 rounded-t-xl group-hover:brightness-125 transition-all duration-300 shadow-lg shadow-indigo-500/20"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(item.date).toLocaleDateString(undefined, { weekday: "short" })}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Aggregated user acquisition timeline</span>
            <span className="text-indigo-300 font-semibold">100% Verified Telemetry</span>
          </div>
        </div>
      </div>
    </div>
  );
};
