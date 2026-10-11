# Atharva Nagari VIII (Nagpur) - 3D WebGL Asset Optimization & Pipeline Standard

**Project**: Real-Time Interactive 3D Walkthrough Website  
**Location**: Besa–Pipla Road, Pipla, Nagpur – 440037  
**Builder**: Atharva Infrastructures  
**Target Package Size**: < 35 MB total GLB payload  
**Target Performance**: Locked 60 FPS on standard modern desktop & mobile browsers  

---

## 1. Scope of 3D Architectural Assets

### 1.1 Exterior Township Assets
1. **Grand Entrance Portal & Security Cabin** (`ATHARVA NAGARI VIII`):
   - Portal canopy with illuminated acrylic typography.
   - 24/7 security cabin with clear vision glass and security monitor.
   - Dual motorized boom barriers with safety striping.
   - Wet reflective asphalt road with pedestrian zebra crossings.
2. **High-Rise Residential Towers (12 Floors)**:
   - Alternating cantilever architectural box framing with teak/walnut wood texture.
   - Crisp white stucco exterior panels.
   - Clear glass balcony railings with dark bronze/charcoal mullions.
   - Symmetrical multi-wing configuration with central lobby glass elevator shaft.
   - Rooftop architectural pergola crown with mood lighting.
3. **Podium Amenities & Landscape**:
   - Manicured circular green amphitheater lawn with stone curbing.
   - Children’s play equipment (multi-deck castle, bright red spiral slide, yellow chute, swing set).
   - Tall Royal Palm trees (`Roystonea regia`) and flowering shrubs.
   - Pedestrian garden pathways with designer bollard fixtures.
4. **Clubhouse & Rooftop Swimming Pool**:
   - Sun deck with loungers and parasols.
   - Modern glass-wrapped fitness center and community hall facade.

### 1.2 Interior Sample Flats (2 BHK & 3 BHK)
1. **Living & Dining Hall**:
   - False ceiling with warm cove LED lighting channels.
   - Luxury 3-seater sectional sofa with Italian marble coffee table.
   - 75" wall-mounted OLED screen with floating wooden media credenza.
   - Wide sliding French glass door opening to the skyline balcony.
2. **Modular Kitchen & Breakfast Island**:
   - Dual-tone cabinets (customizable: Natural Walnut, Alpine White, Matte Obsidian).
   - Quartz/Granite countertop island with modern brass bar stools.
   - Recessed chimney and gas cooktop alcove.
3. **Master Bedroom Suite**:
   - Natural teak wood / herringbone flooring.
   - King-size bed with upholstered fabric headboard and reading sconces.
   - Large corner glass windows capturing Besa-Pipla sunsets.

---

## 2. Geometry & Collision Mesh Specifications

### 2.1 Invisible Proxy Collision Meshes (`UBX_` & `UCX_`)
To achieve high-speed collision checking and smooth stair traversal without GPU physics bottlenecks:
- **Never collide against visual high-poly architectural meshes.**
- Create simplified, low-poly proxy collision volumes:
  - `UBX_Floor_Ground`: Simple box for main asphalt and walkways.
  - `UBX_Stairs_Riser_01`, `02`, `03` (or an inclined collision ramp `UCX_Podium_Ramp` with an angle $\le 28^\circ$): Allows kinematic character controllers to step up smoothly without clipping.
  - `UBX_Wall_Tower_A`, `UBX_Wall_Tower_B`: Simplified box colliders for exterior and interior room boundaries.
  - `UBX_Balcony_Railing`: Invisible proxy box height $1.15$m preventing player falloff.
- In Blender / 3ds Max: Set the object name prefix to `UBX_` (Box collider) or `UCX_` (Convex Hull).
- In the WebGL loader: Parse objects with `UBX_` prefix, set `visible = false`, and register them into Rapier / Three.js Raycaster mesh collision list.

