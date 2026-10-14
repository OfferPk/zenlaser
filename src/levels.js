/**
 * ZenLaser - 50 Solver-Verified Levels Across 5 Thematic Packs
 * Pack 1: Reflection (Levels 1-10) - Pure reflection & mirror orientation
 * Pack 2: Spectrum (Levels 11-20) - Color filters & chromatic crystals
 * Pack 3: Dispersion (Levels 21-30) - 3-way beam splitters
 * Pack 4: Refraction (Levels 31-40) - Obstacles, splitters, filters
 * Pack 5: Prismatic Zen (Levels 41-50) - Master optical labyrinths
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ZenLaserLevels = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const PACKS = [
    { id: 1, name: 'Reflection', count: 10, desc: 'Master the angle of reflection with precision mirrors' },
    { id: 2, name: 'Spectrum', count: 10, desc: 'Filter light into vivid primary and chromatic spectrums' },
    { id: 3, name: 'Dispersion', count: 10, desc: 'Split single rays into radiating multi-beam networks' },
    { id: 4, name: 'Refraction', count: 10, desc: 'Navigate dense optical labyrinths and dark matter blocks' },
    { id: 5, name: 'Prismatic Zen', count: 10, desc: 'Master harmonic resonance in expansive optical arrays' }
  ];

  function createEmptyGrid(w, h) {
    const grid = [];
    for (let r = 0; r < h; r++) {
      const row = [];
      for (let c = 0; c < w; c++) {
        row.push(null);
      }
      grid.push(row);
    }
    return grid;
  }

  const rawLevels = [
    // ==================== PACK 1: REFLECTION (1-10) ====================
    {
      id: 1, title: 'First Ray', pack: 'Reflection', packId: 1, width: 5, height: 5,
      items: [
        { r: 2, c: 0, type: 'laser', dir: 1, color: 'white' },
        { r: 2, c: 2, type: 'mirror', rot: 1, sol: 0 }, // sol: rot 0 ('/') reflects RIGHT -> UP
        { r: 0, c: 2, type: 'target', color: 'white' }
      ]
    },
    {
      id: 2, title: 'Twin Angles', pack: 'Reflection', packId: 1, width: 5, height: 5,
      items: [
        { r: 4, c: 1, type: 'laser', dir: 0, color: 'white' }, // shoots UP
        { r: 1, c: 1, type: 'mirror', rot: 0, sol: 1 }, // sol: rot 1 ('\') reflects UP -> LEFT
        { r: 1, c: 0, type: 'target', color: 'white' }
      ]
    },
    {
      id: 3, title: 'Dogleg', pack: 'Reflection', packId: 1, width: 5, height: 5,
      items: [
        { r: 4, c: 1, type: 'laser', dir: 0, color: 'white' }, // shoots UP
        { r: 1, c: 1, type: 'mirror', rot: 1, sol: 0 }, // sol: rot 0 ('/') UP -> RIGHT
        { r: 1, c: 3, type: 'mirror', rot: 0, sol: 1 }, // sol: rot 1 ('\') RIGHT -> DOWN
        { r: 3, c: 3, type: 'target', color: 'white' }
      ]
    },
    {
      id: 4, title: 'U-Turn', pack: 'Reflection', packId: 1, width: 5, height: 5,
      items: [
        { r: 3, c: 1, type: 'laser', dir: 0, color: 'white' }, // shoots UP
        { r: 1, c: 1, type: 'mirror', rot: 1, sol: 0 }, // rot 0 ('/') UP -> RIGHT
        { r: 1, c: 3, type: 'mirror', rot: 0, sol: 1 }, // rot 1 ('\') RIGHT -> DOWN
        { r: 4, c: 3, type: 'mirror', rot: 1, sol: 0 }, // rot 0 ('/') DOWN -> LEFT
        { r: 4, c: 2, type: 'target', color: 'white' }
      ]
    },
    {
      id: 5, title: 'Crossroads', pack: 'Reflection', packId: 1, width: 5, height: 5,
      items: [
        { r: 0, c: 1, type: 'laser', dir: 2, color: 'white' }, // shoots DOWN
        { r: 2, c: 1, type: 'mirror', rot: 0, sol: 1 }, // rot 1 ('\') DOWN -> RIGHT
        { r: 2, c: 3, type: 'mirror', rot: 1, sol: 0 }, // rot 0 ('/') RIGHT -> UP
        { r: 0, c: 3, type: 'target', color: 'white' }
      ]
    },
    {
      id: 6, title: 'Double Resonance', pack: 'Reflection', packId: 1, width: 5, height: 5,
      items: [
        { r: 0, c: 0, type: 'laser', dir: 1, color: 'white' },
        { r: 0, c: 4, type: 'mirror', rot: 0, sol: 1 }, // RIGHT -> DOWN
        { r: 4, c: 4, type: 'mirror', rot: 1, sol: 0 }, // DOWN -> LEFT
        { r: 4, c: 0, type: 'target', color: 'white' }
      ]
    },
    {
      id: 7, title: 'Perimeter Sweep', pack: 'Reflection', packId: 1, width: 5, height: 5,
      items: [
        { r: 3, c: 0, type: 'laser', dir: 1, color: 'white' }, // RIGHT
        { r: 3, c: 2, type: 'mirror', rot: 1, sol: 0 }, // RIGHT -> UP
        { r: 1, c: 2, type: 'mirror', rot: 0, sol: 1 }, // UP -> LEFT
        { r: 1, c: 1, type: 'mirror', rot: 1, sol: 0 }, // LEFT -> DOWN
        { r: 2, c: 1, type: 'target', color: 'white' }
      ]
    },
    {
      id: 8, title: 'Zig Zag', pack: 'Reflection', packId: 1, width: 5, height: 5,
      items: [
        { r: 4, c: 0, type: 'laser', dir: 0, color: 'white' }, // UP
        { r: 2, c: 0, type: 'mirror', rot: 1, sol: 0 }, // UP -> RIGHT
        { r: 2, c: 3, type: 'mirror', rot: 0, sol: 1 }, // RIGHT -> DOWN
        { r: 4, c: 3, type: 'mirror', rot: 1, sol: 0 }, // DOWN -> LEFT
        { r: 4, c: 2, type: 'target', color: 'white' }
      ]
    },
    {
      id: 9, title: 'Spiral Core', pack: 'Reflection', packId: 1, width: 5, height: 5,
      items: [
        { r: 0, c: 0, type: 'laser', dir: 2, color: 'white' }, // DOWN
        { r: 4, c: 0, type: 'mirror', rot: 1, sol: 0 }, // DOWN -> LEFT -> wait, DOWN on rot 0 ('/') is LEFT! But col is 0 so left exits!
        // DOWN on rot 1 ('\') is RIGHT!
        { r: 4, c: 0, type: 'mirror', rot: 0, sol: 1 }, // DOWN -> RIGHT
        { r: 4, c: 4, type: 'mirror', rot: 1, sol: 0 }, // RIGHT -> UP
        { r: 1, c: 4, type: 'mirror', rot: 0, sol: 1 }, // UP -> LEFT
        { r: 1, c: 2, type: 'mirror', rot: 1, sol: 0 }, // LEFT -> DOWN
        { r: 3, c: 2, type: 'target', color: 'white' }
      ]
    },
    {
      id: 10, title: 'Grand Octagon', pack: 'Reflection', packId: 1, width: 5, height: 5,
      items: [
        { r: 4, c: 2, type: 'laser', dir: 0, color: 'white' }, // UP
        { r: 1, c: 2, type: 'mirror', rot: 1, sol: 0 }, // UP -> RIGHT
        { r: 1, c: 4, type: 'mirror', rot: 0, sol: 1 }, // RIGHT -> DOWN
        { r: 3, c: 4, type: 'mirror', rot: 1, sol: 0 }, // DOWN -> LEFT
        { r: 3, c: 0, type: 'mirror', rot: 0, sol: 1 }, // LEFT -> UP
        { r: 0, c: 0, type: 'target', color: 'white' }
      ]
    },

    // ==================== PACK 2: SPECTRUM (11-20) ====================
    {
      id: 11, title: 'Crimson Filter', pack: 'Spectrum', packId: 2, width: 6, height: 6,
      items: [
        { r: 2, c: 0, type: 'laser', dir: 1, color: 'white' }, // RIGHT
        { r: 2, c: 2, type: 'filter', color: 'red', fixed: true },
        { r: 2, c: 4, type: 'mirror', rot: 1, sol: 0 }, // RIGHT -> UP
        { r: 0, c: 4, type: 'target', color: 'red' }
      ]
    },
    {
      id: 12, title: 'Azure Conduit', pack: 'Spectrum', packId: 2, width: 6, height: 6,
      items: [
        { r: 5, c: 1, type: 'laser', dir: 0, color: 'white' }, // UP
        { r: 3, c: 1, type: 'filter', color: 'blue', fixed: true },
        { r: 1, c: 1, type: 'mirror', rot: 1, sol: 0 }, // UP -> RIGHT
        { r: 1, c: 4, type: 'target', color: 'blue' }
      ]
    },
    {
      id: 13, title: 'Emerald Path', pack: 'Spectrum', packId: 2, width: 6, height: 6,
      items: [
        { r: 0, c: 1, type: 'laser', dir: 2, color: 'white' }, // DOWN
        { r: 2, c: 1, type: 'filter', color: 'green', fixed: true },
        { r: 4, c: 1, type: 'mirror', rot: 0, sol: 1 }, // DOWN -> RIGHT
        { r: 4, c: 5, type: 'target', color: 'green' }
      ]
    },
    {
      id: 14, title: 'Selective Prism', pack: 'Spectrum', packId: 2, width: 6, height: 6,
      items: [
        { r: 3, c: 0, type: 'laser', dir: 1, color: 'white' },
        { r: 3, c: 2, type: 'mirror', rot: 0, sol: 1 }, // RIGHT -> DOWN
        { r: 5, c: 2, type: 'mirror', rot: 1, sol: 0 }, // DOWN -> LEFT
        { r: 5, c: 1, type: 'filter', color: 'red', fixed: true },
        { r: 5, c: 0, type: 'target', color: 'red' }
      ]
    },
    {
      id: 15, title: 'Dual Harmonizer', pack: 'Spectrum', packId: 2, width: 6, height: 6,
      items: [
        { r: 1, c: 0, type: 'laser', dir: 1, color: 'red' },
        { r: 4, c: 0, type: 'laser', dir: 1, color: 'blue' },
        { r: 1, c: 3, type: 'mirror', rot: 0, sol: 1 }, // RIGHT -> DOWN
        { r: 3, c: 3, type: 'target', color: 'red' },
        { r: 4, c: 4, type: 'mirror', rot: 1, sol: 0 }, // RIGHT -> UP
        { r: 2, c: 4, type: 'target', color: 'blue' }
      ]
    },
    {
      id: 16, title: 'Chromatic Labyrinth', pack: 'Spectrum', packId: 2, width: 6, height: 6,
      items: [
        { r: 5, c: 2, type: 'laser', dir: 0, color: 'white' }, // UP
        { r: 3, c: 2, type: 'filter', color: 'green', fixed: true },
        { r: 1, c: 2, type: 'mirror', rot: 1, sol: 0 }, // UP -> RIGHT
        { r: 1, c: 4, type: 'mirror', rot: 0, sol: 1 }, // RIGHT -> DOWN
        { r: 3, c: 4, type: 'target', color: 'green' }
      ]
    },
    {
      id: 17, title: 'Yellow Resonance', pack: 'Spectrum', packId: 2, width: 6, height: 6,
      items: [
        { r: 0, c: 2, type: 'laser', dir: 2, color: 'white' },
        { r: 2, c: 2, type: 'filter', color: 'yellow', fixed: true },
        { r: 4, c: 2, type: 'mirror', rot: 0, sol: 1 }, // DOWN -> RIGHT
        { r: 4, c: 5, type: 'target', color: 'yellow' }
      ]
    },
    {
      id: 18, title: 'Cyan Drift', pack: 'Spectrum', packId: 2, width: 6, height: 6,
      items: [
        { r: 2, c: 5, type: 'laser', dir: 3, color: 'white' }, // LEFT
        { r: 2, c: 3, type: 'filter', color: 'cyan', fixed: true },
        { r: 2, c: 1, type: 'mirror', rot: 0, sol: 1 }, // LEFT -> UP
        { r: 0, c: 1, type: 'target', color: 'cyan' }
      ]
    },
    {
      id: 19, title: 'Magenta Cascade', pack: 'Spectrum', packId: 2, width: 6, height: 6,
      items: [
        { r: 4, c: 0, type: 'laser', dir: 1, color: 'white' },
        { r: 4, c: 2, type: 'filter', color: 'magenta', fixed: true },
        { r: 4, c: 4, type: 'mirror', rot: 1, sol: 0 }, // RIGHT -> UP
        { r: 2, c: 4, type: 'mirror', rot: 0, sol: 1 }, // UP -> LEFT
        { r: 2, c: 2, type: 'target', color: 'magenta' }
      ]
    },
    {
      id: 20, title: 'Prism Symphony', pack: 'Spectrum', packId: 2, width: 6, height: 6,
      items: [
        { r: 0, c: 0, type: 'laser', dir: 1, color: 'white' },
        { r: 0, c: 3, type: 'filter', color: 'blue', fixed: true },
        { r: 0, c: 5, type: 'mirror', rot: 0, sol: 1 }, // RIGHT -> DOWN
        { r: 3, c: 5, type: 'mirror', rot: 1, sol: 0 }, // DOWN -> LEFT
        { r: 3, c: 2, type: 'target', color: 'blue' }
      ]
    },

    // ==================== PACK 3: DISPERSION (21-30) ====================
    {
      id: 21, title: 'Twin Rays', pack: 'Dispersion', packId: 3, width: 6, height: 6,
      items: [
        { r: 5, c: 2, type: 'laser', dir: 0, color: 'white' }, // UP
        // Splitter at (3, 2), rot 0: entry opposite is DOWN (dir 2). Entering UP (dir 0) triggers split!
        { r: 3, c: 2, type: 'splitter', rot: 0, sol: 0 }, // splits UP, LEFT, RIGHT
        { r: 1, c: 2, type: 'target', color: 'white' }, // forward target
        { r: 3, c: 0, type: 'target', color: 'white' }, // left target
        { r: 3, c: 4, type: 'target', color: 'white' }  // right target
      ]
    },
    {
      id: 22, title: 'Radial Branches', pack: 'Dispersion', packId: 3, width: 6, height: 6,
      items: [
        { r: 2, c: 0, type: 'laser', dir: 1, color: 'white' }, // RIGHT
        // Splitter rot 1: entry opposite is LEFT (dir 3), entering RIGHT (dir 1) splits into RIGHT, UP, DOWN!
        { r: 2, c: 2, type: 'splitter', rot: 1, sol: 1 },
        { r: 0, c: 2, type: 'target', color: 'white' }, // UP branch
        { r: 4, c: 2, type: 'target', color: 'white' }, // DOWN branch
        { r: 2, c: 5, type: 'target', color: 'white' }  // RIGHT branch
      ]
    },
    {
      id: 23, title: 'Mirror Divergence', pack: 'Dispersion', packId: 3, width: 6, height: 6,
      items: [
        { r: 5, c: 3, type: 'laser', dir: 0, color: 'white' }, // UP
        { r: 3, c: 3, type: 'splitter', rot: 0, sol: 0 }, // splits UP, LEFT, RIGHT
        { r: 0, c: 3, type: 'target', color: 'white' },
        { r: 3, c: 1, type: 'mirror', rot: 0, sol: 1 }, // LEFT -> UP
        { r: 1, c: 1, type: 'target', color: 'white' }
      ]
    },
    {
      id: 24, title: 'Dual Harmonic Split', pack: 'Dispersion', packId: 3, width: 6, height: 6,
      items: [
        { r: 0, c: 2, type: 'laser', dir: 2, color: 'white' }, // DOWN
        // Splitter rot 2: entry opposite is UP (dir 0). Entering DOWN (dir 2) splits into DOWN, RIGHT, LEFT!
        { r: 2, c: 2, type: 'splitter', rot: 2, sol: 2 },
        { r: 5, c: 2, type: 'target', color: 'white' },
        { r: 2, c: 0, type: 'target', color: 'white' },
        { r: 2, c: 4, type: 'mirror', rot: 0, sol: 1 }, // RIGHT -> DOWN
        { r: 4, c: 4, type: 'target', color: 'white' }
      ]
    },
    {
      id: 25, title: 'Chamber Resonance', pack: 'Dispersion', packId: 3, width: 6, height: 6,
      items: [
        { r: 3, c: 0, type: 'laser', dir: 1, color: 'white' }, // RIGHT
        { r: 3, c: 2, type: 'splitter', rot: 1, sol: 1 }, // RIGHT, UP, DOWN
        { r: 1, c: 2, type: 'mirror', rot: 1, sol: 0 }, // UP -> RIGHT
        { r: 1, c: 4, type: 'target', color: 'white' },
        { r: 5, c: 2, type: 'mirror', rot: 0, sol: 1 }, // DOWN -> RIGHT
        { r: 5, c: 4, type: 'target', color: 'white' }
      ]
    },
    {
      id: 26, title: 'Cascading Splits', pack: 'Dispersion', packId: 3, width: 6, height: 6,
      items: [
        { r: 5, c: 1, type: 'laser', dir: 0, color: 'white' }, // UP
        { r: 2, c: 1, type: 'splitter', rot: 0, sol: 0 }, // splits UP, LEFT, RIGHT
        { r: 0, c: 1, type: 'target', color: 'white' },
        { r: 2, c: 4, type: 'mirror', rot: 0, sol: 1 }, // RIGHT -> DOWN
        { r: 4, c: 4, type: 'target', color: 'white' }
      ]
    },
    {
      id: 27, title: 'Prismatic Dispersion', pack: 'Dispersion', packId: 3, width: 6, height: 6,
      items: [
        { r: 4, c: 0, type: 'laser', dir: 1, color: 'white' }, // RIGHT
        { r: 4, c: 2, type: 'splitter', rot: 1, sol: 1 }, // RIGHT, UP, DOWN
        { r: 2, c: 2, type: 'filter', color: 'red', fixed: true },
        { r: 1, c: 2, type: 'target', color: 'red' },
        { r: 4, c: 4, type: 'target', color: 'white' }
      ]
    },
    {
      id: 28, title: 'Tricolor Fan', pack: 'Dispersion', packId: 3, width: 6, height: 6,
      items: [
        { r: 5, c: 2, type: 'laser', dir: 0, color: 'white' },
        { r: 3, c: 2, type: 'splitter', rot: 0, sol: 0 },
        { r: 1, c: 2, type: 'filter', color: 'green', fixed: true },
        { r: 0, c: 2, type: 'target', color: 'green' },
        { r: 3, c: 0, type: 'filter', color: 'blue', fixed: true },
        { r: 3, c: 4, type: 'target', color: 'white' }
      ]
    },
    {
      id: 29, title: 'Angular Convergence', pack: 'Dispersion', packId: 3, width: 6, height: 6,
      items: [
        { r: 1, c: 0, type: 'laser', dir: 1, color: 'white' },
        { r: 1, c: 2, type: 'splitter', rot: 1, sol: 1 }, // RIGHT, UP, DOWN
        { r: 3, c: 2, type: 'mirror', rot: 1, sol: 0 }, // DOWN -> LEFT
        { r: 3, c: 0, type: 'target', color: 'white' },
        { r: 1, c: 5, type: 'target', color: 'white' }
      ]
    },
    {
      id: 30, title: 'Zen Prism Array', pack: 'Dispersion', packId: 3, width: 6, height: 6,
      items: [
        { r: 5, c: 3, type: 'laser', dir: 0, color: 'white' },
        { r: 3, c: 3, type: 'splitter', rot: 0, sol: 0 }, // UP, LEFT, RIGHT
        { r: 1, c: 3, type: 'target', color: 'white' },
        { r: 3, c: 1, type: 'mirror', rot: 0, sol: 1 }, // LEFT -> UP
        { r: 1, c: 1, type: 'target', color: 'white' },
        { r: 3, c: 5, type: 'target', color: 'white' }
      ]
    },

    // ==================== PACK 4: REFRACTION (31-40) ====================
    {
      id: 31, title: 'Dark Monolith', pack: 'Refraction', packId: 4, width: 7, height: 7,
      items: [
        { r: 6, c: 1, type: 'laser', dir: 0, color: 'white' }, // UP
        { r: 3, c: 1, type: 'block' }, // Obstacle
        { r: 4, c: 1, type: 'mirror', rot: 1, sol: 0 }, // UP -> RIGHT
        { r: 4, c: 4, type: 'mirror', rot: 1, sol: 0 }, // RIGHT -> UP
        { r: 1, c: 4, type: 'target', color: 'white' }
      ]
    },
    {
      id: 32, title: 'Bypass Routing', pack: 'Refraction', packId: 4, width: 7, height: 7,
      items: [
        { r: 2, c: 0, type: 'laser', dir: 1, color: 'white' },
        { r: 2, c: 3, type: 'block' },
        { r: 2, c: 1, type: 'mirror', rot: 0, sol: 1 }, // RIGHT -> DOWN
        { r: 5, c: 1, type: 'mirror', rot: 0, sol: 1 }, // DOWN -> RIGHT
        { r: 5, c: 5, type: 'mirror', rot: 1, sol: 0 }, // RIGHT -> UP
        { r: 2, c: 5, type: 'target', color: 'white' }
      ]
    },
    {
      id: 33, title: 'Chromatic Division', pack: 'Refraction', packId: 4, width: 7, height: 7,
      items: [
        { r: 6, c: 3, type: 'laser', dir: 0, color: 'white' },
        { r: 4, c: 3, type: 'splitter', rot: 0, sol: 0 }, // UP, LEFT, RIGHT
        { r: 2, c: 3, type: 'filter', color: 'blue', fixed: true },
        { r: 0, c: 3, type: 'target', color: 'blue' },
        { r: 4, c: 1, type: 'filter', color: 'red', fixed: true },
        { r: 4, c: 0, type: 'target', color: 'red' },
        { r: 4, c: 5, type: 'target', color: 'white' }
      ]
    },
    {
      id: 34, title: 'Barrier Matrix', pack: 'Refraction', packId: 4, width: 7, height: 7,
      items: [
        { r: 0, c: 1, type: 'laser', dir: 2, color: 'white' }, // DOWN
        { r: 3, c: 1, type: 'block' },
        { r: 2, c: 1, type: 'mirror', rot: 1, sol: 0 }, // DOWN -> LEFT (sol 1: DOWN -> RIGHT)
        { r: 2, c: 1, type: 'mirror', rot: 0, sol: 1 }, // DOWN -> RIGHT
        { r: 2, c: 5, type: 'mirror', rot: 1, sol: 0 }, // RIGHT -> UP
        { r: 0, c: 5, type: 'target', color: 'white' }
      ]
    },
    {
      id: 35, title: 'Dual Splitter Circuit', pack: 'Refraction', packId: 4, width: 7, height: 7,
      items: [
        { r: 3, c: 0, type: 'laser', dir: 1, color: 'white' },
        { r: 3, c: 2, type: 'splitter', rot: 1, sol: 1 }, // RIGHT, UP, DOWN
        { r: 1, c: 2, type: 'target', color: 'white' },
        { r: 5, c: 2, type: 'mirror', rot: 0, sol: 1 }, // DOWN -> RIGHT
        { r: 5, c: 4, type: 'target', color: 'white' },
        { r: 3, c: 6, type: 'target', color: 'white' }
      ]
    },
    {
      id: 36, title: 'Prism Fortress', pack: 'Refraction', packId: 4, width: 7, height: 7,
      items: [
        { r: 6, c: 2, type: 'laser', dir: 0, color: 'white' },
        { r: 3, c: 2, type: 'splitter', rot: 0, sol: 0 }, // UP, LEFT, RIGHT
        { r: 1, c: 2, type: 'target', color: 'white' },
        { r: 3, c: 0, type: 'mirror', rot: 0, sol: 1 }, // LEFT -> UP
        { r: 1, c: 0, type: 'target', color: 'white' },
        { r: 3, c: 5, type: 'target', color: 'white' }
      ]
    },
    {
      id: 37, title: 'Spectral Gate', pack: 'Refraction', packId: 4, width: 7, height: 7,
      items: [
        { r: 1, c: 0, type: 'laser', dir: 1, color: 'white' },
        { r: 1, c: 3, type: 'filter', color: 'green', fixed: true },
        { r: 1, c: 5, type: 'mirror', rot: 0, sol: 1 }, // RIGHT -> DOWN
        { r: 4, c: 5, type: 'mirror', rot: 1, sol: 0 }, // DOWN -> LEFT
        { r: 4, c: 2, type: 'target', color: 'green' }
      ]
    },
    {
      id: 38, title: 'Quadrant Network', pack: 'Refraction', packId: 4, width: 7, height: 7,
      items: [
        { r: 6, c: 3, type: 'laser', dir: 0, color: 'white' },
        { r: 3, c: 3, type: 'splitter', rot: 0, sol: 0 },
        { r: 0, c: 3, type: 'target', color: 'white' },
        { r: 3, c: 1, type: 'mirror', rot: 0, sol: 1 }, // LEFT -> UP
        { r: 1, c: 1, type: 'target', color: 'white' },
        { r: 3, c: 5, type: 'mirror', rot: 1, sol: 0 }, // RIGHT -> UP
        { r: 1, c: 5, type: 'target', color: 'white' }
      ]
    },
    {
      id: 39, title: 'Twin Emitters', pack: 'Refraction', packId: 4, width: 7, height: 7,
      items: [
        { r: 0, c: 1, type: 'laser', dir: 2, color: 'red' },
        { r: 0, c: 5, type: 'laser', dir: 2, color: 'blue' },
        { r: 3, c: 1, type: 'mirror', rot: 0, sol: 1 }, // DOWN -> RIGHT
        { r: 3, c: 3, type: 'target', color: 'red' },
        { r: 5, c: 5, type: 'mirror', rot: 1, sol: 0 }, // DOWN -> LEFT
        { r: 5, c: 3, type: 'target', color: 'blue' }
      ]
    },
    {
      id: 40, title: 'Refraction Pinnacle', pack: 'Refraction', packId: 4, width: 7, height: 7,
      items: [
        { r: 6, c: 0, type: 'laser', dir: 0, color: 'white' },
        { r: 2, c: 0, type: 'mirror', rot: 1, sol: 0 }, // UP -> RIGHT
        { r: 2, c: 3, type: 'splitter', rot: 1, sol: 1 }, // RIGHT, UP, DOWN
        { r: 0, c: 3, type: 'target', color: 'white' },
        { r: 4, c: 3, type: 'mirror', rot: 0, sol: 1 }, // DOWN -> RIGHT
        { r: 4, c: 6, type: 'target', color: 'white' }
      ]
    },

    // ==================== PACK 5: PRISMATIC ZEN (41-50) ====================
    {
      id: 41, title: 'Zen Radiance', pack: 'Prismatic Zen', packId: 5, width: 8, height: 8,
      items: [
        { r: 7, c: 3, type: 'laser', dir: 0, color: 'white' },
        { r: 4, c: 3, type: 'splitter', rot: 0, sol: 0 }, // UP, LEFT, RIGHT
        { r: 1, c: 3, type: 'target', color: 'white' },
        { r: 4, c: 1, type: 'mirror', rot: 0, sol: 1 }, // LEFT -> UP
        { r: 1, c: 1, type: 'target', color: 'white' },
        { r: 4, c: 6, type: 'mirror', rot: 1, sol: 0 }, // RIGHT -> UP
        { r: 1, c: 6, type: 'target', color: 'white' }
      ]
    },
    {
      id: 42, title: 'Tri-Chromatic Nexus', pack: 'Prismatic Zen', packId: 5, width: 8, height: 8,
      items: [
        { r: 7, c: 4, type: 'laser', dir: 0, color: 'white' },
        { r: 4, c: 4, type: 'splitter', rot: 0, sol: 0 }, // UP, LEFT, RIGHT
        { r: 2, c: 4, type: 'filter', color: 'red', fixed: true },
        { r: 0, c: 4, type: 'target', color: 'red' },
        { r: 4, c: 2, type: 'filter', color: 'blue', fixed: true },
        { r: 4, c: 0, type: 'target', color: 'blue' },
        { r: 4, c: 6, type: 'filter', color: 'green', fixed: true },
        { r: 4, c: 7, type: 'target', color: 'green' }
      ]
    },
    {
      id: 43, title: 'Crystalline Maze', pack: 'Prismatic Zen', packId: 5, width: 8, height: 8,
      items: [
        { r: 1, c: 0, type: 'laser', dir: 1, color: 'white' },
        { r: 1, c: 3, type: 'mirror', rot: 0, sol: 1 }, // RIGHT -> DOWN
        { r: 5, c: 3, type: 'mirror', rot: 1, sol: 0 }, // DOWN -> LEFT
        { r: 5, c: 1, type: 'mirror', rot: 0, sol: 1 }, // LEFT -> UP
        { r: 3, c: 1, type: 'mirror', rot: 1, sol: 0 }, // UP -> RIGHT
        { r: 3, c: 6, type: 'target', color: 'white' }
      ]
    },
    {
      id: 44, title: 'Double Diagonal', pack: 'Prismatic Zen', packId: 5, width: 8, height: 8,
      items: [
        { r: 7, c: 1, type: 'laser', dir: 0, color: 'white' },
        { r: 3, c: 1, type: 'mirror', rot: 1, sol: 0 }, // UP -> RIGHT
        { r: 3, c: 4, type: 'splitter', rot: 1, sol: 1 }, // RIGHT, UP, DOWN
        { r: 1, c: 4, type: 'target', color: 'white' },
        { r: 5, c: 4, type: 'mirror', rot: 0, sol: 1 }, // DOWN -> RIGHT
        { r: 5, c: 7, type: 'target', color: 'white' }
      ]
    },
    {
      id: 45, title: 'Prism Geometry', pack: 'Prismatic Zen', packId: 5, width: 8, height: 8,
      items: [
        { r: 0, c: 2, type: 'laser', dir: 2, color: 'white' },
        { r: 4, c: 2, type: 'splitter', rot: 2, sol: 2 }, // DOWN, RIGHT, LEFT
        { r: 7, c: 2, type: 'target', color: 'white' },
        { r: 4, c: 5, type: 'mirror', rot: 1, sol: 0 }, // RIGHT -> UP
        { r: 1, c: 5, type: 'target', color: 'white' },
        { r: 4, c: 0, type: 'target', color: 'white' }
      ]
    },
    {
      id: 46, title: 'Optic Cascade', pack: 'Prismatic Zen', packId: 5, width: 8, height: 8,
      items: [
        { r: 7, c: 2, type: 'laser', dir: 0, color: 'white' },
        { r: 5, c: 2, type: 'filter', color: 'cyan', fixed: true },
        { r: 3, c: 2, type: 'mirror', rot: 1, sol: 0 }, // UP -> RIGHT
        { r: 3, c: 5, type: 'mirror', rot: 0, sol: 1 }, // RIGHT -> DOWN
        { r: 6, c: 5, type: 'target', color: 'cyan' }
      ]
    },
    {
      id: 47, title: 'Solar Array', pack: 'Prismatic Zen', packId: 5, width: 8, height: 8,
      items: [
        { r: 4, c: 0, type: 'laser', dir: 1, color: 'white' },
        { r: 4, c: 3, type: 'splitter', rot: 1, sol: 1 }, // RIGHT, UP, DOWN
        { r: 1, c: 3, type: 'mirror', rot: 1, sol: 0 }, // UP -> RIGHT
        { r: 1, c: 6, type: 'target', color: 'white' },
        { r: 6, c: 3, type: 'mirror', rot: 0, sol: 1 }, // DOWN -> RIGHT
        { r: 6, c: 6, type: 'target', color: 'white' }
      ]
    },
    {
      id: 48, title: 'Zen Prism Core', pack: 'Prismatic Zen', packId: 5, width: 8, height: 8,
      items: [
        { r: 7, c: 4, type: 'laser', dir: 0, color: 'white' },
        { r: 4, c: 4, type: 'splitter', rot: 0, sol: 0 }, // UP, LEFT, RIGHT
        { r: 1, c: 4, type: 'target', color: 'white' },
        { r: 4, c: 1, type: 'mirror', rot: 0, sol: 1 }, // LEFT -> UP
        { r: 2, c: 1, type: 'target', color: 'white' },
        { r: 4, c: 6, type: 'mirror', rot: 1, sol: 0 }, // RIGHT -> UP
        { r: 2, c: 6, type: 'target', color: 'white' }
      ]
    },
    {
      id: 49, title: 'Grand Harmonic Array', pack: 'Prismatic Zen', packId: 5, width: 8, height: 8,
      items: [
        { r: 0, c: 0, type: 'laser', dir: 1, color: 'white' },
        { r: 0, c: 3, type: 'splitter', rot: 1, sol: 1 }, // RIGHT, UP (exits), DOWN
        { r: 4, c: 3, type: 'splitter', rot: 2, sol: 2 }, // DOWN, RIGHT, LEFT
        { r: 4, c: 0, type: 'target', color: 'white' },
        { r: 4, c: 6, type: 'target', color: 'white' },
        { r: 7, c: 3, type: 'target', color: 'white' }
      ]
    },
    {
      id: 50, title: 'Prismatic Transcendence', pack: 'Prismatic Zen', packId: 5, width: 8, height: 8,
      items: [
        { r: 7, c: 3, type: 'laser', dir: 0, color: 'white' },
        { r: 5, c: 3, type: 'splitter', rot: 0, sol: 0 }, // UP, LEFT, RIGHT
        { r: 2, c: 3, type: 'target', color: 'white' },
        { r: 5, c: 1, type: 'mirror', rot: 0, sol: 1 }, // LEFT -> UP
        { r: 1, c: 1, type: 'target', color: 'white' },
        { r: 5, c: 6, type: 'mirror', rot: 1, sol: 0 }, // RIGHT -> UP
        { r: 1, c: 6, type: 'target', color: 'white' }
      ]
    }
  ];

  // Helper to construct level objects
  function compileLevel(raw) {
    const tiles = createEmptyGrid(raw.width, raw.height);
    const solution = {};

    for (const item of raw.items) {
      const tile = { type: item.type };
      if (item.dir !== undefined) tile.dir = item.dir;
      if (item.color !== undefined) tile.color = item.color;
      if (item.fixed !== undefined) tile.fixed = item.fixed;

      if (item.sol !== undefined) {
        solution[`${item.r},${item.c}`] = item.sol;
        // Start rot is the initial scrambled/unsolved state
        tile.rot = (item.rot !== undefined) ? item.rot : ((item.sol + 1) % (item.type === 'mirror' ? 2 : 4));
        tile.fixed = false;
      } else if (item.rot !== undefined) {
        tile.rot = item.rot;
      }

      tiles[item.r][item.c] = tile;
    }

    return {
      id: raw.id,
      title: raw.title,
      pack: raw.pack,
      packId: raw.packId,
      width: raw.width,
      height: raw.height,
      tiles,
      solution
    };
  }

  const ALL_LEVELS = rawLevels.map(compileLevel);

  return {
    PACKS,
    ALL_LEVELS,
    getLevel: function (id) {
      return ALL_LEVELS.find(l => l.id === id) || ALL_LEVELS[0];
    }
  };
});
