# ZenLaser

[![CI](https://github.com/OfferPk/zenlaser/actions/workflows/ci.yml/badge.svg)](https://github.com/OfferPk/zenlaser/actions/workflows/ci.yml)
[![Deploy GitHub Pages](https://github.com/OfferPk/zenlaser/actions/workflows/pages.yml/badge.svg)](https://github.com/OfferPk/zenlaser/actions/workflows/pages.yml)
[![Android build](https://github.com/OfferPk/zenlaser/actions/workflows/android.yml/badge.svg)](https://github.com/OfferPk/zenlaser/actions/workflows/android.yml)

> **ZenLaser**: A sleek, calming offline laser optics and light reflection logic puzzle game. Rotate glass mirrors, beam splitters, and chromatic color filters to channel glowing radiant laser beams into crystal target resonators.

---

## 🌟 Live Demo & Downloads

- **Live Web Demo**: [https://offerpk.github.io/zenlaser/](https://offerpk.github.io/zenlaser/)
- **Android APK**: Download the latest build from [GitHub Actions Artifacts](https://github.com/OfferPk/zenlaser/actions/workflows/android.yml) (`zenlaser-apk`) or [Releases](https://github.com/OfferPk/zenlaser/releases).

---

## ✨ Features

- **100% Offline & Private**: Zero tracking, zero telemetry, zero advertisements, zero network requests. All level progress and moves are saved locally in device storage.
- **50 Solver-Verified Levels Across 5 Packs**:
  - **Pack 1: Reflection** (Levels 1–10): Master the fundamental angle of incidence with 45°/135° diagonal mirrors.
  - **Pack 2: Spectrum** (Levels 11–20): Filter pure white beams into vibrant primary colors (Red, Green, Blue, Cyan, Magenta, Yellow) to satisfy chromatic crystal resonators.
  - **Pack 3: Dispersion** (Levels 21–30): Utilize 3-way prism beam splitters to divide single lasers into multi-directional optical networks.
  - **Pack 4: Refraction** (Levels 31–40): Navigate intricate labyrinths featuring dark matter obstacles, multi-directional mirrors, and splitters.
  - **Pack 5: Prismatic Zen** (Levels 41–50): Master grand optical matrices with multi-stage light routing and resonant crystal arrays.
- **Procedural Crystalline Bell Synthesizer**: Realistic Web Audio harmonic synthesis. Ethereal glass bells on mirror rotations and resonant chord cascades on puzzle completion without audio files.
- **60fps Blooming Canvas Graphics**: High-DPI canvas renderer with neon laser glows, animated energy flow, and crystal spark particles.
- **Intuitive Controls**: Tap or click to rotate optical pieces.
- **Smart Optical Hint Assistant**: Instantly identifies and aligns misoriented components.
- **Unlimited Undo & Reset**: Experiment freely with zero stress.
- **Cross-Platform**: Play as a Progressive Web App (PWA) in any modern web browser or as a native Android app via Capacitor.

---

## 📱 Interface Preview

```
+-------------------------------------------------------------+
|  [◆] ZenLaser       Pack 1 • First Ray            [🔊] [▦] [?] |
|                                                             |
|   Level 1: First Ray         ● ○ ○              Moves: 0    |
|  +-------------------------------------------------------+  |
|  |                                                       |  |
|  |     [Laser] ======>  [ Mirror ╱ ]                     |  |
|  |                           ║                           |  |
|  |                           ║                           |  |
|  |                           ▼                           |  |
|  |                      [Target ◆]                       |  |
|  |                                                       |  |
|  +-------------------------------------------------------+  |
|                                                             |
|           [Undo]               [Reset]            [Hint]    |
+-------------------------------------------------------------+
```

---

## 🛠️ Building & Development

### Prerequisites
- Node.js (v18+)
- npm

### Setup
```bash
# Clone the repository
git clone https://github.com/OfferPk/zenlaser.git
cd zenlaser

# Install dependencies
npm ci
```

### Running Tests
```bash
npm test
```

### Building for Web
```bash
npm run build
```
This compiles runtime assets into `www/`.

### Android Build (Capacitor)
```bash
npx cap sync android
cd android
./gradlew assembleDebug
```

---

## 📄 License
MIT License. Free and open source for everyone.
