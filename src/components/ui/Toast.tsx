"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export interface ToastProps {
  show: boolean;
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ show, message, type = "success", onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const bgGradient =
    type === "success"
      ? "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300"
      : type === "error"
      ? "from-rose-500/20 to-red-500/20 border-rose-500/30 text-rose-300"
      : "from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-300";

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl bg-gradient-to-r shadow-2xl ${bgGradient}`}
      >
        {type === "success" ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
        )}
        <span className="text-sm font-medium text-slate-100">{message}</span>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors ml-2">
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
