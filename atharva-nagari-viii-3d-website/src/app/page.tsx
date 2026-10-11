'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ShieldCheck } from 'lucide-react';

// Dynamic client-side import with ssr: false guarantees zero SSR WebGL build errors on Vercel
const AtharvaExperience = dynamic(
  () => import('@/components/atharva-3d/AtharvaExperience'),
  {
    ssr: false,
    loading: () => (
      <div className="relative w-full h-screen bg-slate-950 flex flex-col items-center justify-center text-white px-4">
        {/* Ambient Glow */}
        <div className="absolute w-96 h-96 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-md">
          {/* Brand Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-300 flex items-center justify-center font-bold text-slate-950 text-2xl shadow-xl shadow-amber-500/20 animate-pulse">
            A
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Atharva Infrastructures • Besa-Pipla Road
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              ATHARVA NAGARI VIII
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Initializing 3D Real-Time Luxury Walkthrough & Physics Engine...
            </p>
          </div>

          {/* Luxury Loading Progress Bar */}
          <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full animate-[shimmer_1.8s_infinite] w-full" />
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> RERA: P50500053130
            </span>
            <span>•</span>
            <span>60 FPS WebGL</span>
          </div>
        </div>
      </div>
    ),
  }
);

export default function HomePage() {
  return (
    <main className="w-full h-screen overflow-hidden bg-slate-950">
      <AtharvaExperience />
    </main>
  );
}
