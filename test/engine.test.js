/**
 * Unit tests for ZenLaser Optics Engine and Level Solver
 * Run via `node --test test/engine.test.js`
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const { reflectMirror, filterColor, LaserEngine } = require('../src/laser-engine.js');
const { ALL_LEVELS, PACKS } = require('../src/levels.js');

test('Reflection logic for rot 0 (slash /)', () => {
  // rot 0: '/'
  // UP (0) -> RIGHT (1)
  // RIGHT (1) -> UP (0)
  // DOWN (2) -> LEFT (3)
  // LEFT (3) -> DOWN (2)
  assert.equal(reflectMirror(0, 0), 1);
  assert.equal(reflectMirror(1, 0), 0);
  assert.equal(reflectMirror(2, 0), 3);
  assert.equal(reflectMirror(3, 0), 2);
});

test('Reflection logic for rot 1 (backslash \\)', () => {
  // rot 1: '\'
  // UP (0) -> LEFT (3)
  // RIGHT (1) -> DOWN (2)
  // DOWN (2) -> RIGHT (1)
  // LEFT (3) -> UP (0)
  assert.equal(reflectMirror(0, 1), 3);
  assert.equal(reflectMirror(1, 1), 2);
  assert.equal(reflectMirror(2, 1), 1);
  assert.equal(reflectMirror(3, 1), 0);
});

test('Chromatic color filtering logic', () => {
  // White passes through red filter -> red
  assert.equal(filterColor('white', 'red'), 'red');
  assert.equal(filterColor('white', 'green'), 'green');
  assert.equal(filterColor('white', 'blue'), 'blue');

  // Yellow passes through red filter -> red (yellow is red+green)
  assert.equal(filterColor('yellow', 'red'), 'red');
  assert.equal(filterColor('yellow', 'green'), 'green');

  // Incompatible color is absorbed -> null
  assert.equal(filterColor('red', 'blue'), null);
  assert.equal(filterColor('green', 'red'), null);
});

test('Infinite loop prevention in circular mirror box', () => {
  // 4 mirrors forming an endless 2x2 loop
  const levelData = {
    id: 999,
    title: 'Loop Box',
    pack: 'Test',
    width: 4,
    height: 4,
    tiles: [
      [null, null, null, null],
      [null, { type: 'laser', dir: 1, color: 'white' }, { type: 'mirror', rot: 1 }, null], // (1,2) '\': RIGHT -> DOWN
      [null, { type: 'mirror', rot: 1 }, { type: 'mirror', rot: 0 }, null], // (2,2) '/': DOWN -> LEFT; (2,1) '\': LEFT -> UP
      [null, null, null, null]
    ]
  };

  const engine = new LaserEngine(levelData);
  const result = engine.trace();
  assert.ok(result.rays.length > 0);
  // Loop terminates safely without hanging
  assert.equal(result.isWin, false);
});

test('Level verification: 50 levels exist across 5 packs', () => {
  assert.equal(ALL_LEVELS.length, 50);
  assert.equal(PACKS.length, 5);

  const packCounts = {};
  for (const lvl of ALL_LEVELS) {
    packCounts[lvl.pack] = (packCounts[lvl.pack] || 0) + 1;
    assert.ok(lvl.width >= 5 && lvl.width <= 8);
    assert.ok(lvl.height >= 5 && lvl.height <= 8);
    assert.ok(lvl.tiles.length === lvl.height);
    assert.ok(lvl.tiles[0].length === lvl.width);
  }

  for (const pack of PACKS) {
    assert.equal(packCounts[pack.name], 10, `Pack ${pack.name} has 10 levels`);
  }
});

test('Level solver: all 50 levels reach winning state with solution', () => {
  for (const lvl of ALL_LEVELS) {
    const engine = new LaserEngine(lvl);

    // Apply solution rotations
    for (const [key, solRot] of Object.entries(lvl.solution)) {
      const [r, c] = key.split(',').map(Number);
      engine.grid[r][c].rot = solRot;
    }

    engine.trace();
    assert.ok(
      engine.isWin(),
      `Level ${lvl.id} ("${lvl.title}") must be solved when solution rotations are applied`
    );
  }
});

test('Interactive moves: rotate, undo, and reset work as expected', () => {
  const lvl = ALL_LEVELS[0]; // Level 1
  const engine = new LaserEngine(lvl);

  // Initial state should not be won yet
  assert.equal(engine.isWin(), false);

  // Rotate mirror at (2, 2)
  const rotated = engine.rotateTile(2, 2);
  assert.ok(rotated);
  assert.ok(engine.canUndo());

  // Now Level 1 should be solved!
  assert.ok(engine.isWin());

  // Undo
  engine.undo();
  assert.equal(engine.isWin(), false);

  // Re-apply rotation
  engine.rotateTile(2, 2);
  assert.ok(engine.isWin());

  // Reset
  engine.reset();
  assert.equal(engine.isWin(), false);
});

test('Hint system delivers correct target rotation', () => {
  const lvl = ALL_LEVELS[0];
  const engine = new LaserEngine(lvl);

  const hint = engine.getHint();
  assert.ok(hint);
  assert.equal(hint.r, 2);
  assert.equal(hint.c, 2);
  assert.equal(hint.targetRot, 0);

  const applied = engine.applyHint();
  assert.ok(applied);
  assert.ok(engine.isWin());
});
