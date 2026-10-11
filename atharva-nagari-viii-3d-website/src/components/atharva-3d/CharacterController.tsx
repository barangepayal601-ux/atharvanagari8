'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CameraMode, ElevatorState } from '@/types/atharva';
import { soundManager } from '@/lib/sound';

interface CharacterControllerProps {
  cameraMode: CameraMode;
  playerPos: [number, number, number];
  setPlayerPos: (pos: [number, number, number]) => void;
  playerYaw: number;
  setPlayerYaw: (yaw: number) => void;
  isInsideElevator: boolean;
  elevatorState: ElevatorState;
  onInteract: () => void;
  virtualJoystick: { x: number; y: number };
  virtualLook: { x: number; y: number };
  isJumpRequested: boolean;
  clearJumpRequest: () => void;
}

// Compute walkable ground height at coordinate (x, z) with stair steps
export function getGroundHeight(x: number, z: number, currentY: number): number {
  // If player is on 12th floor penthouse / sample flat level (~28.6m to 34m)
  if (currentY > 20) {
    // 12th floor lobby and flat platform
    if (x >= -12 && x <= 22 && z >= -14 && z <= 6) {
      return 28.6;
    }
  }

  // Grand Entrance Gate ramp
  if (z > 32 && z < 42 && Math.abs(x) < 7) {
    return 0.0;
  }

  // Podium Garden elevated deck (starts at z = 22, height = 0.9m)
  // Smooth stairs between z = 25 and z = 22
  if (x >= -24 && x <= -4 && z >= -2 && z <= 22) {
    return 0.9;
  }
  if (x >= -24 && x <= -4 && z > 22 && z <= 25) {
    // 3 stepped risers of 0.3m each
    const stepProgress = (25 - z) / 3.0; // 0 at z=25, 1 at z=22
    return Math.floor(stepProgress * 3) * 0.3;
  }

  // Default Ground Level
  return 0.0;
}

