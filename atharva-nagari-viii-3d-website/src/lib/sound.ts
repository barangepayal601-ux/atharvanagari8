'use client';

import { Howl, Howler } from 'howler';

class SoundManager {
  private static instance: SoundManager;
  private isMuted: boolean = false;
  private activeSounds: Map<string, Howl> = new Map();
  private audioCtx: AudioContext | null = null;
  private proOscillators: { osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null = null;
  private natureNodes: { noise: AudioNode; filter: BiquadFilterNode; gain: GainNode; interval?: NodeJS.Timeout } | null = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('digivyapar_muted');
      this.isMuted = savedMute === 'true';
      Howler.mute(this.isMuted);
    }
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    Howler.mute(this.isMuted);
    if (typeof window !== 'undefined') {
      localStorage.setItem('digivyapar_muted', String(this.isMuted));
    }
    if (this.isMuted) {
      this.stopProAmbient();
      this.stopAdvancedNature();
    }
    return this.isMuted;
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    Howler.mute(this.isMuted);
    if (typeof window !== 'undefined') {
      localStorage.setItem('digivyapar_muted', String(this.isMuted));
    }
    if (this.isMuted) {
      this.stopProAmbient();
      this.stopAdvancedNature();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Play interactive soft chime on hover / button clicks
   */
  public playChime(freq: number = 587.33) {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      // Soft harmonic decay
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch {
      // Audio context silently handled
    }
  }

  /**
   * Pro page ambient: Smooth futuristic atmospheric chord
   */
  public playProAmbient() {
    if (this.isMuted) return;
    this.stopAdvancedNature();
    if (this.proOscillators) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(220, ctx.currentTime); // A3

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(329.63, ctx.currentTime); // E4

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 2.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      this.proOscillators = { osc1, osc2, gain };
    } catch {
      // Handled
    }
  }

  public stopProAmbient() {
    if (this.proOscillators) {
      try {
        const { osc1, osc2, gain } = this.proOscillators;
        const ctx = this.getAudioContext();
        if (ctx) {
          gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
          setTimeout(() => {
            try {
              osc1.stop();
              osc2.stop();
            } catch {}
          }, 900);
        } else {
          osc1.stop();
          osc2.stop();
        }
      } catch {}
      this.proOscillators = null;
    }
  }

  /**
   * Advanced page nature soundscape: Flowing water stream with subtle bird chirps
   */
  public playAdvancedNature() {
    if (this.isMuted) return;
    this.stopProAmbient();
    if (this.natureNodes) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      // Create pink/brown noise for flowing waterfall stream
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Lowpass filter for smooth water flow resonance
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 3);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();

      // Gentle periodic bird chirps
      const interval = setInterval(() => {
        if (this.isMuted) return;
        this.playGentleBirdChirp();
      }, 7000);

      this.natureNodes = { noise: whiteNoise, filter, gain, interval };
    } catch {
      // Handled
    }
  }

  private playGentleBirdChirp() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx || this.isMuted) return;

      const baseFreq = 2200 + Math.random() * 800;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 600, ctx.currentTime + 0.08);
      osc.frequency.exponentialRampToValueAtTime(baseFreq - 200, ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.23);
    } catch {}
  }

  public stopAdvancedNature() {
    if (this.natureNodes) {
      try {
        const { noise, gain, interval } = this.natureNodes;
        if (interval) clearInterval(interval);
        const ctx = this.getAudioContext();
        if (ctx) {
          gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1);
          setTimeout(() => {
            try {
              (noise as AudioBufferSourceNode).stop();
            } catch {}
          }, 1100);
        } else {
          (noise as AudioBufferSourceNode).stop();
        }
      } catch {}
      this.natureNodes = null;
    }
  }

  /**
   * Luxury dual-tone elevator chime (C5 -> G5)
   */
  public playElevatorChime() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      const gain2 = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      gain1.gain.setValueAtTime(0.08, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(783.99, ctx.currentTime + 0.15); // G5
      gain2.gain.setValueAtTime(0.09, ctx.currentTime + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.65);
      osc2.start(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.95);
    } catch {}
  }

  /**
   * Subtle realistic acoustic footstep thud
   */
  public playFootstep() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95 + Math.random() * 20, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {}
  }

  /**
   * Smooth automatic sliding door acoustic whoosh
   */
  public playDoorWhoosh() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch {}
  }

  public stopAll() {
    this.stopProAmbient();
    this.stopAdvancedNature();
  }
}

export const soundManager = SoundManager.getInstance();
