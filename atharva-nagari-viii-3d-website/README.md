# Atharva Nagari VIII - Luxury Interactive 3D Walkthrough Website

Real-time, interactive 3D WebGL township walkthrough for **Atharva Nagari VIII** (Atharva Infrastructures, Besa–Pipla Road, Nagpur).

- **Brand**: Atharva Infrastructures
- **Location**: Prime Besa–Pipla Road, Pipla, Nagpur – 440037
- **RERA No**: P50500053130
- **Direct Sales Contact**: +91 82618 32689

---

## 🌟 Key Features

1. **Township 3D Environment**:
   - 12-storey residential towers matching architectural elevations (alternating cantilevered teak wood framing boxes, glass balconies, rooftop pergolas).
   - Grand Entrance Portal (`ATHARVA NAGARI VIII`) with 24/7 security cabin, automated boom barriers, and wet asphalt road with zebra crossings matching `gate.jpg`.
   - Podium Amenities: Circular manicured green lawn, royal palm trees, children's play arena (slides, swings matching `playarea.jpg`), and garden walking paths.
   - Luxury 3 BHK Sample Flat: Living room, cove lighting, modular kitchen island, master bedroom with wooden flooring, and private skyline viewing balcony.

2. **Kinematic Character Controller**:
   - First-Person (FPV) and Third-Person (TPV) camera toggle.
   - Smooth stair-stepping raycast algorithm (up to 0.35m step height) for seamless stair climbing.
   - Jump with physics gravity ($g = -17.5\text{ m/s}^2$) and ground collision detection.
   - PointerLockControls mouse look.
   - Dynamic touch virtual joysticks for mobile visitors.

3. **12-Storey Elevator Transit**:
   - 7-state finite state machine with call trigger (`Press E`).
   - Floor selector panel (Ground to 12th Floor).
   - Animated sliding doors and kinematic vertical platform transporting the player.
   - Dual-tone penthouse arrival chime via Web Audio API.

4. **Lighting & Material Customizer**:
   - Daylight (5600K crisp sun), Golden Hour (3200K sunset), and Luxury Architectural Night (facade wash, balcony strip lights).
   - Interior Finish Toggles: Italian Statuario Marble, Teak Hardwood, or Vitrified floor tiles; Natural Walnut, Alpine White, or Matte Obsidian kitchen cabinets.

5. **Sales Lead Generation & Minimap HUD**:
   - Top-right radar minimap tracking real-time player position.
   - Interactive 3D hotspot pins with amenity cards.
   - VIP site visit booking modal with instant confetti confirmation.
   - Direct call and WhatsApp triggers to **+91 82618 32689**.

---

## 📁 Project Directory Structure

```
atharva-nagari-viii-3d-website/
├── public/
│   └── images/
│       └── atharva/               # Real architectural renders & photos
│           ├── poster.webp        # Launch poster & RERA details
│           ├── gate.jpg           # Grand entrance gate & security cabin
│           ├── elevation.png      # 12-storey front architectural elevation
│           ├── aerial.png         # Dusk township perspective
│           └── playarea.jpg       # Podium lawn & children's play area
├── src/
│   ├── app/
│   │   ├── globals.css            # Tailwind & styling
│   │   ├── layout.tsx             # Luxury SEO & OpenGraph metadata
│   │   └── page.tsx               # Root 3D walkthrough entry page
│   ├── components/
│   │   └── atharva-3d/
│   │       ├── AtharvaExperience.tsx    # Master R3F canvas container
│   │       ├── TownshipScene.tsx        # 3D architectural geometry & models
│   │       ├── CharacterController.tsx  # FPV/TPV, stairs, jump, mobile joysticks
│   │       ├── ElevatorSystem.tsx       # 12-storey elevator state machine & lift
│   │       ├── EnvironmentLighting.tsx  # Day, Golden Hour, and Night presets
│   │       ├── AtharvaOverlayUI.tsx     # Glassmorphism HUD, minimap, modals
│   │       └── standalone/              # Modular reference code
│   │           ├── RapierCharacterController.ts
│   │           └── ElevatorStateMachine.ts
│   ├── lib/
│   │   ├── atharvaData.ts         # Project specs, phone (+91 82618 32689), hotspots
│   │   └── sound.ts               # Web Audio API sound synthesizer
│   └── types/
│       └── atharva.ts             # TypeScript definitions
├── 3D_ASSET_OPTIMIZATION_GUIDE.md # Technical Blender-to-WebGL guide (< 35MB, 60 FPS)
├── next.config.mjs                # Next.js 3D transpile configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript compiler settings
├── vercel.json                    # Native Vercel framework configuration
└── package.json                   # Dependencies
```

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Navigate into this folder
cd atharva-nagari-viii-3d-website

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to Vercel (100% Ready)

### Option A: Via GitHub (Recommended)
1. Initialize a new Git repository inside this folder (or push it to your GitHub):
   ```bash
   cd atharva-nagari-viii-3d-website
   git init
   git add .
   git commit -m "Atharva Nagari VIII 3D interactive website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/atharva-nagari-viii-3d.git
   git push -u origin main
   ```
2. Log into [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository and click **"Deploy"**.

### Option B: Via Vercel CLI
```bash
cd atharva-nagari-viii-3d-website
npx vercel
```
Follow the command-line prompts to deploy instantly.