export default function CharacterController({
  cameraMode,
  playerPos,
  setPlayerPos,
  playerYaw,
  setPlayerYaw,
  isInsideElevator,
  elevatorState,
  onInteract,
  virtualJoystick,
  virtualLook,
  isJumpRequested,
  clearJumpRequest,
}: CharacterControllerProps) {
  const { camera, gl } = useThree();

  // Avatar group for Third Person View
  const avatarRef = useRef<THREE.Group>(null);

  // Key states
  const keys = useRef<{ [key: string]: boolean }>({});
  const verticalVelocity = useRef(0);
  const isGrounded = useRef(true);
  const stepTimer = useRef(0);

  // Mouse Look Pitch & Yaw
  const pitch = useRef(0); // Up/Down rotation
  const yaw = useRef(playerYaw); // Left/Right rotation
  const isPointerLocked = useRef(false);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      if (e.code === 'KeyE') {
        onInteract();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onInteract]);

  // Pointer Lock for Mouse Look
  useEffect(() => {
    const canvas = gl.domElement;

    const handlePointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement === canvas;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPointerLocked.current) return;
      const sensitivity = 0.0022;
      yaw.current -= e.movementX * sensitivity;
      pitch.current -= e.movementY * sensitivity;
      pitch.current = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, pitch.current));
      setPlayerYaw(yaw.current);
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gl, setPlayerYaw]);

  // Handle Virtual Look Drag (Mobile)
  useEffect(() => {
    if (virtualLook.x !== 0 || virtualLook.y !== 0) {
      yaw.current -= virtualLook.x * 0.045;
      pitch.current -= virtualLook.y * 0.045;
      pitch.current = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, pitch.current));
      setPlayerYaw(yaw.current);
    }
  }, [virtualLook, setPlayerYaw]);

  useFrame((_, delta) => {
    // Delta clamping to prevent physics tunnels during lag spikes
    const dt = Math.min(delta, 0.1);

    // Movement Direction Calculation
    let moveForward = 0;
    let moveRight = 0;

    if (keys.current['KeyW'] || keys.current['ArrowUp']) moveForward += 1;
    if (keys.current['KeyS'] || keys.current['ArrowDown']) moveForward -= 1;
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) moveRight -= 1;
    if (keys.current['KeyD'] || keys.current['ArrowRight']) moveRight += 1;

    // Apply Virtual Joystick input (Mobile)
    if (Math.abs(virtualJoystick.y) > 0.1) moveForward -= virtualJoystick.y;
    if (Math.abs(virtualJoystick.x) > 0.1) moveRight += virtualJoystick.x;

    const isRunning = keys.current['ShiftLeft'] || keys.current['ShiftRight'];
    const speed = isRunning ? 7.2 : 4.0; // m/s

    // Calculate movement vector aligned with camera yaw
    const forwardVec = new THREE.Vector3(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
    const rightVec = new THREE.Vector3(Math.cos(yaw.current), 0, -Math.sin(yaw.current));

    const moveDirection = new THREE.Vector3()
      .addScaledVector(forwardVec, moveForward)
      .addScaledVector(rightVec, moveRight);

    const isMoving = moveDirection.lengthSq() > 0.001;
    if (isMoving) {
      moveDirection.normalize();
    }

    let [px, py, pz] = playerPos;

    // Jumping & Gravity
    const jumpTriggered = (keys.current['Space'] || isJumpRequested) && isGrounded.current;
    if (jumpTriggered) {
      verticalVelocity.current = 6.2; // initial jump velocity
      isGrounded.current = false;
      clearJumpRequest();
    }

    // Apply Gravity if not inside moving elevator
    if (!isInsideElevator || elevatorState !== 'MOVING') {
      const gravity = -17.5;
      verticalVelocity.current += gravity * dt;
      py += verticalVelocity.current * dt;

      // Check ground floor height at new coordinates
      const groundY = getGroundHeight(px, pz, py);
      const eyeHeight = 1.65;
      const targetGroundY = groundY + eyeHeight;

      if (py <= targetGroundY) {
        py = targetGroundY;
        verticalVelocity.current = 0;
        isGrounded.current = true;
      } else {
        isGrounded.current = false;
      }
    }

    // Horizontal Movement & Stair Traversal
    if (isMoving) {
      const nextX = px + moveDirection.x * speed * dt;
      const nextZ = pz + moveDirection.z * speed * dt;

      // Stair Stepping: check ground height at candidate position
      const candidateGround = getGroundHeight(nextX, nextZ, py);
      const currentGround = py - 1.65;
      const stepDelta = candidateGround - currentGround;

      // Maximum step height threshold = 0.35m
      const canStep = stepDelta <= 0.35;

      // Simple township boundary collider checks
      const withinTownship =
        nextX >= -35 && nextX <= 35 && nextZ >= -30 && nextZ <= 46;

      if (canStep && withinTownship) {
        px = nextX;
        pz = nextZ;

        // Smoothly step up
        if (stepDelta > 0 && isGrounded.current) {
          py += stepDelta;
        }

        // Play periodic footstep audio
        stepTimer.current += dt * (isRunning ? 1.6 : 1.0);
        if (stepTimer.current > 0.42) {
          soundManager.playFootstep();
          stepTimer.current = 0;
        }
      }
    }

    // Commit player position state
    setPlayerPos([px, py, pz]);

    // Update Avatar mesh position & heading in 3rd person mode
    if (avatarRef.current) {
      avatarRef.current.position.set(px, py - 1.65, pz);
      if (isMoving) {
        const moveAngle = Math.atan2(moveDirection.x, moveDirection.z);
        avatarRef.current.rotation.y = moveAngle;
      } else {
        avatarRef.current.rotation.y = yaw.current;
      }
    }

    // Camera Rig & Perspective Positioning
    if (cameraMode === 'first-person') {
      camera.position.set(px, py, pz);
      const lookTarget = new THREE.Vector3(
        px - Math.sin(yaw.current) * Math.cos(pitch.current),
        py + Math.sin(pitch.current),
        pz - Math.cos(yaw.current) * Math.cos(pitch.current)
      );
      camera.lookAt(lookTarget);
    } else if (cameraMode === 'third-person') {
      // 3rd Person Follow Camera (3.5m back, 1.3m up)
      const camDist = 3.8;
      const camHeight = 1.3;
      const camX = px + Math.sin(yaw.current) * Math.cos(pitch.current) * camDist;
      const camY = py + camHeight + Math.sin(pitch.current) * 1.5;
      const camZ = pz + Math.cos(yaw.current) * Math.cos(pitch.current) * camDist;

      camera.position.set(camX, Math.max(camY, py - 0.5), camZ);
      camera.lookAt(px, py - 0.3, pz);
    } else if (cameraMode === 'drone') {
      // High-angle architectural drone view
      camera.position.lerp(new THREE.Vector3(0, 46, 52), 0.05);
      camera.lookAt(0, 14, 0);
    }
  });

  return (
    <>
      {/* 3rd Person Resident Avatar Mesh */}
      {cameraMode === 'third-person' && (
        <group ref={avatarRef}>
          {/* Stylized Luxury Buyer / Resident Avatar */}
          {/* Head */}
          <mesh position={[0, 1.55, 0]} castShadow>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color="#e0ac69" roughness={0.6} />
          </mesh>
          {/* Stylish Hair */}
          <mesh position={[0, 1.64, -0.02]}>
            <sphereGeometry args={[0.165, 16, 16]} />
            <meshStandardMaterial color="#1a202c" roughness={0.9} />
          </mesh>
          {/* Torso / Blazer */}
          <mesh position={[0, 1.1, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.18, 0.65, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
          {/* Inner Shirt Collar */}
          <mesh position={[0, 1.38, 0.08]}>
            <boxGeometry args={[0.12, 0.1, 0.08]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          {/* Trousers */}
          <mesh position={[-0.1, 0.45, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.07, 0.7, 16]} />
            <meshStandardMaterial color="#334155" roughness={0.5} />
          </mesh>
          <mesh position={[0.1, 0.45, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.07, 0.7, 16]} />
            <meshStandardMaterial color="#334155" roughness={0.5} />
          </mesh>
          {/* Shoes */}
          <mesh position={[-0.1, 0.05, 0.04]} castShadow>
            <boxGeometry args={[0.11, 0.08, 0.2]} />
            <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.5} />
          </mesh>
          <mesh position={[0.1, 0.05, 0.04]} castShadow>
            <boxGeometry args={[0.11, 0.08, 0.2]} />
            <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.5} />
          </mesh>
        </group>
      )}
    </>
  );
}
