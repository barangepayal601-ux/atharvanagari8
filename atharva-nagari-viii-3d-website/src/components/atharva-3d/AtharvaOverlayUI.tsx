'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  CameraMode,
  LightingMode,
  FloorFinish,
  KitchenFinish,
  HotspotItem,
  ElevatorState,
  LeadFormData,
} from '@/types/atharva';
import { ATHARVA_PROJECT_DETAILS, HOTSPOTS_DATA } from '@/lib/atharvaData';
import { soundManager } from '@/lib/sound';
import confetti from 'canvas-confetti';
import {
  Compass,
  Sun,
  Sunset,
  Moon,
  User,
  Eye,
  Plane,
  Layers,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
  Phone,
  MessageSquare,
  Calendar,
  X,
  CheckCircle,
  Volume2,
  VolumeX,
  HelpCircle,
  Sparkles,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface AtharvaOverlayUIProps {
  cameraMode: CameraMode;
  setCameraMode: (mode: CameraMode) => void;
  lightingMode: LightingMode;
  setLightingMode: (mode: LightingMode) => void;
  floorFinish: FloorFinish;
  setFloorFinish: (finish: FloorFinish) => void;
  kitchenFinish: KitchenFinish;
  setKitchenFinish: (finish: KitchenFinish) => void;
  currentFloor: number;
  targetFloor: number;
  onSelectFloor: (floor: number) => void;
  elevatorState: ElevatorState;
  isPlayerInsideElevator: boolean;
  onCallElevator: () => void;
  playerPos: [number, number, number];
  playerYaw: number;
  selectedHotspot: HotspotItem | null;
  onCloseHotspot: () => void;
  onSelectHotspot: (hotspot: HotspotItem) => void;
  gateOpen: boolean;
  toggleGate: () => void;
  sampleFlatDoorOpen: boolean;
  toggleSampleFlatDoor: () => void;
  onMobileJump: () => void;
  onMobileInteract: () => void;
  onTouchJoystickMove: (data: { x: number; y: number }) => void;
  onTouchJoystickEnd: () => void;
  onTouchLookMove: (data: { x: number; y: number }) => void;
  onTouchLookEnd: () => void;
}

export default function AtharvaOverlayUI({
  cameraMode,
  setCameraMode,
  lightingMode,
  setLightingMode,
  floorFinish,
  setFloorFinish,
  kitchenFinish,
  setKitchenFinish,
  currentFloor,
  targetFloor,
  onSelectFloor,
  elevatorState,
  isPlayerInsideElevator,
  onCallElevator,
  playerPos,
  playerYaw,
  selectedHotspot,
  onCloseHotspot,
  onSelectHotspot,
  gateOpen,
  toggleGate,
  sampleFlatDoorOpen,
  toggleSampleFlatDoor,
  onMobileJump,
  onMobileInteract,
  onTouchJoystickMove,
  onTouchJoystickEnd,
  onTouchLookMove,
  onTouchLookEnd,
}: AtharvaOverlayUIProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showElevatorPanel, setShowElevatorPanel] = useState(false);
  const [showControlsHelp, setShowControlsHelp] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);

  const [leadForm, setLeadForm] = useState<LeadFormData>({
    fullName: '',
    phone: '',
    email: '',
    configuration: '3 BHK',
    visitDate: '',
    notes: '',
  });

  const toggleSound = () => {
    const next = soundManager.toggleMute();
    setIsMuted(next);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playChime(659.25);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}
    setLeadSuccess(true);
    setTimeout(() => {
      setLeadSuccess(false);
      setShowLeadModal(false);
      setLeadForm({
        fullName: '',
        phone: '',
        email: '',
        configuration: '3 BHK',
        visitDate: '',
        notes: '',
      });
    }, 2800);
  };

  // Convert player 3D coordinates (-35..35, -30..46) to Minimap percentage (0..100)
  const [px, , pz] = playerPos;
  const minimapX = Math.max(5, Math.min(95, ((px + 35) / 70) * 100));
  const minimapY = Math.max(5, Math.min(95, ((46 - pz) / 76) * 100));
  const minimapRotation = (-playerYaw * 180) / Math.PI;

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between p-3 sm:p-5 select-none text-white font-sans overflow-hidden">
      {/* ============================================================ */}
      {/* 1. TOP HEADER & BRANDING BAR */}
      {/* ============================================================ */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        {/* Project Brand Badge */}
        <div className="pointer-events-auto flex items-center gap-3 bg-slate-900/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-amber-500/30 shadow-xl shadow-black/40">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-300 flex items-center justify-center font-bold text-slate-950 text-lg shadow-md">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                ATHARVA NAGARI VIII
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                  Luxury 3D
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <span>Besa–Pipla Road, Nagpur</span>
              <span className="text-slate-500">•</span>
              <span className="text-amber-400/90 font-mono text-[11px]">
                RERA: {ATHARVA_PROJECT_DETAILS.reraNo}
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls & Minimap Container */}
        <div className="flex items-center gap-3">
          {/* VIP Booking & Direct Contact Actions */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={() => {
                setShowLeadModal(true);
                soundManager.playChime();
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all transform active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Site Visit</span>
            </button>

            <a
              href={`tel:${ATHARVA_PROJECT_DETAILS.phone.replace(/[^0-9+]/g, '')}`}
              className="hidden md:flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 px-3 py-2 rounded-xl text-xs border border-slate-700/60 backdrop-blur-md transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{ATHARVA_PROJECT_DETAILS.phone}</span>
            </a>

            <a
              href={`https://wa.me/${ATHARVA_PROJECT_DETAILS.whatsappNumber}?text=Hi%20Atharva%20Infrastructures,%20I%20am%20exploring%20Atharva%20Nagari%20VIII%203D%20walkthrough%20and%20want%20details.`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-emerald-600/80 hover:bg-emerald-500 text-white rounded-xl backdrop-blur-md transition-colors shadow-md"
              title="Chat on WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </a>

            <button
              onClick={toggleSound}
              className="p-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-700/60 backdrop-blur-md transition-colors"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowControlsHelp(!showControlsHelp)}
              className="p-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-700/60 backdrop-blur-md transition-colors"
              title="Controls Guide"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          {/* ============================================================ */}
          {/* 2. TOP-RIGHT RADAR MINIMAP */}
          {/* ============================================================ */}
          <div className="pointer-events-auto relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-700/80 p-2 shadow-2xl overflow-hidden flex flex-col justify-between">
            {/* Minimap Layout Wireframe */}
            <div className="relative w-full h-full rounded-lg bg-slate-900/90 border border-slate-800 overflow-hidden">
              {/* Grand Gate zone */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-amber-500/40 rounded-sm text-[7px] text-center text-amber-200">
                Gate
              </div>
              {/* Towers */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-8 bg-blue-500/25 border border-blue-400/40 rounded text-[7px] text-center text-blue-200 flex items-center justify-center">
                Towers (12F)
              </div>
              {/* Podium Park */}
              <div className="absolute top-12 left-1 w-6 h-6 rounded-full bg-emerald-500/25 border border-emerald-400/40" />
              {/* Pool */}
              <div className="absolute top-12 right-1 w-6 h-5 rounded bg-cyan-500/25 border border-cyan-400/40" />

              {/* Player Radar Pin */}
              <div
                className="absolute w-3.5 h-3.5 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-75"
                style={{
                  left: `${minimapX}%`,
                  top: `${minimapY}%`,
                }}
              >
                {/* Vision Cone */}
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ transform: `rotate(${minimapRotation}deg)` }}
                >
                  <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-amber-400" />
                </div>
              </div>
            </div>

            {/* Current Level Indicator */}
            <div className="text-[10px] font-mono text-center text-amber-300/90 pt-1">
              {currentFloor === 0 ? 'Ground Level' : `Floor ${currentFloor} (Penthouse)`}
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 3. PROXIMITY CALLOUTS (LIFT & GATE PROXIMITY) */}
      {/* ============================================================ */}
      <div className="flex flex-col items-center gap-2 my-auto">
        {/* Elevator Proximity Callout */}
        {Math.abs(playerPos[0] - 0) < 3.2 &&
          Math.abs(playerPos[2] - -4.5) < 3.2 &&
          elevatorState !== 'MOVING' && (
            <div className="pointer-events-auto flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-amber-500/60 px-4 py-2.5 rounded-2xl shadow-2xl animate-bounce">
              <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-xs">
                E
              </span>
              <span className="text-xs sm:text-sm font-medium">
                {isPlayerInsideElevator
                  ? 'Select Floor on Elevator Panel'
                  : 'Press E or Click to Call High-Speed Lift'}
              </span>
              <button
                onClick={() => {
                  setShowElevatorPanel(true);
                  if (elevatorState === 'IDLE_DOORS_CLOSED') {
                    onCallElevator();
                  }
                }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs"
              >
                {isPlayerInsideElevator ? 'Choose Floor' : 'Open Doors'}
              </button>
            </div>
          )}

        {/* Gate Boom Barrier Proximity Callout */}
        {Math.abs(playerPos[0] - 0) < 5.0 && Math.abs(playerPos[2] - 36) < 4.0 && (
          <div className="pointer-events-auto flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-2xl shadow-xl">
            <span className="text-xs sm:text-sm font-medium">
              Grand Entrance Boom Barrier
            </span>
            <button
              onClick={toggleGate}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                gateOpen ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-slate-950'
              }`}
            >
              {gateOpen ? 'Lower Barrier' : 'Raise Barrier'}
            </button>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 4. BOTTOM DOCK & INTERACTIVE SYSTEM CONTROLLERS */}
      {/* ============================================================ */}
      <footer className="flex flex-wrap items-end justify-between gap-3">
        {/* Left: View Mode & Lighting Presets */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-2 bg-slate-900/85 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-xl">
          {/* Camera Modes */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl">
            <button
              onClick={() => setCameraMode('first-person')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                cameraMode === 'first-person'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">First-Person</span>
            </button>
            <button
              onClick={() => setCameraMode('third-person')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                cameraMode === 'third-person'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">3rd-Person</span>
            </button>
            <button
              onClick={() => setCameraMode('drone')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                cameraMode === 'drone'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Plane className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Drone</span>
            </button>
          </div>

          {/* Lighting Mode Presets */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl">
            <button
              onClick={() => setLightingMode('day')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                lightingMode === 'day'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Daylight"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLightingMode('golden')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                lightingMode === 'golden'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Golden Hour Sunset"
            >
              <Sunset className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLightingMode('night')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                lightingMode === 'night'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Luxury Architectural Night"
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>

          {/* Customizer Drawer Toggle */}
          <button
            onClick={() => setShowCustomizer(!showCustomizer)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              showCustomizer
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Finishes & Materials</span>
          </button>

          {/* Elevator Panel Toggle */}
          <button
            onClick={() => setShowElevatorPanel(!showElevatorPanel)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              showElevatorPanel
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Elevator (Floor {currentFloor})</span>
          </button>
        </div>

        {/* Right: Quick Hotspots Explorer */}
        <div className="pointer-events-auto hidden lg:flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-800 shadow-xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Jump to:
          </span>
          {HOTSPOTS_DATA.slice(0, 4).map((hotspot) => (
            <button
              key={hotspot.id}
              onClick={() => onSelectHotspot(hotspot)}
              className="text-xs bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-amber-300 px-2.5 py-1 rounded-lg border border-slate-700/60 transition-colors"
            >
              {hotspot.title.split(' ')[0]} {hotspot.title.split(' ')[1]}
            </button>
          ))}
        </div>
      </footer>

      {/* ============================================================ */}
      {/* 5. FINISHES & MATERIAL CUSTOMIZER DRAWER */}
      {/* ============================================================ */}
      {showCustomizer && (
        <div className="pointer-events-auto absolute bottom-20 left-4 sm:left-6 w-80 bg-slate-950/95 backdrop-blur-xl border border-amber-500/40 rounded-2xl p-4 shadow-2xl z-40 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Interior Finishes Customizer
            </h3>
            <button
              onClick={() => setShowCustomizer(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 pt-3">
            {/* Living Room & Master Bedroom Flooring */}
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-2">
                Floor Tile & Texture
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'marble', label: 'Italian Marble' },
                  { id: 'wood', label: 'Teak Hardwood' },
                  { id: 'vitrified', label: 'Grey Vitrified' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setFloorFinish(item.id as FloorFinish);
                      soundManager.playChime(440);
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                      floorFinish === item.id
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modular Kitchen Cabinets */}
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-2">
                Modular Kitchen Finish
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'walnut', label: 'Natural Walnut' },
                  { id: 'white', label: 'Alpine White' },
                  { id: 'charcoal', label: 'Matte Obsidian' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setKitchenFinish(item.id as KitchenFinish);
                      soundManager.playChime(523);
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                      kitchenFinish === item.id
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. ELEVATOR 12-STOREY FLOOR SELECTOR PANEL */}
      {/* ============================================================ */}
      {showElevatorPanel && (
        <div className="pointer-events-auto absolute top-1/2 -translate-y-1/2 right-4 sm:right-6 w-64 bg-slate-950/95 backdrop-blur-xl border border-amber-500/40 rounded-2xl p-4 shadow-2xl z-40 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-white">Elevator Transit Hub</h3>
              <p className="text-[11px] text-amber-400">
                {elevatorState === 'MOVING'
                  ? `Ascending to Floor ${targetFloor}...`
                  : `Current: Floor ${currentFloor}`}
              </p>
            </div>
            <button
              onClick={() => setShowElevatorPanel(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-3">
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 13 }).map((_, f) => {
                const isSelected = f === currentFloor;
                return (
                  <button
                    key={`lift-btn-${f}`}
                    disabled={elevatorState === 'MOVING'}
                    onClick={() => {
                      onSelectFloor(f);
                      soundManager.playChime(600);
                    }}
                    className={`py-2 rounded-xl font-bold text-xs transition-all border ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : 'bg-slate-900 text-slate-200 border-slate-800 hover:border-amber-500/50'
                    } ${elevatorState === 'MOVING' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {f === 0 ? 'G' : f}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Status:</span>
              <span className="font-semibold text-amber-300 uppercase text-[10px]">
                {elevatorState.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. HOTSPOT MODAL DETAIL SHEET */}
      {/* ============================================================ */}
      {selectedHotspot && (
        <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl overflow-hidden text-white">
            <button
              onClick={onCloseHotspot}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Photo Preview if Available */}
            {selectedHotspot.image && (
              <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4 border border-slate-700 shadow-inner">
                <Image
                  src={selectedHotspot.image}
                  alt={selectedHotspot.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500 text-slate-950 shadow">
                  {selectedHotspot.category}
                </span>
              </div>
            )}

            <h3 className="text-xl font-bold text-white mb-2">{selectedHotspot.title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {selectedHotspot.description}
            </p>

            {/* Features List */}
            <div className="space-y-2 mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Key Highlights
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedHotspot.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs text-slate-200 bg-slate-800/60 p-2 rounded-xl border border-slate-750"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedHotspot.specs && (
              <p className="text-xs text-slate-400 italic mb-5 border-l-2 border-amber-500/50 pl-3">
                {selectedHotspot.specs}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={onCloseHotspot}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white"
              >
                Close View
              </button>
              <button
                onClick={() => {
                  onCloseHotspot();
                  setShowLeadModal(true);
                  soundManager.playChime();
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 transition-transform active:scale-95"
              >
                Inquire & Book Visit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 8. VIP VISIT BOOKING & LEAD GENERATION MODAL */}
      {/* ============================================================ */}
      {showLeadModal && (
        <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
            <button
              onClick={() => setShowLeadModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {leadSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-bold text-white">Visit Scheduled!</h3>
                <p className="text-sm text-slate-300 max-w-sm mx-auto">
                  Thank you! Our Atharva Nagari sales associate will contact you at{' '}
                  <span className="text-amber-400">{leadForm.phone}</span> to confirm your
                  exclusive VIP site visit.
                </p>
                <div className="p-3 bg-slate-800/80 rounded-2xl text-xs text-slate-400">
                  Site Office: 3rd Floor, Above Shyam Mart, Besa–Pipla Road, Nagpur.
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                    Atharva Infrastructures
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    Book an In-Person VIP Site Visit
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Experience Atharva Nagari VIII live along Besa-Pipla Road, Nagpur.
                  </p>
                </div>

                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={leadForm.fullName}
                      onChange={(e) => setLeadForm({ ...leadForm, fullName: e.target.value })}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={leadForm.phone}
                        onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Preferred Configuration
                      </label>
                      <select
                        value={leadForm.configuration}
                        onChange={(e) =>
                          setLeadForm({
                            ...leadForm,
                            configuration: e.target.value as '2 BHK' | '3 BHK' | 'Both / Undecided',
                          })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                      >
                        <option value="2 BHK">2 BHK Luxury (1,050 – 1,200 sq.ft)</option>
                        <option value="3 BHK">3 BHK Royal (1,450 – 1,750 sq.ft)</option>
                        <option value="Both / Undecided">Undecided / Both</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Preferred Date of Visit
                    </label>
                    <input
                      type="date"
                      value={leadForm.visitDate}
                      onChange={(e) => setLeadForm({ ...leadForm, visitDate: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 transition-transform active:scale-98"
                    >
                      Confirm VIP Site Visit
                    </button>
                    <p className="text-[11px] text-slate-400 text-center mt-2">
                      RERA Registered Project: {ATHARVA_PROJECT_DETAILS.reraNo}
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 9. CONTROLS GUIDE DIALOG */}
      {/* ============================================================ */}
      {showControlsHelp && (
        <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 text-white shadow-2xl">
            <button
              onClick={() => setShowControlsHelp(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-lg text-amber-400 mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Navigation & Interaction Controls
            </h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex justify-between p-2 rounded-xl bg-slate-800">
                <span className="font-semibold text-white">W / A / S / D or Arrows</span>
                <span>Walk Forward, Left, Back, Right</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-slate-800">
                <span className="font-semibold text-white">Shift + W</span>
                <span>Sprint / Run</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-slate-800">
                <span className="font-semibold text-white">Spacebar</span>
                <span>Jump with Physics Gravity</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-slate-800">
                <span className="font-semibold text-white">Mouse Look</span>
                <span>Click canvas to lock pointer & look around</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-slate-800">
                <span className="font-semibold text-white">Key [E]</span>
                <span>Call Elevator / Interact with Gates</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-slate-800">
                <span className="font-semibold text-white">Click Hotspot Pins</span>
                <span>View amenities & sample flat specifications</span>
              </div>
            </div>
            <button
              onClick={() => setShowControlsHelp(false)}
              className="w-full mt-5 py-2.5 rounded-xl bg-amber-500 font-bold text-xs text-slate-950 hover:bg-amber-400"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 10. MOBILE ON-SCREEN TOUCH JOYSTICK & BUTTONS */}
      {/* ============================================================ */}
      <div className="pointer-events-auto sm:hidden fixed bottom-6 left-6 z-40">
        <div
          className="relative w-28 h-28 rounded-full bg-slate-900/70 border border-slate-700/80 backdrop-blur-md flex items-center justify-center touch-none"
          onTouchMove={(e) => {
            const touch = e.touches[0];
            const rect = e.currentTarget.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = (touch.clientX - centerX) / (rect.width / 2);
            const dy = (touch.clientY - centerY) / (rect.height / 2);
            onTouchJoystickMove({
              x: Math.max(-1, Math.min(1, dx)),
              y: Math.max(-1, Math.min(1, dy)),
            });
          }}
          onTouchEnd={onTouchJoystickEnd}
        >
          <div className="w-10 h-10 rounded-full bg-amber-500/80 shadow-lg pointer-events-none" />
        </div>
      </div>

      {/* Mobile Jump & Action Buttons */}
      <div className="pointer-events-auto sm:hidden fixed bottom-6 right-6 z-40 flex items-center gap-3">
        <button
          onClick={onMobileInteract}
          className="w-14 h-14 rounded-full bg-slate-900/80 border border-amber-500/60 text-amber-300 font-bold text-xs flex items-center justify-center shadow-lg active:scale-95"
        >
          [E]
        </button>
        <button
          onClick={onMobileJump}
          className="w-14 h-14 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center shadow-lg active:scale-95"
        >
          JUMP
        </button>
      </div>
    </div>
  );
}
