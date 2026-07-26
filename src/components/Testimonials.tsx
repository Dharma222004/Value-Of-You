"use client";

import { motion } from "framer-motion";
import { MessageSquare, Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Human Capital gave me absolute clarity on my true earning power. Instead of staying at a comfortable tech salary, I used my financial runway and skill score to raise a $5M seed round.",
    author: "Elena Rostova",
    role: "Founder & CEO, NeuralScale",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    rating: 5,
  },
  {
    quote:
      "Traditional financial planners only cared about my IRA. Human Capital quantified my health endurance and rare AI skill stack—helping me double my executive consulting retainer.",
    author: "Marcus Chen",
    role: "VP of Product Strategy",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    rating: 5,
  },
  {
    quote:
      "The Bloomberg Terminal for personal assets. Seeing my 5 dimensions mapped visually completely changed how I allocate time between career growth and sleep recovery.",
    author: "Sarah Jenkins",
    role: "Managing Director, Apex Capital",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400 text-xs font-mono mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>MEMBER TESTIMONIALS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--foreground)] tracking-tight">
            Trusted by High-Performers
          </h2>
          <p className="mt-4 text-[var(--subtext)] max-w-2xl text-base">
            See how founders, executives, and senior engineers use Human Capital to unlock their full economic potential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-panel rounded-3xl p-8 space-y-6 text-left relative flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-[var(--foreground)] leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[var(--border)]">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-10 h-10 rounded-full object-cover border border-[var(--border)]"
                />
                <div>
                  <div className="text-sm font-bold text-[var(--foreground)]">{t.author}</div>
                  <div className="text-xs text-[var(--subtext)]">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