### 2.2 Polygon Budgets
| Component | Max Triangles | Draw Calls (Batched) |
| :--- | :--- | :--- |
| **Township Exterior Towers (12 Floors)** | 95,000 tris | 12 - 18 |
| **Grand Entrance Gate & Cabin** | 12,000 tris | 4 - 6 |
| **Podium Garden, Lawn & Playground** | 35,000 tris | 8 - 12 |
| **Palm Trees & Vegetation** (Alpha cards) | 28,000 tris | 4 (Instanced) |
| **3 BHK Sample Flat (Furnished Interior)** | 65,000 tris | 15 - 20 |
| **Total Scene Budget** | **< 235,000 tris** | **< 60 draw calls** |

---

## 3. Materials, Textures & Packed PBR Standard

### 3.1 Packed ORM Texture Channels
To reduce HTTP requests and GPU texture memory, pack textures into single 8-bit RGBA maps:
- **Red (R)**: Ambient Occlusion (AO)
- **Green (G)**: Roughness
- **Blue (B)**: Metallic
- **Alpha (A)**: Optional Height / Displacement or Opacity mask

### 3.2 Texture Resolutions
- **Hero Architectural Facade & Floor Tiles**: $2048 \times 2048$ px (JPEG / WebP / KTX2).
- **Secondary Props & Furniture**: $1024 \times 1024$ px.
- **Vegetation Leaves & Accents**: $512 \times 512$ px.
- **Color Space**: sRGB for BaseColor / Albedo; Linear for Normal and ORM maps.

### 3.3 Baked Indirect Lighting & Lightmaps
- Real-time dynamic shadows for every window and balcony across 12 floors will overwhelm mobile GPUs.
- **Workflow**:
  1. Bake high-resolution indirect bounced lighting and ambient occlusion into a secondary UV channel (`UV2`) using Blender Cycles or 3ds Max V-Ray / Corona.
  2. Set directional sunlight to cast shadows only from the main exterior towers and entrance gate.
  3. Sample flat interior cove lighting should be pre-baked into lightmaps with subtle Three.js point lights added for specular highlights.

---

## 4. Export & Compression Pipeline (GLB + DRACO / KTX2)

### 4.1 Blender glTF 2.0 Export Flags
When exporting from Blender:
```
File -> Export -> glTF 2.0 (.glb)
- Format: GLB Binary
- Include: Selected Objects + Custom Properties
- Transform: +Y Up (standard WebGL)
- Geometry:
  [x] Apply Modifiers
  [x] UVs
  [x] Normals
  [x] Tangents
  [x] Vertex Colors (if used for AO tinting)
  [x] Compression (DRACO)
```

### 4.2 glTF-Transform CLI Optimization Script
Run this terminal pipeline on the exported `.glb` file to achieve maximum compression:
```bash
# 1. Weld duplicate vertices
gltf-transform weld input.glb temp1.glb

# 2. Deduplicate shared material definitions
gltf-transform dedup temp1.glb temp2.glb

# 3. Simplify geometry if over poly-budget
gltf-transform simplify temp2.glb temp3.glb --ratio 0.85 --error 0.001

# 4. Compress textures to KTX2 / WebP
gltf-transform etc1s temp3.glb temp4.glb --quality 180

# 5. Apply DRACO mesh compression (quantization)
gltf-transform draco temp4.glb Atharva_Nagari_VIII_Optimized.glb \
  --quantize-position 14 \
  --quantize-normal 10 \
  --quantize-texcoord 12
```

---

## 5. WebGL 60 FPS Performance Checklist

- [x] **Draw Call Batching**: Static architectural elements merged by material using `THREE.BufferGeometryUtils.mergeGeometries`.
- [x] **Instanced Meshes**: Palm trees, balcony railings, and street bollards rendered via `InstancedMesh`.
- [x] **Frustum Culling**: Enabled across all mesh nodes.
- [x] **Tone Mapping**: `ACESFilmicToneMapping` with exposure tuned between `1.1` (Day) and `1.4` (Night).
- [x] **Device Pixel Ratio (DPR) Clamping**: `gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))` to prevent performance drops on Retina / 4K displays.
- [x] **Memory Cleanup**: Textures and geometries disposed upon unmounting.
