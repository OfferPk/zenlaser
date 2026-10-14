/**
 * ZenLaser - Core Optics Engine
 * Handles 2D grid raycasting, optical components, chromatic filtering, and level verification.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ZenLaserEngine = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Direction vectors: UP(0), RIGHT(1), DOWN(2), LEFT(3)
  const DIRS = [
    { dr: -1, dc: 0, name: 'UP' },
    { dr: 0, dc: 1, name: 'RIGHT' },
    { dr: 1, dc: 0, name: 'DOWN' },
    { dr: 0, dc: -1, name: 'LEFT' }
  ];

  const COLOR_COMPONENTS = {
    red:     { r: 1, g: 0, b: 0, hex: '#FF3366', glow: 'rgba(255, 51, 102, 0.85)' },
    green:   { r: 0, g: 1, b: 0, hex: '#00FF99', glow: 'rgba(0, 255, 153, 0.85)' },
    blue:    { r: 0, g: 0, b: 1, hex: '#3399FF', glow: 'rgba(51, 153, 255, 0.85)' },
    yellow:  { r: 1, g: 1, b: 0, hex: '#FFDD33', glow: 'rgba(255, 221, 51, 0.85)' },
    magenta: { r: 1, g: 0, b: 1, hex: '#FF33DD', glow: 'rgba(255, 51, 221, 0.85)' },
    cyan:    { r: 0, g: 1, b: 1, hex: '#00FFFF', glow: 'rgba(0, 255, 255, 0.85)' },
    white:   { r: 1, g: 1, b: 1, hex: '#FFFFFF', glow: 'rgba(255, 255, 255, 0.95)' }
  };

  function filterColor(rayColor, filterColorName) {
    const c1 = COLOR_COMPONENTS[rayColor];
    const c2 = COLOR_COMPONENTS[filterColorName];
    if (!c1 || !c2) return null;

    const nr = c1.r & c2.r;
    const ng = c1.g & c2.g;
    const nb = c1.b & c2.b;

    if (nr === 0 && ng === 0 && nb === 0) return null;

    for (const [name, comp] of Object.entries(COLOR_COMPONENTS)) {
      if (comp.r === nr && comp.g === ng && comp.b === nb) {
        return name;
      }
    }
    return null;
  }

  function reflectMirror(dir, rot) {
    // rot 0: '/' (UP <-> RIGHT, DOWN <-> LEFT)
    // rot 1: '\' (UP <-> LEFT, DOWN <-> RIGHT)
    if (rot === 0) {
      return dir ^ 1;
    } else {
      return 3 - dir;
    }
  }

  function cloneGrid(grid) {
    return grid.map(row => row.map(tile => {
      if (!tile) return null;
      return { ...tile };
    }));
  }

  class LaserEngine {
    constructor(levelData) {
      this.width = levelData.width;
      this.height = levelData.height;
      this.id = levelData.id;
      this.title = levelData.title;
      this.pack = levelData.pack;
      this.solution = levelData.solution || {}; // key: `${r},${c}` -> target rot
      this.history = [];
      this.load(levelData);
    }

    load(levelData) {
      this.grid = [];
      for (let r = 0; r < this.height; r++) {
        const row = [];
        for (let c = 0; c < this.width; c++) {
          const item = levelData.tiles && levelData.tiles[r] && levelData.tiles[r][c];
          if (item) {
            row.push({ ...item });
          } else {
            row.push(null);
          }
        }
        this.grid.push(row);
      }
      this.history = [];
      this.trace();
    }

    rotateTile(r, c) {
      if (r < 0 || r >= this.height || c < 0 || c >= this.width) return false;
      const tile = this.grid[r][c];
      if (!tile || tile.fixed) return false;

      let prevRot = tile.rot || 0;
      let newRot = prevRot;

      if (tile.type === 'mirror') {
        newRot = (prevRot + 1) % 2;
      } else if (tile.type === 'splitter') {
        newRot = (prevRot + 1) % 4;
      } else if (tile.type === 'filter' && !tile.fixed) {
        // Some filters can be rotatable or toggleable if needed, default fixed
        return false;
      } else {
        return false;
      }

      tile.rot = newRot;
      this.history.push({ r, c, prevRot, newRot });
      this.trace();
      return true;
    }

    undo() {
      if (this.history.length === 0) return false;
      const last = this.history.pop();
      const tile = this.grid[last.r][last.c];
      if (tile) {
        tile.rot = last.prevRot;
        this.trace();
        return true;
      }
      return false;
    }

    canUndo() {
      return this.history.length > 0;
    }

    reset() {
      while (this.history.length > 0) {
        const last = this.history.pop();
        const tile = this.grid[last.r][last.c];
        if (tile) tile.rot = last.prevRot;
      }
      this.trace();
    }

    getHint() {
      if (this.isWin()) return null;
      // Find a rotatable tile that differs from solution
      for (let r = 0; r < this.height; r++) {
        for (let c = 0; c < this.width; c++) {
          const tile = this.grid[r][c];
          if (!tile || tile.fixed) continue;
          const key = `${r},${c}`;
          if (this.solution[key] !== undefined && tile.rot !== this.solution[key]) {
            return { r, c, targetRot: this.solution[key] };
          }
        }
      }
      return null;
    }

    applyHint() {
      const hint = this.getHint();
      if (!hint) return false;
      const tile = this.grid[hint.r][hint.c];
      if (!tile) return false;
      const prevRot = tile.rot || 0;
      tile.rot = hint.targetRot;
      this.history.push({ r: hint.r, c: hint.c, prevRot, newRot: hint.targetRot });
      this.trace();
      return true;
    }

    trace() {
      // 1. Reset all targets
      this.targets = [];
      for (let r = 0; r < this.height; r++) {
        for (let c = 0; c < this.width; c++) {
          const tile = this.grid[r][c];
          if (tile && tile.type === 'target') {
            tile.energized = false;
            tile.energizedColor = null;
            this.targets.push({ r, c, tile });
          }
        }
      }

      // 2. Identify all laser emitters
      const activeRays = [];
      for (let r = 0; r < this.height; r++) {
        for (let c = 0; c < this.width; c++) {
          const tile = this.grid[r][c];
          if (tile && tile.type === 'laser') {
            activeRays.push({
              r,
              c,
              dir: tile.dir,
              color: tile.color || 'white',
              path: [{ r, c }],
              emitter: { r, c }
            });
          }
        }
      }

      // 3. Trace rays step by step with loop detection
      this.rays = [];
      const visited = new Set();
      const MAX_STEPS = 80;

      while (activeRays.length > 0) {
        const ray = activeRays.shift();
        let curR = ray.r;
        let curC = ray.c;
        let curDir = ray.dir;
        let curColor = ray.color;
        let path = [...ray.path];
        let steps = 0;
        let terminated = false;

        while (steps < MAX_STEPS && !terminated) {
          steps++;
          const nextR = curR + DIRS[curDir].dr;
          const nextC = curC + DIRS[curDir].dc;

          // Check grid bounds
          if (nextR < 0 || nextR >= this.height || nextC < 0 || nextC >= this.width) {
            path.push({ r: nextR, c: nextC, outOfBounds: true });
            terminated = true;
            break;
          }

          path.push({ r: nextR, c: nextC });

          // State key for infinite loop prevention
          const stateKey = `${nextR},${nextC},${curDir},${curColor}`;
          if (visited.has(stateKey)) {
            terminated = true;
            break;
          }
          visited.add(stateKey);

          const tile = this.grid[nextR][nextC];
          if (!tile) {
            // Empty space: continue in same direction
            curR = nextR;
            curC = nextC;
            continue;
          }

          if (tile.type === 'block') {
            // Hits solid wall: terminates
            terminated = true;
            break;
          }

          if (tile.type === 'laser') {
            // Hits another emitter: terminates
            terminated = true;
            break;
          }

          if (tile.type === 'target') {
            // Check color requirement
            const match = (!tile.color || tile.color === 'any' || tile.color === curColor);
            if (match) {
              tile.energized = true;
              tile.energizedColor = curColor;
            }
            // Target absorbs ray
            terminated = true;
            break;
          }

          if (tile.type === 'mirror') {
            // Reflect ray
            const rot = tile.rot || 0;
            const newDir = reflectMirror(curDir, rot);
            curR = nextR;
            curC = nextC;
            curDir = newDir;
            continue;
          }

          if (tile.type === 'splitter') {
            const rot = tile.rot || 0;

            curR = nextR;
            curC = nextC;

            if (curDir === rot) {
              // 3-way split: forward, left, right
              const fwdDir = rot;
              const leftDir = (rot + 3) % 4;
              const rightDir = (rot + 1) % 4;

              // Continue current ray forward
              curDir = fwdDir;

              // Branch left
              activeRays.push({
                r: curR,
                c: curC,
                dir: leftDir,
                color: curColor,
                path: [{ r: curR, c: curC }],
                emitter: ray.emitter
              });

              // Branch right
              activeRays.push({
                r: curR,
                c: curC,
                dir: rightDir,
                color: curColor,
                path: [{ r: curR, c: curC }],
                emitter: ray.emitter
              });
            }
            // Otherwise pass straight through
            continue;
          }

          if (tile.type === 'filter') {
            const newColor = filterColor(curColor, tile.color);
            if (!newColor) {
              // Absorbed by filter
              terminated = true;
              break;
            }
            curColor = newColor;
            curR = nextR;
            curC = nextC;
            continue;
          }

          // Unhandled tile type, continue
          curR = nextR;
          curC = nextC;
        }

        this.rays.push({
          color: ray.color,
          effectiveColor: curColor,
          path,
          terminated
        });
      }

      this.isSolved = this.targets.length > 0 && this.targets.every(t => t.tile.energized);
      return {
        rays: this.rays,
        targets: this.targets,
        isWin: this.isSolved
      };
    }

    isWin() {
      return this.isSolved;
    }
  }

  return {
    DIRS,
    COLOR_COMPONENTS,
    filterColor,
    reflectMirror,
    cloneGrid,
    LaserEngine
  };
});
