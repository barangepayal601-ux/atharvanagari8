'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import {
  CameraMode,
  LightingMode,
  FloorFinish,
  KitchenFinish,
  HotspotItem,
  ElevatorState,
} from '@/types/atharva';
import { HOTSPOTS_DATA, ATHARVA_PROJECT_DETAILS } from '@/lib/atharvaData';
import { soundManager } from '@/lib/sound';
import TownshipScene from './TownshipScene';
import CharacterController from './CharacterController';
import ElevatorSystem, { FLOOR_HEIGHTS } from './ElevatorSystem';
import EnvironmentLighting from './EnvironmentLighting';
import AtharvaOverlayUI from './AtharvaOverlayUI';

export default function AtharvaExperience() {
  // Application State
  const [cameraMode, setCameraMode] = useState<CameraMode>('first-person');
  const [lightingMode, setLightingMode] = useState<LightingMode>('day');
  const [floorFinish, setFloorFinish] = useState<FloorFinish>('marble');
  const [kitchenFinish, setKitchenFinish] = useState<KitchenFinish>('walnut');

  // Player Kinematics
  // Starts on the paved entrance boulevard just outside the grand gate
  const [playerPos, setPlayerPos] = useState<[number, number, number]>([0, 1.65, 30]);
  const [playerYaw, setPlayerYaw] = useState<number>(0);

  // 12-Storey Elevator State
  const [currentFloor, setCurrentFloor] = useState<number>(0);
  const [targetFloor, setTargetFloor] = useState<number>(0);
  const [elevatorState, setElevatorState] = useState<ElevatorState>('IDLE_DOORS_CLOSED');
  const [isPlayerInsideElevator, setIsPlayerInsideElevator] = useState<boolean>(false);

  // Interactive Society Elements
  const [gateOpen, setGateOpen] = useState<boolean>(false);
  const [sampleFlatDoorOpen, setSampleFlatDoorOpen] = useState<boolean>(false);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotItem | null>(null);

  // Mobile Virtual Touch Joystick
  const [virtualJoystick, setVirtualJoystick] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [virtualLook, setVirtualLook] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isJumpRequested, setIsJumpRequested] = useState<boolean>(false);

  // Ambient sound management on lighting switch
  useEffect(() => {
    if (lightingMode === 'day') {
      soundManager.playAdvancedNature();
    } else if (lightingMode === 'golden') {
      soundManager.playProAmbient();
    } else {
      soundManager.playProAmbient();
    }

    return () => {
      soundManager.stopAll();
    };
  }, [lightingMode]);

  // Proximity interact action (Key E or Mobile button)
  const handleInteract = useCallback(() => {
    // 1. Check Grand Entrance Gate proximity
    if (Math.abs(playerPos[0] - 0) < 5.0 && Math.abs(playerPos[2] - 36) < 4.0) {
      setGateOpen((prev) => !prev);
      soundManager.playDoorWhoosh();
      return;
    }

    // 2. Check Elevator proximity
    const inElevatorZone =
      Math.abs(playerPos[0] - 0) < 3.0 && Math.abs(playerPos[2] - -4.5) < 3.0;

    if (inElevatorZone) {
      if (elevatorState === 'IDLE_DOORS_CLOSED') {
        setElevatorState('OPENING');
        soundManager.playDoorWhoosh();
      } else if (elevatorState === 'DOORS_OPEN') {
        setElevatorState('CLOSING');
        soundManager.playDoorWhoosh();
      }
      return;
    }

    // 3. Check Sample Flat Door proximity (12th floor)
    if (playerPos[1] > 25 && Math.abs(playerPos[0] - 10) < 4.0 && Math.abs(playerPos[2] - -1) < 4.0) {
      setSampleFlatDoorOpen((prev) => !prev);
      soundManager.playDoorWhoosh();
    }
  }, [playerPos, elevatorState]);

  // Elevator Floor Selection
  const handleSelectFloor = (newFloor: number) => {
    if (newFloor === currentFloor) {
      setElevatorState('OPENING');
      soundManager.playDoorWhoosh();
      return;
    }
    setTargetFloor(newFloor);
    setElevatorState('CLOSING');
    soundManager.playDoorWhoosh();
    setTimeout(() => {
      setElevatorState('MOVING');
    }, 700);
  };

  // Jump to Hotspot coordinate
  const handleSelectHotspot = (hotspot: HotspotItem) => {
    setSelectedHotspot(hotspot);
    soundManager.playChime(784);

    // If hotspot is on 12th floor sample flat, elevate player
    if (hotspot.id === 'sample-flat-3bhk') {
      setPlayerPos([10, 30.2, -3]);
      setCurrentFloor(12);
      setTargetFloor(12);
    } else {
      // Teleport closer to landmark
      const [hx, , hz] = hotspot.position;
      setPlayerPos([hx, 1.65, hz + 5]);
      setCurrentFloor(0);
      setTargetFloor(0);
    }
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden select-none">
      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 1.65, 30], fov: 60, near: 0.1, far: 250 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: lightingMode === 'night' ? 1.4 : 1.1,
          powerPreference: 'high-performance',
        }}
        className="w-full h-full cursor-crosshair"
      >
        <Suspense fallback={null}>
          {/* Dynamic Environment & Photorealistic Lighting */}
          <EnvironmentLighting mode={lightingMode} />

          {/* Master 3D Township Environment */}
          <TownshipScene
            lightingMode={lightingMode}
            floorFinish={floorFinish}
            kitchenFinish={kitchenFinish}
            onSelectHotspot={handleSelectHotspot}
            selectedHotspotId={selectedHotspot?.id || null}
            gateOpen={gateOpen}
            sampleFlatDoorOpen={sampleFlatDoorOpen}
          />

          {/* Dynamic 12-Floor Elevator System */}
          <ElevatorSystem
            currentFloor={currentFloor}
            targetFloor={targetFloor}
            onFloorChange={setCurrentFloor}
            elevatorState={elevatorState}
            setElevatorState={setElevatorState}
            playerPos={playerPos}
            setPlayerPos={setPlayerPos}
            isPlayerInside={isPlayerInsideElevator}
            setIsPlayerInside={setIsPlayerInsideElevator}
          />

          {/* Kinematic Character Controller (Physics, Stairs, Jump) */}
          <CharacterController
            cameraMode={cameraMode}
            playerPos={playerPos}
            setPlayerPos={setPlayerPos}
            playerYaw={playerYaw}
            setPlayerYaw={setPlayerYaw}
            isInsideElevator={isPlayerInsideElevator}
            elevatorState={elevatorState}
            onInteract={handleInteract}
            virtualJoystick={virtualJoystick}
            virtualLook={virtualLook}
            isJumpRequested={isJumpRequested}
            clearJumpRequest={() => setIsJumpRequested(false)}
          />
        </Suspense>
      </Canvas>

      {/* Luxury Glassmorphism HUD & Minimap Overlay */}
      <AtharvaOverlayUI
        cameraMode={cameraMode}
        setCameraMode={setCameraMode}
        lightingMode={lightingMode}
        setLightingMode={setLightingMode}
        floorFinish={floorFinish}
        setFloorFinish={setFloorFinish}
        kitchenFinish={kitchenFinish}
        setKitchenFinish={setKitchenFinish}
        currentFloor={currentFloor}
        targetFloor={targetFloor}
        onSelectFloor={handleSelectFloor}
        elevatorState={elevatorState}
        isPlayerInsideElevator={isPlayerInsideElevator}
        onCallElevator={handleInteract}
        playerPos={playerPos}
        playerYaw={playerYaw}
        selectedHotspot={selectedHotspot}
        onCloseHotspot={() => setSelectedHotspot(null)}
        onSelectHotspot={handleSelectHotspot}
        gateOpen={gateOpen}
        toggleGate={() => setGateOpen((prev) => !prev)}
        sampleFlatDoorOpen={sampleFlatDoorOpen}
        toggleSampleFlatDoor={() => setSampleFlatDoorOpen((prev) => !prev)}
        onMobileJump={() => setIsJumpRequested(true)}
        onMobileInteract={handleInteract}
        onTouchJoystickMove={setVirtualJoystick}
        onTouchJoystickEnd={() => setVirtualJoystick({ x: 0, y: 0 })}
        onTouchLookMove={setVirtualLook}
        onTouchLookEnd={() => setVirtualLook({ x: 0, y: 0 })}
      />
    </div>
  );
}
