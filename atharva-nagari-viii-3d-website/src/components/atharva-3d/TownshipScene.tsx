'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { FloorFinish, KitchenFinish, HotspotItem, LightingMode } from '@/types/atharva';
import { HOTSPOTS_DATA } from '@/lib/atharvaData';

interface TownshipSceneProps {
  lightingMode: LightingMode;
  floorFinish: FloorFinish;
  kitchenFinish: KitchenFinish;
  onSelectHotspot: (hotspot: HotspotItem) => void;
  selectedHotspotId: string | null;
  gateOpen: boolean;
  sampleFlatDoorOpen: boolean;
}

export default function TownshipScene({
  lightingMode,
  floorFinish,
  kitchenFinish,
  onSelectHotspot,
  selectedHotspotId,
  gateOpen,
  sampleFlatDoorOpen,
}: TownshipSceneProps) {
  const boomBarrierRef = useRef<THREE.Group>(null);
  const flatDoorRef = useRef<THREE.Mesh>(null);
  const poolWaterRef = useRef<THREE.Mesh>(null);

  // Materials based on customization mode
  const floorMaterial = useMemo(() => {
    switch (floorFinish) {
      case 'wood':
        return new THREE.MeshStandardMaterial({
          color: '#8c5932',
          roughness: 0.35,
          metalness: 0.05,
        });
      case 'vitrified':
        return new THREE.MeshStandardMaterial({
          color: '#e4e7eb',
          roughness: 0.15,
          metalness: 0.2,
        });
      case 'marble':
      default:
        return new THREE.MeshStandardMaterial({
          color: '#f8fafc',
          roughness: 0.08,
          metalness: 0.12,
        });
    }
  }, [floorFinish]);

  const kitchenMaterial = useMemo(() => {
    switch (kitchenFinish) {
      case 'white':
        return new THREE.MeshStandardMaterial({
          color: '#f8fafc',
          roughness: 0.15,
          metalness: 0.1,
        });
      case 'charcoal':
        return new THREE.MeshStandardMaterial({
          color: '#1e293b',
          roughness: 0.3,
          metalness: 0.5,
        });
      case 'walnut':
      default:
        return new THREE.MeshStandardMaterial({
          color: '#5c3822',
          roughness: 0.4,
          metalness: 0.08,
        });
    }
  }, [kitchenFinish]);

  // Animated boom barrier and pool water waves
  useFrame(({ clock }, delta) => {
    if (boomBarrierRef.current) {
      const targetAngle = gateOpen ? -Math.PI / 2.3 : 0;
      boomBarrierRef.current.rotation.z = THREE.MathUtils.lerp(
        boomBarrierRef.current.rotation.z,
        targetAngle,
        delta * 3
      );
    }

    if (flatDoorRef.current) {
      const targetAngle = sampleFlatDoorOpen ? -Math.PI / 2.2 : 0;
      flatDoorRef.current.rotation.y = THREE.MathUtils.lerp(
        flatDoorRef.current.rotation.y,
        targetAngle,
        delta * 3.5
      );
    }

    if (poolWaterRef.current) {
      const mat = poolWaterRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.opacity = 0.8 + Math.sin(clock.getElapsedTime() * 2) * 0.05;
      }
    }
  });

  const isNight = lightingMode === 'night';
  const isGolden = lightingMode === 'golden';

  return (
    <group name="Atharva_Township_Master_Scene">
      {/* ============================================================ */}
      {/* 1. GROUND PLANE & BESA-PIPLA ROAD */}
      {/* ============================================================ */}
      {/* Society Base Terrain */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[90, 0.1, 100]} />
        <meshStandardMaterial color="#1a202c" roughness={0.8} />
      </mesh>

      {/* Main Besa-Pipla Arterial Road */}
      <mesh position={[0, 0.01, 41]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[86, 14]} />
        <meshStandardMaterial
          color="#1e2229"
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* Road Center Divider Dashed Strip */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={`divider-${i}`} position={[-32 + i * 8, 0.02, 41]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.2, 0.22]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Pedestrian Zebra Crossing at Grand Gate */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`zebra-${i}`} position={[-5.6 + i * 1.6, 0.02, 36.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.7, 3.8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Paved Entrance Driveway with Pavers */}
      <mesh position={[0, 0.01, 24]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial color="#374151" roughness={0.6} />
      </mesh>

      {/* ============================================================ */}
      {/* 2. GRAND ENTRANCE GATE & SECURITY PORTAL ("ATHARVA NAGARI VIII") */}
      {/* ============================================================ */}
      <group position={[0, 0, 36]} name="Grand_Entrance_Portal">
        {/* Main Portal Crossbeam & Frame */}
        <mesh position={[0, 4.2, 0]} castShadow>
          <boxGeometry args={[14, 0.8, 1.8]} />
          <meshStandardMaterial color="#2d3748" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Left Portal Tower Column */}
        <mesh position={[-6.5, 2.1, 0]} castShadow>
          <boxGeometry args={[1.0, 4.2, 1.8]} />
          <meshStandardMaterial color="#4a5568" roughness={0.4} />
        </mesh>
        {/* Right Portal Tower Column */}
        <mesh position={[6.5, 2.1, 0]} castShadow>
          <boxGeometry args={[1.0, 4.2, 1.8]} />
          <meshStandardMaterial color="#4a5568" roughness={0.4} />
        </mesh>

        {/* Illuminated Marquee Plaque: ATHARVA NAGARI VIII */}
        <mesh position={[0, 4.2, 0.95]}>
          <planeGeometry args={[12.6, 0.7]} />
          <meshStandardMaterial
            color={isNight ? '#fffaed' : '#ffffff'}
            emissive={isNight ? '#ffd27d' : '#fff4cc'}
            emissiveIntensity={isNight ? 1.4 : 0.4}
          />
        </mesh>
        <Text
          position={[0, 4.2, 0.98]}
          fontSize={0.38}
          color="#0f172a"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
        >
          ATHARVA NAGARI VIII
        </Text>

        {/* Central 24/7 Security Cabin */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[2.0, 3.0, 3.0]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
        </mesh>
        {/* Cabin Glass Observation Windows */}
        <mesh position={[0, 1.6, 1.52]}>
          <planeGeometry args={[1.6, 1.2]} />
          <meshPhysicalMaterial
            color="#a0aec0"
            transparent
            opacity={0.5}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
        <mesh position={[0, 1.6, -1.52]}>
          <planeGeometry args={[1.6, 1.2]} />
          <meshPhysicalMaterial
            color="#a0aec0"
            transparent
            opacity={0.5}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* Automated Boom Barrier (Ingress Lane) */}
        <group position={[-1.2, 1.0, 1.2]}>
          {/* Barrier Base Post */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 1.0, 16]} />
            <meshStandardMaterial color="#e53e3e" metalness={0.5} />
          </mesh>
          {/* Animated Barrier Arm */}
          <group ref={boomBarrierRef} position={[0, 0.45, 0]}>
            <mesh position={[-2.2, 0, 0]} rotation={[0, 0, 0]}>
              <boxGeometry args={[4.4, 0.08, 0.04]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive={isNight ? '#e53e3e' : '#000000'}
                emissiveIntensity={isNight ? 0.8 : 0}
              />
            </mesh>
          </group>
        </group>

        {/* Luxury Vehicles at Gate Entry */}
        {/* Incoming Sedan */}
        <group position={[-3.6, 0.55, 3.5]}>
          <mesh castShadow position={[0, 0.25, 0]}>
            <boxGeometry args={[1.8, 0.65, 4.0]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.75, -0.2]} castShadow>
            <boxGeometry args={[1.5, 0.55, 2.2]} />
            <meshPhysicalMaterial
              color="#0f172a"
              metalness={0.8}
              roughness={0.1}
              transparent
              opacity={0.85}
            />
          </mesh>
          {/* Headlights */}
          <mesh position={[-0.65, 0.35, -2.02]}>
            <circleGeometry args={[0.14, 16]} />
            <meshBasicMaterial color="#fffaed" />
          </mesh>
          <mesh position={[0.65, 0.35, -2.02]}>
            <circleGeometry args={[0.14, 16]} />
            <meshBasicMaterial color="#fffaed" />
          </mesh>
        </group>

        {/* Boundary Walls & Top Coping */}
        <mesh position={[-18, 1.2, 0]}>
          <boxGeometry args={[22, 2.4, 0.4]} />
          <meshStandardMaterial color="#f7fafc" roughness={0.6} />
        </mesh>
        <mesh position={[18, 1.2, 0]}>
          <boxGeometry args={[22, 2.4, 0.4]} />
          <meshStandardMaterial color="#f7fafc" roughness={0.6} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 3. 12-STOREY HIGH-RISE RESIDENTIAL TOWERS (ATHARVA NAGARI VIII) */}
      {/* ============================================================ */}
      <group position={[0, 0, -4]} name="Atharva_High_Rise_Towers">
        {/* Ground Podium Stilt Parking / Base Structure */}
        <mesh position={[0, 1.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[48, 2.6, 18]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>

        {/* Stilt Parking Pillars */}
        {[-20, -12, -4, 4, 12, 20].map((colX) => (
          <mesh key={`col-${colX}`} position={[colX, 1.3, 8]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 2.6, 16]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
          </mesh>
        ))}

        {/* Main 12 Residential Floors (Symmetrical Multi-Wing Complex) */}
        {/* Height per floor = 2.6m -> 12 floors = 31.2m */}
        <mesh position={[0, 17.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[46, 30, 16]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
        </mesh>

        {/* Architectural Signature Cantilever Frames & Balconies */}
        {/* Wood-texture vertical accent ribbons matching elevation renders */}
        {[-18, -10, 10, 18].map((fx) => (
          <group key={`accent-frame-${fx}`}>
            <mesh position={[fx, 17.5, 8.2]} castShadow>
              <boxGeometry args={[4.2, 29.5, 0.6]} />
              <meshStandardMaterial
                color="#6d3f1f" // Rich teak/walnut wood framing
                roughness={0.45}
                metalness={0.15}
              />
            </mesh>
            {/* Ambient LED strip washer lights on frames in night mode */}
            {isNight && (
              <pointLight position={[fx, 18, 9.2]} intensity={0.9} distance={10} color="#ffb74d" />
            )}
          </group>
        ))}

        {/* Central Glass Double-Height Lobby Feature */}
        <mesh position={[0, 17.5, 8.1]}>
          <planeGeometry args={[6.5, 29.5]} />
          <meshPhysicalMaterial
            color="#1e293b"
            transparent
            opacity={0.65}
            roughness={0.08}
            metalness={0.9}
          />
        </mesh>

        {/* Balconies on All 12 Floors */}
        {Array.from({ length: 12 }).map((_, floorIdx) => {
          const floorY = 3.2 + floorIdx * 2.5;
          return (
            <group key={`floor-balconies-${floorIdx}`} position={[0, floorY, 8.2]}>
              {/* Left Wing Balcony Slab */}
              <mesh position={[-14, 0, 0.6]} castShadow>
                <boxGeometry args={[12, 0.15, 1.4]} />
                <meshStandardMaterial color="#e2e8f0" />
              </mesh>
              {/* Left Wing Glass Railing */}
              <mesh position={[-14, 0.55, 1.25]}>
                <boxGeometry args={[11.8, 0.95, 0.05]} />
                <meshPhysicalMaterial
                  color="#94a3b8"
                  transparent
                  opacity={0.45}
                  roughness={0.1}
                  metalness={0.8}
                />
              </mesh>

              {/* Right Wing Balcony Slab */}
              <mesh position={[14, 0, 0.6]} castShadow>
                <boxGeometry args={[12, 0.15, 1.4]} />
                <meshStandardMaterial color="#e2e8f0" />
              </mesh>
              {/* Right Wing Glass Railing */}
              <mesh position={[14, 0.55, 1.25]}>
                <boxGeometry args={[11.8, 0.95, 0.05]} />
                <meshPhysicalMaterial
                  color="#94a3b8"
                  transparent
                  opacity={0.45}
                  roughness={0.1}
                  metalness={0.8}
                />
              </mesh>

              {/* Windows with warm night glow */}
              {isNight && (
                <>
                  <mesh position={[-14, 1.2, 0]}>
                    <planeGeometry args={[10, 1.6]} />
                    <meshBasicMaterial color="#ffe8b3" />
                  </mesh>
                  <mesh position={[14, 1.2, 0]}>
                    <planeGeometry args={[10, 1.6]} />
                    <meshBasicMaterial color="#ffe8b3" />
                  </mesh>
                </>
              )}
            </group>
          );
        })}

        {/* Rooftop Architectural Pergola & Crown */}
        <mesh position={[0, 33.2, 0]} castShadow>
          <boxGeometry args={[47, 0.8, 17]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Rooftop Louver Fins */}
        {Array.from({ length: 9 }).map((_, i) => (
          <mesh key={`roof-fin-${i}`} position={[-20 + i * 5, 34.2, 0]} castShadow>
            <boxGeometry args={[0.3, 1.4, 15]} />
            <meshStandardMaterial color="#6d3f1f" roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* ============================================================ */}
      {/* 4. PODIUM AMENITIES & KIDS PLAY ARENA (Matching playarea.jpg) */}
      {/* ============================================================ */}
      <group position={[-16, 0.9, 8]} name="Podium_Garden_Kids_Play">
        {/* Raised Podium Deck Base */}
        <mesh position={[0, -0.45, 0]} receiveShadow>
          <boxGeometry args={[20, 0.9, 22]} />
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </mesh>

        {/* Circular Manicured Green Lawn */}
        <mesh position={[2, 0.02, 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[6.5, 32]} />
          <meshStandardMaterial color="#2d6a4f" roughness={0.9} />
        </mesh>

        {/* Kids Multi-Deck Play Station & Slide */}
        <group position={[-4, 0, -3]}>
          {/* Play House Platform */}
          <mesh position={[0, 1.2, 0]} castShadow>
            <boxGeometry args={[1.8, 0.1, 1.8]} />
            <meshStandardMaterial color="#d97706" />
          </mesh>
          {/* Canopy Roof (Yellow/Green) */}
          <mesh position={[0, 2.5, 0]} castShadow>
            <coneGeometry args={[1.4, 0.9, 4]} />
            <meshStandardMaterial color="#16a34a" />
          </mesh>
          {/* Colorful Curved Slide (Red) */}
          <mesh position={[1.4, 0.6, 0]} rotation={[0, 0, -0.6]} castShadow>
            <cylinderGeometry args={[0.35, 0.45, 2.6, 16, 1, true, 0, Math.PI]} />
            <meshStandardMaterial color="#dc2626" roughness={0.2} />
          </mesh>
          {/* Straight Yellow Slide */}
          <mesh position={[-1.2, 0.55, 0]} rotation={[0, 0, 0.55]} castShadow>
            <cylinderGeometry args={[0.3, 0.4, 2.4, 16, 1, true, 0, Math.PI]} />
            <meshStandardMaterial color="#eab308" roughness={0.2} />
          </mesh>
          {/* Swing Set Frame */}
          <group position={[0, 0, 3]}>
            <mesh position={[-1.2, 1.0, 0]} rotation={[0.2, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 2.1, 8]} />
              <meshStandardMaterial color="#2563eb" />
            </mesh>
            <mesh position={[1.2, 1.0, 0]} rotation={[-0.2, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 2.1, 8]} />
              <meshStandardMaterial color="#2563eb" />
            </mesh>
            <mesh position={[0, 2.0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 2.4, 8]} />
              <meshStandardMaterial color="#2563eb" />
            </mesh>
          </group>
        </group>

        {/* Tall Royal Palm Trees */}
        {[
          { x: 5, z: -5 },
          { x: 6, z: 4 },
          { x: -5, z: 6 },
        ].map((palm, idx) => (
          <group key={`palm-${idx}`} position={[palm.x, 0, palm.z]}>
            {/* Trunk */}
            <mesh position={[0, 3.2, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.28, 6.4, 12]} />
              <meshStandardMaterial color="#785338" roughness={0.9} />
            </mesh>
            {/* Fronds */}
            {Array.from({ length: 7 }).map((_, fIdx) => (
              <mesh
                key={`frond-${fIdx}`}
                position={[0, 6.3, 0]}
                rotation={[0.5, (fIdx * Math.PI) / 3.5, 0.3]}
                castShadow
              >
                <coneGeometry args={[1.5, 3.2, 5]} />
                <meshStandardMaterial color="#15803d" roughness={0.8} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Bollard Garden Lights */}
        {[-5, 0, 5].map((bx) => (
          <group key={`bollard-${bx}`} position={[bx, 0.3, 8]}>
            <mesh>
              <cylinderGeometry args={[0.06, 0.06, 0.6, 12]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.28, 0]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshStandardMaterial
                color="#fef08a"
                emissive="#fef08a"
                emissiveIntensity={isNight ? 1.5 : 0.2}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* ============================================================ */}
      {/* 5. CLUBHOUSE & SWIMMING POOL DECK */}
      {/* ============================================================ */}
      <group position={[20, 0.9, 10]} name="Clubhouse_Pool_Deck">
        {/* Pool Deck Platform */}
        <mesh position={[0, -0.45, 0]} receiveShadow>
          <boxGeometry args={[16, 0.9, 20]} />
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </mesh>

        {/* Crystal Clear Swimming Pool */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[11, 0.8, 7.5]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>
        {/* Pool Water Surface */}
        <mesh ref={poolWaterRef} position={[0, 0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10.6, 7.1]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            transparent
            opacity={0.85}
            roughness={0.04}
            metalness={0.2}
            transmission={0.65}
          />
        </mesh>

        {/* Sun Loungers */}
        {[-3.5, 0, 3.5].map((lx) => (
          <group key={`lounger-${lx}`} position={[lx, 0.15, 5.5]}>
            <mesh castShadow>
              <boxGeometry args={[1.1, 0.2, 2.2]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.35, -0.7]} rotation={[0.4, 0, 0]}>
              <boxGeometry args={[1.0, 0.15, 0.8]} />
              <meshStandardMaterial color="#38bdf8" />
            </mesh>
          </group>
        ))}
      </group>

      {/* ============================================================ */}
      {/* 6. SAMPLE LUXURY 3 BHK FLAT INTERIOR (12th Floor, y = 28.6m) */}
      {/* ============================================================ */}
      <group position={[10, 28.6, -5]} name="Luxury_Sample_Flat_Interior">
        {/* Walkable Living & Dining Room Floor (Customizable) */}
        <mesh position={[0, 0.05, 0]} receiveShadow material={floorMaterial}>
          <boxGeometry args={[12, 0.1, 10]} />
        </mesh>

        {/* False Ceiling with Cove LED Lighting */}
        <mesh position={[0, 2.7, 0]}>
          <boxGeometry args={[11.8, 0.1, 9.8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        {/* Recessed Warm Cove Glow */}
        <mesh position={[0, 2.64, 0]}>
          <planeGeometry args={[9.5, 7.5]} />
          <meshStandardMaterial
            color="#fff8e7"
            emissive="#ffecb3"
            emissiveIntensity={1.2}
            side={THREE.DoubleSide}
          />
        </mesh>
        <pointLight position={[0, 2.4, 0]} intensity={1.5} color="#fff4df" distance={8} />

        {/* Exterior Walls & Windows */}
        {/* Back Wall */}
        <mesh position={[0, 1.4, -4.95]} castShadow>
          <boxGeometry args={[12, 2.6, 0.1]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
        </mesh>
        {/* Right Wall */}
        <mesh position={[5.95, 1.4, 0]} castShadow>
          <boxGeometry args={[0.1, 2.6, 10]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
        </mesh>

        {/* Front Wall with Balcony French Slider Doors */}
        <mesh position={[-3.5, 1.4, 4.95]}>
          <boxGeometry args={[5, 2.6, 0.1]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>
        <mesh position={[3.5, 1.4, 4.95]}>
          <boxGeometry args={[5, 2.6, 0.1]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>
        {/* French Balcony Sliding Glass Door */}
        <mesh position={[0, 1.3, 4.95]}>
          <planeGeometry args={[2.0, 2.4]} />
          <meshPhysicalMaterial
            color="#cbd5e1"
            transparent
            opacity={0.35}
            roughness={0.05}
            metalness={0.9}
          />
        </mesh>

        {/* Private Skyline Balcony Deck */}
        <mesh position={[0, 0.05, 6.2]} receiveShadow>
          <boxGeometry args={[10, 0.1, 2.4]} />
          <meshStandardMaterial color="#475569" roughness={0.3} />
        </mesh>
        {/* Balcony Glass Railing */}
        <mesh position={[0, 0.6, 7.35]}>
          <boxGeometry args={[9.8, 1.0, 0.06]} />
          <meshPhysicalMaterial
            color="#94a3b8"
            transparent
            opacity={0.4}
            roughness={0.08}
            metalness={0.8}
          />
        </mesh>

        {/* Luxury Furniture: Modern Sectional Sofa */}
        <group position={[-2.5, 0.1, -1]}>
          {/* Main Seat */}
          <mesh position={[0, 0.25, 0]} castShadow>
            <boxGeometry args={[3.2, 0.4, 1.4]} />
            <meshStandardMaterial color="#334155" roughness={0.7} />
          </mesh>
          {/* Back Cushion */}
          <mesh position={[0, 0.65, -0.55]} castShadow>
            <boxGeometry args={[3.2, 0.45, 0.3]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
          {/* Marble Coffee Table */}
          <mesh position={[0, 0.25, 1.4]} castShadow>
            <cylinderGeometry args={[0.8, 0.8, 0.35, 24]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.1} />
          </mesh>
        </group>

        {/* Entertainment TV Unit */}
        <group position={[-2.5, 0.1, 4.5]}>
          {/* Floating Credenza */}
          <mesh position={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[3.0, 0.4, 0.5]} />
            <meshStandardMaterial color="#5c3822" roughness={0.4} />
          </mesh>
          {/* 75" UHD Smart OLED Display */}
          <mesh position={[0, 1.35, 0]}>
            <boxGeometry args={[2.4, 1.35, 0.05]} />
            <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.9} />
          </mesh>
        </group>

        {/* Modular Kitchen with Breakfast Island (Customizable Finish) */}
        <group position={[3.2, 0.1, -2]}>
          {/* Island Counter Base */}
          <mesh position={[0, 0.45, 0]} castShadow material={kitchenMaterial}>
            <boxGeometry args={[3.2, 0.9, 1.2]} />
          </mesh>
          {/* Quartz Countertop */}
          <mesh position={[0, 0.92, 0]} castShadow>
            <boxGeometry args={[3.3, 0.08, 1.3]} />
            <meshStandardMaterial color="#ffffff" roughness={0.15} metalness={0.1} />
          </mesh>
          {/* Bar Stools */}
          {[-0.9, 0, 0.9].map((sx) => (
            <mesh key={`stool-${sx}`} position={[sx, 0.35, 1.0]} castShadow>
              <cylinderGeometry args={[0.22, 0.22, 0.7, 16]} />
              <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.3} />
            </mesh>
          ))}
        </group>

        {/* Master Bedroom Section with Wooden Flooring */}
        <group position={[3.5, 0.1, 2.5]}>
          {/* Master Bed King Platform */}
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[2.4, 0.5, 2.6]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.8} />
          </mesh>
          {/* Padded Headboard */}
          <mesh position={[0, 0.85, -1.25]} castShadow>
            <boxGeometry args={[2.5, 0.9, 0.18]} />
            <meshStandardMaterial color="#475569" roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 7. INTERACTIVE 3D HOTSPOT PINS */}
      {/* ============================================================ */}
      {HOTSPOTS_DATA.map((hotspot) => {
        const isSelected = selectedHotspotId === hotspot.id;
        const [hx, hy, hz] = hotspot.position;

        return (
          <group
            key={hotspot.id}
            position={[hx, hy, hz]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectHotspot(hotspot);
            }}
          >
            {/* Glowing Billboard Pin Badge */}
            <mesh position={[0, 0.5, 0]}>
              <sphereGeometry args={[0.32, 16, 16]} />
              <meshStandardMaterial
                color={isSelected ? '#f59e0b' : '#38bdf8'}
                emissive={isSelected ? '#f59e0b' : '#0284c7'}
                emissiveIntensity={1.8}
              />
            </mesh>

            {/* Pulsing Outer Aura Ring */}
            <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.45, 0.62, 24]} />
              <meshBasicMaterial
                color={isSelected ? '#fbbf24' : '#7dd3fc'}
                transparent
                opacity={0.7}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Vertical Marker Stem */}
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>

            {/* Title Label */}
            <Text
              position={[0, 1.15, 0]}
              fontSize={0.35}
              color="#ffffff"
              outlineWidth={0.04}
              outlineColor="#0f172a"
              anchorX="center"
              anchorY="middle"
            >
              {hotspot.title.split('&')[0]}
            </Text>
          </group>
        );
      })}
    </group>
  );
}
