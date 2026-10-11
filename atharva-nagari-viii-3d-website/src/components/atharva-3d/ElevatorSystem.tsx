'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { soundManager } from '@/lib/sound';
import { ElevatorState } from '@/types/atharva';

interface ElevatorSystemProps {
  currentFloor: number;
  targetFloor: number;
  onFloorChange: (floor: number) => void;
  elevatorState: ElevatorState;
  setElevatorState: (state: ElevatorState) => void;
  playerPos: [number, number, number];
  setPlayerPos: (pos: [number, number, number]) => void;
  isPlayerInside: boolean;
  setIsPlayerInside: (inside: boolean) => void;
}

export const FLOOR_HEIGHTS: { [key: number]: number } = {
  0: 0.0,
  1: 2.6,
  2: 5.2,
  3: 7.8,
  4: 10.4,
  5: 13.0,
  6: 15.6,
  7: 18.2,
  8: 20.8,
  9: 23.4,
  10: 26.0,
  11: 28.6,
  12: 31.2,
};

export default function ElevatorSystem({
  currentFloor,
  targetFloor,
  onFloorChange,
  elevatorState,
  setElevatorState,
  playerPos,
  setPlayerPos,
  isPlayerInside,
  setIsPlayerInside,
}: ElevatorSystemProps) {
  const cabinRef = useRef<THREE.Group>(null);
  const leftDoorRef = useRef<THREE.Mesh>(null);
  const rightDoorRef = useRef<THREE.Mesh>(null);
  const outerLeftDoorRef = useRef<THREE.Mesh>(null);
  const outerRightDoorRef = useRef<THREE.Mesh>(null);

  const [doorOpenRatio, setDoorOpenRatio] = useState(0); // 0 (closed) to 1 (fully open)
  const currentLiftY = useRef(FLOOR_HEIGHTS[currentFloor] || 0);

  // Proximity check for player inside cabin
  useEffect(() => {
    const [px, py, pz] = playerPos;
    const cabinY = currentLiftY.current;
    const inBoundsX = Math.abs(px - 0) < 1.25;
    const inBoundsZ = Math.abs(pz - (-5)) < 1.25;
    const inBoundsY = Math.abs(py - (cabinY + 1.2)) < 2.0;

    const inside = inBoundsX && inBoundsZ && inBoundsY;
    if (inside !== isPlayerInside) {
      setIsPlayerInside(inside);
    }
  }, [playerPos, isPlayerInside, setIsPlayerInside]);

  useFrame((_, delta) => {
    // 1. Elevator Vertical Kinematics
    const targetY = FLOOR_HEIGHTS[targetFloor] ?? 0;
    const currentY = currentLiftY.current;

    if (elevatorState === 'MOVING') {
      const dir = Math.sign(targetY - currentY);
      const step = 3.5 * delta; // 3.5 m/s elevator speed

      if (Math.abs(targetY - currentY) <= step) {
        currentLiftY.current = targetY;
        if (cabinRef.current) {
          cabinRef.current.position.y = targetY;
        }
        onFloorChange(targetFloor);
        setElevatorState('ARRIVED');
        soundManager.playElevatorChime();
        setTimeout(() => {
          setElevatorState('OPENING');
          soundManager.playDoorWhoosh();
        }, 500);
      } else {
        const nextY = currentY + dir * step;
        const deltaLiftY = nextY - currentY;
        currentLiftY.current = nextY;
        if (cabinRef.current) {
          cabinRef.current.position.y = nextY;
        }

        // If player is inside cabin, carry player along vertically!
        if (isPlayerInside) {
          setPlayerPos([playerPos[0], playerPos[1] + deltaLiftY, playerPos[2]]);
        }
      }
    }

    // 2. Sliding Door Animation
    if (elevatorState === 'OPENING') {
      setDoorOpenRatio((prev) => {
        const next = Math.min(1, prev + delta * 1.6);
        if (next >= 1) {
          setElevatorState('DOORS_OPEN');
        }
        return next;
      });
    } else if (elevatorState === 'CLOSING') {
      setDoorOpenRatio((prev) => {
        const next = Math.max(0, prev - delta * 1.6);
        if (next <= 0) {
          setElevatorState('IDLE_DOORS_CLOSED');
        }
        return next;
      });
    }

    // Update physical door mesh positions
    const doorSlide = doorOpenRatio * 0.58;
    if (leftDoorRef.current) leftDoorRef.current.position.x = -0.32 - doorSlide;
    if (rightDoorRef.current) rightDoorRef.current.position.x = 0.32 + doorSlide;
    if (outerLeftDoorRef.current) outerLeftDoorRef.current.position.x = -0.32 - doorSlide;
    if (outerRightDoorRef.current) outerRightDoorRef.current.position.x = 0.32 + doorSlide;
  });

  return (
    <group name="Elevator_System">
      {/* Elevator Shaft (Tower Height 36m) */}
      <mesh position={[0, 16.5, -5]}>
        <boxGeometry args={[2.8, 33, 2.6]} />
        <meshPhysicalMaterial
          color="#0c1824"
          transparent
          opacity={0.35}
          roughness={0.15}
          metalness={0.7}
          transmission={0.4}
        />
      </mesh>

      {/* Structural Steel Shaft Columns */}
      <mesh position={[-1.38, 16.5, -6.28]}>
        <boxGeometry args={[0.08, 33, 0.08]} />
        <meshStandardMaterial color="#222b35" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[1.38, 16.5, -6.28]}>
        <boxGeometry args={[0.08, 33, 0.08]} />
        <meshStandardMaterial color="#222b35" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[-1.38, 16.5, -3.72]}>
        <boxGeometry args={[0.08, 33, 0.08]} />
        <meshStandardMaterial color="#222b35" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[1.38, 16.5, -3.72]}>
        <boxGeometry args={[0.08, 33, 0.08]} />
        <meshStandardMaterial color="#222b35" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Moving Elevator Cabin */}
      <group ref={cabinRef} position={[0, currentLiftY.current, -5]}>
        {/* Cabin Floor / Platform */}
        <mesh position={[0, 0.05, 0]} receiveShadow>
          <boxGeometry args={[2.4, 0.1, 2.2]} />
          <meshStandardMaterial color="#2a2e33" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Cabin Ceiling with Recessed Warm LED Strip */}
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[2.4, 0.1, 2.2]} />
          <meshStandardMaterial color="#373d44" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 2.44, 0]}>
          <planeGeometry args={[1.6, 1.4]} />
          <meshStandardMaterial
            color="#fff8e7"
            emissive="#ffecb3"
            emissiveIntensity={1.8}
            side={THREE.DoubleSide}
          />
        </mesh>
        <pointLight position={[0, 2.2, 0]} intensity={1.2} distance={4} color="#fff2df" />

        {/* Cabin Rear Mirror Wall */}
        <mesh position={[0, 1.25, -1.05]}>
          <planeGeometry args={[2.3, 2.38]} />
          <meshPhysicalMaterial
            color="#d8e2ec"
            roughness={0.02}
            metalness={0.98}
            reflectivity={0.95}
          />
        </mesh>

        {/* Cabin Left & Right Walls */}
        <mesh position={[-1.15, 1.25, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[2.1, 2.38]} />
          <meshStandardMaterial color="#47525d" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[1.15, 1.25, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[2.1, 2.38]} />
          <meshStandardMaterial color="#47525d" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Stainless Steel Handrail */}
        <mesh position={[0, 0.95, -0.98]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 2.1, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Cabin Front Sliding Doors (Inner) */}
        <mesh ref={leftDoorRef} position={[-0.32, 1.25, 1.05]}>
          <boxGeometry args={[0.62, 2.36, 0.04]} />
          <meshStandardMaterial color="#788896" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh ref={rightDoorRef} position={[0.32, 1.25, 1.05]}>
          <boxGeometry args={[0.62, 2.36, 0.04]} />
          <meshStandardMaterial color="#788896" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Digital Floor Indicator inside Cabin */}
        <mesh position={[0.9, 1.5, 0.9]}>
          <boxGeometry args={[0.15, 0.28, 0.02]} />
          <meshStandardMaterial color="#1a202c" />
        </mesh>
      </group>

      {/* Outer Hoistway Doors at Current Floor */}
      <group position={[0, FLOOR_HEIGHTS[currentFloor] || 0, -3.9]}>
        <mesh ref={outerLeftDoorRef} position={[-0.32, 1.25, 0]}>
          <boxGeometry args={[0.62, 2.4, 0.04]} />
          <meshStandardMaterial color="#55606d" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh ref={outerRightDoorRef} position={[0.32, 1.25, 0]}>
          <boxGeometry args={[0.62, 2.4, 0.04]} />
          <meshStandardMaterial color="#55606d" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Exterior Call Button Panel */}
        <mesh position={[0.85, 1.2, 0.05]}>
          <boxGeometry args={[0.1, 0.25, 0.02]} />
          <meshStandardMaterial
            color="#2d3748"
            emissive={elevatorState === 'MOVING' ? '#e53e3e' : '#38a169'}
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>
    </group>
  );
}
