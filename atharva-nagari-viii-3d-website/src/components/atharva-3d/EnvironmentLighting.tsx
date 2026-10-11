'use client';

import React from 'react';
import { LightingMode } from '@/types/atharva';

interface EnvironmentLightingProps {
  mode: LightingMode;
}

export default function EnvironmentLighting({ mode }: EnvironmentLightingProps) {
  if (mode === 'day') {
    return (
      <>
        {/* Crisp daylight sky & sun */}
        <color attach="background" args={['#b8d8f8']} />
        <fog attach="fog" args={['#b8d8f8', 60, 190]} />
        <ambientLight intensity={0.75} color="#ffffff" />
        <directionalLight
          position={[45, 60, 35]}
          intensity={1.4}
          color="#fffdf5"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={1}
          shadow-camera-far={160}
          shadow-camera-left={-45}
          shadow-camera-right={45}
          shadow-camera-top={45}
          shadow-camera-bottom={-45}
          shadow-bias={-0.00015}
        />
        <hemisphereLight args={['#9fd2ff', '#556644', 0.45]} />
      </>
    );
  }

  if (mode === 'golden') {
    return (
      <>
        {/* Warm golden hour sunset over Nagpur skyline */}
        <color attach="background" args={['#ffb27a']} />
        <fog attach="fog" args={['#ffad73', 45, 170]} />
        <ambientLight intensity={0.55} color="#ffe2cc" />
        <directionalLight
          position={[60, 25, 40]}
          intensity={1.8}
          color="#ff8c3b"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={1}
          shadow-camera-far={160}
          shadow-camera-left={-45}
          shadow-camera-right={45}
          shadow-camera-top={45}
          shadow-camera-bottom={-45}
          shadow-bias={-0.00015}
        />
        <hemisphereLight args={['#ff9452', '#3a2010', 0.5]} />
      </>
    );
  }

  // Luxury Architectural Night Mode
  return (
    <>
      {/* Deep twilight/night sky with warm architectural facade glow */}
      <color attach="background" args={['#0b111e']} />
      <fog attach="fog" args={['#0a0f1c', 40, 160]} />
      <ambientLight intensity={0.25} color="#2b3a55" />
      <directionalLight
        position={[30, 45, 20]}
        intensity={0.35}
        color="#8aa8cf"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <hemisphereLight args={['#172338', '#080d14', 0.2]} />

      {/* Grand Entrance Gate Spotlights */}
      <spotLight
        position={[0, 9, 36]}
        target-position={[0, 0, 36]}
        intensity={3.5}
        color="#ffd27d"
        angle={0.65}
        penumbra={0.6}
        distance={25}
      />

      {/* Architectural Facade Washers */}
      <pointLight position={[-15, 8, 2]} intensity={2.0} color="#ffb74d" distance={30} />
      <pointLight position={[15, 8, 2]} intensity={2.0} color="#ffb74d" distance={30} />
      <pointLight position={[0, 16, 2]} intensity={2.2} color="#ffe082" distance={35} />
      <pointLight position={[0, 28, 2]} intensity={2.2} color="#ffe082" distance={35} />

      {/* Podium Garden Bollards & Lanterns */}
      <pointLight position={[-16, 3, 8]} intensity={1.8} color="#ffc107" distance={20} />
      <pointLight position={[20, 2.5, 12]} intensity={1.6} color="#4fc3f7" distance={18} />
    </>
  );
}
