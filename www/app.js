/**
 * ZenLaser - Main Application & 60fps Canvas Optics Renderer
 */

(function () {
  'use strict';

  const { LaserEngine, DIRS, COLOR_COMPONENTS } = window.ZenLaserEngine;
  const { ALL_LEVELS, PACKS, getLevel } = window.ZenLaserLevels;
  const sound = window.ZenLaserAudio;

  // DOM Elements
  const canvas = document.getElementById('laser-canvas');
  const ctx = canvas.getContext('2d');
  const levelTitleEl = document.getElementById('level-title');
  const packNameEl = document.getElementById('pack-name');
  const moveCountEl = document.getElementById('move-count');
  const targetsMeterEl = document.getElementById('targets-meter');
  const btnUndo = document.getElementById('btn-undo');
  const btnReset = document.getElementById('btn-reset');
  const btnHint = document.getElementById('btn-hint');
  const btnSound = document.getElementById('btn-sound');
  const btnLevels = document.getElementById('btn-levels');
  const btnRules = document.getElementById('btn-rules');

  // Modals
  const levelsModal = document.getElementById('levels-modal');
  const rulesModal = document.getElementById('rules-modal');
  const winModal = document.getElementById('win-modal');
  const winMovesEl = document.getElementById('win-moves');
  const winTargetsEl = document.getElementById('win-targets');
  const btnNextLevel = document.getElementById('btn-next-level');
  const btnCloseLevels = document.getElementById('close-levels');
  const btnCloseRules = document.getElementById('close-rules');
  const packTabsContainer = document.getElementById('pack-tabs');
  const levelGridContainer = document.getElementById('level-grid');

  const modalOpeners = new Map([
    [levelsModal, btnLevels],
    [rulesModal, btnRules]
  ]);

  function openModal(modal, focusTarget) {
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('active');
    requestAnimationFrame(() => focusTarget?.focus());
  }

  function closeModal(modal, returnFocus = true) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    if (returnFocus) modalOpeners.get(modal)?.focus();
  }

  function getFocusableElements(container) {
    return [...container.querySelectorAll('button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])')]
      .filter(element => element.getClientRects().length > 0);
  }

  document.addEventListener('keydown', (event) => {
    const activeModal = document.querySelector('.modal-overlay.active');
    if (!activeModal) return;

    if (event.key === 'Escape' && activeModal !== winModal) {
      closeModal(activeModal);
      return;
    }

    if (event.key !== 'Tab') return;
    const focusable = getFocusableElements(activeModal);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === activeModal)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  for (const modal of [levelsModal, rulesModal]) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal(modal);
    });
  }

  // State
  let currentLevelId = 1;
  let engine = null;
  let moveCount = 0;
  let completedLevels = new Set();
  let animationFrameId = null;
  let particles = [];
  let pulseTimer = 0;
  let selectedPackId = 1;

  // Load Saved Progress
  try {
    const savedLvl = localStorage.getItem('zenlaser_current_level');
    if (savedLvl) currentLevelId = parseInt(savedLvl, 10) || 1;

    const savedCompleted = localStorage.getItem('zenlaser_completed');
    if (savedCompleted) {
      completedLevels = new Set(JSON.parse(savedCompleted));
    }
  } catch (e) {}

  function saveProgress() {
    try {
      localStorage.setItem('zenlaser_current_level', currentLevelId.toString());
      localStorage.setItem('zenlaser_completed', JSON.stringify([...completedLevels]));
    } catch (e) {}
  }

  function updateSoundIcon() {
    const isMuted = sound.isMuted();
    btnSound.setAttribute('aria-pressed', String(!isMuted));
    btnSound.setAttribute('aria-label', isMuted ? 'Turn sound on' : 'Turn sound off');
    btnSound.title = isMuted ? 'Turn sound on' : 'Turn sound off';
    btnSound.innerHTML = isMuted
      ? `<svg viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`
      : `<svg viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
  }

  function initLevel(lvlId) {
    currentLevelId = lvlId;
    const levelData = getLevel(lvlId);
    engine = new LaserEngine(levelData);
    moveCount = 0;
    particles = [];

    levelTitleEl.textContent = `Level ${levelData.id}: ${levelData.title}`;
    packNameEl.textContent = levelData.pack;
    selectedPackId = levelData.packId;

    updateUI();
    resizeCanvas();
    saveProgress();
  }

  function updateUI() {
    moveCountEl.textContent = moveCount;
    btnUndo.disabled = !engine.canUndo();

    // Targets meter
    const totalTargets = engine.targets.length;
    const energizedTargets = engine.targets.filter(t => t.tile.energized).length;
    targetsMeterEl.setAttribute('aria-label', `${energizedTargets} of ${totalTargets} crystals energized`);

    targetsMeterEl.innerHTML = '';
    for (let i = 0; i < totalTargets; i++) {
      const dot = document.createElement('span');
      dot.className = 'meter-dot' + (i < energizedTargets ? ' active' : '');
      targetsMeterEl.appendChild(dot);
    }
  }

  function resizeCanvas() {
    if (!canvas.parentElement) return;
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    const size = Math.max(0, Math.floor(Math.min(rect.width - 24, rect.height - 24, 520)));

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resizeCanvas);

  // Optical Rendering
  function render() {
    pulseTimer += 0.05;
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, w, h);

    if (!engine) return;

    const cols = engine.width;
    const rows = engine.height;
    const cellSize = w / cols;

    // Draw Grid Background
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cellSize;
        const y = r * cellSize;

        ctx.fillStyle = (r + c) % 2 === 0 ? 'rgba(16, 26, 44, 0.45)' : 'rgba(12, 20, 36, 0.45)';
        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

        ctx.strokeStyle = 'rgba(70, 100, 160, 0.15)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1);
      }
    }

    // Draw Laser Rays
    for (const ray of engine.rays) {
      if (!ray.path || ray.path.length < 2) continue;

      const comp = COLOR_COMPONENTS[ray.effectiveColor || ray.color] || COLOR_COMPONENTS.white;

      ctx.save();
      ctx.beginPath();

      const startPt = ray.path[0];
      const startX = (startPt.c + 0.5) * cellSize;
      const startY = (startPt.r + 0.5) * cellSize;
      ctx.moveTo(startX, startY);

      for (let i = 1; i < ray.path.length; i++) {
        const pt = ray.path[i];
        const px = (pt.c + 0.5) * cellSize;
        const py = (pt.r + 0.5) * cellSize;
        ctx.lineTo(px, py);
      }

      // Outer Bloom Glow
      ctx.strokeStyle = comp.glow;
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = comp.hex;
      ctx.shadowBlur = 14;
      ctx.stroke();

      // Core Vibrant Beam
      ctx.strokeStyle = comp.hex;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 4;
      ctx.stroke();

      // Ultra-bright Center Filament
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.2;
      ctx.shadowBlur = 0;
      ctx.stroke();

      ctx.restore();
    }

    // Draw Components on Grid
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tile = engine.grid[r][c];
        if (!tile) continue;

        const cx = (c + 0.5) * cellSize;
        const cy = (r + 0.5) * cellSize;
        const radius = cellSize * 0.4;

        if (tile.type === 'block') {
          // Obstacle Block
          ctx.fillStyle = '#141E30';
          ctx.strokeStyle = '#2B3E5C';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(c * cellSize + 4, r * cellSize + 4, cellSize - 8, cellSize - 8, 8);
          ctx.fill();
          ctx.stroke();

          // Internal texture
          ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.fillRect(c * cellSize + 10, r * cellSize + 10, cellSize - 20, cellSize - 20);
        } else if (tile.type === 'laser') {
          // Laser Emitter
          const dir = tile.dir;
          const colorComp = COLOR_COMPONENTS[tile.color || 'white'];

          ctx.save();
          ctx.translate(cx, cy);

          // Base Cannon
          ctx.fillStyle = '#1C283E';
          ctx.strokeStyle = colorComp.hex;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, radius * 0.75, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Barrel
          const angle = dir * (Math.PI / 2) - Math.PI / 2;
          ctx.rotate(angle);

          ctx.fillStyle = colorComp.hex;
          ctx.shadowColor = colorComp.hex;
          ctx.shadowBlur = 8;
          ctx.fillRect(-radius * 0.25, -radius * 1.1, radius * 0.5, radius * 0.6);

          ctx.restore();
        } else if (tile.type === 'mirror') {
          // Diagonal Mirror
          const rot = tile.rot || 0;

          ctx.save();
          ctx.translate(cx, cy);

          // Clickable ring indicator if rotatable
          if (!tile.fixed) {
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.25)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([3, 4]);
            ctx.beginPath();
            ctx.arc(0, 0, radius * 0.95, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
          }

          // Mirror angle
          // rot 0: '/' (top-right to bottom-left) -> -45deg
          // rot 1: '\' (top-left to bottom-right) -> +45deg
          const mirrorAngle = rot === 0 ? -Math.PI / 4 : Math.PI / 4;
          ctx.rotate(mirrorAngle);

          // Silver reflective surface
          const grad = ctx.createLinearGradient(0, -radius * 0.8, 0, radius * 0.8);
          grad.addColorStop(0, '#FFFFFF');
          grad.addColorStop(0.5, '#7CE8FF');
          grad.addColorStop(1, '#FFFFFF');

          ctx.strokeStyle = grad;
          ctx.lineWidth = 6;
          ctx.lineCap = 'round';
          ctx.shadowColor = 'rgba(0, 229, 255, 0.8)';
          ctx.shadowBlur = 10;

          ctx.beginPath();
          ctx.moveTo(0, -radius * 0.8);
          ctx.lineTo(0, radius * 0.8);
          ctx.stroke();

          // Dark frame backing
          ctx.strokeStyle = '#0F1826';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(3, -radius * 0.75);
          ctx.lineTo(3, radius * 0.75);
          ctx.stroke();

          ctx.restore();
        } else if (tile.type === 'splitter') {
          // Beam Splitter
          const rot = tile.rot || 0;

          ctx.save();
          ctx.translate(cx, cy);

          // Rotatable ring indicator
          if (!tile.fixed) {
            ctx.strokeStyle = 'rgba(255, 221, 51, 0.3)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([3, 4]);
            ctx.beginPath();
            ctx.arc(0, 0, radius * 0.95, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
          }

          // Splitter orientation angle
          const splitAngle = rot * (Math.PI / 2) - Math.PI / 2;
          ctx.rotate(splitAngle);

          // Triangular Prism Wedge
          ctx.fillStyle = 'rgba(255, 221, 51, 0.2)';
          ctx.strokeStyle = '#FFDD33';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = 'rgba(255, 221, 51, 0.7)';
          ctx.shadowBlur = 10;

          ctx.beginPath();
          ctx.moveTo(0, -radius * 0.85); // Apex
          ctx.lineTo(radius * 0.75, radius * 0.65);
          ctx.lineTo(-radius * 0.75, radius * 0.65);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Central core
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(0, 0, radius * 0.25, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        } else if (tile.type === 'filter') {
          // Chromatic Optical Filter
          const comp = COLOR_COMPONENTS[tile.color] || COLOR_COMPONENTS.white;

          ctx.fillStyle = comp.glow;
          ctx.strokeStyle = comp.hex;
          ctx.lineWidth = 3;
          ctx.shadowColor = comp.hex;
          ctx.shadowBlur = 12;

          ctx.beginPath();
          ctx.roundRect(cx - radius * 0.6, cy - radius * 0.6, radius * 1.2, radius * 1.2, 6);
          ctx.fill();
          ctx.stroke();
        } else if (tile.type === 'target') {
          // Crystal Target Resonator
          const isEnergized = tile.energized;
          const targetColor = tile.color || 'white';
          const comp = COLOR_COMPONENTS[isEnergized ? (tile.energizedColor || targetColor) : targetColor] || COLOR_COMPONENTS.white;

          ctx.save();
          ctx.translate(cx, cy);

          if (isEnergized) {
            // Radiant corona
            const pulse = 1 + Math.sin(pulseTimer * 3) * 0.08;
            ctx.scale(pulse, pulse);

            ctx.shadowColor = comp.hex;
            ctx.shadowBlur = 25;

            // Spawn gentle particles at active crystal
            if (Math.random() < 0.25) {
              particles.push({
                x: cx + (Math.random() - 0.5) * radius,
                y: cy + (Math.random() - 0.5) * radius,
                vx: (Math.random() - 0.5) * 1.2,
                vy: (Math.random() - 0.5) * 1.2 - 0.5,
                color: comp.hex,
                alpha: 1,
                life: 30
              });
            }
          }

          // Gem Crystal Shape
          ctx.fillStyle = isEnergized ? comp.hex : 'rgba(25, 40, 65, 0.7)';
          ctx.strokeStyle = isEnergized ? '#FFFFFF' : comp.hex;
          ctx.lineWidth = isEnergized ? 2.5 : 2;

          ctx.beginPath();
          ctx.moveTo(0, -radius * 0.85);
          ctx.lineTo(radius * 0.8, -radius * 0.2);
          ctx.lineTo(radius * 0.5, radius * 0.85);
          ctx.lineTo(-radius * 0.5, radius * 0.85);
          ctx.lineTo(-radius * 0.8, -radius * 0.2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Internal Facet Highlights
          if (isEnergized) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(0, -radius * 0.85);
            ctx.lineTo(0, radius * 0.85);
            ctx.stroke();
          }

          ctx.restore();
        }
      }
    }

    // Render Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 1 / p.life;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    animationFrameId = requestAnimationFrame(render);
  }

  // Board Input Interaction
  function handlePointer(clientX, clientY) {
    if (!engine) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

    const cellSize = rect.width / engine.width;
    const c = Math.floor(x / cellSize);
    const r = Math.floor(y / cellSize);

    const rotated = engine.rotateTile(r, c);
    if (rotated) {
      sound.playRotate();
      moveCount++;
      updateUI();

      if (engine.isWin()) {
        onLevelVictory();
      }
    }
  }

  canvas.addEventListener('click', (e) => handlePointer(e.clientX, e.clientY));
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      handlePointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: false });

  function onLevelVictory() {
    sound.playLevelComplete();
    completedLevels.add(currentLevelId);
    saveProgress();

    setTimeout(() => {
      winMovesEl.textContent = moveCount;
      winTargetsEl.textContent = engine.targets.length;
      openModal(winModal, btnNextLevel);
    }, 450);
  }

  // Button Listeners
  btnUndo.addEventListener('click', () => {
    if (engine && engine.undo()) {
      sound.playClick();
      updateUI();
    }
  });

  btnReset.addEventListener('click', () => {
    if (engine) {
      sound.playClick();
      engine.reset();
      moveCount = 0;
      updateUI();
    }
  });

  btnHint.addEventListener('click', () => {
    if (engine) {
      sound.playClick();
      if (engine.applyHint()) {
        moveCount++;
        updateUI();
        if (engine.isWin()) {
          onLevelVictory();
        }
      }
    }
  });

  btnSound.addEventListener('click', () => {
    sound.toggleMute();
    updateSoundIcon();
  });

  btnLevels.addEventListener('click', () => {
    sound.playClick();
    renderLevelsModal();
    openModal(levelsModal, btnCloseLevels);
  });

  btnCloseLevels.addEventListener('click', () => {
    sound.playClick();
    closeModal(levelsModal);
  });

  btnRules.addEventListener('click', () => {
    sound.playClick();
    openModal(rulesModal, btnCloseRules);
  });

  btnCloseRules.addEventListener('click', () => {
    sound.playClick();
    closeModal(rulesModal);
  });

  btnNextLevel.addEventListener('click', () => {
    sound.playClick();
    closeModal(winModal, false);
    if (currentLevelId < 50) {
      initLevel(currentLevelId + 1);
    } else {
      initLevel(1);
    }
    btnLevels.focus();
  });

  function renderLevelsModal() {
    // Pack tabs
    packTabsContainer.innerHTML = '';
    for (const pack of PACKS) {
      const tab = document.createElement('button');
      tab.className = 'pack-tab' + (pack.id === selectedPackId ? ' active' : '');
      tab.type = 'button';
      tab.dataset.packId = pack.id;
      tab.setAttribute('aria-pressed', String(pack.id === selectedPackId));
      tab.textContent = `${pack.name} (${pack.id}/5)`;
      tab.addEventListener('click', () => {
        selectedPackId = pack.id;
        renderLevelsModal();
        packTabsContainer.querySelector(`[data-pack-id="${pack.id}"]`)?.focus();
      });
      packTabsContainer.appendChild(tab);
    }

    // Level buttons
    levelGridContainer.innerHTML = '';
    const startId = (selectedPackId - 1) * 10 + 1;
    const endId = startId + 10;

    for (let id = startId; id < endId; id++) {
      const btn = document.createElement('button');
      btn.className = 'level-btn';
      btn.type = 'button';
      if (id === currentLevelId) btn.classList.add('active');
      if (completedLevels.has(id)) btn.classList.add('completed');
      btn.setAttribute('aria-label', `Level ${id}${id === currentLevelId ? ', current level' : ''}${completedLevels.has(id) ? ', completed' : ''}`);
      if (id === currentLevelId) btn.setAttribute('aria-current', 'page');
      btn.textContent = id;

      btn.addEventListener('click', () => {
        sound.playClick();
        levelsModal.classList.remove('active');
        initLevel(id);
      });

      levelGridContainer.appendChild(btn);
    }
  }

  // Register PWA Service Worker
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }

  // Start App
  updateSoundIcon();
  initLevel(currentLevelId);
  render();
})();
